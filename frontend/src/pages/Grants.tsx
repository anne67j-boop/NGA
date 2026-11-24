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
  if (!value) return "Not stated in the official notice";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not stated in the official notice" : date.toLocaleDateString();
};

const Grants: React.FC = () => {
  const [records, setRecords] = useState<GrantSource[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let active = true;
    fetch("/api/grants", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Verified content is unavailable");
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
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <section className="mx-auto max-w-4xl rounded-xl border border-amber-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">Independent information website</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Grant information from official sources</h1>
        <p className="mt-4 text-slate-700">
          Listings appear here only after an editor has checked the administering agency's official notice.
          Program rules and deadlines can change; confirm every detail with the agency before acting.
        </p>

        {state === "loading" && (
          <p className="mt-8 text-slate-600" role="status">Checking the verified information catalogue…</p>
        )}

        {state === "unavailable" && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-semibold text-slate-900">Verified listings are temporarily unavailable</h2>
            <p className="mt-2 text-sm text-slate-700">
              Do not rely on old or copied funding claims. Search current opportunities and confirm all requirements directly with the administering agency.
            </p>
          </div>
        )}

        {state === "ready" && records.length === 0 && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold text-slate-900">No verified opportunities are currently published here</h2>
            <p className="mt-2 text-sm text-slate-700">
              This catalogue starts empty. We will not invent grant names, funding amounts, eligibility rules, or deadlines.
            </p>
          </div>
        )}

        {state === "ready" && records.length > 0 && (
          <div className="mt-8 space-y-5">
            {records.map((grant) => (
              <article key={grant.id} className="rounded-lg border border-slate-200 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Verified source record</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{grant.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-600">{grant.administering_agency}</p>
                <p className="mt-4 text-slate-700">{grant.summary}</p>
                {grant.eligibility_summary && (
                  <p className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">Eligibility note:</span> {grant.eligibility_summary}
                  </p>
                )}
                <p className="mt-3 text-sm text-slate-600">Deadline: {formatDate(grant.deadline_at)}</p>
                <p className="mt-1 text-xs text-slate-500">Source last checked: {formatDate(grant.source_checked_at)}</p>
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                  <a className="text-brand-700 underline" href={grant.official_notice_url} target="_blank" rel="noopener noreferrer">Official opportunity notice</a>
                  <a className="text-brand-700 underline" href={grant.official_agency_url} target="_blank" rel="noopener noreferrer">Administering agency</a>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <a className="inline-block rounded bg-brand-700 px-5 py-3 font-semibold text-white hover:bg-brand-800" href="https://www.grants.gov/" target="_blank" rel="noopener noreferrer">
            Search official Grants.gov
          </a>
        </div>
      </section>
    </main>
  );
};

export default Grants;
