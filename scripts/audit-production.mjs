#!/usr/bin/env node
const raw = process.argv[2];
if (!raw) {
  console.error("Usage: node scripts/audit-production.mjs https://your-site.example");
  process.exit(1);
}
let base;
try {
  base = new URL(raw);
  if (base.protocol !== "https:") throw new Error("HTTPS is required");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
const checks = [];
const check = (name, ok, detail = "") => {
  checks.push({ name, ok });
  console.log((ok ? "PASS  " : "FAIL  ") + name + (detail ? " — " + detail : ""));
};
try {
  const response = await fetch(base, { redirect: "follow", signal: AbortSignal.timeout(15000) });
  const html = await response.text();
  check("Homepage responds", response.ok, String(response.status));
  check("HTTPS enforced", new URL(response.url).protocol === "https:");
  for (const header of ["strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy"]) {
    check("Security header: " + header, Boolean(response.headers.get(header)), response.headers.get(header) || "missing");
  }
  check("Viewport meta tag", /<meta[^>]+name=["']viewport["']/i.test(html));
  check("Document title", /<title>[^<]+<\/title>/i.test(html));
  const endpoint = new URL("/api/grants/apply", base);
  const probe = await fetch(endpoint, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(15000) });
  check("Application API route exists", probe.status !== 404 && probe.status < 500, "GET returned " + probe.status);
  check("Application API rejects GET", probe.status === 405, "405 expected");
} catch (error) {
  check("Audit request completed", false, error.message);
}
const failed = checks.filter((item) => !item.ok);
console.log("\nAudit: " + (checks.length - failed.length) + "/" + checks.length + " passed.");
if (failed.length) process.exit(1);
