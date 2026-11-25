import { test } from "node:test";
import assert from "node:assert/strict";
import grantsHandler from "../../api/grants.js";
import adminHandler from "../../api/admin/grants.js";
import healthHandler from "../../api/health.js";

function responseMock() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(value) { this.body = value || ""; },
  };
}

test("public grants API rejects unsupported methods", async () => {
  const res = responseMock();
  await grantsHandler({ method: "POST" }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(JSON.parse(res.body).error, "METHOD_NOT_ALLOWED");
});

test("public grants API fails closed when database is not configured", async () => {
  const oldUrl = process.env.SUPABASE_URL;
  const oldKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
  try {
    const res = responseMock();
    await grantsHandler({ method: "GET" }, res);
    assert.equal(res.statusCode, 503);
    assert.equal(JSON.parse(res.body).error, "CONTENT_DATABASE_NOT_CONFIGURED");
  } finally {
    if (oldUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.SUPABASE_PUBLISHABLE_KEY; else process.env.SUPABASE_PUBLISHABLE_KEY = oldKey;
  }
});

test("health endpoint never claims database readiness without configuration", async () => {
  const oldUrl = process.env.SUPABASE_URL;
  const oldKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_PUBLISHABLE_KEY;
  try {
    const res = responseMock();
    await healthHandler({ method: "GET" }, res);
    assert.equal(res.statusCode, 503);
    assert.deepEqual(JSON.parse(res.body), {
      status: "degraded",
      database: "not_configured",
      applicationIntake: "disabled",
    });
  } finally {
    if (oldUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.SUPABASE_PUBLISHABLE_KEY; else process.env.SUPABASE_PUBLISHABLE_KEY = oldKey;
  }
});

test("admin content API rejects missing credentials before database access", async () => {
  const oldToken = process.env.NGA_CONTENT_ADMIN_TOKEN;
  delete process.env.NGA_CONTENT_ADMIN_TOKEN;
  try {
    const res = responseMock();
    await adminHandler({ method: "POST", headers: {}, body: {} }, res);
    assert.equal(res.statusCode, 401);
    assert.equal(JSON.parse(res.body).error, "UNAUTHORIZED");
  } finally {
    if (oldToken === undefined) delete process.env.NGA_CONTENT_ADMIN_TOKEN; else process.env.NGA_CONTENT_ADMIN_TOKEN = oldToken;
  }
});

test("admin content API rejects non-government source URLs", async () => {
  const oldToken = process.env.NGA_CONTENT_ADMIN_TOKEN;
  const oldUrl = process.env.SUPABASE_URL;
  const oldSecret = process.env.SUPABASE_SECRET_KEY;
  process.env.NGA_CONTENT_ADMIN_TOKEN = "test-admin-token";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "test-secret";
  try {
    const res = responseMock();
    await adminHandler({
      method: "POST",
      headers: { authorization: "Bearer test-admin-token" },
      body: {
        slug: "fake-grant",
        title: "Fake grant",
        administering_agency: "Example Agency",
        summary: "This must not be saved.",
        official_notice_url: "https://example.com/opportunity",
        official_agency_url: "https://example.com",
        publish: true,
      },
    }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(JSON.parse(res.body).error, "INVALID_RECORD");
  } finally {
    for (const [key, value] of [
      ["NGA_CONTENT_ADMIN_TOKEN", oldToken],
      ["SUPABASE_URL", oldUrl],
      ["SUPABASE_SECRET_KEY", oldSecret],
    ]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
