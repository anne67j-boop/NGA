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
import ChatWidget from './components/ChatWidget';

type RoutePath =
  | '#/'
  | '#/about'
  | '#/grants'
  | '#/refunds'
  | '#/apply'
  | '#/resources'
  | '#/contact'
  | '#/eligibility'
  | '#/login'
  | '#/dashboard'
  | '#/visionlab'
  | '#/vprofile';

const DEFAULT_ROUTE: RoutePath = '#/';

// 1. Properly define the ROUTES object outside of the component
const ROUTES: Record<RoutePath, React.ComponentType> = {
  '#/': Home,
  '#/about': About,
  '#/grants': Grants,
  '#/refunds': Refunds,
  '#/apply': Apply,
  '#/resources': Resources,
  '#/contact': Contact,
  '#/eligibility': Eligibility,
  '#/login': Login,
  '#/dashboard': Dashboard,
  '#/visionlab': VisionLab,
  '#/vprofile': VProfile,
};

const getInitialHash = (): string => {
  if (!window.location.hash) {
    window.location.hash = DEFAULT_ROUTE;
  }
  return window.location.hash;
};

const normalizeHash = (hash: string): RoutePath => {
  const path = hash.split('?')[0] as RoutePath;
  return (path in ROUTES) ? path : DEFAULT_ROUTE;
};

// 2. Only ONE App component declaration
const App = (): React.JSX.Element => {
  const [currentHash, setCurrentHash] = useState<string>(() => getInitialHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || DEFAULT_ROUTE);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const normalizedPath = normalizeHash(currentHash);

  // Standalone Login page
  if (normalizedPath === '#/login' || currentHash.startsWith('#/login')) {
    return (
      <>
        <Login />
        <ChatWidget />
      </>
    );
  }

  const PageComponent = ROUTES[normalizedPath] || ROUTES[DEFAULT_ROUTE];

  return (
    <Layout>
      <PageComponent />
      <ChatWidget />
    </Layout>
  );
};

export default App;
