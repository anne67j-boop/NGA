import React from "react";

const Grants: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Grant listings temporarily withdrawn</h1>
      <p className="mt-4 text-slate-700">The programs and funding amounts previously shown here have not been verified against current agency notices. They are not application offers or guarantees of funding.</p>
      <a className="mt-6 inline-block font-semibold text-brand-700 underline" href="https://www.grants.gov/">Search official federal opportunities on Grants.gov</a>
    </section>
  </main>
);
export default Grants;
