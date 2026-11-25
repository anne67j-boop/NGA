import React from "react";

const resources = [
  { category: "Research", title: "Opportunity comparison worksheet", description: "Compare purpose, applicant type, deadline, funding structure and required documents across opportunities.", url: "#/grants" },
  { category: "Planning", title: "Application planning checklist", description: "Break an opportunity into eligibility, narrative, budget, attachments, approvals and submission tasks.", url: "#/eligibility" },
  { category: "Writing", title: "Grant narrative practice", description: "Practice turning a program objective into a concise problem statement, project plan, outcomes and measurement strategy.", url: "#/about" },
  { category: "Budgeting", title: "Budget preparation", description: "Organize personnel, equipment, services, travel and other project costs before preparing a final budget.", url: "#/refunds" },
  { category: "Documentation", title: "Source tracking", description: "Record where each important requirement came from so your research remains reproducible.", url: "#/grants" },
  { category: "Project learning", title: "NGA build notes", description: "Review the project's architecture, content model and development workflow.", url: "#/about" },
];

const Resources: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Learning library</p><h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Grant research and application resources</h1><p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">Reusable tools for organizing grant research, requirements and application preparation.</p></header>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {resources.map((item) => <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">{item.category}</p><h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p><a className="mt-5 inline-flex font-semibold text-blue-700 underline underline-offset-4 dark:text-blue-300" href={item.url}>Open resource →</a></article>)}
      </div>
    </div>
  </div>
);
export default Resources;
