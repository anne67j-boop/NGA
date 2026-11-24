import express from "express";

const app = express();
const port = Number(process.env.PORT || 5000);

// This placeholder API deliberately has no application, account, database,
// email, or AI functionality. Never log request bodies or accept applicant data.
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.set({
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  });
  next();
});

// A small parser limit protects this disabled endpoint from oversized JSON.
// The body is never persisted, forwarded, emailed, or written to logs.
app.use(express.json({ limit: "1kb", strict: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", applicationIntake: "disabled" });
});

app.post("/submit", (_req, res) => {
  res.status(503).json({
    success: false,
    code: "INTAKE_UNAVAILABLE",
    message: "Application intake is disabled. Do not send personal or financial information.",
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Return sanitized parser errors; never expose stack traces or submitted content.
app.use((error, _req, res, _next) => {
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body too large" });
  }
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ success: false, message: "Malformed JSON" });
  }
  return res.status(400).json({ success: false, message: "Invalid request" });
});

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("PORT must be an integer between 0 and 65535");
}

app.listen(port, "127.0.0.1", () => {
  console.log(`NGA placeholder API listening on 127.0.0.1:${port}`);
});
