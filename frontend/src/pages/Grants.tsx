import React, { useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, GRANTS } from "../data";

const Grants: React.FC = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GRANTS.filter((grant) => {
      const matchesCategory = category === "All" || grant.category === category;
      const haystack = [grant.title, grant.category, grant.description, ...grant.eligibility].join(" ").toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Grant information</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Explore assistance programs</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">Search the tutorial program catalogue, review requirements, and start an application draft. Program records on this demo site are examples and should be verified with the administering agency before any real-world application.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <span className="sr-only">Search grants</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search programs, categories or requirements" className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
          </label>
          <label className="relative">
            <span className="sr-only">Filter by category</span>
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((grant) => (
            <article key={grant.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800 dark:bg-brand-900/30 dark:text-brand-300">{grant.category}</span>
                  <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{grant.title}</h2>
                </div>
                <span className="text-right text-sm font-bold text-slate-700 dark:text-slate-200">{grant.amount}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{grant.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {grant.eligibility.map((item) => <span key={item} className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">{item}</span>)}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Deadline: {grant.deadline}</span>
                <a href={`#/apply?preselectedGrant=${grant.id}`} className="inline-flex items-center rounded-md bg-brand-700 px-4 py-2 text-sm font-bold text-white hover:bg-brand-800">Start application <ArrowRight className="ml-2 h-4 w-4" /></a>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">No programs match your search.</div>}
      </main>
    </div>
  );
};

export default Grants;
