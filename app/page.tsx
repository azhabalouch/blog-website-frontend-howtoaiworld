import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Cloud, BarChart2, Briefcase, Lock, Database } from "lucide-react";
import { getAuthors, getBlogs, getCategories, generateSlug } from "../lib/site-data";

export default function Home() {
  const blogs = getBlogs();
  const featuredBlog = blogs[0];
  const recommendedBlogs = blogs.slice(1, 4);
  const latestBlogs = blogs.slice(4, 8);
  const categories = getCategories().slice(0, 6);
  const authors = getAuthors().slice(0, 3);
  
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Top Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Story */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Featured Stories</h2>
          <Link href={featuredBlog ? `/blogs/${generateSlug(featuredBlog.title)}` : "/blogs"} className="relative block rounded-xl overflow-hidden shadow-lg h-[400px] group cursor-pointer">
            {featuredBlog && (
              <>
                <Image 
                  src={featuredBlog.featured_image || "https://placehold.co/800x400"} 
                  alt={featuredBlog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-3xl font-bold mb-2">{featuredBlog.title}</h3>
                  <p className="text-gray-200 line-clamp-2">{featuredBlog.excerpt}</p>
                </div>
                <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/40"><ChevronLeft className="w-6 h-6 text-white" /></button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/40"><ChevronRight className="w-6 h-6 text-white" /></button>
              </>
            )}
          </Link>
        </div>

        {/* Recommended Articles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Recommended</h2>
          <div className="flex flex-col gap-4 h-[400px] justify-between">
            {recommendedBlogs.map((blog, idx) => (
              <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`} className="flex gap-4 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition">
                <div className="relative w-24 h-20 rounded-md overflow-hidden shrink-0">
                  <Image src={blog.featured_image || "https://placehold.co/100x100"} alt="Thumb" fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-sm leading-tight line-clamp-2 mb-1">{blog.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-4 rounded-full bg-gray-200 shrink-0" />
                    <span>{blog.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest From Our Experts */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">Latest From Our Experts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestBlogs.map((blog, idx) => (
            <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full">
              <div className="relative h-40">
                <Image src={blog.featured_image || "https://placehold.co/300x200"} alt={blog.title} fill className="object-cover" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-blue-600 uppercase mb-2">{blog.category || "Category"}</span>
                <h3 className="font-bold text-lg mb-2 leading-tight line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{blog.excerpt}</p>
                {blog.keywords && blog.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.keywords.slice(0, 3).map((keyword) => (
                      <span key={keyword} className="text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 px-2 py-1">{keyword}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                  <div>
                    <div className="text-sm font-bold">{blog.author}</div>
                    <div className="text-xs text-gray-500">{blog.date}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Latest Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogs.slice(0, 4).map((blog, idx) => (
                <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition block">
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{blog.title}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{blog.excerpt}</p>
                <div className="text-xs text-blue-600 font-semibold uppercase">{blog.category || "Category"}</div>
                </Link>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Browse Categories</h2>
          <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, idx) => {
                const icons = [CheckCircle2, ShieldCheck, Cloud, BarChart2, Briefcase, Lock, Database];
                const Icon = icons[idx % icons.length];

                return (
                  <Link key={cat.slug} href={`/blogs?category=${encodeURIComponent(cat.name)}`} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 cursor-pointer hover:border-blue-300">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium flex-1">{cat.name}</span>
                      <span className="text-xs text-gray-400">({cat.count})</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-wider">Top Authors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Link key={author.slug} href={`/authors/${author.slug}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">{author.initials}</div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg leading-tight">{author.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{author.bio}</p>
                  <div className="text-xs font-semibold text-blue-600 mt-2">{author.postCount} posts</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
    </main>
  )
}