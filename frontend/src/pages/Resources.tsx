import React, { useState } from 'react';
import { FAQS, RESOURCES } from '../constants';
import { FileText, Download, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const Resources: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Documents & Help Center</h1>
          <p className="text-lg text-slate-600">Download necessary forms and find answers to common questions.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Files Column */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
               <FileText className="h-5 w-5 text-brand-600 mr-2" /> Downloadable Forms
            </h2>
            
            <div className="space-y-4">
              {RESOURCES.map((resource) => (
                <div key={resource.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-200 rounded-lg hover:border-brand-500 transition-colors">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{resource.title}</h3>
                    <p className="text-slate-500 text-sm mb-2">{resource.description}</p>
                    <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-mono">
                      {resource.type} • {resource.size}
                    </span>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <a 
                      href={resource.url}
                      className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Column */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
               <HelpCircle className="h-5 w-5 text-brand-600 mr-2" /> Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.id} className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-4 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 text-sm pr-4">{faq.question}</span>
                    {openFaq === faq.id ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-4 pb-4 pt-0 bg-slate-50 border-t border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed mt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-brand-50 border border-brand-100 rounded-lg p-6">
              <h3 className="text-brand-800 font-bold mb-2">Still have questions?</h3>
              <p className="text-brand-700 text-sm mb-4">
                Our support team is available to help guide you through the application process.
              </p>
              <a href="/contact" className="text-brand-700 font-bold text-sm underline hover:text-brand-900">
                Contact Support
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Resources;