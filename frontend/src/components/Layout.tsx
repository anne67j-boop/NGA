import React, { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { label: "Home", href: "#/" },
  { label: "Grant information", href: "#/grants" },
  { label: "Eligibility", href: "#/eligibility" },
  { label: "Resources", href: "#/resources" },
  { label: "About", href: "#/about" },
  { label: "Contact", href: "#/contact" },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = window.localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      // Storage may be unavailable in private or restricted browsing contexts.
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      // Theme remains available for this page session when storage is blocked.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((current) => current === "light" ? "dark" : "light");

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        Independent information website — not a government agency or official grant portal. Verify all information with the administering agency.
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#/" className="min-w-0 text-left" aria-label="Grant Assistance Information home">
            <span className="block truncate text-lg font-bold text-slate-900 dark:text-white">Grant Assistance Information</span>
            <span className="block text-xs text-slate-600 dark:text-slate-400">Independent information and official resources</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} aria-current={window.location.hash === item.href ? "page" : undefined} className="rounded px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">
                {item.label}
              </a>
            ))}
            <a href="https://www.grants.gov/" rel="noopener noreferrer" className="ml-2 rounded bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
              Official Grants.gov
            </a>
            <button type="button" onClick={toggleTheme} aria-label="Toggle color theme" className="ml-2 rounded p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <button type="button" onClick={toggleTheme} aria-label="Toggle color theme" className="rounded p-2 text-slate-600 dark:text-slate-300">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="rounded p-2 text-slate-700 dark:text-slate-200">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={window.location.hash === item.href ? "page" : undefined} className="block rounded px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                {item.label}
              </a>
            ))}
            <a href="https://www.grants.gov/" rel="noopener noreferrer" className="mt-2 block rounded bg-brand-700 px-3 py-3 text-center text-sm font-semibold text-white">
              Official Grants.gov
            </a>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-slate-100 py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Independent grant information website. No government affiliation or funding authority is claimed.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#/refunds" className="underline hover:text-slate-950 dark:hover:text-white">Fees and payment warning</a>
            <a href="#/contact" className="underline hover:text-slate-950 dark:hover:text-white">Support status</a>
            <a href="https://www.grants.gov/" rel="noopener noreferrer" className="underline hover:text-slate-950 dark:hover:text-white">Grants.gov</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
