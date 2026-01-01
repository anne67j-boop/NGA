import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, UserCircle, LayoutDashboard, Sun, Moon } from 'lucide-react';
import ChatWidget from './ChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Theme Management
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
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
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      {/* Official US Banner */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 py-1.5 px-4 text-xs font-medium text-slate-900 dark:text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
             <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="US Flag" className="h-3 w-auto" />
             <span>An official website of the United States Grant Assistance Program</span>
          </div>
          <div className="hidden sm:block text-slate-500 dark:text-slate-400">
            Secure & Verified
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white dark:bg-slate-900 border-b-4 border-brand-500 sticky top-0 z-50 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo area */}
            <button 
              onClick={() => navigate('#/')} 
              className="flex items-center gap-4 focus:outline-none group text-left"
              aria-label="Home"
            >
              <div className="bg-brand-900 dark:bg-brand-800 text-white p-2.5 shadow-sm rounded-sm">
                <span className="font-serif font-bold text-2xl tracking-tighter">US</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 dark:text-white leading-none group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">National Grant Assistance</span>
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Portal for Personal, Business & Health Funding</span>
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
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-700 dark:hover:text-brand-400'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              
              <div className="ml-4 pl-4 border-l border-slate-300 dark:border-slate-700 flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>

                {isLoggedIn ? (
                  <button
                    onClick={() => navigate('#/dashboard')}
                    className="flex items-center text-brand-700 dark:text-brand-300 font-bold text-sm hover:text-brand-900 dark:hover:text-white bg-brand-50 dark:bg-brand-900/50 px-3 py-2 rounded border border-brand-100 dark:border-brand-800"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                  </button>
                ) : (
                  <>
                     <button
                      onClick={() => navigate('#/login')}
                      className="text-slate-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-400 font-bold text-sm px-3 py-2 flex items-center"
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
            <div className="lg:hidden flex items-center gap-2">
               <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-brand-900 dark:text-white focus:outline-none p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                <span className="sr-only">Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  className={`block w-full text-left px-3 py-4 border-b border-slate-100 dark:border-slate-800 text-base font-bold ${
                    isActiveLink(link.path)
                        ? 'text-brand-700 dark:text-brand-400 pl-4 border-l-4 border-brand-700 dark:border-brand-500 bg-slate-50 dark:bg-slate-800/50'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </button>
              ))}
               <button
                  onClick={() => navigate('#/dashboard')}
                  className="block w-full text-left px-3 py-4 border-b border-slate-100 dark:border-slate-800 text-base font-bold text-brand-800 dark:text-brand-300"
                >
                  My Dashboard
                </button>
              <div className="pt-6 px-3">
                <button
                  onClick={() => navigate('#/login')}
                  className="block w-full text-center bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 font-bold text-lg mb-3 rounded"
                >
                  Member Login
                </button>
                <button
                  onClick={() => navigate('#/apply')}
                  className="block w-full text-center bg-brand-700 dark:bg-brand-600 text-white px-4 py-3 font-bold text-lg shadow-sm rounded"
                >
                  Start Application
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow focus:outline-none bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        {children}
      </main>

      {/* Footer - Official Style */}
      <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-800 pt-12 pb-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 shadow-sm max-w-md rounded-lg">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Need help?</h3>
                 <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Contact the National Grant Assistance support line for guidance on eligibility and application status.</p>
                 <div className="flex items-center text-brand-700 dark:text-brand-400 font-bold">
                    <Phone className="h-5 w-5 mr-2" /> 1-800-555-GRANT
                 </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Programs</h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li><button onClick={() => navigate('#/grants')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">Personal Relief</button></li>
                <li><button onClick={() => navigate('#/grants')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">Small Business (SBA)</button></li>
                <li><button onClick={() => navigate('#/eligibility')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">Check Eligibility</button></li>
                <li><button onClick={() => navigate('#/grants')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">Healthcare Assistance</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Official Tools</h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li><button onClick={() => navigate('#/dashboard')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">My Dashboard</button></li>
                <li><button onClick={() => navigate('#/apply')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">Check Status</button></li>
                <li><button onClick={() => navigate('#/contact')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">Report Fraud</button></li>
                <li><button onClick={() => navigate('#/visionlab')} className="hover:text-brand-700 dark:hover:text-brand-300 hover:underline">Innovation Studio</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-300 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400">
             <div className="mb-4 md:mb-0">
               <span className="font-bold">National Grant Assistance Portal</span> &copy; 2025
             </div>
             <div className="flex space-x-6">
               <button onClick={() => navigate('#/refunds')} className="hover:underline hover:text-brand-700 dark:hover:text-brand-300">Refund Policy</button>
               <button className="hover:underline hover:text-brand-700 dark:hover:text-brand-300">Privacy Policy</button>
               <button className="hover:underline hover:text-brand-700 dark:hover:text-brand-300">Accessibility</button>
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