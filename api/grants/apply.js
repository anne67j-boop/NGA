import { randomBytes } from "node:crypto";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
const clean = (v, max = 4000) => typeof v === "string" ? v.trim().slice(0, max) : "";
const html = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function reply(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
}

async function db(path, options = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(process.env.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/" + path, {
    ...options,
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", ...(options.headers || {}) },
  });
}

async function emailReceipt(record) {
  if (!process.env.RESEND_API_KEY || !process.env.GRANT_FROM_EMAIL) return false;
  const messages = [{
    from: process.env.GRANT_FROM_EMAIL, to: [record.email],
    subject: "NGA application received: " + record.reference_id,
    html: "<p>Hello " + html(record.applicant_name) + ",</p><p>Your tutorial application record was saved.</p><p>Reference: <strong>" + html(record.reference_id) + "</strong></p><p>This is not a government application or funding decision.</p>",
  }];
  if (process.env.GRANT_ADMIN_EMAIL) messages.push({
    from: process.env.GRANT_FROM_EMAIL, to: [process.env.GRANT_ADMIN_EMAIL],
    subject: "New NGA tutorial submission: " + record.reference_id,
    html: "<p>New tutorial submission.</p><p>Reference: " + html(record.reference_id) + "</p><p>Program: " + html(record.grant_title) + "</p>",
  });
  const results = await Promise.all(messages.map((message) => fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(message),
  })));
  return results.every((r) => r.ok);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, { message: "Method not allowed." });
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return reply(res, 503, { code: "INTAKE_NOT_CONFIGURED", message: "Application intake is not configured. No application data was accepted." });
  }

  try {
    const data = req.body && typeof req.body === "object" ? req.body : {};
    const get = (key) => data[key];
    const applicantName = clean(get("applicantName"), 200);
    const email = clean(get("email"), 255).toLowerCase();
    const grantId = clean(get("grantId"), 120);
    const grantTitle = clean(get("grantTitle"), 255);
    const phone = clean(get("phone"), 50);
    const address = clean(get("address"), 255);
    const city = clean(get("city"), 120);
    const state = clean(get("state"), 120);
    const postalCode = clean(get("postalCode"), 32);
    const purpose = clean(get("purpose"), 4000);
    const incomeRange = clean(get("incomeRange"), 80);
    const signature = clean(get("signature"), 200);
    const certification = get("certification") === true || get("certification") === "true";

    if (clean(get("website"))) return reply(res, 400, { message: "Invalid submission." });
    if (!grantId || !grantTitle || !applicantName || !phone || !address || !city || !state || !postalCode || purpose.length < 30 || !incomeRange || !certification || signature.toLowerCase() !== applicantName.toLowerCase()) {
      return reply(res, 400, { message: "Complete all required fields and confirm certification and signature." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(res, 400, { message: "Enter a valid email address." });

    const referenceId = "NGA-" + new Date().getUTCFullYear() + "-" + randomBytes(4).toString("hex").toUpperCase();
    const record = {
      reference_id: referenceId, grant_slug: grantId, grant_title: grantTitle, applicant_name: applicantName,
      email, phone, street_address: address, city, state, postal_code: postalCode, purpose, income_range: incomeRange,
      application_data: { certification, signature }, status: "SUBMITTED",
    };
    const saved = await db("grant_applications?select=id,reference_id,submitted_at", {
      method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(record),
    });
    if (!saved.ok) {
      if (attachment) await fetch(process.env.SUPABASE_URL.replace(/\/$/, "") + "/storage/v1/object/nga-private-attachments/" + attachment.storage_path, {
        method: "DELETE",
        headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY },
      }).catch(() => {});
      return reply(res, 502, { message: "The application could not be saved. Please try again later." });
    }
    const [row] = await saved.json();
    let emailSent = false;
    try { emailSent = await emailReceipt(record); } catch { emailSent = false; }
    return reply(res, 201, {
      ok: true, referenceId, status: "SUBMITTED", submittedAt: row?.submitted_at, emailSent,
      message: "Tutorial application record saved. This is not a government submission or funding decision.",
    });
  } catch {
    return reply(res, 500, { message: "Unexpected server error while processing the application." });
  }
}