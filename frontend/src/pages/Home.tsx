import React from "react";

const Home: React.FC = () => (
  <div className="bg-slate-50 dark:bg-slate-950">
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Independent grant information</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Navigate grant information with clarity and confidence.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Understand how funding opportunities work, learn what to verify, and follow official agency sources before you make a decision.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#/grants" className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-500">Explore grant information</a>
            <a href="https://www.grants.gov/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-500 px-6 py-3 font-semibold text-white hover:bg-white/10">Visit official Grants.gov ↗</a>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-400">We are an independent information website. We do not award grants, represent a government agency, or accept grant applications.</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold text-cyan-200">Start with the official source</p>
          <h2 className="mt-3 text-2xl font-bold">A safer way to research funding</h2>
          <ul className="mt-6 space-y-5 text-sm text-slate-200">
            <li className="flex gap-3"><span className="text-cyan-300">01</span><span><strong className="text-white">Find an opportunity</strong><br/>Search the official federal portal and agency websites.</span></li>
            <li className="flex gap-3"><span className="text-cyan-300">02</span><span><strong className="text-white">Read the official notice</strong><br/>Check the opportunity number, deadline, applicant types and instructions.</span></li>
            <li className="flex gap-3"><span className="text-cyan-300">03</span><span><strong className="text-white">Confirm before acting</strong><br/>Ask the administering agency about eligibility and requirements.</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Explore NGA</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Practical information, clearly organized</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Use these sections to understand the process. Any program-specific detail must be checked against the current official notice.</p>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <a href="#/grants" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">01 / DIRECTORY</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Grant information</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Browse the catalogue of opportunities that have been independently checked against official agency notices.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">View information →</span></a>
        <a href="#/eligibility" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">02 / REQUIREMENTS</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Eligibility guidance</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Learn where eligibility rules are published and why the official notice is the final reference.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">Understand eligibility →</span></a>
        <a href="#/resources" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">03 / LEARNING</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Resources</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Find official application guides, learning materials, applicant support and scam-prevention resources.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">Explore resources →</span></a>
        <a href="#/about" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">04 / TRANSPARENCY</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">About NGA</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Understand the purpose and limits of this independent information website.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">About this website →</span></a>
        <a href="#/refunds" className="group rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-amber-900 dark:bg-amber-950/30"><span className="text-sm font-bold text-amber-800 dark:text-amber-300">05 / STAY SAFE</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Fees and payment warning</h3><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Learn how to recognize payment demands and protect your financial information.</p><span className="mt-5 inline-block font-semibold text-amber-800 dark:text-amber-300">Read safety guidance →</span></a>
        <a href="#/contact" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">06 / HELP</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Support and contact</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">See the current support status and reach official Grants.gov help when you need portal assistance.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">View support options →</span></a>
      </div>
    </section>

    <section className="border-y border-blue-100 bg-blue-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Important: federal grants are not universal personal cash assistance</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">Grants.gov explains that federal opportunities are generally intended for organizations and entities carrying out funded projects. It does not publish personal financial assistance benefits. Check the official guidance to identify the right type of program.</p></div>
        <a href="https://www.usa.gov/benefits" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500">Explore USA.gov benefits ↗</a>
      </div>
    </section>
  </div>
);
export default Home;
