import React, { useEffect, useState } from "react";
import { storage, ApplicantProfile } from "../lib/storage";
import { CheckCircle2, Save } from "lucide-react";

const VProfile: React.FC = () => {
  const [profile, setProfile] = useState<ApplicantProfile>({ firstName:"",lastName:"",email:"",phone:"",address:"",city:"",state:"",zip:"",narrative:"" });
  const [saved, setSaved] = useState(false);
  useEffect(()=>{ const p=storage.getProfile(); if(p) setProfile(p); },[]);
  const update=(key:keyof ApplicantProfile,value:string)=>{setProfile(p=>({...p,[key]:value}));setSaved(false);};
  const save=()=>{storage.saveProfile(profile);setSaved(true);};
  return <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Applicant profile</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">vProfile</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Save reusable applicant details in this browser so the application form can be pre-filled.</p>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {([["firstName","First name"],["lastName","Last name"],["email","Email"],["phone","Phone"],["address","Address"],["city","City"],["state","State"],["zip","ZIP code"]] as const).map(([key,label])=><label key={key} className="text-sm font-bold">{label}<input value={profile[key]} onChange={(e)=>update(key,e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal dark:border-slate-700 dark:bg-slate-950"/></label>)}
      </div>
      <label className="mt-5 block text-sm font-bold">Reusable assistance narrative<textarea value={profile.narrative} onChange={(e)=>update("narrative",e.target.value)} rows={5} placeholder="Describe the type of assistance you normally need." className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal dark:border-slate-700 dark:bg-slate-950"/></label>
      <div className="mt-6 flex flex-wrap items-center gap-4"><button onClick={save} className="inline-flex items-center rounded-md bg-brand-700 px-5 py-3 font-bold text-white"><Save className="mr-2 h-4 w-4"/>Save profile</button>{saved&&<span className="inline-flex items-center text-sm font-bold text-green-700"><CheckCircle2 className="mr-1 h-4 w-4"/>Saved locally</span>}</div>
      <div className="mt-8 rounded-lg bg-slate-50 p-4 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">Tutorial note: this profile is stored only in this browser. Do not use it for sensitive identity, banking, tax or credential storage.</div>
    </section>
  </main>;
};
export default VProfile;
