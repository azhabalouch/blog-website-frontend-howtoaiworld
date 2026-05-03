import Image from "next/image";
import Link from "next/link";
import { Share2, Link as LinkIcon, User } from "lucide-react";
import { getBlogBySlug, getBlogs, generateSlug } from "../../../lib/site-data";

export async function generateStaticParams() {
  return getBlogs().map((blog) => ({
    slug: generateSlug(blog.title),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    return { title: "Blog not found - Howtoaiworld" };
  }

  return {
    title: `${blog.title} - Howtoaiworld`,
    description: blog.excerpt,
    keywords: blog.keywords,
  };
}

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const blog = getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    return <div className="max-w-4xl mx-auto py-20 text-center text-2xl font-bold">Blog not found</div>;
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Banner with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 pt-16 pb-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-100 mb-4 flex-wrap">
              <span>{blog.category?.split('/')[0]?.trim()}</span>
              {blog.keywords?.slice(0, 2).map((keyword) => (
                <span key={keyword} className="px-2 py-1 rounded-full bg-white/10 text-white">{keyword}</span>
              ))}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              {blog.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-indigo-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p>Written by: <Link href={`/authors/${generateSlug(blog.author)}`} className="font-bold text-white hover:underline">{blog.author}</Link></p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span>{blog.date}</span>
                <span>•</span>
                <span>6 min read</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/10">
              <Image 
                src={blog.featured_image || "https://placehold.co/400x400/transparent/white?text=AI+Icon"} 
                alt={blog.title}
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <h3 className="font-bold text-xl mb-6 text-gray-900 border-b pb-4">Table of Contents</h3>
            <nav className="space-y-4 text-sm font-medium text-gray-600 border-l-2 border-gray-100 pl-4 py-2">
              <a href="#" className="block hover:text-blue-600 transition">Introduction</a>
              <a href="#" className="block hover:text-blue-600 transition">Step 1: Research the topic</a>
              <a href="#" className="block hover:text-blue-600 transition">Step 2: Content Outline</a>
              <a href="#" className="block hover:text-blue-600 transition">Step 3: Write your content</a>
              <a href="#" className="block hover:text-blue-600 transition">Step 4: Verify accuracy</a>
              <a href="#" className="block hover:text-blue-600 transition">Conclusion</a>
            </nav>
            
            <div className="mt-12">
              <h4 className="font-bold text-gray-900 mb-4">Share</h4>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 transition">
                   <Share2 className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 transition">
                   <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 prose prose-lg prose-blue max-w-none text-gray-700">
            {blog.keywords && blog.keywords.length > 0 && (
              <div className="not-prose mb-8 flex flex-wrap gap-2">
                {blog.keywords.map((keyword) => (
                  <span key={keyword} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">{keyword}</span>
                ))}
              </div>
            )}

            {blog.content_images && blog.content_images.length > 0 && (
              <div className="not-prose mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.content_images.map((image, idx) => (
                  <div key={idx} className="relative h-64 rounded-2xl overflow-hidden shadow-sm">
                    <Image src={image} alt={`${blog.title} image ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* If content is raw HTML, render it safely */}
            <div dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
            
            {/* FAQ Section */}
            {blog.faq && blog.faq.length > 0 && (
              <div className="mt-12 bg-gray-50 p-8 rounded-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {blog.faq.map((item: any, idx: number) => (
                    <div key={idx}>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{item.question}</h4>
                      <p className="text-gray-600 m-0">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar - CTA / Promo */}
          <aside className="w-full lg:w-72 shrink-0 sticky top-24">
            <div className="bg-[#1E3A5F] text-white p-8 rounded-xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4 leading-tight">Is your brand winning AI search?</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                You can now track your AI Visibility with the all-in-one SEO tool marketers trust.
              </p>
              <button className="w-full bg-[#F5D898] hover:bg-[#eac478] text-[#1E3A5F] font-bold py-3 px-4 rounded-lg transition-colors">
                Start your free trial
              </button>
            </div>
          </aside>
          
        </div>
      </div>
    </article>
  );
}
