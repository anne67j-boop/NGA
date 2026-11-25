import React from "react";

const VisionLab: React.FC = () => (
  <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
    <section className="mx-auto max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-8">
      <h1 className="text-2xl font-bold">Vision Studio unavailable</h1>
      <p className="mt-4 text-slate-300">Video generation is disabled until requests can be securely proxied through a backend that keeps provider credentials off the browser.</p>
    </section>
  </main>
);
export default VisionLab;
