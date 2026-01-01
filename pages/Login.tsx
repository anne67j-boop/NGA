import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Loader2, Key } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      window.location.hash = '#/dashboard';
      setIsLoading(false);
    }, 1200);
  };

  const performDemoLogin = () => {
    setIsLoading(true);
    setEmail('john.doe@example.com');
    setPassword('SecurePass123!');
    
    // Auto-redirect after a short "filling" delay
    setTimeout(() => {
      window.location.hash = '#/dashboard';
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => window.location.hash = '#/'}
            className="flex items-center gap-3 group"
          >
            <div className="bg-brand-600 text-white p-3 shadow-lg rounded-lg group-hover:bg-brand-700 transition-colors">
              <span className="font-serif font-bold text-3xl tracking-tighter">US</span>
            </div>
          </button>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or <button onClick={() => window.location.hash = '#/apply'} className="font-medium text-brand-600 hover:text-brand-500 hover:underline">start a new application</button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white py-8 px-4 shadow-depth sm:rounded-lg sm:px-10 border border-slate-100">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-brand-600 py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">Demo Access</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={performDemoLogin}
                className="flex w-full items-center justify-center rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Key className="h-4 w-4 mr-2 text-slate-400" />
                Use Demo Credentials
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-2 text-slate-400 text-xs">
          <ShieldCheck className="h-4 w-4" />
          <span>Official US Government Secure System</span>
        </div>
      </div>
    </div>
  );
};

export default Login;