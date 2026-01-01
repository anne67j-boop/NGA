import React, { useState } from 'react';
import { Menu, X, Phone, UserCircle, LayoutDashboard } from 'lucide-react';
import ChatWidget from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get current path for active state highlighting
  const currentPath = window.location.hash.replace(/^#/, '').split('?')[0] || '/';
  const isLoggedIn = currentPath === '/dashboard' || currentPath === '/visionlab';

  const navigate = (path: string) => {
    window.location.hash = path;
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navLinks = [
    { name: 'Home', path: '#/' },
    { name: 'Available Grants', path: '#/grants' },
    { name: 'About', path: '#/about' },
    { name: 'Resources', path: '#/resources' },
  ];

  const isActiveLink = (path: string) => {
    // Clean path for comparison (remove #)
    const cleanPath = path.replace(/^#/, '');
    if (cleanPath === '/') return currentPath === '/';
    return currentPath === cleanPath;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative">
      {/* Official US Banner */}
      <div className="bg-slate-100 border-b border-slate-300 py-1.5 px-4 text-xs font-medium text-slate-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
             <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="US Flag" className="h-3 w-auto" />
             <span>An official website of the United States Grant Assistance Program</span>
          </div>
          <div className="hidden sm:block text-slate-500">
            Secure & Verified
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b-4 border-brand-500 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo area */}
            <button 
              onClick={() => navigate('#/')} 
              className="flex items-center gap-4 focus:outline-none group text-left"
              aria-label="Home"
            >
              <div className="bg-brand-900 text-white p-2.5 shadow-sm rounded-sm">
                <span className="font-serif font-bold text-2xl tracking-tighter">US</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 leading-none group-hover:text-brand-700 transition-colors">National Grant Assistance</span>
                <span className="text-sm text-slate-600 font-medium mt-1">Portal for Personal, Business & Health Funding</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`px-4 py-2 text-sm font-bold rounded transition-colors ${
                    isActiveLink(link.path)
                      ? 'bg-brand-900 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-brand-700'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              
              <div className="ml-4 pl-4 border-l border-slate-300 flex items-center space-x-3">
                {isLoggedIn ? (
                  <button
                    onClick={() => navigate('#/dashboard')}
                    className="flex items-center text-brand-700 font-bold text-sm hover:text-brand-900 bg-brand-50 px-3 py-2 rounded border border-brand-100"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                  </button>
                ) : (
                  <>
                     <button
                      onClick={() => navigate('#/login')}
                      className="text-slate-700 hover:text-brand-700 font-bold text-sm px-3 py-2 flex items-center"
                    >
                      <UserCircle className="h-5 w-5 mr-1" /> Login
                    </button>
                    <button
                      onClick={() => navigate('#/apply')}
                      className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all uppercase tracking-wide rounded-sm"
                    >
                      Apply Now
                    </button>
                  </>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-brand-900 focus:outline-none p-2 hover:bg-slate-100 rounded"
              >
                {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                <span className="sr-only">Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`block w-full text-left px-3 py-4 border-b border-slate-100 text-base font-bold ${
                    isActiveLink(link.path)
                        ? 'text-brand-700 pl-4 border-l-4 border-brand-700 bg-slate-50'
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
               <button
                  onClick={() => navigate('#/dashboard')}
                  className="block w-full text-left px-3 py-4 border-b border-slate-100 text-base font-bold text-brand-800"
                >
                  My Dashboard
                </button>
              <div className="pt-6 px-3">
                <button
                  onClick={() => navigate('#/login')}
                  className="block w-full text-center bg-slate-200 text-slate-800 px-4 py-3 font-bold text-lg mb-3 rounded"
                >
                  Member Login
                </button>
                <button
                  onClick={() => navigate('#/apply')}
                  className="block w-full text-center bg-brand-700 text-white px-4 py-3 font-bold text-lg shadow-sm rounded"
                >
                  Start Application
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow focus:outline-none">
        {children}
      </main>

      {/* Footer - Official Style */}
      <footer className="bg-slate-100 border-t border-slate-300 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white p-6 border border-slate-200 shadow-sm max-w-md rounded-lg">
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Need help?</h3>
                 <p className="text-slate-600 text-sm mb-4">Contact the National Grant Assistance support line for guidance on eligibility and application status.</p>
                 <div className="flex items-center text-brand-700 font-bold">
                    <Phone className="h-5 w-5 mr-2" /> 1-800-555-GRANT
                 </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Programs</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><button onClick={() => navigate('#/grants')} className="hover:text-brand-700 hover:underline">Personal Relief</button></li>
                <li><button onClick={() => navigate('#/grants')} className="hover:text-brand-700 hover:underline">Small Business (SBA)</button></li>
                <li><button onClick={() => navigate('#/eligibility')} className="hover:text-brand-700 hover:underline">Check Eligibility</button></li>
                <li><button onClick={() => navigate('#/grants')} className="hover:text-brand-700 hover:underline">Healthcare Assistance</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Official Tools</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><button onClick={() => navigate('#/dashboard')} className="hover:text-brand-700 hover:underline">My Dashboard</button></li>
                <li><button onClick={() => navigate('#/apply')} className="hover:text-brand-700 hover:underline">Check Status</button></li>
                <li><button onClick={() => navigate('#/contact')} className="hover:text-brand-700 hover:underline">Report Fraud</button></li>
                <li><button onClick={() => navigate('#/visionlab')} className="hover:text-brand-700 hover:underline">Innovation Studio</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
             <div className="mb-4 md:mb-0">
               <span className="font-bold">National Grant Assistance Portal</span> &copy; 2025
             </div>
             <div className="flex space-x-6">
               <button onClick={() => navigate('#/refunds')} className="hover:underline hover:text-brand-700">Refund Policy</button>
               <button className="hover:underline hover:text-brand-700">Privacy Policy</button>
               <button className="hover:underline hover:text-brand-700">Accessibility</button>
             </div>
          </div>
        </div>
      </footer>
      
      {/* Automated Response Machine (Chatbot) */}
      <ChatWidget />
    </div>
  );
};

export default Layout;