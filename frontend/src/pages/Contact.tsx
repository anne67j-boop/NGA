import React from "react";

const Contact: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Support contact is not configured</h1>
      <p className="mt-4 text-slate-700">This site does not currently have a verified support endpoint. The contact form has been disabled so messages are not falsely reported as delivered.</p>
      <p className="mt-3 text-slate-700">For federal grant information, use the official <a className="text-brand-700 underline" href="https://www.grants.gov/">Grants.gov</a> website.</p>
    </section>
  </main>
);
export default Contact;
