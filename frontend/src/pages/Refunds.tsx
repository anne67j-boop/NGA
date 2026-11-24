import React from "react";

const Refunds: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Fraud prevention</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Fees, refunds and payment warning</h1>
      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-7 dark:border-red-900 dark:bg-red-950/30"><h2 className="text-xl font-bold text-red-950 dark:text-red-100">Do not pay anyone who promises a guaranteed grant</h2><p className="mt-3 text-sm leading-6 text-red-950 dark:text-red-100">NGA is not authorized to collect federal grant application fees, process government funding, or guarantee an award. Do not send money, gift cards, cryptocurrency, banking credentials or identity documents to anyone claiming they can secure a grant for you through this website.</p></div>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-lg font-bold text-slate-900 dark:text-white">NGA payment status</h2><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">No grant application payment or processing service is offered through this website. Do not make a payment to NGA for access to government funding. If you believe you have been charged by someone claiming to represent NGA, contact your payment provider promptly and preserve your receipts and messages.</p></section>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Verify fees with the agency</h2><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Use the contact details published in the official opportunity notice or on the agency's verified website. Do not rely on phone numbers, payment instructions or links sent by an unsolicited message.</p><a href="https://www.grants.gov/learn-grants/grant-fraud" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex font-semibold text-blue-700 underline dark:text-blue-300">Read Grants.gov fraud-prevention guidance ↗</a></section>
      <p className="mt-6 text-xs leading-5 text-slate-500 dark:text-slate-400">This page is general safety information, not legal, banking or refund advice. Refund rights depend on the payment method, provider and applicable law.</p>
    </div>
  </div>
);
export default Refunds;
