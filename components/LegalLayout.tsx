"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Scale, 
  Shield, 
  AlertTriangle, 
  ChevronRight,
  FileText,
  Home
} from "lucide-react";

const legalPages = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How we collect and protect your data",
    icon: Shield,
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "Rules for using our platform",
    icon: Scale,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description: "Important legal information",
    icon: AlertTriangle,
  },
];

interface LegalLayoutProps {
  children: React.ReactNode;
  sections?: { id: string; title: string }[];
}

export default function LegalLayout({ children, sections = [] }: LegalLayoutProps) {
  const pathname = usePathname();
  const currentPage = legalPages.find(page => pathname.includes(page.slug));

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Header */}
      <div className="bg-card-bg border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-muted" />
            <span className="text-muted">Legal</span>
            {currentPage && (
              <>
                <ChevronRight className="w-4 h-4 text-muted" />
                <span className="text-foreground font-medium">{currentPage.title}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Page Navigation Card */}
              <div className="premium-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Legal Center</h2>
                    <p className="text-xs text-muted">Compliance & Policies</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  {legalPages.map((page) => {
                    const Icon = page.icon;
                    const isActive = pathname.includes(page.slug);
                    return (
                      <Link
                        key={page.slug}
                        href={`/legal/${page.slug}`}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                          isActive 
                            ? "bg-primary/10 border border-primary/20" 
                            : "hover:bg-surface border border-transparent"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mt-0.5 ${isActive ? "text-primary" : "text-muted"}`} />
                        <div className="flex-1">
                          <span className={`block font-medium text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                            {page.title}
                          </span>
                          <span className="text-xs text-muted leading-tight block mt-0.5">
                            {page.description}
                          </span>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Table of Contents - Only show if sections provided */}
              {sections.length > 0 && (
                <div className="premium-card p-5">
                  <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
                    On This Page
                  </h3>
                  <nav 
                    className="space-y-1 overflow-y-auto pr-1" 
                    style={{ maxHeight: 'min(400px, calc(100vh - 400px))' }}
                  >
                    {sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="block py-2 px-3 text-sm text-muted hover:text-primary hover:bg-surface rounded-lg transition-colors"
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Contact Card */}
              <div className="premium-surface p-4">
                <p className="text-sm text-muted">
                  Questions about our legal policies?{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
