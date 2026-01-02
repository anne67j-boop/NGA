import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Support Center</h1>
          <p className="text-lg text-slate-600">Need help with your application? We are here to assist you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
               <div className="space-y-4">
                 <div className="flex items-start">
                   <Phone className="h-5 w-5 text-brand-600 mr-3 mt-1" />
                   <div>
                     <p className="text-sm font-bold text-slate-900">Phone Support</p>
                     <p className="text-sm text-slate-600">1-800-555-HELP</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <Mail className="h-5 w-5 text-brand-600 mr-3 mt-1" />
                   <div>
                     <p className="text-sm font-bold text-slate-900">Email</p>
                     <p className="text-sm text-slate-600">support@nationalgrants.org</p>
                   </div>
                 </div>
                 <div className="flex items-start">
                   <Clock className="h-5 w-5 text-brand-600 mr-3 mt-1" />
                   <div>
                     <p className="text-sm font-bold text-slate-900">Hours</p>
                     <p className="text-sm text-slate-600">Mon-Fri: 8am - 6pm EST</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-brand-50 p-6 rounded-lg border border-brand-100">
               <h3 className="font-bold text-brand-800 mb-2">SBA Assistance</h3>
               <p className="text-sm text-brand-700">
                 For specific questions regarding Small Business loans, please have your business tax ID ready when calling.
               </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                  <h3 className="text-green-800 font-bold mb-2">Message Sent</h3>
                  <p className="text-green-700 text-sm mb-4">Our support team has received your inquiry and will respond via email shortly.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-brand-600 font-bold text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full border-slate-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        className="w-full border-slate-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                    <select className="w-full border-slate-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500">
                      <option>Application Status</option>
                      <option>Eligibility Question</option>
                      <option>Technical Issue</option>
                      <option>Report a Problem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">How can we help?</label>
                    <textarea 
                      rows={4} 
                      required 
                      className="w-full border-slate-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-bold rounded-md hover:bg-brand-700 transition-colors"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;