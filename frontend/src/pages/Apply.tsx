import React from "react";

const Apply: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-3xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Application intake is temporarily unavailable</h1>
      <p className="mt-4 text-slate-700">
        This portal has not yet verified its program affiliation or established a secure, authenticated application-processing service.
        Do not enter or send Social Security numbers, tax identifiers, bank details, passwords, or other sensitive personal information here.
      </p>
      <p className="mt-3 text-slate-700">
        Verify grant opportunities independently through the relevant official government agency before applying.
      </p>
      <a className="mt-6 inline-block font-semibold text-brand-700 underline" href="https://www.grants.gov/">Visit the official U.S. federal grants portal</a>
    </section>
  </main>
);
export default Apply;
