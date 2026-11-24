import React from "react";

const Refunds: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Fees and payment warning</h1>
      <p className="mt-4 text-slate-700">This website has no verified authority to collect grant application fees or process government funding. Do not pay this site or disclose banking information. Confirm all fees, if any, directly with the administering agency through its official website.</p>
      <a className="mt-6 inline-block font-semibold text-brand-700 underline" href="https://www.grants.gov/">Official federal grants information</a>
    </section>
  </main>
);
export default Refunds;
