import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

let child;
let port;
let output = "";

async function unusedPort() {
  const server = createServer();
  await new Promise((resolve, reject) => server.listen(0, "127.0.0.1", resolve).once("error", reject));
  const address = server.address();
  const selected = address.port;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return selected;
}

before(async () => {
  port = await unusedPort();
  child = spawn(process.execPath, ["server.js"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(port), NODE_ENV: "test" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => { output += chunk.toString(); });
  child.stderr.on("data", (chunk) => { output += chunk.toString(); });

  const deadline = Date.now() + 7000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`API process exited early: ${output}`);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`API did not become ready: ${output}`);
});

after(() => {
  if (child && child.exitCode === null) child.kill("SIGTERM");
});

test("health reports that intake is disabled and sends defensive headers", async () => {
  const response = await fetch(`http://127.0.0.1:${port}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok", applicationIntake: "disabled" });
  assert.equal(response.headers.get("x-powered-by"), null);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("content-security-policy") || "", /default-src 'none'/);
});

test("application submission is rejected and sensitive values are not echoed", async () => {
  const secret = "TEST-SSN-123-45-6789";
  const response = await fetch(`http://127.0.0.1:${port}/submit`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName: "Test Applicant", ssn: secret, bankAccount: "999999" }),
  });
  assert.equal(response.status, 503);
  const body = await response.text();
  assert.match(body, /INTAKE_UNAVAILABLE/);
  assert.doesNotMatch(body, new RegExp(secret));
  assert.doesNotMatch(body, /Test Applicant|999999/);
});

test("malformed JSON is rejected with a sanitized response", async () => {
  const response = await fetch(`http://127.0.0.1:${port}/submit`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not-json",
  });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { success: false, message: "Malformed JSON" });
});

test("oversized JSON is rejected without exposing parser details", async () => {
  const response = await fetch(`http://127.0.0.1:${port}/submit`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ padding: "x".repeat(2048) }),
  });
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { success: false, message: "Request body too large" });
});

test("unknown routes do not disclose server details", async () => {
  const response = await fetch(`http://127.0.0.1:${port}/admin`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { success: false, message: "Not found" });
});
