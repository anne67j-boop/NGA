import React from "react";

const About: React.FC = () => (
  <div className="bg-slate-50 px-4 py-14 dark:bg-slate-950 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <header><p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">About the project</p><h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">Grant Assistance Information</h1><p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">NGA is a personal website-building and grant-research project designed to organize information, test a modern web stack and provide a practical learning environment.</p></header>
      <section className="mt-9 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Project goals</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300"><li>Build a polished responsive React application.</li><li>Practice routing, reusable components and accessible navigation.</li><li>Model grant opportunities in a structured database.</li><li>Practice secure API design, editorial workflows and validation.</li><li>Turn research requirements into a maintainable product interface.</li></ul></section>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Content model</h2><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">Grant records can contain a title, administering organization, summary, eligibility notes, deadline and source references. The database and API are designed so records can be reviewed and published without hard-coding them into the interface.</p></section>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Learning boundary</h2><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">This project is intended for learning and experimentation. It does not represent a government service, funding authority or application-processing organization.</p></section>
    </div>
  </div>
);
export default About;
