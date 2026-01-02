import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Grants from './pages/Grants';
import Apply from './pages/Apply';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Refunds from './pages/Refunds';
import Eligibility from './pages/Eligibility';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VisionLab from './pages/VisionLab';
import VProfile from './pages/VProfile';

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    // Ensure we start with a hash
    if (!window.location.hash) {
      window.location.hash = '#/';
    }
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getPage = () => {
    // Strip query params for routing matching
    const path = currentHash.split('?')[0];
    
    // Check for "naked" paths just in case
    if (path === '#/login') return <Login />;
    
    switch (path) {
      case '#/': return <Home />;
      case '#/about': return <About />;
      case '#/grants': return <Grants />;
      case '#/refunds': return <Refunds />;
      case '#/apply': return <Apply />;
      case '#/resources': return <Resources />;
      case '#/contact': return <Contact />;
      case '#/eligibility': return <Eligibility />;
      case '#/login': return <Login />; 
      case '#/dashboard': return <Dashboard />;
      case '#/visionlab': return <VisionLab />;
      case '#/vprofile': return <VProfile />;
      default: return <Home />;
    }
  };

  // Login page standalone check
  if (currentHash.startsWith('#/login')) {
    return <Login />;
  }

  return (
    <Layout>
      {getPage()}
    </Layout>
  );
};

export default App;