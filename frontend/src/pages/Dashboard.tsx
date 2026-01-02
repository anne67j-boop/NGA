import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  FileText, 
  TrendingUp, 
  MoreHorizontal, 
  AlertCircle,
  Video,
  Plus,
  Home as HomeIcon,
  ArrowUpDown,
  User,
  Shield,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [userApps, setUserApps] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'date' | 'status'>('date');
  const [hasVProfile, setHasVProfile] = useState(false);

  useEffect(() => {
    // Load persisted applications
    const stored = localStorage.getItem('user_applications');
    if (stored) {
      try {
        setUserApps(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse apps", e);
      }
    }
    // Check for vProfile
    const profile = localStorage.getItem('vprofile');
    if (profile) setHasVProfile(true);
  }, []);

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('business')) return <Briefcase className="h-5 w-5 text-green-700 dark:text-green-400" />;
    if (t.includes('home')) return <HomeIcon className="h-5 w-5 text-amber-700 dark:text-amber-400" />;
    return <FileText className="h-5 w-5 text-brand-700 dark:text-brand-400" />;
  };

  const getColorForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('business')) return 'bg-green-100 dark:bg-green-900/30';
    if (t.includes('home')) return 'bg-amber-100 dark:bg-amber-900/30';
    return 'bg-brand-100 dark:bg-brand-900/30';
  };

  // Combine static and dynamic apps for display logic
  const allApps = useMemo(() => {
    // Historical/Static Data for populated view
    const staticApps = [
      {
        id: 'SBA-2025-X992',
        title: 'SBA Small Business Assistance',
        grantType: 'business',
        status: 'Approved',
        date: '01/12/2025',
        isStatic: true
      },
      {
        id: 'HE-24-881',
        title: 'Homeowner Repair Grant',
        grantType: 'home',
        status: 'Under Review',
        date: '01/14/2025',
        isStatic: true
      },
      {
        id: 'PH-00-112',
        title: 'Personal Hardship Relief',
        grantType: 'personal',
        status: 'Incomplete',
        date: '01/10/2025',
        isStatic: true
      }
    ];
    
    // Merge
    const combined = [...userApps, ...staticApps];

    // Sort
    return combined.sort((a, b) => {
      if (sortOrder === 'date') {
        // Simple string date compare (MM/DD/YYYY)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        // Status sort: Approved > Under Review > Pending > Incomplete
        const priority: Record<string, number> = { 
          'Approved': 4, 
          'Under Review': 3, 
          'Pending Review': 2, 
          'Incomplete': 1 
        };
        const pA = priority[a.status] || 0;
        const pB = priority[b.status] || 0;
        return pB - pA;
      }
    });
  }, [userApps, sortOrder]);

  // Calculate Stats
  const approvedCount = allApps.filter(a => a.status === 'Approved').length;
  const underReviewCount = allApps.filter(a => a.status === 'Under Review' || a.status === 'Pending Review').length;
  
  // Funding amount based on approved count (base $15k + variable per extra approved)
  const totalFunding = 15000 + ((approvedCount - 1) * 5000); 

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Dashboard Header */}
      <div className="bg-brand-900 dark:bg-slate-900 pt-12 pb-24 border-b border-brand-800 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-brand-700 dark:bg-slate-800 flex items-center justify-center border-2 border-brand-500 dark:border-slate-600 text-white text-2xl font-bold shadow-lg">
                JD
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white font-serif">Welcome back, John</h1>
                <p className="text-brand-200 dark:text-slate-400 text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  ID: US-G-884291
                </p>
              </div>
            </div>
            <div>
              <button 
                onClick={() => window.location.hash = '#/apply'}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded shadow-md text-sm font-bold text-brand-900 dark:text-slate-900 bg-white hover:bg-brand-50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> New Application
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        
        {/* NEW USER WELCOME SECTION */}
        {!hasVProfile && (
           <div className="mb-8 animate-fade-in-up">
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 dark:from-emerald-900 dark:to-emerald-800 rounded-lg shadow-depth p-1 border border-emerald-600 dark:border-emerald-700">
                <div className="bg-white dark:bg-slate-900 rounded p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-start gap-4">
                     <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full hidden sm:block">
                        <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Setup Your Universal Grant Profile (vProfile)</h3>
                       <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xl">
                         New Applicant? Create your <strong>vProfile</strong> once to securely store your business details and personal narrative. 
                         Our AI engine will help you write a professional summary that you can auto-fill into any grant application.
                       </p>
                     </div>
                   </div>
                   <button 
                     onClick={() => window.location.hash = '#/vprofile'}
                     className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-bold shadow-md transition-all flex items-center group"
                   >
                     Create vProfile <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
           </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Total Approved Funding */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-depth p-6 border-t-4 border-green-500 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Approved Funding</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">${totalFunding.toLocaleString()}.00</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex items-center justify-between text-xs mb-1">
                 <span className="font-bold text-green-700 dark:text-green-400 flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Disbursement Ready</span>
                 <span className="text-green-600 dark:text-green-400 font-medium">100%</span>
               </div>
               <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-full h-1.5">
                 <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
               </div>
            </div>
          </div>

          {/* Applications Under Review */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-depth p-6 border-t-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Applications Under Review</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{underReviewCount}</p>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex items-center justify-between text-xs mb-1">
                 <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Avg. Review Progress</span>
                 <span className="text-amber-600 dark:text-amber-400 font-medium">65%</span>
               </div>
               <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-1.5">
                 <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
               </div>
            </div>
          </div>

          {/* Innovation Studio */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-depth p-6 border-t-4 border-brand-500 group cursor-pointer hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors" onClick={() => window.location.hash = '#/visionlab'}>
             <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Innovation Studio</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-brand-700 dark:group-hover:text-brand-400">Vision Assistant</p>
              </div>
              <div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-full group-hover:bg-brand-200 dark:group-hover:bg-brand-800 transition-colors">
                <Video className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex items-center justify-between text-xs mb-1">
                 <span className="font-bold text-brand-700 dark:text-brand-400 flex items-center">Generative Tools</span>
                 <span className="text-brand-600 dark:text-brand-400 font-medium">Online</span>
               </div>
               <div className="w-full bg-brand-100 dark:bg-brand-900/30 rounded-full h-1.5">
                 <div className="bg-brand-500 h-1.5 rounded-full w-full animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          
          {/* Main List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 shadow-card rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application History</h3>
                <button 
                  onClick={() => setSortOrder(prev => prev === 'date' ? 'status' : 'date')}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-400 flex items-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-2 py-1 rounded shadow-sm"
                >
                  <ArrowUpDown className="h-3 w-3 mr-1" /> 
                  Sort: {sortOrder === 'date' ? 'Newest' : 'Status'}
                </button>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {allApps.map((app, idx) => (
                  <li key={idx} className={`px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!app.isStatic ? 'bg-brand-50/20 dark:bg-brand-900/10' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`${getColorForType(app.grantType)} p-2.5 rounded-lg shadow-sm`}>
                          {getIconForType(app.grantType)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{app.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            ID: {app.id} • {app.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          app.status === 'Approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' :
                          app.status === 'Under Review' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                          app.status === 'Pending Review' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                          app.status === 'Incomplete' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-pulse'
                        }`}>
                          {app.status}
                        </span>
                        
                        {app.status === 'Incomplete' ? (
                           <a href="#/apply" className="ml-4 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">Resume</a>
                        ) : (
                           <MoreHorizontal className="h-4 w-4 text-slate-400 dark:text-slate-500 ml-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400" />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
                
                {allApps.length === 0 && (
                   <li className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                     No applications found. Start a new one today.
                   </li>
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            
            {/* VProfile Mini Card */}
             <div className="bg-white dark:bg-slate-800 shadow-card rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-6 group cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors" onClick={() => window.location.hash = '#/vprofile'}>
               <div className="flex items-center mb-3">
                 <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3">
                   <User className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                 </div>
                 <h3 className="font-bold text-slate-900 dark:text-white">My vProfile</h3>
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                 Status: {hasVProfile ? <span className="text-green-600 dark:text-green-400 font-bold">Active</span> : <span className="text-slate-400 dark:text-slate-500">Not Created</span>}
               </p>
               <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${hasVProfile ? 'bg-green-500 w-full' : 'bg-slate-300 dark:bg-slate-600 w-[10%]'}`}></div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-card rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
               <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Notifications</h3>
               <div className="space-y-4">
                 <div className="flex items-start">
                   <div className="flex-shrink-0">
                     <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500 animate-pulse"></div>
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-bold text-slate-900 dark:text-white">Document Verification</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please upload your 2024 tax return to finalize the SBA application.</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <div className="flex-shrink-0">
                     <div className="h-2 w-2 mt-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-bold text-slate-900 dark:text-white">System Maintenance</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Portal will be down for maintenance on Sunday 2am-4am EST.</p>
                   </div>
                 </div>
               </div>
               <button className="w-full mt-4 text-center text-sm text-brand-600 dark:text-brand-400 font-bold hover:underline bg-slate-50 dark:bg-slate-700/50 py-2 rounded border border-slate-100 dark:border-slate-700">
                 View Message Center
               </button>
            </div>

            <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-lg shadow-lg p-6 text-white border border-brand-700 mb-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
               <h3 className="font-bold text-lg mb-2 flex items-center relative z-10">
                 <Video className="h-5 w-5 mr-2" /> Vision Innovation Lab
               </h3>
               <p className="text-sm text-brand-200 mb-4 relative z-10 leading-relaxed">
                 Enhance your grant proposal with AI-generated visual concepts. Use our Vision Generative Video model to create impact videos.
               </p>
               <a href="#/visionlab" className="block w-full text-center bg-white text-brand-900 py-3 rounded font-bold text-sm hover:bg-brand-50 transition-colors shadow-sm relative z-10">
                 Open Studio
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;