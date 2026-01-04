import React, { useState, useEffect, ReactElement } from 'react';

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

const ROUTES: Record<RoutePath, () => ReactElement> = {
  '#/': () => <Home />,
  '#/about': () => <About />,
  '#/grants': () => <Grants />,
  '#/refunds': () => <Refunds />,
  '#/apply': () => <Apply />,
  '#/resources': () => <Resources />,
  '#/contact': () => <Contact />,
  '#/eligibility': () => <Eligibility />,
  '#/login': () => <Login />,
  '#/dashboard': () => <Dashboard />,
  '#/visionlab': () => <VisionLab />,
  '#/vprofile': () => <VProfile />,
};

const getInitialHash = (): string => {
  if (!window.location.hash) {
    window.location.hash = DEFAULT_ROUTE;
  }
  return window.location.hash;
};

const normalizeHash = (hash: string): RoutePath => {
  // Strip query params, keep only the path part
  const path = hash.split('?')[0] as RoutePath;

  if (path in ROUTES) {
    return path;
  }

  return DEFAULT_ROUTE;
};

const App: React.FC = () => {
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

  // Login page: render standalone, without Layout
  if (normalizedPath === '#/login' || currentHash.startsWith('#/login')) {
    return <Login />;
  }

  const PageComponent = ROUTES[normalizedPath] ?? ROUTES[DEFAULT_ROUTE];

  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
};

export default App;
