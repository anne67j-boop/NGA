import React from "react";

const resources = [
  { category: "Search and discover", title: "Search federal grant opportunities", description: "Use the official search service to explore current notices and opportunity details.", url: "https://www.grants.gov/" },
  { category: "Applicant guidance", title: "How to apply for grants", description: "Official overview of finding an opportunity, checking eligibility, registration and applying through Workspace.", url: "https://www.grants.gov/applicants/grant-applications/how-to-apply-for-grants" },
  { category: "Step-by-step learning", title: "Grants.gov Quick Start Guide", description: "Official quick-start instructions for applicants using Grants.gov.", url: "https://www.grants.gov/quick-start-guide/applicants" },
  { category: "Eligibility", title: "Grant eligibility guidance", description: "Learn why the eligibility section in each funding notice is the controlling source.", url: "https://www.grants.gov/learn-grants/grant-eligibility.html" },
  { category: "Help and support", title: "Grants.gov Support Center", description: "Get help directly from the official portal about accounts, search, Workspace and technical issues.", url: "https://www.grants.gov/support" },
  { category: "Fraud prevention", title: "Avoid government grant scams", description: "Understand that unsolicited promises of free government grant money and demands for fees are warning signs.", url: "https://www.grants.gov/learn-grants/grant-fraud" },
  { category: "Personal assistance", title: "USA.gov benefits", description: "Explore official information about government benefits and personal assistance programs.", url: "https://www.usa.gov/benefits" },
];

const Resources: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Official learning links</p><h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Grant research and application resources</h1><p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">A curated starting point for official information. These links lead to external agencies and are not operated by NGA.</p></header>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {resources.map((item) => <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">{item.category}</p><h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p><a className="mt-5 inline-flex font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-300" href={item.url} target="_blank" rel="noopener noreferrer">Open official resource ↗</a></article>)}
      </div>
      <p className="mt-8 rounded-lg bg-blue-50 p-5 text-sm leading-6 text-blue-950 dark:bg-blue-950/40 dark:text-blue-100">External pages, availability and instructions can change. Confirm you are on the agency's official domain before sharing information or submitting an application.</p>
    </div>
  </div>
);
export default Resources;
