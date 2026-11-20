import React from "react";

const Dashboard: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Applicant dashboard unavailable</h1>
      <p className="mt-4 text-slate-700">No authenticated applicant account or verified application database is connected. Sample records and funding totals have been removed so demo data cannot be mistaken for real decisions or payments.</p>
      <p className="mt-3 text-slate-700">Application status cannot be verified through this site at this time.</p>
    </section>
  </main>
);
export default Dashboard;
