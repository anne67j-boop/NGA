import React, { useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const Eligibility: React.FC = () => {
  const [answers, setAnswers] = useState({ age: "", residency: "", need: "", documents: "" });
  const [checked, setChecked] = useState(false);

  const eligible = answers.age === "yes" && answers.residency === "yes" && answers.need === "yes" && answers.documents === "yes";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Eligibility</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Run a quick eligibility check</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">This questionnaire is a planning tool, not an eligibility determination by a government agency.</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6">
            {[
              ["age", "Are you at least 18 years old?"],
              ["residency", "Do you meet the residency/citizenship requirement of the program you are considering?"],
              ["need", "Can you document the need or purpose described by the program?"],
              ["documents", "Can you provide the documents requested by the program?"],
            ].map(([key, label]) => (
              <fieldset key={key}>
                <legend className="mb-3 font-bold text-slate-900 dark:text-white">{label}</legend>
                <div className="flex gap-3">
                  {["yes", "no"].map((value) => (
                    <label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 dark:border-slate-700">
                      <input type="radio" name={key} value={value} checked={answers[key as keyof typeof answers] === value} onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))} />
                      <span className="capitalize">{value}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <button type="button" onClick={() => setChecked(true)} className="mt-8 rounded-md bg-brand-700 px-6 py-3 font-bold text-white hover:bg-brand-800">Check my answers</button>

          {checked && (
            <div className={`mt-8 rounded-lg border p-5 ${eligible ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30" : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"}`}>
              <div className="flex items-start gap-3">
                {eligible ? <CheckCircle2 className="mt-0.5 h-6 w-6 text-green-700" /> : <XCircle className="mt-0.5 h-6 w-6 text-amber-700" />}
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">{eligible ? "You appear to meet the basic checklist" : "More information is needed"}</h2>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{eligible ? "You can continue to the application form and verify the specific program requirements there." : "A 'no' answer does not necessarily mean you are ineligible. Review the program-specific rules and documents before applying."}</p>
                  {eligible && <a href="#/apply" className="mt-4 inline-flex items-center font-bold text-brand-700">Continue to application <ArrowRight className="ml-2 h-4 w-4" /></a>}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Eligibility;
