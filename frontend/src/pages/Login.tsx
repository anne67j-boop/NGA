import React, { useEffect, useState } from "react";
import { storage } from "../lib/storage";

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState(!!storage.getSession());

  useEffect(() => { const s = storage.getSession(); if (s) { setName(s.name); setEmail(s.email); } }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { setMessage("Enter your name and email."); return; }
    storage.saveSession({ name: name.trim(), email: email.trim() });
    setSignedIn(true);
    setMessage("Demo session created on this browser.");
  };

  const signOut = () => { storage.clearSession(); setSignedIn(false); setMessage("Signed out."); };

  return <main className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
    <section className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Account</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{signedIn ? "Your local session" : "Sign in"}</h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">This tutorial version uses browser storage only. It is not production authentication.</p>
      {!signedIn ? <form onSubmit={submit} className="mt-6 space-y-5">
        <label className="block text-sm font-bold">Name<input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" /></label>
        <label className="block text-sm font-bold">Email<input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-2 w-full rounded-lg border border-slate-300 p-3 dark:border-slate-700 dark:bg-slate-950" /></label>
        <button className="w-full rounded-md bg-brand-700 px-5 py-3 font-bold text-white hover:bg-brand-800">Continue</button>
      </form> : <div className="mt-6">
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800"><div className="font-bold">{name}</div><div className="text-sm text-slate-500">{email}</div></div>
        <button onClick={signOut} className="mt-5 rounded-md border border-slate-300 px-5 py-3 font-bold dark:border-slate-700">Sign out</button>
      </div>}
      {message && <p className="mt-4 text-sm font-semibold text-brand-700">{message}</p>}
      <a href="#/vprofile" className="mt-6 block text-sm font-bold text-brand-700 underline">Open your applicant profile</a>
    </section>
  </main>;
};
export default Login;
