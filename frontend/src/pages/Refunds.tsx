import React from "react";

const Refunds: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Finance</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Fees and payments</h1>
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment model</h2><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">This learning project does not process grant fees, application payments or funding disbursements. The page exists to demonstrate how financial information can be presented clearly in a grant-related website.</p></section>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Refund workflow example</h2><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">A production payment system would record the transaction, payment provider reference, status, refund eligibility and audit history. Those records should be handled server-side and never exposed through client-side secrets.</p></section>
    </div>
  </div>
);
export default Refunds;
