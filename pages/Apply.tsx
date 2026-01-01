import React, { useState, useEffect, useRef } from 'react';
import { GRANTS } from '../constants';
import { ShieldCheck, CheckCircle, Lock, AlertCircle, ChevronRight, ChevronLeft, Info, Wand2, RefreshCw, Loader2 } from 'lucide-react';

const Apply: React.FC = () => {
  const [preselectedGrantId, setPreselectedGrantId] = useState('');

  useEffect(() => {
    // Parse query params from hash: #/apply?preselectedGrant=xyz
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
  const [isFilling, setIsFilling] = useState(false); // Visual feedback for auto-fill
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
    certification: false
  });

  // Update formData when preselectedGrantId changes
  useEffect(() => {
    if (preselectedGrantId) {
      setFormData(prev => ({ ...prev, grantId: preselectedGrantId }));
    }
  }, [preselectedGrantId]);

  // Demo Data Helper
  const fillDemoData = () => {
    setIsFilling(true);
    // Simulate "typing" or processing delay
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
        ssn: "123-45-6789",
        debt: "0",
        propertyOwned: true,
        propertyAddress: "123 Freedom Way",
        certification: true
      });
      setIsFilling(false);
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    }
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

    setIsLoading(true);
    setSubmitError(null);

    // Simulate API Latency for realism
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // 1. ATTEMPT BACKEND SUBMISSION (For Email Notification)
      // We wrap this in a try/catch so if the backend server isn't running (common in demo/preview modes),
      // the application still "succeeds" locally for the user experience.
      try {
        // Use relative path for production compatibility
        await fetch('/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (serverError) {
        console.warn("Backend server unreachable. Proceeding with local storage only.");
      }
      
      // 2. PERSIST TO LOCAL STORAGE FOR DASHBOARD DEMO
      const selectedGrant = GRANTS.find(g => g.id === formData.grantId);
      const newApp = {
        id: `US-G-${Math.floor(Math.random() * 1000000)}`,
        title: selectedGrant?.title || "General Assistance",
        status: "Pending Review",
        date: new Date().toLocaleDateString(),
        grantType: selectedGrant?.category || 'General'
      };

      const existingApps = JSON.parse(localStorage.getItem('demo_applications') || '[]');
      localStorage.setItem('demo_applications', JSON.stringify([newApp, ...existingApps]));
      
      setSubmitted(true);
      window.scrollTo(0, 0);
      
    } catch (err) {
      console.error("Submission error", err);
      setSubmitError("An error occurred while processing your application locally.");
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white p-10 border-t-8 border-brand-600 shadow-card rounded-lg animate-fade-in-up">
          <div className="flex items-center mb-6">
             <div className="bg-green-100 p-2 rounded-full mr-4">
               <CheckCircle className="h-8 w-8 text-green-700" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-slate-900">Application Received</h2>
               <p className="text-slate-600">Your submission has been logged securely.</p>
             </div>
          </div>
          
          <div className="bg-slate-50 p-6 border border-slate-200 mb-8 rounded">
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-slate-500 font-medium">Reference Number</span>
                  <span className="block text-slate-900 font-mono font-bold text-lg">US-G-{Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-medium">Date Submitted</span>
                  <span className="block text-slate-900 font-bold">{new Date().toLocaleDateString()}</span>
                </div>
             </div>
             <p className="mt-4 text-sm text-slate-600 leading-relaxed">
               Please retain this reference number for your records. A confirmation email has been sent to the address provided.
             </p>
          </div>
          
          <button
            onClick={() => window.location.hash = '#/dashboard'}
            className="inline-block bg-brand-700 text-white font-bold py-3 px-6 rounded hover:bg-brand-800 transition-colors w-full sm:w-auto text-center shadow-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Application for Assistance</h1>
              <p className="text-slate-600 text-sm">
                OMB Control No. 3245-0324 | Expiration Date: 12/31/2026
              </p>
            </div>
            <button
              onClick={fillDemoData}
              disabled={isFilling}
              className={`flex items-center px-5 py-2.5 text-xs font-bold uppercase tracking-wide rounded-md border shadow-sm transition-all ${
                isFilling 
                  ? 'bg-brand-50 text-brand-400 border-brand-100' 
                  : 'bg-white text-brand-700 border-slate-300 hover:bg-brand-50 hover:border-brand-300 hover:shadow-md'
              }`}
              title="Populate form with test data"
            >
              {isFilling ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Auto-Filling...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" /> Auto-Fill Demo Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center bg-slate-50 px-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors ${
                      isActive 
                        ? 'bg-brand-700 border-brand-200 text-white' 
                        : isCompleted
                          ? 'bg-green-600 border-green-200 text-white'
                          : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <span className={`mt-2 text-xs font-bold ${isActive ? 'text-brand-700' : 'text-slate-500'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-300 shadow-card p-8 rounded-lg">
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
             <div className="flex">
               <div className="flex-shrink-0">
                 <Lock className="h-5 w-5 text-blue-600" />
               </div>
               <div className="ml-3">
                 <p className="text-sm text-blue-800 font-medium">
                   Secure Form: This system is authorized for official use only.
                 </p>
                 <p className="text-xs text-blue-700 mt-1">
                   All data is encrypted. Misrepresentation of facts is subject to penalties under federal law.
                 </p>
               </div>
             </div>
          </div>
          
          {submitError && (
             <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
               <div className="flex">
                 <div className="flex-shrink-0">
                   <AlertCircle className="h-5 w-5 text-red-500" />
                 </div>
                 <div className="ml-3">
                   <p className="text-sm text-red-800">
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
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-6">Program Selection</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Select Assistance Type *</label>
                  <select
                    name="grantId"
                    value={formData.grantId}
                    onChange={handleChange}
                    className="block w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white shadow-sm"
                    required
                  >
                    <option value="">-- Select a Program --</option>
                    {GRANTS.map(grant => (
                      <option key={grant.id} value={grant.id}>{grant.title}</option>
                    ))}
                    <option value="general">General Assistance</option>
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    If you are unsure, select 'General Assistance' and a case manager will help determine your eligibility.
                  </p>

                  {/* Program Summary Card */}
                  {selectedGrant && (
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-md p-4 animate-fade-in shadow-sm">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-brand-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1">{selectedGrant.title} Overview</h4>
                          <p className="text-sm text-slate-600 leading-relaxed mb-3">
                            {selectedGrant.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 border border-brand-200">
                               Amount: {selectedGrant.amount}
                             </span>
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                               Deadline: {selectedGrant.deadline}
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded border border-slate-200 mt-4">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Pre-Screening Question</h4>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required 
                      className="h-5 w-5 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-slate-700">I confirm that I am a US citizen or permanent resident. *</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Applicant Information */}
            {currentStep === 2 && (
              <div data-step="2" className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-6">Applicant Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 mb-1">Full Legal Name / Business Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">Date of Birth / Incorporation *</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-800 mb-1">Primary Phone *</label>
                     <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                      placeholder="(555) 555-5555"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-800 mb-1">Mailing Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                      required
                    />
                  </div>

                  {/* Security Field - SSN/EIN */}
                  <div className="md:col-span-2 bg-slate-50 p-4 rounded border border-slate-200">
                    <label className="block text-sm font-bold text-slate-800 mb-1">
                      {isBusiness ? 'Employer Identification Number (EIN)' : 'Social Security Number (SSN)'} 
                      <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="ssn"
                        value={formData.ssn}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 rounded p-2.5 pl-10 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono tracking-wider shadow-sm"
                        placeholder={isBusiness ? "XX-XXXXXXX" : "XXX-XX-XXXX"}
                        maxLength={isBusiness ? 10 : 11}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500 flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1 text-green-600" />
                      Your information is encrypted with 256-bit SSL security and is only used for identity verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

             {/* Step 3: Direct Deposit */}
             {currentStep === 3 && (
              <div data-step="3" className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-6">Electronic Funds Transfer</h3>
                
                <div className="bg-slate-50 p-6 border border-slate-200 rounded space-y-6">
                  <p className="text-sm text-slate-600 mb-4">
                    Please provide valid banking information for the direct deposit of grant funds. The account must match the applicant's name.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1">Bank Name *</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1">Routing Number (9 digits) *</label>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        required
                        pattern="\d{9}"
                        title="Routing number must be 9 digits"
                        maxLength={9}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-bold text-slate-800 mb-1">Account Number *</label>
                       <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
                        required
                      />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-800 mb-1">Name on Account *</label>
                       <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={handleChange}
                        className="block w-full border border-slate-300 rounded p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
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
                 <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-6">Review & Certify</h3>
                 
                 <div className="bg-slate-50 p-6 border border-slate-200 rounded text-sm space-y-4 mb-6">
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Summary of Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div><span className="text-slate-500 block">Applicant:</span> <span className="font-medium text-slate-900">{formData.fullName}</span></div>
                       <div><span className="text-slate-500 block">Program:</span> <span className="font-medium text-slate-900">{formData.grantId}</span></div>
                       <div><span className="text-slate-500 block">Email:</span> <span className="font-medium text-slate-900">{formData.email}</span></div>
                       <div><span className="text-slate-500 block">Bank:</span> <span className="font-medium text-slate-900">{formData.bankName} (...{formData.accountNumber.slice(-4)})</span></div>
                    </div>
                 </div>

                 <div className="bg-white p-6 border border-slate-300 rounded shadow-sm">
                   <div className="flex items-start">
                     <input
                       type="checkbox"
                       name="certification"
                       checked={formData.certification}
                       onChange={handleChange}
                       required
                       className="mt-1 h-5 w-5 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                     />
                     <div className="ml-4 text-sm">
                       <p className="font-bold text-slate-900 mb-1">Certification of Truth & Authorization</p>
                       <p className="text-slate-600 leading-relaxed">
                         I certify under penalty of perjury that the information provided herein is true and accurate. I understand that these funds are for the stated purpose only. I authorize the verification of this information with federal databases.
                       </p>
                     </div>
                   </div>
                </div>
              </div>
            )}

            <div className="pt-8 flex justify-between items-center border-t border-slate-200 mt-8">
               {currentStep > 1 ? (
                 <button
                   type="button"
                   onClick={handlePrev}
                   className="flex items-center text-slate-600 font-bold hover:text-brand-700 px-4 py-2 rounded transition-colors"
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
                   className="flex items-center bg-brand-700 text-white px-6 py-2 rounded font-bold hover:bg-brand-800 transition-colors shadow-sm"
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
                       <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
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