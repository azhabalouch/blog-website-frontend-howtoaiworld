import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { getCategories } from "../lib/site-data";

export default function Navbar() {
  const categories = getCategories().slice(0, 8);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img className="w-9 h-8 rounded-full flex items-center justify-center" src="/logo.jpg"/>
          <span className="font-bold text-xl tracking-tight leading-none">
            Howtoaiworld
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-gray-700">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <div className="relative group flex items-center cursor-pointer hover:text-blue-600 py-4">
            Blogs <ChevronDown className="w-4 h-4 ml-1" />
            <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 flex flex-col z-50">
              <Link href="/blogs" className="px-4 py-2 hover:bg-gray-50 text-gray-800 hover:text-blue-600 font-bold border-b border-gray-100">All Blogs</Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/blogs?category=${encodeURIComponent(cat.name)}`} className="px-4 py-2 hover:bg-gray-50 text-gray-600 hover:text-blue-600">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          <Link href="/authors" className="hover:text-blue-600">Authors</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <form className="flex rounded-md border border-gray-300 overflow-hidden h-9">
            <input type="email" placeholder="Email" className="px-3 outline-none text-sm w-40" />
            <button type="button" className="bg-slate-600 text-white px-4 text-sm font-medium hover:bg-slate-700">Subscribe</button>
          </form>
          <form action="/blogs" method="GET" className="flex items-center border border-gray-300 rounded-md px-3 h-9 bg-gray-50 max-w-[200px]">
            <input type="text" name="q" placeholder="Search..." className="bg-transparent outline-none w-full text-sm" />
            <button type="submit"><Search className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer" /></button>
          </form>
        </div>
      </div>
    </header>
  );
}
