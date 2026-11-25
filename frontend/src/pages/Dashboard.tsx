import React, { useState } from "react";
import { storage } from "../lib/storage";
import { CheckCircle2, Clock3, FileEdit, Trash2 } from "lucide-react";

const Dashboard: React.FC = () => {
  const [apps, setApps] = useState(storage.getApplications());
  const session = storage.getSession();

  const remove = (id: string) => {
    const next = apps.filter((item) => item.id !== id);
    storage.saveApplications(next);
    setApps(next);
  };

  return <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
    <div className="mx-auto max-w-5xl">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-wide text-brand-700">Applicant dashboard</p><h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">My applications</h1><p className="mt-2 text-sm text-slate-500">{session ? `Signed in as ${session.email}` : "Local browser dashboard"}</p></div>
          <a href="#/apply" className="rounded-md bg-brand-700 px-5 py-3 text-center font-bold text-white">New application</a>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {apps.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900"><FileEdit className="mx-auto h-10 w-10 text-slate-400" /><h2 className="mt-3 font-bold text-slate-900 dark:text-white">No applications yet</h2><p className="mt-2 text-sm text-slate-500">Start an application and save it as a draft or submit it for this tutorial workflow.</p></div> : apps.map((app) => <article key={app.id} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><div className="text-xs font-mono text-slate-500">{app.id}</div><h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{app.grantTitle}</h2><p className="mt-1 text-sm text-slate-500">Updated {new Date(app.updatedAt).toLocaleString()}</p></div>
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${app.status === "Submitted" ? "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"}`}>{app.status === "Submitted" ? <CheckCircle2 className="h-4 w-4"/> : <Clock3 className="h-4 w-4"/>}{app.status}</span>
          </div>
          <div className="mt-5 flex gap-3"><a href="#/apply" className="text-sm font-bold text-brand-700 underline">{app.status === "Draft" ? "Continue application" : "Start another application"}</a><button onClick={()=>remove(app.id)} className="inline-flex items-center text-sm font-bold text-red-700"><Trash2 className="mr-1 h-4 w-4"/>Delete local record</button></div>
        </article>)}
      </div>
    </div>
  </main>;
};
export default Dashboard;
