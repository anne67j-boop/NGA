import express from "express";

const app = express();
const port = Number(process.env.PORT || 5000);

// No application, authentication, database, or email service is enabled.
// In particular, do not accept or log SSNs, tax IDs, bank details, or signatures.
app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", applicationIntake: "disabled" });
});

app.post("/submit", (_req, res) => {
  res.status(503).json({
    success: false,
    code: "INTAKE_UNAVAILABLE",
    message: "Application intake is not configured. No application data was accepted."
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`NGA placeholder API listening on 127.0.0.1:${port}`);
});
