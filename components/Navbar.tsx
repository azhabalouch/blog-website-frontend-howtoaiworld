"use client";

import Link from "next/link";
import { Search, ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import { getCategories } from "../lib/site-data";
import { useState, useEffect } from "react";

export default function Navbar() {
  const categories = getCategories().slice(0, 8);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [blogsDropdownOpen, setBlogsDropdownOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="bg-card-bg border-b border-card-border sticky top-0 z-50" style={{ boxShadow: "var(--shadow-premium)" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          {/* <img className="w-9 h-8 rounded-full" src="/logo.jpg" alt="Howtoaiworld Logo"/> */}
          <span className="font-bold text-xl tracking-tight leading-none text-foreground">
            Howtoaiworld
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-muted">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <div className="relative group flex items-center cursor-pointer hover:text-primary py-4 transition-colors">
            Blogs <ChevronDown className="w-4 h-4 ml-1" />
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
          <form action="/blogs" method="GET" className="flex items-center border border-card-border rounded-xl px-3 h-9 bg-surface max-w-[200px]">
            <input type="text" name="q" placeholder="Search..." className="bg-transparent outline-none w-full text-sm text-foreground placeholder-muted" />
            <button type="submit"><Search className="w-4 h-4 text-muted hover:text-primary cursor-pointer" /></button>
          </form>
          <button onClick={toggleDarkMode} className="p-2 rounded-xl border border-card-border hover:bg-surface transition-colors" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-muted" />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-surface transition-colors" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-muted" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-surface transition-colors" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-card-border bg-card-bg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors">Home</Link>
            <div>
              <button onClick={() => setBlogsDropdownOpen(!blogsDropdownOpen)} className="w-full flex items-center justify-between py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors">
                Blogs <ChevronDown className={`w-4 h-4 transition-transform ${blogsDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {blogsDropdownOpen && (
                <div className="pl-4 flex flex-col">
                  <Link href="/blogs" onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl hover:bg-surface text-muted hover:text-primary font-semibold transition-colors">All Blogs</Link>
                  {categories.map((cat) => (
                    <Link key={cat.slug} href={`/blogs?category=${encodeURIComponent(cat.name)}`} onClick={() => setMobileOpen(false)} className="py-2.5 px-3 rounded-xl hover:bg-surface text-muted hover:text-primary transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors">About</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors">Contact</Link>
            <Link href="/authors" onClick={() => setMobileOpen(false)} className="py-3 px-3 rounded-xl hover:bg-surface text-foreground font-medium transition-colors">Authors</Link>
            <div className="mt-2 pt-2 border-t border-card-border">
              <form action="/blogs" method="GET" className="flex items-center border border-card-border rounded-xl px-3 h-10 bg-surface">
                <input type="text" name="q" placeholder="Search..." className="bg-transparent outline-none w-full text-sm text-foreground placeholder-muted" />
                <button type="submit"><Search className="w-4 h-4 text-muted" /></button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
