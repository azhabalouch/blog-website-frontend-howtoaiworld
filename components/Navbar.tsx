"use client";

import Link from "next/link";
import { Search, ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { getCategories } from "../lib/site-data";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const categories = getCategories().slice(0, 8);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [blogsDropdownOpen, setBlogsDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Scroll lock and focus trap when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape key to close mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setBlogsDropdownOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return;
    const menu = mobileMenuRef.current;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    menu.addEventListener("keydown", handleTabTrap);
    // Focus first item on open
    first.focus();
    return () => menu.removeEventListener("keydown", handleTabTrap);
  }, [mobileOpen, blogsDropdownOpen]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setBlogsDropdownOpen(false);
  };

  return (
    <header className="bg-card-bg border-b border-card-border sticky top-0 z-50" style={{ boxShadow: "var(--shadow-premium)" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Howtoaiworld home">
          <span className="font-bold text-xl tracking-tight leading-none text-foreground">
            Howtoaiworld
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-muted" aria-label="Main navigation">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <div className="relative group flex items-center cursor-pointer hover:text-primary py-4 transition-colors">
            <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link> <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
            <div className="absolute top-full left-0 w-48 bg-card-bg border border-card-border rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 flex flex-col z-50" style={{ boxShadow: "var(--shadow-elevated)" }}>
              <Link href="/blogs" className="px-4 py-2.5 hover:bg-surface text-foreground hover:text-primary font-bold border-b border-card-border">All Blogs</Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/blogs?category=${encodeURIComponent(cat.name)}`} className="px-4 py-2.5 hover:bg-surface text-muted hover:text-primary">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="/authors" className="hover:text-primary transition-colors">Authors</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <form action="/blogs" method="GET" role="search" className="flex items-center border border-card-border rounded-xl px-3 h-9 bg-surface max-w-[200px]">
            <label htmlFor="desktop-search" className="sr-only">Search blogs</label>
            <input id="desktop-search" type="text" name="q" placeholder="Search..." className="bg-transparent outline-none w-full text-sm text-foreground placeholder-muted" />
            <button type="submit" aria-label="Search"><Search className="w-4 h-4 text-muted hover:text-primary cursor-pointer" /></button>
          </form>
          <button onClick={toggleDarkMode} className="p-2 rounded-xl border border-card-border hover:bg-surface transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-muted" />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-surface transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            {darkMode ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-muted" />}
          </button>
          <button
            ref={menuButtonRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl hover:bg-surface transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div ref={mobileMenuRef} id="mobile-menu" className="lg:hidden border-t border-card-border bg-card-bg" role="dialog" aria-label="Mobile navigation menu">
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
            <Link href="/" onClick={closeMobile} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors min-h-[44px] flex items-center">Home</Link>
            <div>
              <button
                onClick={() => setBlogsDropdownOpen(!blogsDropdownOpen)}
                className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors min-h-[44px]"
                aria-expanded={blogsDropdownOpen}
              >
                Blogs <ChevronDown className={`w-4 h-4 transition-transform ${blogsDropdownOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {blogsDropdownOpen && (
                <div className="pl-4 flex flex-col">
                  <Link href="/blogs" onClick={closeMobile} className="py-2.5 px-3 rounded-xl hover:bg-surface text-muted hover:text-primary font-semibold transition-colors min-h-[44px] flex items-center">All Blogs</Link>
                  {categories.map((cat) => (
                    <Link key={cat.slug} href={`/blogs?category=${encodeURIComponent(cat.name)}`} onClick={closeMobile} className="py-2.5 px-3 rounded-xl hover:bg-surface text-muted hover:text-primary transition-colors min-h-[44px] flex items-center">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/about" onClick={closeMobile} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors min-h-[44px] flex items-center">About</Link>
            <Link href="/contact" onClick={closeMobile} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors min-h-[44px] flex items-center">Contact</Link>
            <Link href="/authors" onClick={closeMobile} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors min-h-[44px] flex items-center">Authors</Link>
            <div className="mt-2 pt-2 border-t border-card-border">
              <form action="/blogs" method="GET" role="search" className="flex items-center border border-card-border rounded-xl px-3 h-12 bg-surface">
                <label htmlFor="mobile-search" className="sr-only">Search blogs</label>
                <input id="mobile-search" type="text" name="q" placeholder="Search..." className="bg-transparent outline-none w-full text-base text-foreground placeholder-muted" />
                <button type="submit" aria-label="Search"><Search className="w-5 h-5 text-muted" /></button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
