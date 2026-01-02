import React from "react";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from "lucide-react";

const Eligibility: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Program Eligibility Standards</h1>
          <p className="text-lg text-slate-600 max-w-3xl">
            Review the mandatory requirements to determine if you or your organization qualify for federal or state-subsidized funding.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          
          {/* General Requirements */}
          <section className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">General Applicant Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                 <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-slate-900">Legal Residency</h4>
                   <p className="text-sm text-slate-600">Must be a US Citizen or Permanent Resident with a valid Social Security Number.</p>
                 </div>
              </div>
              <div className="flex items-start">
                 <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-slate-900">Age Requirement</h4>
                   <p className="text-sm text-slate-600">Primary applicant must be at least 18 years of age at the time of submission.</p>
                 </div>
              </div>
              <div className="flex items-start">
                 <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-slate-900">Identity Verification</h4>
                   <p className="text-sm text-slate-600">Must be able to provide valid government-issued photo identification.</p>
                 </div>
              </div>
              <div className="flex items-start">
                 <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="font-bold text-slate-900">Banking</h4>
                   <p className="text-sm text-slate-600">Must have a valid US bank account for direct deposit of funds.</p>
                 </div>
              </div>
            </div>
          </section>

          {/* Specific Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 border border-slate-200">
               <h3 className="font-bold text-lg text-slate-900 mb-4">Small Business (SBA)</h3>
               <ul className="space-y-3 text-sm text-slate-700">
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Registered US Entity</li>
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Under 500 Employees</li>
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Valid EIN/Tax ID</li>
               </ul>
            </div>
            <div className="bg-slate-50 p-6 border border-slate-200">
               <h3 className="font-bold text-lg text-slate-900 mb-4">Homeowners</h3>
               <ul className="space-y-3 text-sm text-slate-700">
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Primary Residence Only</li>
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Current on Property Taxes</li>
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Proof of Deed/Title</li>
               </ul>
            </div>
            <div className="bg-slate-50 p-6 border border-slate-200">
               <h3 className="font-bold text-lg text-slate-900 mb-4">Personal Hardship</h3>
               <ul className="space-y-3 text-sm text-slate-700">
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Documented Financial Need</li>
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Income below threshold</li>
                 <li className="flex items-start"><div className="w-1.5 h-1.5 bg-brand-600 rounded-full mt-1.5 mr-2"></div>Unemployment status (if applicable)</li>
               </ul>
            </div>
          </div>

          {/* Disqualifiers */}
          <section className="bg-red-50 border border-red-100 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center">
              <XCircle className="h-5 w-5 mr-2" /> Automatic Disqualifications
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-red-800">
              <li>• Providing false or misleading information</li>
              <li>• Currently incarcerated for fraud-related offenses</li>
              <li>• Non-registered business entities (for SBA grants)</li>
              <li>• Duplicate applications for the same funding cycle</li>
            </ul>
          </section>

          {/* CTA */}
          <div className="bg-brand-900 text-white rounded-lg p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Do you meet these criteria?</h3>
            <p className="text-brand-100 mb-8 max-w-2xl mx-auto">
              If you satisfy the eligibility requirements listed above, you are invited to submit an official application for review.
            </p>
            <a 
              href="#/apply" 
              className="inline-flex items-center px-8 py-4 bg-white text-brand-900 font-bold text-lg rounded shadow hover:bg-brand-50 transition-colors"
            >
              Proceed to Application <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Eligibility;