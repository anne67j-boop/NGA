import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';

import Home from './pages/Home';
import About from './pages/About';
import Grants from './pages/Grants';
import Refunds from './pages/Refunds';
import Apply from './pages/Apply';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Eligibility from './pages/Eligibility';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VisionLab from './pages/VisionLab';
import VProfile from './pages/VProfile';

import ChatWidget from './components/ChatWidget';

// -----------------------------
// Route Types
// -----------------------------
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

// IMPORTANT: semicolon above fixes TS1005 errors

const DEFAULT_ROUTE: RoutePath = '#/';

// -----------------------------
// Route Map
// -----------------------------
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

// -----------------------------
// Helpers
// -----------------------------
const getInitialHash = (): RoutePath => {
  const raw = window.location.hash || DEFAULT_ROUTE;
  const clean = raw.split('?')[0] as RoutePath;
  return clean in ROUTES ? clean : DEFAULT_ROUTE;
};

const normalizeHash = (hash: string): RoutePath => {
  const clean = hash.split('?')[0] as RoutePath;
  return clean in ROUTES ? clean : DEFAULT_ROUTE;
};

// -----------------------------
// App Component
// -----------------------------
const App = (): React.JSX.Element => {
  const [currentHash, setCurrentHash] = useState<RoutePath>(() => getInitialHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(normalizeHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const normalizedPath = normalizeHash(currentHash);

  // Standalone Login Page (no layout)
  if (normalizedPath === '#/login') {
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
