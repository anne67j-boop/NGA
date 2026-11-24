import React from "react";

const Resources: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Verified resources</h1>
      <p className="mt-4 text-slate-700">Unverified downloadable forms and document checklists have been removed. For official federal grant notices, applicant guidance, and agency contacts, use Grants.gov.</p>
      <a className="mt-6 inline-block font-semibold text-brand-700 underline" href="https://www.grants.gov/">Visit Grants.gov</a>
    </section>
  </main>
);
export default Resources;
