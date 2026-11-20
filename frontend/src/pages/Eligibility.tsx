import React from "react";

const Eligibility: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Check eligibility with the administering agency</h1>
      <p className="mt-4 text-slate-700">Eligibility rules vary by program and can change. The criteria previously shown on this website are not verified and should not be relied on. Confirm requirements directly with the agency listed on the official opportunity notice.</p>
      <a className="mt-6 inline-block font-semibold text-brand-700 underline" href="https://www.grants.gov/">Official federal grant search</a>
    </section>
  </main>
);
export default Eligibility;
