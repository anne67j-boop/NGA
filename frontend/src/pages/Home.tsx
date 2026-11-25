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
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Grant research and learning</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Understand grants. Research opportunities. Build better applications.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A practical space for learning how grant programs work, organizing opportunity information, understanding eligibility, and preparing application materials.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#/grants" className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-500">Explore grant information</a>
            <a href="#/resources" className="rounded-lg border border-slate-500 px-6 py-3 font-semibold text-white hover:bg-white/10">Browse resources</a>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-400">Independent educational project for grant research and website-building practice.</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur">
          <p className="text-sm font-semibold text-cyan-200">Start here</p>
          <h2 className="mt-3 text-2xl font-bold">A simple grant research workflow</h2>
          <ul className="mt-6 space-y-5 text-sm text-slate-200">
            <li className="flex gap-3"><span className="text-cyan-300">01</span><span><strong className="text-white">Discover</strong><br/>Collect opportunities and organize the information that matters.</span></li>
            <li className="flex gap-3"><span className="text-cyan-300">02</span><span><strong className="text-white">Understand</strong><br/>Review eligibility, requirements, timelines and application materials.</span></li>
            <li className="flex gap-3"><span className="text-cyan-300">03</span><span><strong className="text-white">Prepare</strong><br/>Turn the requirements into a clear checklist and application plan.</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Explore NGA</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Everything organized in one place</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Use the sections below as a personal learning and research workspace.</p>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <a href="#/grants" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">01 / DIRECTORY</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Grant information</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Browse the structured opportunity catalogue and study how grant records are organized.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">View information →</span></a>
        <a href="#/eligibility" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">02 / REQUIREMENTS</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Eligibility guidance</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Learn how to break eligibility requirements into clear, reviewable criteria.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">Understand eligibility →</span></a>
        <a href="#/resources" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">03 / LEARNING</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Resources</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Build your own research checklist, writing workflow and reference library.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">Explore resources →</span></a>
        <a href="#/about" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">04 / PROJECT</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">About NGA</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">See the purpose, architecture and learning goals behind the project.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">About this project →</span></a>
        <a href="#/refunds" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">05 / FINANCE</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Fees and payments</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Understand how payment and fee information can be represented safely in a grant workflow.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">Open finance guide →</span></a>
        <a href="#/contact" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-blue-700 dark:text-blue-300">06 / SUPPORT</span><h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Contact</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">View the project's support and feedback interface.</p><span className="mt-5 inline-block font-semibold text-blue-700 dark:text-blue-300">Open contact →</span></a>
      </div>
    </section>
  </div>
);
export default Home;
