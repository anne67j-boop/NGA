import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User, Briefcase, FileText, Save, Sparkles, Loader2, CheckCircle, Shield, AlertCircle } from 'lucide-react';

const VProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    businessName: '',
    businessType: '',
    ein: '',
    annualRevenue: '',
    narrativeRaw: '',
    narrativePolished: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('vprofile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const validateProfile = () => {
     // Basic heuristics
     const fakePattern = /^test$|^123$|^fake$/i;
     if (fakePattern.test(profile.firstName) || fakePattern.test(profile.lastName)) {
        return "Please enter a valid legal name.";
     }
     if (profile.phone.includes('555-555') || profile.phone.length < 10) {
        return "Please enter a valid, active phone number.";
     }
     return null;
  };

  const handleSave = () => {
    const validationError = validateProfile();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    
    // Simulate network save
    setTimeout(() => {
      localStorage.setItem('vprofile', JSON.stringify(profile));
      setSaved(true);
      setLoading(false);
    }, 800);
  };

  const generateNarrative = async () => {
    if (!profile.narrativeRaw.trim()) {
      setError("Please write a few bullet points about yourself or your business first.");
      return;
    }
    
    // Check if API key is available (shimmed or real)
    if (!process.env.API_KEY && (!(window as any).process?.env?.API_KEY)) {
        setError("AI features require a valid API session. Please ensure you are connected.");
        return;
    }

    setAiLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          You are a professional grant writer. 
          Rewrite the following user input into a compelling, formal, and persuasive 3-4 sentence professional summary suitable for a federal grant application.
          Focus on impact, stability, and need.
          
          User Input: "${profile.narrativeRaw}"
          Business Type: "${profile.businessType}"
          Revenue: "${profile.annualRevenue}"
        `,
      });
      
      const polishedText = response.text;
      setProfile(prev => ({ ...prev, narrativePolished: polishedText }));
    } catch (err) {
      console.error(err);
      setError("Unable to generate narrative. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-200">
      {/* Header */}
      <div className="bg-brand-900 text-white py-12 border-b border-brand-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
               <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Verified Applicant System</span>
          </div>
          <h1 className="text-3xl font-bold font-serif mb-2">Universal Grant Profile (vProfile)</h1>
          <p className="text-brand-200 text-lg">
            Create your master profile once. Apply to multiple grants instantly with AI-enhanced data.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-card border border-slate-200 dark:border-slate-700 overflow-hidden">
          
          {/* Progress / Status Bar */}
          <div className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600 px-8 py-4 flex justify-between items-center">
             <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Profile Completeness</span>
             <div className="flex items-center gap-4">
               {saved && <span className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> All Changes Saved</span>}
               <button 
                 onClick={handleSave}
                 disabled={loading}
                 className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded font-bold text-sm transition-colors"
               >
                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                 Save Profile
               </button>
             </div>
          </div>

          <div className="p-8 space-y-10">
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <p className="ml-3 text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* 1. Personal Identity */}
            <section className="animate-fade-in">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                <User className="h-5 w-5 text-brand-600 dark:text-brand-400 mr-2" /> Personal Identity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="e.g. Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="e.g. Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="jane.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Mailing Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </div>
            </section>

            {/* 2. Business / Economic Data */}
            <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center border-b border-slate-100 dark:border-slate-700 pb-2">
                <Briefcase className="h-5 w-5 text-brand-600 dark:text-brand-400 mr-2" /> Economic Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Business Name (Optional)</label>
                   <input 
                    type="text" 
                    name="businessName"
                    value={profile.businessName}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-2.5 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="Leave blank if applying as individual"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Entity Type</label>
                  <select 
                    name="businessType" 
                    value={profile.businessType}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded p-2.5 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-900 dark:text-white"
                  >
                    <option value="">-- Select Type --</option>
                    <option value="Individual / Sole Prop">Individual / Sole Proprietorship</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Non-Profit">Non-Profit (501c3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Annual Household/Business Income</label>
                  <select 
                    name="annualRevenue" 
                    value={profile.annualRevenue}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-600 rounded p-2.5 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-slate-900 dark:text-white"
                  >
                    <option value="">-- Select Range --</option>
                    <option value="0-25k">$0 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k+">$100,000+</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 3. AI Narrative Builder */}
            <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-2">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                    <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400 mr-2" /> Grant Narrative
                 </h2>
                 <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" /> AI Powered
                 </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Draft Your Story
                    <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                      Briefly describe your situation, your business goals, or why you need funding. Bullet points are fine.
                    </span>
                  </label>
                  <textarea 
                    name="narrativeRaw"
                    value={profile.narrativeRaw}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white rounded p-3 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="e.g. I have been running a bakery for 5 years. I want to buy a new oven to increase production. I am located in an underserved community."
                  />
                </div>

                <div className="flex justify-end mb-6">
                   <button 
                     onClick={generateNarrative}
                     disabled={aiLoading}
                     className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded font-bold text-sm transition-colors flex items-center shadow-sm"
                   >
                     {aiLoading ? (
                       <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Polishing...
                       </>
                     ) : (
                       <>
                        <Sparkles className="h-4 w-4 mr-2" /> Generate Professional Bio
                       </>
                     )}
                   </button>
                </div>
                
                {profile.narrativePolished && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Professional Summary (Ready for Application)
                    </label>
                    <div className="relative">
                      <textarea 
                        name="narrativePolished"
                        value={profile.narrativePolished}
                        onChange={handleChange}
                        rows={5}
                        className="w-full border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10 rounded p-3 focus:ring-purple-500 focus:border-purple-500 text-slate-800 dark:text-slate-200 leading-relaxed"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/80 dark:bg-slate-800/80 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-1 rounded border border-purple-100 dark:border-purple-800">
                          AI Generated
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      * Review and edit this text as needed. It will be saved to your vProfile for future applications.
                    </p>
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VProfile;