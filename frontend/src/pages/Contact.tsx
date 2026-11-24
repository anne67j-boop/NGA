import React from "react";

const Contact: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Help and support</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Support and contact</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">We want support information to be accurate. NGA's own support inbox and ticketing service are not yet configured, so this website cannot currently receive or confirm support requests.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900 dark:bg-amber-950/30"><h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">NGA support status</h2><p className="mt-3 text-sm leading-6 text-amber-950 dark:text-amber-100">Contact form: unavailable<br/>Applicant accounts: unavailable<br/>Application tracking: unavailable<br/>Grant application intake: unavailable</p><p className="mt-4 text-sm leading-6 text-amber-950 dark:text-amber-100">Do not send sensitive personal, tax, identity or banking information to this website.</p></section>
        <section className="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Official Grants.gov support</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">For help with the official federal portal, account registration, opportunity search or Workspace, contact Grants.gov directly through its official support center.</p><a href="https://www.grants.gov/support" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Open official support ↗</a></section>
      </div>
      <p className="mt-7 text-sm text-slate-600 dark:text-slate-400">For program-specific eligibility or application questions, contact the administering agency using the contact information in the current official funding notice.</p>
    </div>
  </div>
);
export default Contact;
