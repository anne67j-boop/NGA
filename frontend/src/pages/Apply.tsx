import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Save, UserRound } from "lucide-react";
import { GRANTS } from "../data";
import { Application, storage } from "../lib/storage";

type FormState = {
  grantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  assistancePurpose: string;
  incomeRange: string;
  documentsReady: boolean;
  certification: boolean;
  signature: string;
};

const emptyForm: FormState = {
  grantId: "", firstName: "", lastName: "", email: "", phone: "", address: "",
  city: "", state: "", zip: "", assistancePurpose: "", incomeRange: "",
  documentsReady: false, certification: false, signature: "",
};

const Apply: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const grantId = query.get("preselectedGrant") || "";
    const profile = storage.getProfile();
    setForm((current) => ({
      ...current,
      grantId,
      ...(profile ? {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        assistancePurpose: profile.narrative,
      } : {}),
    }));
  }, []);

  const selectedGrant = useMemo(() => GRANTS.find((g) => g.id === form.grantId), [form.grantId]);

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError("");
  };

  const validate = () => {
    if (step === 1 && !form.grantId) return "Select a program before continuing.";
    if (step === 2 && (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.zip)) return "Complete all required personal and contact fields.";
    if (step === 3 && (!form.assistancePurpose || !form.incomeRange)) return "Complete the assistance-purpose and income fields.";
    if (step === 4 && (!form.documentsReady || !form.certification || form.signature.trim().toLowerCase() !== `${form.firstName} ${form.lastName}`.trim().toLowerCase())) return "Confirm the checklist, certification and exact digital signature.";
    return "";
  };

  const next = () => {
    const message = validate();
    if (message) { setError(message); return; }
    setError("");
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo(0, 0);
  };

  const saveDraft = () => {
    if (!form.grantId) { setError("Select a program before saving a draft."); return; }
    const existing = storage.getApplications().filter((item) => item.id !== "draft-current");
    const draft: Application = {
      id: "draft-current",
      grantId: form.grantId,
      grantTitle: selectedGrant?.title || "General Assistance",
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: form,
    };
    storage.saveApplications([draft, ...existing]);
    setSaved(true);
    setError("");
  };

  const submit = async () => {
    const message = validate();
    if (message) { setError(message); return; }
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/grants/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grantId: form.grantId,
          grantTitle: selectedGrant?.title || "General Assistance",
          applicantName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          postalCode: form.zip,
          purpose: form.assistancePurpose,
          incomeRange: form.incomeRange,
          certification: form.certification,
          signature: form.signature,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.referenceId) {
        throw new Error(result.message || "The application could not be saved. Please try again.");
      }
      const application: Application = {
        id: result.referenceId,
        grantId: form.grantId,
        grantTitle: selectedGrant?.title || "General Assistance",
        status: "Submitted",
        createdAt: result.submittedAt || new Date().toISOString(),
        updatedAt: result.submittedAt || new Date().toISOString(),
        data: form,
      };
      const existing = storage.getApplications().filter((item) => item.id !== "draft-current");
      storage.saveApplications([application, ...existing]);
      setSubmitted(application);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
        <section className="mx-auto max-w-2xl rounded-xl border border-green-200 bg-white p-8 shadow-sm dark:border-green-900 dark:bg-slate-900">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Application submitted</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Your application record was saved to the NGA demonstration database. This independent information website is not a government agency or official grant portal. No government submission or funding decision has been made.</p>
          <div className="mt-6 rounded-lg bg-slate-100 p-5 dark:bg-slate-800">
            <div className="text-xs font-semibold uppercase text-slate-500">Reference</div>
            <div className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">{submitted.id}</div>
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{submitted.grantTitle}</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#/dashboard" className="rounded-md bg-brand-700 px-5 py-3 font-bold text-white">Open dashboard</a>
            <a href="#/" className="rounded-md border border-slate-300 px-5 py-3 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">Return home</a>
          </div>
        </section>
      </main>
    );
  }

  const steps = ["Program", "Personal details", "Assistance", "Review"];

  return (
    <main className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Application</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Application for assistance</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Complete the form step by step. Drafts are stored locally in this browser.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8 grid grid-cols-4 gap-2">
          {steps.map((label, index) => (
            <button key={label} type="button" onClick={() => index + 1 < step ? setStep(index + 1) : undefined} className={`rounded-lg border px-2 py-3 text-xs font-bold sm:text-sm ${step === index + 1 ? "border-brand-600 bg-brand-50 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300" : step > index + 1 ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30" : "border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900"}`}>{index + 1}. {label}</button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); step === 4 ? submit() : next(); }} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div>}

          {step === 1 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Choose the assistance program</h2>
              <label className="mt-6 block text-sm font-bold text-slate-700 dark:text-slate-200">Program *</label>
              <select value={form.grantId} onChange={(e) => update("grantId", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white" required>
                <option value="">Select a program</option>
                {GRANTS.map((grant) => <option key={grant.id} value={grant.id}>{grant.title}</option>)}
              </select>
              {selectedGrant && <div className="mt-5 rounded-lg bg-slate-50 p-5 dark:bg-slate-800"><div className="font-bold text-slate-900 dark:text-white">{selectedGrant.title}</div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedGrant.description}</p></div>}
            </section>
          )}

          {step === 2 && (
            <section>
              <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal and contact details</h2><p className="mt-1 text-sm text-slate-500">Use your real information only when this is connected to a legitimate, verified service.</p></div><UserRound className="h-6 w-6 text-brand-700" /></div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {[
                  ["firstName","First name"],["lastName","Last name"],["email","Email address"],["phone","Phone number"],
                  ["address","Street address"],["city","City"],["state","State"],["zip","ZIP code"]
                ].map(([key,label]) => <label key={key} className="block text-sm font-bold text-slate-700 dark:text-slate-200">{label} *<input value={String(form[key as keyof FormState])} onChange={(e) => update(key as keyof FormState, e.target.value)} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} required className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal dark:border-slate-700 dark:bg-slate-950 dark:text-white" /></label>)}
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Assistance details</h2>
              <div className="mt-6 grid gap-5">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">What assistance do you need? *
                  <textarea value={form.assistancePurpose} onChange={(e) => update("assistancePurpose", e.target.value)} rows={5} required placeholder="Describe the purpose and how the assistance would help." className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                </label>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Approximate household/business income range *
                  <select value={form.incomeRange} onChange={(e) => update("incomeRange", e.target.value)} required className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                    <option value="">Select a range</option><option>Under $25,000</option><option>$25,000–$49,999</option><option>$50,000–$99,999</option><option>$100,000–$249,999</option><option>$250,000+</option><option>Prefer not to say</option>
                  </select>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm dark:border-slate-800"><input type="checkbox" checked={form.documentsReady} onChange={(e) => update("documentsReady", e.target.checked)} className="mt-1" /><span><strong>Documents ready.</strong> I can provide the documents required by the specific program if asked.</span></label>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review and submit</h2>
              <div className="mt-6 rounded-lg bg-slate-50 p-5 text-sm dark:bg-slate-800">
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div><dt className="font-semibold text-slate-500">Program</dt><dd className="font-bold">{selectedGrant?.title || "Not selected"}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Applicant</dt><dd className="font-bold">{form.firstName} {form.lastName}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Email</dt><dd>{form.email}</dd></div>
                  <div><dt className="font-semibold text-slate-500">Income range</dt><dd>{form.incomeRange}</dd></div>
                </dl>
                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700"><span className="font-semibold text-slate-500">Purpose</span><p className="mt-1">{form.assistancePurpose}</p></div>
              </div>
              <label className="mt-6 flex items-start gap-3 text-sm"><input type="checkbox" checked={form.certification} onChange={(e) => update("certification", e.target.checked)} className="mt-1" /><span>I certify that the information I entered is accurate to the best of my knowledge and understand that this tutorial submission is not a government application. *</span></label>
              <label className="mt-5 block text-sm font-bold text-slate-700 dark:text-slate-200">Digital signature — type your full name *
                <input value={form.signature} onChange={(e) => update("signature", e.target.value)} placeholder={`${form.firstName} ${form.lastName}`} required className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              </label>
            </section>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-between">
            <div className="flex gap-3">
              {step > 1 && <button type="button" onClick={() => { setStep((s) => s - 1); setError(""); }} className="inline-flex items-center rounded-md border border-slate-300 px-5 py-3 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"><ArrowLeft className="mr-2 h-4 w-4" />Back</button>}
              <button type="button" onClick={saveDraft} disabled={submitting} className="inline-flex items-center rounded-md border border-slate-300 px-5 py-3 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"><Save className="mr-2 h-4 w-4" />Save draft</button>
            </div>
            <button type="submit" disabled={submitting} className="inline-flex items-center justify-center rounded-md bg-brand-700 px-6 py-3 font-bold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60">{step === 4 ? (submitting ? "Submitting..." : "Submit application") : "Continue"}{step < 4 && <ArrowRight className="ml-2 h-4 w-4" />}</button>
          </div>
          {saved && <p className="mt-3 text-right text-xs font-semibold text-green-700">Draft saved locally.</p>}
        </form>
      </div>
    </main>
  );
};

export default Apply;
