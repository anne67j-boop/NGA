import test, { after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import handler from "./apply.js";

const originalFetch = globalThis.fetch;
const originalEnv = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  GRANT_FROM_EMAIL: process.env.GRANT_FROM_EMAIL,
  GRANT_ADMIN_EMAIL: process.env.GRANT_ADMIN_EMAIL,
};

function response() {
  return {
    statusCode: 200,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(value) { this.body = value; return this; },
  };
}

const validBody = {
  grantId: "sample-program",
  grantTitle: "Sample Program",
  applicantName: "Test Applicant",
  email: "test@example.com",
  phone: "+1 555 0100",
  address: "123 Test Street",
  city: "Test City",
  state: "Test State",
  postalCode: "12345",
  purpose: "This is synthetic test data used to verify the intake endpoint.",
  incomeRange: "Prefer not to say",
  certification: true,
  signature: "Test Applicant",
};

beforeEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.GRANT_FROM_EMAIL;
  delete process.env.GRANT_ADMIN_EMAIL;
  globalThis.fetch = originalFetch;
});

after(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("rejects methods other than POST", async () => {
  const res = response();
  await handler({ method: "GET" }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, "POST");
});

test("does not accept submissions when Supabase is not configured", async () => {
  const res = response();
  await handler({ method: "POST", body: validBody }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, "INTAKE_NOT_CONFIGURED");
});

test("rejects incomplete or honeypot submissions without contacting the database", async () => {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error("Unexpected network call"); };

  const invalid = response();
  await handler({ method: "POST", body: { ...validBody, purpose: "too short" } }, invalid);
  assert.equal(invalid.statusCode, 400);

  const bot = response();
  await handler({ method: "POST", body: { ...validBody, website: "spam" } }, bot);
  assert.equal(bot.statusCode, 400);
  assert.equal(called, false);
});

test("stores a valid synthetic submission and returns its reference", async () => {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  globalThis.fetch = async (url, options) => {
    assert.match(String(url), /\/rest\/v1\/grant_applications\?select=/);
    assert.equal(options.method, "POST");
    const submitted = JSON.parse(options.body);
    assert.equal(submitted.applicant_name, "Test Applicant");
    return {
      ok: true,
      json: async () => [{
        id: "00000000-0000-4000-8000-000000000001",
        reference_id: submitted.reference_id,
        submitted_at: "2026-11-25T00:00:00.000Z",
      }],
    };
  };

  const res = response();
  await handler({ method: "POST", body: validBody }, res);
  assert.equal(res.statusCode, 201);
  assert.match(res.body.referenceId, /^NGA-\d{4}-[A-F0-9]{8}$/);
  assert.equal(res.body.emailSent, false);
});

test("does not report success when the database rejects the insert", async () => {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-key";
  globalThis.fetch = async () => ({ ok: false, status: 500 });

  const res = response();
  await handler({ method: "POST", body: validBody }, res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.ok, undefined);
});
