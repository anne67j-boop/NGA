import React from "react";
import { Download, FileText } from "lucide-react";

const resources = [
  { title: "Application preparation checklist", text: "A simple checklist for organizing program requirements before starting an application.", content: "NGA APPLICATION PREPARATION CHECKLIST\n\n1. Confirm the program and eligibility requirements.\n2. Gather identity and contact information.\n3. Prepare a clear description of the assistance needed.\n4. Review every answer before submitting.\n5. Keep your reference number." },
  { title: "Applicant worksheet", text: "A plain-text worksheet you can save locally while preparing an application.", content: "NGA APPLICANT WORKSHEET\n\nProgram:\nPurpose of assistance:\nDocuments available:\nQuestions for the administering agency:\nNotes:" },
];

const download = (title:string,content:string)=>{const blob=new Blob([content],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${title.toLowerCase().replace(/[^a-z0-9]+/g,"-")}.txt`;a.click();URL.revokeObjectURL(url);};

const Resources: React.FC = () => <main className="min-h-screen bg-white dark:bg-slate-950">
  <section className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto max-w-7xl px-4 sm:px-6"><p className="text-sm font-bold uppercase tracking-wide text-brand-700">Resources</p><h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Documents & help center</h1><p className="mt-3 text-slate-600 dark:text-slate-300">Use these simple downloadable tutorial worksheets to prepare your application.</p></div></section>
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="grid gap-5 md:grid-cols-2">{resources.map((r)=><article key={r.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><FileText className="h-8 w-8 text-brand-700"/><h2 className="mt-4 text-xl font-bold">{r.title}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.text}</p><button onClick={()=>download(r.title,r.content)} className="mt-5 inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-bold dark:border-slate-700"><Download className="mr-2 h-4 w-4"/>Download worksheet</button></article>)}</div></div>
</main>;
export default Resources;
