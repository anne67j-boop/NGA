import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';

const Refunds: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
       <div className="bg-slate-100 border-b border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Refund Policy & Service Terms</h1>
          <p className="text-slate-600">Last Updated: January 15, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            The National Grant Assistance Portal is a public service initiative. We do not charge application fees for any federal or state grant programs listed in our directory.
          </p>

          <div className="bg-blue-50 border-l-4 border-brand-600 p-6 my-8">
            <h3 className="text-brand-900 font-bold text-lg mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2" /> Policy Overview
            </h3>
            <p className="text-brand-800 text-sm">
              Since no payments are collected for standard applications, "refunds" generally do not apply. However, this policy covers optional premium services or erroneous duplicate transactions if applicable.
            </p>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. No Fee Guarantee</h3>
          <p className="text-slate-700 mb-4">
             We are committed to accessible funding. You will never be asked to pay a fee to submit a Personal Hardship, SBA, or Home Equity grant application through this portal.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Unauthorized Transactions</h3>
          <p className="text-slate-700 mb-4">
            If you see a charge on your bank statement from "Natl Grant Assist" that you did not authorize, please contact our fraud department immediately. We will issue a full reversal for any fraudulent activity verified by our security team.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Dispute Resolution</h3>
          <p className="text-slate-700 mb-4">
            To submit a formal inquiry regarding a transaction, please contact the Support Center at <a href="mailto:support@nationalgrants.org" className="text-brand-600 underline">support@nationalgrants.org</a>.
          </p>
          
          <div className="flex items-start bg-amber-50 p-4 rounded-md mt-8 border border-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Note: Third-party grant writers or consultants are not affiliated with this official portal. We cannot refund fees paid to external agencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refunds;