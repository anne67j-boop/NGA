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

const normalizeHash = (hash: string): RoutePath => {
  const clean = hash.split('?')[0] as RoutePath;
  return clean in ROUTES ? clean : DEFAULT_ROUTE;
};

const App = (): React.JSX.Element => {
  const [currentHash, setCurrentHash] = useState<RoutePath>(() => normalizeHash(window.location.hash || DEFAULT_ROUTE));

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(normalizeHash(window.location.hash));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const PageComponent = ROUTES[normalizeHash(currentHash)];
  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
};

export default App;
