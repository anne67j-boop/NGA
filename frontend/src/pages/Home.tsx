import React from "react";
import { ArrowRight, ClipboardCheck, FileText, Search, UserRound } from "lucide-react";

const Home: React.FC = () => <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
  <section className="bg-white py-16 dark:bg-slate-900">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">Grant Assistance Information</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Find programs. Check eligibility. Complete your application.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">A practical grant-information and application-workflow website designed around the full applicant journey—from discovering a program to saving a profile, completing forms, submitting a tutorial application and checking the dashboard.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#/grants" className="inline-flex items-center rounded-md bg-brand-700 px-6 py-3 font-bold text-white hover:bg-brand-800">Explore programs <Search className="ml-2 h-5 w-5"/></a>
          <a href="#/apply" className="inline-flex items-center rounded-md border border-slate-300 px-6 py-3 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">Start an application <ArrowRight className="ml-2 h-5 w-5"/></a>
        </div>
      </div>
    </div>
  </section>

  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="grid gap-5 md:grid-cols-4">
      {[["#/grants",Search,"Find a program","Search and filter the available program catalogue."],["#/eligibility",ClipboardCheck,"Check eligibility","Answer a quick checklist before applying."],["#/vprofile",UserRound,"Build your profile","Save reusable details and pre-fill applications."],["#/apply",FileText,"Complete the form","Save drafts, review answers and submit."]].map(([href,Icon,title,text])=>{const I=Icon as React.ElementType;return <a key={String(href)} href={String(href)} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"><I className="h-7 w-7 text-brand-700"/><h2 className="mt-4 font-bold text-slate-900 dark:text-white">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p></a>})}
    </div>

    <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
      <h2 className="font-bold text-amber-950 dark:text-amber-100">Important</h2>
      <p className="mt-2 text-sm leading-6 text-amber-900 dark:text-amber-200">This is an independent tutorial website. Program records and application data shown here are for the workflow demonstration unless independently verified. Do not enter sensitive banking credentials, passwords, Social Security numbers or tax identifiers into this tutorial build.</p>
    </div>
  </section>
</div>;
export default Home;
