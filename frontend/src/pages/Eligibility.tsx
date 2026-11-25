import React from "react";

const Eligibility: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-5xl">
      <header className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Requirements</p><h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Understand grant eligibility</h1><p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Eligibility is program-specific. Use the published opportunity requirements as the source for determining who can apply.</p></header>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">What to review</h2><ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300"><li>Eligible applicant types and exclusions</li><li>Geographic or service-area requirements</li><li>Required registrations and identifiers</li><li>Matching funds, cost sharing or other conditions</li><li>Submission deadline and required attachments</li><li>Program contact information</li></ul></section>
        <section className="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Turn requirements into a checklist</h2><p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">For each opportunity, capture the applicant type, location requirements, project purpose, financial conditions, required documents and deadline. This makes it easier to compare opportunities and prepare an application plan.</p><p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">Keep the original opportunity notice with your notes so every checklist item can be traced back to its source.</p></section>
      </div>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Research principle</h2><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">General grant guidance is useful for learning, but the requirements attached to a specific program are the controlling details for that program.</p></section>
    </div>
  </div>
);
export default Eligibility;
