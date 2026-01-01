import React from 'react';
import { ArrowRight, Briefcase, HeartPulse, User, Home as HomeIcon, CheckCircle, AlertCircle } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = (path: string) => {
    window.location.hash = path;
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col bg-slate-50">
      {/* Hero Section - Official Portal Style (Matured) */}
      <section className="bg-brand-900 text-white relative overflow-hidden">
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900 via-brand-900 to-brand-800 opacity-90"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center bg-brand-800/50 border border-brand-700/50 rounded px-3 py-1.5 text-xs font-semibold mb-8 backdrop-blur-sm text-brand-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              2025 Fiscal Year Applications Now Open
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight font-serif">
              Grant Assistance for <br/> <span className="text-brand-100">American Families</span>
            </h1>
            <p className="text-lg md:text-xl text-brand-200 mb-10 leading-relaxed max-w-2xl font-light">
              The official portal to find and apply for government-backed funding. Secure support for personal hardship, small business growth (SBA), home equity repairs, and healthcare needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('#/grants')}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-brand-900 text-base font-bold shadow-sm hover:bg-brand-50 transition-all rounded-sm cursor-pointer border border-transparent"
              >
                View Available Grants
              </button>
              <button
                onClick={() => navigate('#/eligibility')}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-800/40 border border-brand-600 text-white text-base font-bold hover:bg-brand-700 transition-all backdrop-blur-sm rounded-sm cursor-pointer"
              >
                Check Eligibility
              </button>
            </div>
          </div>
        </div>
        
        {/* Abstract pattern background - significantly reduced opacity for maturity */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/5 opacity-20 transform skew-x-12 translate-x-20 pointer-events-none"></div>
      </section>

      {/* Main Categories - The Core Offering */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">Select Your Funding Category</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">Choose the program that best matches your current needs to view specific requirements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Personal */}
            <button onClick={() => navigate('#/grants')} className="group text-left block bg-white border border-slate-200 hover:border-brand-500 p-8 transition-all hover:shadow-card rounded-lg relative overflow-hidden">
               <div className="w-14 h-14 bg-brand-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-all duration-300">
                 <User className="h-7 w-7 text-brand-600 group-hover:text-white" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">Personal Grants</h3>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                 Financial aid for hardship relief, debt consolidation, and daily living expenses.
               </p>
               <span className="text-brand-600 font-bold text-sm flex items-center group-hover:underline decoration-2 underline-offset-4">
                 Apply Now <ArrowRight className="ml-2 h-4 w-4" />
               </span>
            </button>

            {/* Business/SBA */}
            <button onClick={() => navigate('#/grants')} className="group text-left block bg-white border border-slate-200 hover:border-brand-500 p-8 transition-all hover:shadow-card rounded-lg relative overflow-hidden">
               <div className="w-14 h-14 bg-brand-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-all duration-300">
                 <Briefcase className="h-7 w-7 text-brand-600 group-hover:text-white" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">SBA Business</h3>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                 Start-up capital, operational costs, and disaster recovery for small businesses.
               </p>
               <span className="text-brand-600 font-bold text-sm flex items-center group-hover:underline decoration-2 underline-offset-4">
                 Apply Now <ArrowRight className="ml-2 h-4 w-4" />
               </span>
            </button>

            {/* Home */}
            <button onClick={() => navigate('#/grants')} className="group text-left block bg-white border border-slate-200 hover:border-brand-500 p-8 transition-all hover:shadow-card rounded-lg relative overflow-hidden">
               <div className="w-14 h-14 bg-brand-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-all duration-300">
                 <HomeIcon className="h-7 w-7 text-brand-600 group-hover:text-white" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">Home Equity</h3>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                 Funding for home repairs, energy upgrades, and property value stabilization.
               </p>
               <span className="text-brand-600 font-bold text-sm flex items-center group-hover:underline decoration-2 underline-offset-4">
                 Apply Now <ArrowRight className="ml-2 h-4 w-4" />
               </span>
            </button>

             {/* Health */}
             <button onClick={() => navigate('#/grants')} className="group text-left block bg-white border border-slate-200 hover:border-brand-500 p-8 transition-all hover:shadow-card rounded-lg relative overflow-hidden">
               <div className="w-14 h-14 bg-brand-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-all duration-300">
                 <HeartPulse className="h-7 w-7 text-brand-600 group-hover:text-white" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-700 transition-colors">Healthcare</h3>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                 Assistance for medical bills, prescriptions, and preventative care access.
               </p>
               <span className="text-brand-600 font-bold text-sm flex items-center group-hover:underline decoration-2 underline-offset-4">
                 Apply Now <ArrowRight className="ml-2 h-4 w-4" />
               </span>
            </button>

          </div>
        </div>
      </section>

      {/* Information / Process Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-16 items-start">
             <div className="lg:w-1/2">
               <h2 className="text-3xl font-bold text-slate-900 mb-6 font-serif">Application Process</h2>
               <p className="text-lg text-slate-600 mb-10">
                 We have streamlined the application process to ensure it is accessible to all US residents. No specialized knowledge is required.
               </p>
               
               <div className="space-y-10">
                 <div className="flex relative">
                   <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-600 text-white font-bold text-base shadow-sm z-10">1</div>
                   <div className="ml-6">
                     <h4 className="text-lg font-bold text-slate-900 mb-1">Select Your Program</h4>
                     <p className="text-slate-600 text-sm">Choose from Personal, Business, Home, or Health categories based on your needs.</p>
                   </div>
                   <div className="absolute left-5 top-10 h-full w-px bg-slate-300 -z-0"></div>
                 </div>
                 <div className="flex relative">
                   <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-600 text-white font-bold text-base shadow-sm z-10">2</div>
                   <div className="ml-6">
                     <h4 className="text-lg font-bold text-slate-900 mb-1">Submit Secure Application</h4>
                     <p className="text-slate-600 text-sm">Fill out our encrypted form with your basic identity and financial details.</p>
                   </div>
                   <div className="absolute left-5 top-10 h-full w-px bg-slate-300 -z-0"></div>
                 </div>
                 <div className="flex">
                   <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-600 text-white font-bold text-base shadow-sm z-10">3</div>
                   <div className="ml-6">
                     <h4 className="text-lg font-bold text-slate-900 mb-1">Receive Decision</h4>
                     <p className="text-slate-600 text-sm">Most applicants receive a formal status update via email within 5-7 business days.</p>
                   </div>
                 </div>
               </div>
             </div>
             <div className="lg:w-1/2 mt-4 lg:mt-0">
                <div className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center text-lg">
                     <AlertCircle className="h-5 w-5 text-brand-600 mr-2" />
                     Important Security Notice
                   </h3>
                   <p className="text-sm text-slate-700 mb-6 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
                     The National Grant Assistance Portal is committed to preventing fraud. We will never ask for payment to process an application. All grants listed here are publicly funded or subsidized.
                   </p>
                   <ul className="text-sm text-slate-700 space-y-4">
                     <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-600 mr-3" /> No application fees</li>
                     <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-600 mr-3" /> Secure 256-bit data encryption</li>
                     <li className="flex items-center"><CheckCircle className="h-5 w-5 text-emerald-600 mr-3" /> Equal opportunity for all</li>
                   </ul>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Featured CTA (Dark Navy for Trust) */}
      <section className="bg-brand-900 py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <h2 className="text-3xl font-bold text-white mb-6 font-serif">Ready to Apply?</h2>
           <p className="text-lg text-brand-100 mb-10 max-w-2xl mx-auto">
             Funding is available for the 2025 fiscal year. Applications are processed on a first-come, first-served basis for qualified applicants.
           </p>
           <button 
             onClick={() => navigate('#/apply')}
             className="inline-block bg-white text-brand-900 font-bold px-10 py-4 text-base shadow-sm hover:bg-brand-50 transition-all rounded-sm cursor-pointer border border-transparent"
           >
             Start Application Now
           </button>
        </div>
        {/* Very subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-600 opacity-5 blur-3xl rounded-full"></div>
      </section>
    </div>
  );
};

export default Home;