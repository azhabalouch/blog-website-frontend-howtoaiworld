import Image from "next/image";
import Link from "next/link";
import { Share2, Link as LinkIcon, User, BookOpen, Clock, Calendar } from "lucide-react";
import { getBlogBySlug, getBlogs, getAuthorBySlug, generateSlug } from "../../../lib/site-data";

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

// Extract headings from HTML content for dynamic TOC
function extractHeadings(htmlContent: string): { id: string; text: string; level: number }[] {
  if (!htmlContent) return [];
  const headings: { id: string; text: string; level: number }[] = [];
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    // Strip HTML tags from text
    const text = match[2].replace(/<[^>]*>/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text, level });
  }
  return headings;
}

export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const blog = getBlogBySlug(resolvedParams.slug);

  if (!blog) {
    return <div className="max-w-4xl mx-auto py-20 text-center text-2xl font-bold text-foreground">Blog not found</div>;
  }

  const author = getAuthorBySlug(generateSlug(blog.author));
  const headings = extractHeadings(blog.content || "");

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative overflow-hidden pt-16 pb-12 md:pb-16 text-white" style={{ backgroundColor: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,white,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4">
          {/* Category & Tags */}
          <div className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">{blog.category?.split('/')[0]?.trim()}</span>
            {blog.keywords?.slice(0, 3).map((keyword) => (
              <span key={keyword} className="px-2.5 py-1 rounded-full bg-white/10 text-white/90">{keyword}</span>
            ))}
          </div>
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-6 max-w-4xl">
            {blog.title}
          </h1>
          
          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
            <Link href={`/authors/${generateSlug(blog.author)}`} className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 border border-white/30">
                {author?.featuredImage ? (
                  <Image src={author.featuredImage} alt={blog.author} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className="font-bold text-white block">{blog.author}</span>
                <span className="text-white/70 text-xs">Author</span>
              </div>
            </Link>
            <div className="flex items-center gap-1.5 text-white/70">
              <Calendar className="w-4 h-4" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70">
              <Clock className="w-4 h-4" />
              <span>6 min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 relative items-start">
          
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <div className="premium-card p-5">
              <h3 className="font-bold text-base mb-4 text-foreground border-b border-card-border pb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Contents
              </h3>
              {headings.length > 0 ? (
                <nav className="space-y-2 text-sm">
                  {headings.map((heading, idx) => (
                    <a 
                      key={idx} 
                      href={`#${heading.id}`}
                      className={`block hover:text-primary transition-colors ${
                        heading.level === 1 ? 'font-semibold text-foreground' : 
                        heading.level === 2 ? 'font-medium text-muted pl-3' : 
                        'text-muted/80 pl-5'
                      }`}
                      style={{ paddingLeft: heading.level > 1 ? `${(heading.level - 1) * 12}px` : '0' }}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <p className="text-sm text-muted">No sections available</p>
              )}
            </div>
            
            <div className="mt-6">
              <h4 className="font-bold text-sm text-foreground mb-3">Share Article</h4>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-muted hover:text-primary hover:border-primary hover:bg-surface transition-all">
                   <Share2 className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-muted hover:text-primary hover:border-primary hover:bg-surface transition-all">
                   <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Keywords */}
            {blog.keywords && blog.keywords.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {blog.keywords.map((keyword) => (
                  <span key={keyword} className="px-3 py-1.5 rounded-full bg-surface text-primary text-xs font-semibold border border-primary/20">{keyword}</span>
                ))}
              </div>
            )}

            {/* Featured Image if no content images */}
            {(!blog.content_images || blog.content_images.length === 0) && blog.featured_image && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-elevated">
                <Image 
                  src={blog.featured_image} 
                  alt={blog.title}
                  width={800}
                  height={450}
                  className="object-cover w-full h-auto"
                />
              </div>
            )}

            {/* Content Images */}
            {blog.content_images && blog.content_images.length > 0 && (
              <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.content_images.map((image, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-premium">
                    <Image src={image} alt={`${blog.title} image ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                ))}
              </div>
            )}

            {/* Article Content - with ID anchors for TOC */}
            <div className="article-content text-foreground leading-relaxed">
              {blog.content ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: blog.content.replace(
                      /<h([1-6])([^>]*)>(.*?)<\/h\1>/gi, 
                      (match, level, attrs, text) => {
                        const id = text.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
                      }
                    ) 
                  }}
                  className="prose-content"
                />
              ) : (
                <p className="text-muted italic">No content available for this article.</p>
              )}
            </div>
            
            {/* FAQ Section */}
            {blog.faq && blog.faq.length > 0 && (
              <div className="mt-14 premium-card p-6 md:p-8">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">Q&A</span>
                  </span>
                  Frequently Asked Questions
                </h3>
                <div className="space-y-5">
                  {blog.faq.map((item: any, idx: number) => (
                    <div key={idx} className="border-b border-card-border last:border-0 pb-5 last:pb-0">
                      <h4 className="font-bold text-base text-foreground mb-2">{item.question}</h4>
                      <p className="text-muted text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar - Author Profile */}
          <aside className="w-full lg:w-72 shrink-0 sticky top-24 space-y-5">
            {author && (
              <div className="premium-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold overflow-hidden shadow-premium">
                    {author.featuredImage ? (
                      <Image src={author.featuredImage} alt={author.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      author.initials
                    )}
                  </div>
                  <div>
                    <Link href={`/authors/${author.slug}`} className="font-bold text-foreground hover:text-primary transition">
                      {author.name}
                    </Link>
                    <p className="text-xs text-muted">{author.postCount} articles</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">{author.bio}</p>
                <Link 
                  href={`/authors/${author.slug}`}
                  className="w-full block text-center py-2.5 rounded-lg bg-surface hover:bg-primary-light text-foreground hover:text-primary-dark font-medium text-sm transition-colors border border-card-border"
                >
                  View Profile
                </Link>
              </div>
            )}
            
            {/* Related from Author */}
            {author && author.blogs.length > 1 && (
              <div className="premium-card p-5">
                <h4 className="font-bold text-sm text-foreground mb-4">More from {author.name.split(' ')[0]}</h4>
                <div className="space-y-3">
                  {author.blogs
                    .filter(b => b.title !== blog.title)
                    .slice(0, 3)
                    .map((relatedBlog, idx) => (
                      <Link 
                        key={idx} 
                        href={`/blogs/${generateSlug(relatedBlog.title)}`}
                        className="block group"
                      >
                        <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {relatedBlog.title}
                        </h5>
                        <span className="text-xs text-muted">{relatedBlog.date}</span>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </aside>
          
        </div>
      </div>
    </article>
  );
}
