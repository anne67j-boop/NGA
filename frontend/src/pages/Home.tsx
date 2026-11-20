import React from "react";

const Home: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-4xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Independent information site</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Find verified grant information from official sources</h1>
      <p className="mt-5 text-slate-700">This website is not a U.S. government agency and is not affiliated with Grants.gov, the Small Business Administration, or any federal department. Programs and funding claims previously displayed here have not been independently verified and are temporarily withdrawn.</p>
      <p className="mt-4 text-slate-700">Use the official federal grants portal to search current opportunities, confirm eligibility, and apply through the agency responsible for each program.</p>
      <a className="mt-6 inline-block rounded bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800" href="https://www.grants.gov/">Go to Grants.gov</a>
    </section>
  </main>
);
export default Home;
