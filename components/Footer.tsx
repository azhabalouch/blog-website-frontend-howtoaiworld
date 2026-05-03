import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 shrink-0 border-t border-white/10 bg-[#11151c] text-[#e7ecf2]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-5" aria-label="Footer navigation">
          <section className="space-y-4 xl:col-span-2">
            <h4 className="text-lg font-semibold tracking-wide text-white">About Us</h4>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Howtoaiworld is your premier destination for AI news, cutting-edge tutorials, and expert insights.
              We deliver high-quality content that keeps you informed about the latest in artificial intelligence
              and technology innovation.
            </p>
          </section>

          <nav className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link href="/" className="transition hover:text-white">Home</Link></li>
              <li><Link href="/blogs" className="transition hover:text-white">Featured Articles</Link></li>
              <li><Link href="/about" className="transition hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact Us</Link></li>
            </ul>
          </nav>

          <nav className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide text-white">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link href="/legal/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="transition hover:text-white">Terms of Service</Link></li>
              <li><Link href="/legal/disclaimer" className="transition hover:text-white">Disclaimer</Link></li>
            </ul>
          </nav>

          <section className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide text-white">Connect With Us</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a href="https://x.com/howtoaiworld" rel="noopener noreferrer" target="_blank" className="transition hover:text-white">
                  𝕏 Twitter
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/people/Howtoaiworld/61587792413577" rel="noopener noreferrer" target="_blank" className="transition hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/howtoaiworld" rel="noopener noreferrer" target="_blank" className="transition hover:text-white">
                  Instagram
                </a>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h4 className="text-lg font-semibold tracking-wide text-white">Get In Touch</h4>
            <p className="text-sm leading-7 text-slate-300">Have questions or feedback? We&apos;d love to hear from you.</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a href="mailto:support@howtoaiworld.com" className="transition hover:text-white">
                  ✉ support@howtoaiworld.com
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
                >
                  Contact Form
                </Link>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Howtoaiworld All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
