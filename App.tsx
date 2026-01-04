import React, { useEffect, useState } from "react";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import Grants from "./pages/Grants";
import Apply from "./pages/Apply";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";
import Eligibility from "./pages/Eligibility";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VisionLab from "./pages/VisionLab";
import VProfile from "./pages/VProfile";

type Route =
  | "#/"
  | "#/about"
  | "#/grants"
  | "#/apply"
  | "#/resources"
  | "#/contact"
  | "#/refunds"
  | "#/eligibility"
  | "#/login"
  | "#/dashboard"
  | "#/visionlab"
  | "#/vprofile";

const DEFAULT_ROUTE: Route = "#/";

const ROUTE_MAP: Record<Route, JSX.Element> = {
  "#/": <Home />,
  "#/about": <About />,
  "#/grants": <Grants />,
  "#/apply": <Apply />,
  "#/resources": <Resources />,
  "#/contact": <Contact />,
  "#/refunds": <Refunds />,
  "#/eligibility": <Eligibility />,
  "#/login": <Login />,
  "#/dashboard": <Dashboard />,
  "#/visionlab": <VisionLab />,
  "#/vprofile": <VProfile />,
};

const normalizeHash = (hash: string): Route => {
  const clean = hash.split("?")[0] as Route;
  return clean in ROUTE_MAP ? clean : DEFAULT_ROUTE;
};

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>(() =>
    normalizeHash(window.location.hash || DEFAULT_ROUTE)
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(normalizeHash(window.location.hash));
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Login page should NOT use Layout
  if (route === "#/login") {
    return ROUTE_MAP["#/login"];
  }

  return <Layout>{ROUTE_MAP[route]}</Layout>;
};

export default App;
