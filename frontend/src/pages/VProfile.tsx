import React from "react";

const VProfile: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Profile service unavailable</h1>
      <p className="mt-4 text-slate-700">Profile storage and AI-assisted profile generation are disabled until authenticated server-side storage and protected AI credentials are configured. Do not enter personal or tax information here.</p>
    </section>
  </main>
);
export default VProfile;
