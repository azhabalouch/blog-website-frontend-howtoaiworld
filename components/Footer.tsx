import Link from "next/link";
import { Mail, ArrowRight, MessageCircle, Share2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 shrink-0 border-t border-card-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4" aria-label="Footer navigation">
          <section className="space-y-4 xl:col-span-1">
            <div className="flex items-center gap-2.5">
              {/* <img className="w-9 h-8 rounded-full" src="/logo.jpg" alt="Howtoaiworld Logo"/> */}
              <span className="font-bold text-xl tracking-tight leading-none text-foreground">
                Howtoaiworld
              </span>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted">
              Your premier destination for AI news, cutting-edge tutorials, and expert insights.
              We deliver high-quality content that keeps you informed about the latest in artificial intelligence.
            </p>
          </section>

          <nav className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide text-foreground">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="/" className="transition hover:text-primary">Home</Link></li>
              <li><Link href="/blogs" className="transition hover:text-primary">Featured Articles</Link></li>
              <li><Link href="/about" className="transition hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="transition hover:text-primary">Contact Us</Link></li>
            </ul>
          </nav>

          <nav className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link href="/legal/privacy" className="transition hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="transition hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/legal/disclaimer" className="transition hover:text-primary">Disclaimer</Link></li>
            </ul>
          </nav>

          <section className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide text-foreground">Connect With Us</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a href="https://x.com/howtoaiworld" rel="noopener noreferrer" target="_blank" className="transition hover:text-primary inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Twitter / X
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/people/Howtoaiworld/61587792413577" rel="noopener noreferrer" target="_blank" className="transition hover:text-primary inline-flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/howtoaiworld" rel="noopener noreferrer" target="_blank" className="transition hover:text-primary inline-flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Instagram
                </a>
              </li>
              <li>
                <a href="mailto:support@howtoaiworld.com" className="transition hover:text-primary inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" /> support@howtoaiworld.com
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 border-t border-card-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">&copy; {new Date().getFullYear()} Howtoaiworld All rights reserved.</p>
          <Link
            href="/contact"
            className="premium-button inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
