import React from 'react';
import { TEAM } from '../constants';
import { Target, Users, Map } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Our Mission</h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto">
            We are dedicated to providing equitable financial assistance to American families and small businesses during times of need and growth.
          </p>
        </div>
      </div>

      {/* Program Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Who We Are</h2>
            <div className="prose prose-slate text-slate-600 leading-relaxed space-y-4">
              <p>
                The National Grant Assistance Portal was established to simplify the process of finding and applying for financial aid. We aggregate funding from various federal, state, and private non-profit sources into one accessible platform.
              </p>
              <p>
                Whether you are a homeowner needing repairs, a patient struggling with medical bills, or an entrepreneur launching a startup, our goal is to connect you with the resources you qualify for.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex items-start">
                 <Target className="h-6 w-6 text-brand-600 mr-2 mt-1" />
                 <div>
                   <h4 className="font-bold text-slate-900">Targeted Aid</h4>
                   <p className="text-sm text-slate-500">Specific programs for specific needs.</p>
                 </div>
              </div>
              <div className="flex items-start">
                 <Users className="h-6 w-6 text-brand-600 mr-2 mt-1" />
                 <div>
                   <h4 className="font-bold text-slate-900">Community First</h4>
                   <p className="text-sm text-slate-500">Helping neighbors help neighbors.</p>
                 </div>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000" 
              alt="Community meeting" 
              className="rounded-lg shadow-lg border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Meet The Support Team</h2>
            <p className="text-slate-600 mt-2">
              Real people working to process your applications and answer your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.id} className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full border-4 border-slate-50">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-brand-600 font-medium text-sm mb-4">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;