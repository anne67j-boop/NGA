import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your frontend
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
  })
);

app.use(bodyParser.json());

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

    const application = new Application(applicationData);
    await application.save();

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "admin@example.com",
        to: "anne67j@gmail.com",
        subject: "New Grant Application Submitted",
        text: `A new application has been submitted by ${req.body.fullName}.`,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
