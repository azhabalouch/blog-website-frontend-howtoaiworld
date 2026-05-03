import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p>© 2026 Global Enterprise Solutions. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/legal/terms" className="hover:text-gray-900">Terms of Service</Link>
          <Link href="/legal/privacy" className="hover:text-gray-900">Privacy Policy</Link>
          <Link href="/legal/gdpr" className="hover:text-gray-900">GDPR</Link>
        </div>
      </div>
    </footer>
  );
}
