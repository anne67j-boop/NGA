import React from "react";

const Apply: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Application workspace</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Plan an application</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">Use this page as a planning workspace for turning grant requirements into an organized application checklist.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {["Eligibility", "Project narrative", "Budget", "Attachments", "Review", "Submission"].map((item, index) => (
          <div key={item} className="rounded-lg border border-slate-200 p-5 dark:border-slate-700">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">0{index + 1}</span>
            <h2 className="mt-2 font-semibold text-slate-900 dark:text-white">{item}</h2>
          </div>
        ))}
      </div>
    </section>
  </main>
);
export default Apply;
