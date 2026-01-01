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
  Trash2,
  ArrowUpDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [demoApps, setDemoApps] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<'date' | 'status'>('date');

  useEffect(() => {
    // Load persisted demo applications
    const stored = localStorage.getItem('demo_applications');
    if (stored) {
      try {
        setDemoApps(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse demo apps", e);
      }
    }
  }, []);

  const clearDemoData = () => {
    if (window.confirm("Clear all demo applications and reset dashboard stats?")) {
      localStorage.removeItem('demo_applications');
      setDemoApps([]);
      // No reload needed, just state update
    }
  };

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('business')) return <Briefcase className="h-5 w-5 text-green-700" />;
    if (t.includes('home')) return <HomeIcon className="h-5 w-5 text-amber-700" />;
    return <FileText className="h-5 w-5 text-brand-700" />;
  };

  const getColorForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('business')) return 'bg-green-100';
    if (t.includes('home')) return 'bg-amber-100';
    return 'bg-brand-100';
  };

  // Combine static and dynamic apps for display logic
  const allApps = useMemo(() => {
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
        date: '01/10/2025', // Older date for sort testing
        isStatic: true
      }
    ];
    
    // Merge
    const combined = [...demoApps, ...staticApps];

    // Sort
    return combined.sort((a, b) => {
      if (sortOrder === 'date') {
        // Simple string date compare for demo purposes (MM/DD/YYYY)
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
  }, [demoApps, sortOrder]);

  // Calculate Stats
  const approvedCount = allApps.filter(a => a.status === 'Approved').length;
  const underReviewCount = allApps.filter(a => a.status === 'Under Review' || a.status === 'Pending Review').length;
  
  // Mock funding amount based on approved count (base $15k + random per extra approved)
  const totalFunding = 15000 + ((approvedCount - 1) * 5000); 

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Dashboard Header */}
      <div className="bg-brand-900 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-brand-700 flex items-center justify-center border-2 border-brand-500 text-white text-2xl font-bold shadow-lg">
                JD
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white font-serif">Welcome back, John</h1>
                <p className="text-brand-200 text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  ID: US-G-884291
                </p>
              </div>
            </div>
            <div>
              <button 
                onClick={() => window.location.hash = '#/apply'}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded shadow-md text-sm font-bold text-brand-900 bg-white hover:bg-brand-50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> New Application
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Total Approved Funding */}
          <div className="bg-white rounded-lg shadow-depth p-6 border-t-4 border-green-500 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Approved Funding</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">${totalFunding.toLocaleString()}.00</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex items-center justify-between text-xs mb-1">
                 <span className="font-bold text-green-700 flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Disbursement Ready</span>
                 <span className="text-green-600 font-medium">100%</span>
               </div>
               <div className="w-full bg-green-100 rounded-full h-1.5">
                 <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
               </div>
            </div>
          </div>

          {/* Applications Under Review */}
          <div className="bg-white rounded-lg shadow-depth p-6 border-t-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Applications Under Review</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{underReviewCount}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex items-center justify-between text-xs mb-1">
                 <span className="font-bold text-amber-700 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Avg. Review Progress</span>
                 <span className="text-amber-600 font-medium">65%</span>
               </div>
               <div className="w-full bg-amber-100 rounded-full h-1.5">
                 <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
               </div>
            </div>
          </div>

          {/* Innovation Studio */}
          <div className="bg-white rounded-lg shadow-depth p-6 border-t-4 border-brand-500 group cursor-pointer hover:bg-brand-50 transition-colors" onClick={() => window.location.hash = '#/visionlab'}>
             <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Innovation Studio</p>
                <p className="text-xl font-bold text-slate-900 mt-1 group-hover:text-brand-700">Vision Assistant</p>
              </div>
              <div className="bg-brand-100 p-3 rounded-full group-hover:bg-brand-200 transition-colors">
                <Video className="h-6 w-6 text-brand-600" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex items-center justify-between text-xs mb-1">
                 <span className="font-bold text-brand-700 flex items-center">Generative Tools</span>
                 <span className="text-brand-600 font-medium">Online</span>
               </div>
               <div className="w-full bg-brand-100 rounded-full h-1.5">
                 <div className="bg-brand-500 h-1.5 rounded-full w-full animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          
          {/* Main List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-card rounded-lg overflow-hidden border border-slate-200">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Application History</h3>
                <button 
                  onClick={() => setSortOrder(prev => prev === 'date' ? 'status' : 'date')}
                  className="text-xs font-bold text-slate-500 hover:text-brand-700 flex items-center bg-white border border-slate-300 px-2 py-1 rounded shadow-sm"
                >
                  <ArrowUpDown className="h-3 w-3 mr-1" /> 
                  Sort: {sortOrder === 'date' ? 'Newest' : 'Status'}
                </button>
              </div>
              <ul className="divide-y divide-slate-100">
                {allApps.map((app, idx) => (
                  <li key={idx} className={`px-6 py-4 hover:bg-slate-50 transition-colors ${!app.isStatic ? 'bg-brand-50/20' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`${getColorForType(app.grantType)} p-2.5 rounded-lg shadow-sm`}>
                          {getIconForType(app.grantType)}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-bold text-slate-900">{app.title}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            ID: {app.id} • {app.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          app.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          app.status === 'Under Review' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          app.status === 'Pending Review' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          app.status === 'Incomplete' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                          'bg-blue-100 text-blue-800 border-blue-200 animate-pulse'
                        }`}>
                          {app.status}
                        </span>
                        
                        {app.status === 'Incomplete' ? (
                           <a href="#/apply" className="ml-4 text-xs font-bold text-brand-600 hover:underline">Resume</a>
                        ) : (
                           <MoreHorizontal className="h-4 w-4 text-slate-400 ml-4 cursor-pointer hover:text-brand-600" />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
                
                {allApps.length === 0 && (
                   <li className="px-6 py-8 text-center text-slate-500">
                     No applications found. Start a new one today.
                   </li>
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white shadow-card rounded-lg p-6 border border-slate-200 mb-6">
               <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Notifications</h3>
               <div className="space-y-4">
                 <div className="flex items-start">
                   <div className="flex-shrink-0">
                     <div className="h-2 w-2 mt-1.5 rounded-full bg-red-500 animate-pulse"></div>
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-bold text-slate-900">Document Verification</p>
                     <p className="text-xs text-slate-500 mt-1">Please upload your 2024 tax return to finalize the SBA application.</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <div className="flex-shrink-0">
                     <div className="h-2 w-2 mt-1.5 rounded-full bg-slate-300"></div>
                   </div>
                   <div className="ml-3">
                     <p className="text-sm font-bold text-slate-900">System Maintenance</p>
                     <p className="text-xs text-slate-500 mt-1">Portal will be down for maintenance on Sunday 2am-4am EST.</p>
                   </div>
                 </div>
               </div>
               <button className="w-full mt-4 text-center text-sm text-brand-600 font-bold hover:underline bg-slate-50 py-2 rounded border border-slate-100">
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

            {demoApps.length > 0 && (
              <button 
                onClick={clearDemoData}
                className="w-full flex items-center justify-center p-3 text-red-600 text-xs font-bold border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Reset Demo Data
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;