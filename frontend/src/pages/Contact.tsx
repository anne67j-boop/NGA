import React from "react";

const Contact: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Project support</p>
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Contact and feedback</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">This page is part of the project's interface and can be connected to a support inbox or ticket system as the next development step.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Feedback workflow</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">A production contact form can capture a message, validate the request, rate-limit submissions and route the message to a protected support queue.</p><a href="mailto:support@example.com" className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">Email project support</a></section>
        <section className="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Project status</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">The interface, API and database layers are being developed as separate components so each can be tested independently.</p></section>
      </div>
    </div>
  </div>
);
export default Contact;
