import { timingSafeEqual } from "node:crypto";
import { isOfficialAgencyUrl, sendJson, supabaseRest } from "../../backend/lib/supabase.js";

function safeEqual(left, right) {
  const a = Buffer.from(left || "", "utf8");
  const b = Buffer.from(right || "", "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function allowedOrigin(origin) {
  if (!origin) return true;
  const allowed = (process.env.NGA_ALLOWED_ORIGINS || "https://nga-beta.vercel.app,https://nga-rebirths-projects.vercel.app")
    .split(",").map((value) => value.trim()).filter(Boolean);
  return allowed.includes(origin);
}

function validateRecord(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const slug = String(input.slug || "").trim();
  const title = String(input.title || "").trim();
  const agency = String(input.administering_agency || "").trim();
  const summary = String(input.summary || "").trim();
  const eligibility = String(input.eligibility_summary || "").trim();
  const noticeUrl = String(input.official_notice_url || "").trim();
  const agencyUrl = String(input.official_agency_url || "").trim();
  const status = String(input.program_status || "open");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return null;
  if (!title || title.length > 180 || !agency || agency.length > 180) return null;
  if (!summary || summary.length > 1800 || eligibility.length > 1200) return null;
  if (!isOfficialAgencyUrl(noticeUrl) || !isOfficialAgencyUrl(agencyUrl)) return null;
  if (!["open", "closed", "withdrawn"].includes(status)) return null;

  let deadline = null;
  if (input.deadline_at) {
    const parsed = new Date(input.deadline_at);
    if (Number.isNaN(parsed.getTime())) return null;
    deadline = parsed.toISOString();
  }

  return {
    slug,
    title,
    administering_agency: agency,
    summary,
    eligibility_summary: eligibility,
    official_notice_url: noticeUrl,
    official_agency_url: agencyUrl,
    deadline_at: deadline,
    program_status: status,
    verification_status: "verified",
    is_published: input.publish === true && status === "open",
    verified_at: new Date().toISOString(),
    source_checked_at: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  }

  if (!allowedOrigin(req.headers?.origin)) {
    return sendJson(res, 403, { error: "ORIGIN_NOT_ALLOWED" });
  }

  const expected = process.env.NGA_CONTENT_ADMIN_TOKEN;
  const authorization = String(req.headers?.authorization || "");
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!expected || !safeEqual(supplied, expected)) {
    return sendJson(res, 401, { error: "UNAUTHORIZED" });
  }

  if (!process.env.SUPABASE_SECRET_KEY || !process.env.SUPABASE_URL) {
    return sendJson(res, 503, { error: "CONTENT_DATABASE_NOT_CONFIGURED" });
  }

  const bodySize = Buffer.byteLength(JSON.stringify(req.body ?? null), "utf8");
  if (bodySize > 8192) return sendJson(res, 413, { error: "REQUEST_TOO_LARGE" });

  const record = validateRecord(req.body);
  if (!record) {
    return sendJson(res, 400, {
      error: "INVALID_RECORD",
      message: "Provide complete content and HTTPS notice/agency URLs on official .gov domains.",
    });
  }

  try {
    const query = new URLSearchParams({ on_conflict: "slug" });
    const saved = await supabaseRest(`grant_sources?${query.toString()}`, {
      admin: true,
      method: "POST",
      body: record,
      prefer: "resolution=merge-duplicates,return=representation",
    });
    return sendJson(res, 200, { success: true, record: saved[0] || null });
  } catch {
    return sendJson(res, 502, { error: "CONTENT_SAVE_FAILED" });
  }
}
