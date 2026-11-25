import React, { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { storage } from "../lib/storage";

const Contact: React.FC = () => {
  const [form,setForm]=useState({name:"",email:"",topic:"Application question",message:""});
  const [sent,setSent]=useState(false);
  const submit=(e:React.FormEvent)=>{e.preventDefault();storage.saveMessage(form);setSent(true);};
  return <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
    <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Contact</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Send a message</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Messages are saved locally for this tutorial. They are not delivered to a real support team.</p>
      {sent ? <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30"><CheckCircle2 className="h-8 w-8 text-green-600"/><h2 className="mt-2 font-bold">Message saved</h2><button onClick={()=>setSent(false)} className="mt-4 text-sm font-bold text-brand-700 underline">Send another</button></div> :
      <form onSubmit={submit} className="mt-7 space-y-5">
        <label className="block text-sm font-bold">Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950"/></label>
        <label className="block text-sm font-bold">Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950"/></label>
        <label className="block text-sm font-bold">Topic<select value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950"><option>Application question</option><option>Eligibility question</option><option>Technical issue</option><option>Report a problem</option></select></label>
        <label className="block text-sm font-bold">Message<textarea required rows={6} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-normal dark:border-slate-700 dark:bg-slate-950"/></label>
        <button className="inline-flex items-center rounded-md bg-brand-700 px-6 py-3 font-bold text-white"><Send className="mr-2 h-4 w-4"/>Save message</button>
      </form>}
    </section>
  </main>;
};
export default Contact;
