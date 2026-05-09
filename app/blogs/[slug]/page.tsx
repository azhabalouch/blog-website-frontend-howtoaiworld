import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { User, Clock, Calendar, ChevronRight, Home } from "lucide-react";
import { getBlogBySlug, getBlogs, getAuthorBySlug, generateSlug } from "../../../lib/site-data";
import ShareSection from "../../../components/ShareSection";
import TableOfContents from "../../../components/TableOfContents";

// Calculate reading time from HTML content
function calculateReadingTime(htmlContent: string): number {
  if (!htmlContent) return 1;
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

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

  const blogUrl = `https://howtoaiworld.com/blogs/${generateSlug(blog.title)}`;

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: blog.keywords,
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: blogUrl,
      siteName: "Howtoaiworld",
      type: "article",
      publishedTime: blog.date,
      modifiedTime: blog.date,
      authors: [blog.author],
      tags: blog.keywords,
      images: blog.featured_image
        ? [{ url: blog.featured_image, width: 1200, height: 630, alt: blog.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.featured_image ? [blog.featured_image] : undefined,
      creator: "@howtoaiworld",
    },
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
    if (id) {
      headings.push({ id, text, level });
    }
  }
  return headings;
}

// Keywords Section Component for Right Sidebar
function KeywordsSection({ keywords }: { keywords: string[] }) {
  if (!keywords || keywords.length === 0) return null;
  return (
    <div className="premium-card p-5">
      <h3 className="font-bold text-sm text-foreground mb-4">Keywords</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span key={keyword} className="px-2.5 py-1 rounded-full bg-surface text-primary text-xs font-medium border border-primary/20">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

// Article Content with Interspersed Images
function ArticleContentWithImages({ blog }: { blog: any }) {
  const content = blog.content || '';
  const contentImages = blog.content_images || [];
  // First caption is for featured image, rest are for content images
  const allCaptions = blog.captions?.split('\n') || [];
  const captions = allCaptions.slice(1); // Skip first caption (featured image)

  if (!content && contentImages.length === 0) {
    return <p className="text-muted italic">No content available for this article.</p>;
  }

  // Split content into roughly equal parts to insert images
  const contentParts: string[] = [];
  if (contentImages.length > 0 && content) {
    // Find paragraph or section breaks to split content
    const paragraphs = content.split(/(<\/p>|<\/h[1-6]>|<\/div>)/);
    const chunkSize = Math.ceil(paragraphs.length / (contentImages.length + 1));

    for (let i = 0; i < paragraphs.length; i += chunkSize) {
      const chunk = paragraphs.slice(i, i + chunkSize).join('');
      if (chunk.trim()) {
        contentParts.push(chunk);
      }
    }
  } else if (content) {
    contentParts.push(content);
  }

  // Add IDs to headings for TOC
  const addHeadingIds = (html: string) => {
    return html.replace(
      /<h([1-6])([^>]*)>(.*?)<\/h\1>/gi,
      (match, level, attrs, text) => {
        const id = text.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
      }
    );
  };

  return (
    <div className="article-content text-foreground leading-relaxed">
      {contentParts.length > 0 ? (
        contentParts.map((part, idx) => (
          <div key={idx}>
            <div
              dangerouslySetInnerHTML={{ __html: addHeadingIds(part) }}
              className="prose-content"
            />
            {idx < contentImages.length && (
              <div className="mb-6 md:mb-8">
                <div className="relative w-full aspect-[16/9] max-w-[800px] mx-auto rounded-2xl overflow-hidden shadow-elevated">
                  <Image
                    src={contentImages[idx]}
                    alt={captions[idx] || `${blog.title} image ${idx + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                {captions[idx] && (
                  <figcaption className="content-image-caption mt-2 md:mt-3 px-2 md:px-0">
                    {captions[idx]}
                  </figcaption>
                )}
              </div>
            )}
          </div>
        ))
      ) : content ? (
        <div
          dangerouslySetInnerHTML={{ __html: addHeadingIds(content) }}
          className="prose-content"
        />
      ) : null}

      {/* Show remaining images if more images than content parts */}
      {contentImages.length > contentParts.length && (
        contentImages.slice(contentParts.length).map((image: string, idx: number) => {
          const actualIdx = contentParts.length + idx;
          return (
            <div key={`extra-${actualIdx}`} className="content-image-wrapper my-6 md:my-8">
              <figure className="w-full">
                <div className="relative w-full aspect-[16/9] max-w-[800px] mx-auto">
                  <Image
                    src={image}
                    alt={captions[actualIdx] || `${blog.title} image ${actualIdx + 1}`}
                    fill
                    className="object-cover rounded-xl"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                {captions[actualIdx] && (
                  <figcaption className="content-image-caption mt-2 md:mt-3 px-2 md:px-0">
                    {captions[actualIdx]}
                  </figcaption>
                )}
              </figure>
            </div>
          );
        })
      )}
    </div>
  );
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
  const readingTime = calculateReadingTime(blog.content || "");

  // Strip HTML for word count and articleBody
  const plainTextContent = (blog.content || '').replace(/<[^>]*>/g, '');
  const wordCount = plainTextContent.trim().split(/\s+/).filter(Boolean).length;

  // BlogPosting structured data
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "url": `https://howtoaiworld.com/blogs/${generateSlug(blog.title)}`,
    "datePublished": blog.date,
    "dateModified": blog.date,
    "wordCount": wordCount,
    "articleBody": plainTextContent.slice(0, 5000),
    "section": blog.category?.split('/')[0]?.trim() || undefined,
    "author": {
      "@type": "Person",
      "name": blog.author,
      "url": `https://howtoaiworld.com/authors/${generateSlug(blog.author)}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Howtoaiworld",
      "logo": {
        "@type": "ImageObject",
        "url": "https://howtoaiworld.com/logo.jpg"
      }
    },
    "image": blog.featured_image ? {
      "@type": "ImageObject",
      "url": `https://howtoaiworld.com${blog.featured_image}`,
      "width": 1200,
      "height": 630
    } : undefined,
    "keywords": blog.keywords?.join(", "),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://howtoaiworld.com/blogs/${generateSlug(blog.title)}`
    }
  };

  // FAQ structured data if FAQ exists
  const faqSchema = blog.faq && blog.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://howtoaiworld.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs",
        "item": "https://howtoaiworld.com/blogs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://howtoaiworld.com/blogs/${generateSlug(blog.title)}`
      }
    ]
  };

  return (
    <>
      <Script
        id="blogposting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    <article className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 pt-20 pb-2">
        <ol className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5 text-muted/50" /></li>
          <li>
            <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link>
          </li>
          <li><ChevronRight className="w-3.5 h-3.5 text-muted/50" /></li>
          <li>
            <span className="text-foreground font-medium line-clamp-1">{blog.title}</span>
          </li>
        </ol>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden pt-10 pb-8 sm:pt-16 sm:pb-12 md:pb-16 text-white" style={{ backgroundColor: "var(--primary)" }}>
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
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-4 sm:mb-6 max-w-4xl">
            {blog.title}
          </h1>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-sm">
            <Link href={`/authors/${generateSlug(blog.author)}`} className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 border border-white/30">
                {author?.featuredImage ? (
                  <Image src={author.featuredImage} alt={blog.author} width={40} height={40} className="object-cover w-full h-full" loading="lazy" />
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
              <span>{readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 relative items-start">
          
          {/* Left Sidebar - Table of Contents (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            {/* Last Update Date */}
            <div className="flex items-center gap-2 mb-5 text-sm text-muted">
              <Calendar className="w-4 h-4" />
              <span>Updated: {blog.date}</span>
            </div>

            <TableOfContents headings={headings} />

            <ShareSection
              title={blog.title}
              excerpt={blog.excerpt}
              url={`https://howtoaiworld.com/blogs/${generateSlug(blog.title)}`}
            />
          </aside>

          {/* Mobile TOC + Share (shown before content on mobile) */}
          <div className="lg:hidden space-y-4 mb-4">
            {/* Last Update Date */}
            <div className="flex items-center gap-2 text-sm text-muted">
              <Calendar className="w-4 h-4" />
              <span>Updated: {blog.date}</span>
            </div>
            <TableOfContents headings={headings} />
            <ShareSection
              title={blog.title}
              excerpt={blog.excerpt}
              url={`https://howtoaiworld.com/blogs/${generateSlug(blog.title)}`}
            />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 overflow-x-hidden">
            {/* Featured Image */}
            {blog.featured_image && (
              <div className="mb-6 md:mb-8">
                <div className="relative w-full aspect-[16/9] max-w-[800px] mx-auto rounded-2xl overflow-hidden shadow-elevated">
                  <Image
                    src={blog.featured_image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                {/* Featured Image Caption - first caption from API */}
                {blog.captions?.split('\n')[0] && (
                  <p className="text-center text-sm text-muted mt-3 italic">
                    {blog.captions.split('\n')[0]}
                  </p>
                )}
              </div>
            )}

            {/* Article Content with Interspersed Images */}
            <ArticleContentWithImages blog={blog} />
            
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

          {/* Right Sidebar - Keywords & Author Profile */}
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 space-y-5">
            {/* Keywords */}
            {blog.keywords && blog.keywords.length > 0 && (
              <KeywordsSection keywords={blog.keywords} />
            )}

            {author && (
              <div className="premium-card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold overflow-hidden shadow-premium">
                    {author.featuredImage ? (
                      <Image src={author.featuredImage} alt={author.name} width={56} height={56} className="object-cover w-full h-full" loading="lazy" />
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
                <h3 className="font-bold text-sm text-foreground mb-4">More from {author.name.split(' ')[0]}</h3>
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
                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {relatedBlog.title}
                        </h4>
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
    </>
  );
}
