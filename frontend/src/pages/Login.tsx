import React from "react";

const Login: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16">
    <section className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Sign-in is not configured</h1>
      <p className="mt-4 text-slate-700">There is currently no verified authentication service connected to this portal. No credentials should be entered here.</p>
      <a className="mt-6 inline-block font-semibold text-brand-700 underline" href="#/">Return to home</a>
    </section>
  </main>
);
export default Login;
