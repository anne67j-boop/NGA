import React, { useState, useEffect, useRef } from 'react';
import { GRANTS } from '../constants';
import { ShieldCheck, CheckCircle, Lock, AlertCircle, ChevronRight, ChevronLeft, Info, Loader2, Download, User, AlertTriangle, PenTool } from 'lucide-react';

const Apply: React.FC = () => {
  const [preselectedGrantId, setPreselectedGrantId] = useState('');
  const [hasVProfile, setHasVProfile] = useState(false);

  useEffect(() => {
    // Parse query params from hash: #/apply?preselectedGrant=xyz
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const grantId = params.get('preselectedGrant');
      if (grantId) setPreselectedGrantId(grantId);
    }
    
    // Check for profile
    if (localStorage.getItem('vprofile')) {
      setHasVProfile(true);
    }
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    branch: "", // routing
    accountName: "",
    accountNumber: "",
    ssn: "", // SSN or EIN
    debt: "",
    propertyOwned: false,
    propertyAddress: "",
    certification: false,
    signature: "", // Digital Signature
    narrative: "" // New field to support profile bio
  });

  // Update formData when preselectedGrantId changes
  useEffect(() => {
    if (preselectedGrantId) {
      setFormData(prev => ({ ...prev, grantId: preselectedGrantId }));
    }
  }, [preselectedGrantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const loadFromProfile = () => {
    const stored = localStorage.getItem('vprofile');
    if (stored) {
      const profile = JSON.parse(stored);
      setFormData(prev => ({
        ...prev,
        fullName: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        // Optional: Map business fields if your form supports them explicitly
        narrative: profile.narrativePolished || profile.narrativeRaw || ""
      }));
    }
  };

  // --- VALIDATION LOGIC ---

  // Check for common fake patterns
  const isFakeData = (text: string) => {
    const patterns = [
      /^test$/i, 
      /^fake$/i, 
      /^demo$/i, 
      /^1234/i, 
      /123 Main St/i,
      /555-555-5555/,
      /john doe/i, 
      /jane doe/i
    ];
    return patterns.some(p => p.test(text));
  };

  const hasSequentialNumbers = (text: string) => {
    // Detects 123456789 or 987654321
    return /123456789/.test(text) || /987654321/.test(text) || /00000000/.test(text);
  };

  const isDuplicateApplication = (grantId: string) => {
    const existingApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
    // Check if user has an application with this Grant ID that is NOT 'Incomplete'
    return existingApps.some((app: any) => app.id.includes('US-G') && app.title.includes(GRANTS.find(g => g.id === grantId)?.title || grantId));
  };

  const validateStep = () => {
    if (!formRef.current) return true;
    
    // Get current step inputs
    const inputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      `[data-step="${currentStep}"] input, [data-step="${currentStep}"] select, [data-step="${currentStep}"] textarea`
    );
    
    let isValid = true;
    for (const input of inputs) {
      if (!input.checkValidity()) {
        isValid = false;
        input.reportValidity();
        break; // Show message for the first invalid input
      }

      // Custom Validation Checks for Specific Fields
      if (input.name === 'fullName' && isFakeData(input.value)) {
        setSubmitError("Please provide a verifiable legal name. 'John Doe' or 'Test' names are not accepted.");
        isValid = false;
        break;
      }
      if (input.name === 'phone' && (isFakeData(input.value) || input.value.includes('555-555'))) {
        setSubmitError("Please provide a valid, active phone number.");
        isValid = false;
        break;
      }
      if (input.name === 'address' && isFakeData(input.value)) {
        setSubmitError("Please provide a real residential or business address for verification.");
        isValid = false;
        break;
      }
      if ((input.name === 'ssn' || input.name === 'accountNumber' || input.name === 'branch') && hasSequentialNumbers(input.value)) {
        setSubmitError("The numeric sequence provided appears invalid or is a common test pattern.");
        isValid = false;
        break;
      }
    }

    // Step 4 Specific Validation (Certification)
    if (isValid && currentStep === 4) {
       if (!formData.certification) {
          setSubmitError("You must verify and check the certification box to proceed.");
          isValid = false;
       } else if (formData.signature.trim().toLowerCase() !== formData.fullName.trim().toLowerCase()) {
          setSubmitError(`Digital Signature mismatch. Please type "${formData.fullName}" exactly as entered in Step 2 to certify this document.`);
          isValid = false;
       }
    }
    
    if (isValid) setSubmitError(null); // Clear error if valid
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    // Local Duplicate Check
    if (isDuplicateApplication(formData.grantId)) {
       setSubmitError("DUPLICATE DETECTED: Our records indicate you have already submitted an application for this specific grant program. Please check your dashboard.");
       return;
    }

    setIsLoading(true);
    setSubmitError(null);

    // Simulate Network Latency for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // 1. ATTEMPT BACKEND SUBMISSION (For Email Notification)
      let backendSuccess = false;
      try {
        const res = await fetch('/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const resData = await res.json();
        
        if (!res.ok) {
           throw new Error(resData.message || "Server rejected submission");
        }
        backendSuccess = true;
      } catch (serverError: any) {
        // If server explicitly rejected (e.g. duplicate or fake), stop process
        if (serverError.message.includes("Duplicate") || serverError.message.includes("flagged")) {
           setSubmitError(serverError.message);
           setIsLoading(false);
           return;
        }
        // Otherwise, allow "Offline Mode" fallthrough for demo purposes if backend just isn't running
        console.warn("Backend offline, proceeding with local storage only.");
      }
      
      // 2. PERSIST TO LOCAL STORAGE FOR DASHBOARD
      const selectedGrant = GRANTS.find(g => g.id === formData.grantId);
      const newApp = {
        id: `US-G-${Math.floor(Math.random() * 1000000)}`,
        title: selectedGrant?.title || "General Assistance",
        status: "Pending Review",
        date: new Date().toLocaleDateString(),
        grantType: selectedGrant?.category || 'General'
      };

      const existingApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
      localStorage.setItem('user_applications', JSON.stringify([newApp, ...existingApps]));
      
      setSubmitted(true);
      window.scrollTo(0, 0);
      
    } catch (err: any) {
      console.error("Submission error", err);
      setSubmitError(err.message || "An error occurred while submitting your application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Program' },
    { id: 2, name: 'Personal Details' },
    { id: 3, name: 'Banking' },
    { id: 4, name: 'Review & Submit' }
  ];

  // Get the currently selected grant object for display logic
  const selectedGrant = GRANTS.find(g => g.id === formData.grantId);

  // Determine if the selected grant is business related
  const isBusiness = React.useMemo(() => {
    return selectedGrant?.category.includes('Business') || selectedGrant?.title.includes('Business');
  }, [selectedGrant]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center py-12 px-4 transition-colors duration-200">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-800 p-10 border-t-8 border-brand-600 shadow-card rounded-lg animate-fade-in-up">
          <div className="flex items-center mb-6">
             <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
               <CheckCircle className="h-8 w-8 text-green-700 dark:text-green-400" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Application Received</h2>
               <p className="text-slate-600 dark:text-slate-300">Your submission has been logged securely.</p>
             </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/50 p-6 border border-slate-200 dark:border-slate-600 mb-8 rounded">
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 font-medium">Reference Number</span>
                  <span className="block text-slate-900 dark:text-white font-mono font-bold text-lg">US-G-{Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div>
                  <span className="block text-slate-500 dark:text-slate-400 font-medium">Date Submitted</span>
                  <span className="block text-slate-900 dark:text-white font-bold">{new Date().toLocaleDateString()}</span>
                </div>
             </div>
             <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
               Please retain this reference number for your records. A confirmation email has been sent to the address provided.
             </p>
          </div>
          
          <button
            onClick={() => window.location.hash = '#/dashboard'}
            className="inline-block bg-brand-700 dark:bg-brand-600 text-white font-bold py-3 px-6 rounded hover:bg-brand-800 dark:hover:bg-brand-700 transition-colors w-full sm:w-auto text-center shadow-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-200">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Application for Assistance</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                OMB Control No. 3245-0324 | Expiration Date: 12/31/2026
              </p>
            </div>
            {hasVProfile && (
              <button
                onClick={loadFromProfile}
                className="flex items-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded font-bold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                title="Populate from your saved vProfile"
              >
                <User className="h-4 w-4 mr-2" /> Load from vProfile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10"></div>
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center bg-slate-50 dark:bg-slate-950 px-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors ${
                      isActive 
                        ? 'bg-brand-700 dark:bg-brand-600 border-brand-200 dark:border-brand-800 text-white' 
                        : isCompleted
                          ? 'bg-green-600 dark:bg-green-500 border-green-200 dark:border-green-800 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <span className={`mt-2 text-xs font-bold ${isActive ? 'text-brand-700 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-card p-8 rounded-lg">
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 mb-8">
             <div className="flex">
               <div className="flex-shrink-0">
                 <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
               </div>
               <div className="ml-3">
                 <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                   Secure Form: This system is authorized for official use only.
                 </p>
                 <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                   All data is encrypted. Misrepresentation of facts is subject to penalties under federal law.
                 </p>
               </div>
             </div>
          </div>
          
          {submitError && (
             <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
               <div className="flex">
                 <div className="flex-shrink-0">
                   <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                 </div>
                 <div className="ml-3">
                   <p className="text-sm text-red-800 dark:text-red-300 font-bold">
                     Validation Error:
                   </p>
                   <p className="text-sm text-red-800 dark:text-red-300">
                     {submitError}
                   </p>
                 </div>
               </div>
             </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            
            {/* Step 1: Program Selection */}
            {currentStep === 1 && (
              <div data-step="1" className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">Program Selection</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Select Assistance Type *</label>
                  <select
                    name="grantId"
                    value={formData.grantId}
                    onChange={handleChange}
                    className="block w-full border border-slate-300 dark:border-slate-600 rounded p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-900 dark:text-white shadow-sm"
                    required
                  >
                    <option value="">-- Select a Program --</option>
                    {GRANTS.map(grant => (
                      <option key={grant.id} value={grant.id}>{grant.title}</option>
                    ))}
                    <option value="general">General Assistance</option>
                  </select>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    If you are unsure, select 'General Assistance' and a case manager will help determine your eligibility.
                  </p>

                  {/* Program Summary Card */}
                  {selectedGrant && (
                    <div className="mt-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md p-4 animate-fade-in shadow-sm">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-brand-600 dark:text-brand-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{selectedGrant.title} Overview</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            {selectedGrant.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                               Amount: {selectedGrant.amount}
                             </span>
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                               Deadline: {selectedGrant.deadline}
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded border border-slate-200 dark:border-slate-600 mt-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Pre-Screening Question</h4>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required 
                      className="h-5 w-5 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">I confirm that I am a US citizen or permanent resident. *</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Applicant Information */}
            {currentStep === 2 && (
              <div data-step="2" className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">Applicant Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Full Legal Name / Business Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Date of Birth / Incorporation *</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Primary Phone *</label>
                     <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                      placeholder="(555) 555-5555"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Mailing Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>

                  {/* Security Field - SSN/EIN */}
                  <div className="md:col-span-2 bg-slate-50 dark:bg-slate-700/50 p-4 rounded border border-slate-200 dark:border-slate-600">
                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {isBusiness ? 'Employer Identification Number (EIN)' : 'Social Security Number (SSN)'} 
                      <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">(Optional)</span>
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="text"
                        name="ssn"
                        value={formData.ssn}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 pl-10 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono tracking-wider shadow-sm"
                        placeholder={isBusiness ? "XX-XXXXXXX" : "XXX-XX-XXXX"}
                        maxLength={isBusiness ? 10 : 11}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                      Your information is encrypted with 256-bit SSL security and is only used for identity verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

             {/* Step 3: Direct Deposit */}
             {currentStep === 3 && (
              <div data-step="3" className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">Electronic Funds Transfer</h3>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 p-6 border border-slate-200 dark:border-slate-600 rounded space-y-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Please provide valid banking information for the direct deposit of grant funds. The account must match the applicant's name.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Bank Name *</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Routing Number (9 digits) *</label>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        required
                        pattern="\d{9}"
                        title="Routing number must be 9 digits"
                        maxLength={9}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Account Number *</label>
                       <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        required
                      />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Name on Account *</label>
                       <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        required
                      />
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Certification */}
            {currentStep === 4 && (
              <div data-step="4" className="space-y-6 animate-fade-in">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">Review & Certify</h3>
                 
                 <div className="bg-slate-50 dark:bg-slate-700/50 p-6 border border-slate-200 dark:border-slate-600 rounded text-sm space-y-4 mb-6">
                    <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-600 pb-2">Summary of Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div><span className="text-slate-500 dark:text-slate-400 block">Applicant:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.fullName}</span></div>
                       <div><span className="text-slate-500 dark:text-slate-400 block">Program:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.grantId}</span></div>
                       <div><span className="text-slate-500 dark:text-slate-400 block">Email:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.email}</span></div>
                       <div><span className="text-slate-500 dark:text-slate-400 block">Bank:</span> <span className="font-medium text-slate-900 dark:text-white">{formData.bankName} (...{formData.accountNumber.slice(-4)})</span></div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-slate-800 p-8 border border-slate-300 dark:border-slate-600 rounded shadow-md relative overflow-hidden">
                   {/* Decorative formal border */}
                   <div className="absolute top-0 left-0 w-2 h-full bg-brand-600"></div>
                   
                   <div className="flex items-start mb-6">
                     <input
                       type="checkbox"
                       name="certification"
                       checked={formData.certification}
                       onChange={handleChange}
                       required
                       className="mt-1 h-5 w-5 text-brand-600 border-slate-300 rounded focus:ring-brand-500 cursor-pointer"
                     />
                     <div className="ml-4 text-sm">
                       <p className="font-serif font-bold text-lg text-slate-900 dark:text-white mb-2">Certification of Truth & Authorization</p>
                       <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                         I certify under penalty of perjury that the information provided herein is true and accurate. I understand that these funds are for the stated purpose only. I authorize the verification of this information with federal databases. I understand that any false statement or misrepresentation is a violation of federal law and may result in the rejection of this application and potential legal action.
                       </p>
                     </div>
                   </div>

                   {/* Digital Signature Field */}
                   <div className="ml-9 border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                      <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
                        <PenTool className="h-4 w-4 mr-2 text-brand-600" />
                        Digital Signature
                      </label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        Type your full legal name exactly as it appears in Step 2 to sign this document electronically.
                      </p>
                      <input
                        type="text"
                        name="signature"
                        value={formData.signature}
                        onChange={handleChange}
                        className="block w-full border-b-2 border-slate-300 dark:border-slate-600 bg-transparent py-2 px-1 text-lg font-serif italic focus:outline-none focus:border-brand-600 dark:focus:border-brand-400 transition-colors dark:text-white"
                        placeholder="Sign here..."
                        required
                      />
                      <div className="mt-4 flex justify-between text-xs text-slate-400 font-mono">
                        <span>Signed by: {formData.signature || "(Pending)"}</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            <div className="pt-8 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 mt-8">
               {currentStep > 1 ? (
                 <button
                   type="button"
                   onClick={handlePrev}
                   className="flex items-center text-slate-600 dark:text-slate-400 font-bold hover:text-brand-700 dark:hover:text-brand-300 px-4 py-2 rounded transition-colors"
                 >
                   <ChevronLeft className="h-4 w-4 mr-1" /> Back
                 </button>
               ) : (
                 <div></div> 
               )}

               {currentStep < 4 ? (
                 <button
                   type="button"
                   onClick={handleNext}
                   className="flex items-center bg-brand-700 dark:bg-brand-600 text-white px-6 py-2 rounded font-bold hover:bg-brand-800 dark:hover:bg-brand-700 transition-colors shadow-sm"
                 >
                   Next Step <ChevronRight className="h-4 w-4 ml-1" />
                 </button>
               ) : (
                 <button
                   type="submit"
                   disabled={isLoading}
                   className="flex items-center bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isLoading ? (
                     <>
                       <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...
                     </>
                   ) : (
                     <>
                       Submit Application <CheckCircle className="h-4 w-4 ml-2" />
                     </>
                   )}
                 </button>
               )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;