import React, { useEffect, useState } from "react";

interface GrantSource {
  id: string;
  slug: string;
  title: string;
  administering_agency: string;
  summary: string;
  eligibility_summary: string;
  official_notice_url: string;
  official_agency_url: string;
  deadline_at: string | null;
  source_checked_at: string | null;
  verified_at: string | null;
}

type LoadState = "loading" | "ready" | "unavailable";

const formatDate = (value: string | null): string => {
  if (!value) return "Not stated";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not stated" : date.toLocaleDateString();
};

const Grants: React.FC = () => {
  const [records, setRecords] = useState<GrantSource[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/grants", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Catalogue unavailable");
        return response.json();
      })
      .then((payload: { data?: GrantSource[] }) => {
        if (!active) return;
        setRecords(Array.isArray(payload.data) ? payload.data : []);
        setState("ready");
      })
      .catch(() => {
        if (active) setState("unavailable");
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Grant directory</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Grant information</h1>
        <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">Explore structured grant records, program summaries, eligibility notes, deadlines and source information.</p>

        {state === "loading" && <p className="mt-8 text-slate-600 dark:text-slate-300" role="status">Loading grant information…</p>}

        {state === "unavailable" && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Grant catalogue</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The catalogue is currently being prepared. Published records will appear here when available.</p>
          </div>
        )}

        {state === "ready" && records.length === 0 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">No records published yet</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The directory is ready for structured grant records.</p>
          </div>
        )}

        {state === "ready" && records.length > 0 && (
          <div className="mt-8 space-y-5">
            {records.map((grant) => (
              <article key={grant.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Published record</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{grant.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">{grant.administering_agency}</p>
                <p className="mt-4 text-slate-700 dark:text-slate-300">{grant.summary}</p>
                {grant.eligibility_summary && <p className="mt-3 text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Eligibility:</span> {grant.eligibility_summary}</p>}
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Deadline: {formatDate(grant.deadline_at)}</p>
                <p className="mt-1 text-xs text-slate-500">Source checked: {formatDate(grant.source_checked_at)}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                  <a className="text-brand-700 underline" href={grant.official_notice_url} target="_blank" rel="noopener noreferrer">Opportunity source</a>
                  <a className="text-brand-700 underline" href={grant.official_agency_url} target="_blank" rel="noopener noreferrer">Agency source</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Grants;
