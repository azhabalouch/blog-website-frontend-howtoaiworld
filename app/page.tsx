import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, ShieldCheck, Cloud, BarChart2, Briefcase, Lock, Database, ArrowRight, Mail, Sparkles, TrendingUp, BookOpen, Zap, Target, Award } from "lucide-react";
import { getAuthors, getBlogs, getCategories, generateSlug } from "../lib/site-data";
import FeaturedCarousel from "../components/FeaturedCarousel";

export default function Home() {
  const blogs = getBlogs();

  // WebSite structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Howtoaiworld",
    "url": "https://howtoaiworld.com",
    "description": "Howtoaiworld makes Artificial Intelligence easy to understand. Practical guides, honest reviews, and step-by-step tutorials for everyone.",
    "publisher": {
      "@type": "Organization",
      "name": "Howtoaiworld",
      "logo": {
        "@type": "ImageObject",
        "url": "https://howtoaiworld.com/logo.jpg"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://howtoaiworld.com/blogs?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // ItemList structured data for featured articles
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": blogs.slice(0, 6).map((blog, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "BlogPosting",
        "headline": blog.title,
        "url": `https://howtoaiworld.com/blogs/${generateSlug(blog.title)}`,
        "datePublished": blog.date,
        "author": {
          "@type": "Person",
          "name": blog.author
        },
        "image": blog.featured_image
      }
    }))
  };
  const heroBlog = blogs[0]; // One exclusive featured article for hero
  const featuredBlogs = blogs.slice(1, 4); // Different articles for Featured Stories carousel
  const recommendedBlogs = blogs.slice(4, 8);
  const latestBlogs = blogs.slice(8, 16);

  // Get full counts for stats, then slice for display
  const allCategories = getCategories();
  const allAuthors = getAuthors();
  const categories = getCategories().slice(0, 6);
  const authors = getAuthors().slice(0, 3);

  // Extract trending topics from blog keywords dynamically
  const allKeywords = blogs.flatMap(blog => blog.keywords || []);
  const keywordCounts = new Map<string, number>();
  allKeywords.forEach(keyword => {
    keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
  });
  const trendingTopics = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([keyword]) => keyword);
  // Fallback to categories if no keywords found
  const dynamicTopics = trendingTopics.length > 0 ? trendingTopics : categories.map(c => c.name).slice(0, 12);

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="item-list-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    <main>
      {/* Hero Section - Exclusive Featured Article */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,var(--primary),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          {heroBlog && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Text Content */}
              <div className="space-y-5 text-white order-2 lg:order-1">
                <div className="flex items-center gap-2 text-white/70 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Exclusive</span>
                  <span className="text-white/40">•</span>
                  <span className="text-primary">{heroBlog.category?.split('/')[0]}</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                  {heroBlog.title}
                </h1>
                <p className="text-base text-white/80 max-w-lg leading-relaxed line-clamp-3">
                  {heroBlog.excerpt}
                </p>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="font-medium text-white/90">{heroBlog.author}</span>
                  <span>•</span>
                  <span>{heroBlog.date}</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link 
                    href={`/blogs/${generateSlug(heroBlog.title)}`} 
                    className="premium-button inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
                  >
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/blogs" className="inline-flex items-center gap-2 border border-white/25 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all text-sm">
                    All Articles
                  </Link>
                </div>
                {/* Stats */}
                <div className="flex gap-8 pt-4 text-sm border-t border-white/10 mt-4">
                  <div><span className="text-xl font-bold text-primary">{blogs.length}+</span><br/><span className="text-white/50 text-xs">Articles</span></div>
                  <div><span className="text-xl font-bold text-primary">{allCategories.length}+</span><br/><span className="text-white/50 text-xs">Categories</span></div>
                  <div><span className="text-xl font-bold text-primary">{allAuthors.length}+</span><br/><span className="text-white/50 text-xs">Authors</span></div>
                </div>
              </div>
              {/* Right: Hero Image */}
              <div className="order-1 lg:order-2">
                <Link href={`/blogs/${generateSlug(heroBlog.title)}`} className="block relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/10] group">
                  <Image
                    src={heroBlog.featured_image || "https://placehold.co/800x500"}
                    alt={heroBlog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                      Read Now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14 space-y-20">
        {/* Featured Stories Carousel + Recommended */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">Featured Stories</h2>
              <Link href="/blogs" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <FeaturedCarousel blogs={featuredBlogs} />
          </div>

          <div className="space-y-5">
            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">Recommended</h2>
            <div className="flex flex-col gap-3">
              {recommendedBlogs.map((blog, idx) => (
                <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`} className="premium-card flex gap-3 p-3 hover:-translate-y-0.5 transition-transform">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image src={blog.featured_image || "https://placehold.co/100x80"} alt={blog.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">{blog.category?.split('/')[0]}</span>
                    <h4 className="font-bold text-sm leading-snug line-clamp-2 text-foreground">{blog.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted mt-1">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{blog.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest From Our Experts */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">Latest From Our Experts</h2>
            <Link href="/blogs" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestBlogs.map((blog, idx) => (
              <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`} className="premium-card overflow-hidden flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={blog.featured_image || "https://placehold.co/300x200"} alt={blog.title} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-semibold text-primary uppercase mb-2">{blog.category || "Category"}</span>
                  <h3 className="font-bold text-lg mb-2 leading-tight line-clamp-2 text-foreground">{blog.title}</h3>
                  <p className="text-sm text-muted line-clamp-3 mb-4 flex-1">{blog.excerpt}</p>
                  {blog.keywords && blog.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.keywords.slice(0, 3).map((keyword) => (
                        <span key={keyword} className="text-[11px] font-semibold rounded-full bg-primary-light text-primary-dark px-2 py-1">{keyword}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {blog.author?.split(" ").map(w => w[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{blog.author}</div>
                      <div className="text-xs text-muted">{blog.date}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,var(--primary-light),transparent_40%)]" />
          <div className="relative premium-card p-8 md:p-12 border-none bg-transparent shadow-none">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-semibold mb-4">
                <Zap className="w-4 h-4" /> Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Howtoaiworld?</h2>
              <p className="text-muted">We make AI accessible to everyone with practical, honest, and easy-to-follow content.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground">Simple Explanations</h3>
                <p className="text-sm text-muted leading-relaxed">We break down complex AI topics into easy-to-understand guides anyone can follow.</p>
              </div>
              <div className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground">Practical & Actionable</h3>
                <p className="text-sm text-muted leading-relaxed">Every article includes real tools, tips, and steps you can use right away.</p>
              </div>
              <div className="group text-center space-y-4 p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground">Honest & Researched</h3>
                <p className="text-sm text-muted leading-relaxed">We fact-check everything. If something is hype, we tell you. If it works, we show you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Blogs + Categories */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">Latest Blogs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {blogs.slice(0, 6).map((blog, idx) => (
                <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`} className="premium-card p-5 block">
                  <span className="text-xs font-semibold text-primary uppercase">{blog.category || "Category"}</span>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground mt-1">{blog.title}</h3>
                  <p className="text-sm text-muted mb-3 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="font-medium">{blog.author}</span>
                    <span>·</span>
                    <span>{blog.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">Browse Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, idx) => {
                const icons = [CheckCircle2, ShieldCheck, Cloud, BarChart2, Briefcase, Lock, Database];
                const Icon = icons[idx % icons.length];
                return (
                  <Link key={cat.slug} href={`/blogs?category=${encodeURIComponent(cat.name)}`} className="premium-card p-3 flex items-center gap-2 cursor-pointer">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium flex-1 text-foreground">{cat.name}</span>
                    <span className="text-xs text-muted">({cat.count})</span>
                  </Link>
                );
              })}
            </div>

            {/* Newsletter */}
            <div className="premium-card p-6 mt-6">
              <h3 className="font-bold text-lg text-foreground mb-2">Stay Updated</h3>
              <p className="text-sm text-muted mb-4">Get the latest AI insights delivered to your inbox weekly.</p>
              <div style={{ textAlign: "left" }} className="sender-form-field" data-sender-form-id="eERpR0" />
            </div>
          </div>
        </section>

        {/* Top Authors */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">Top Authors</h2>
            <Link href="/authors" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">All Authors <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Link key={author.slug} href={`/authors/${author.slug}`} className="premium-card p-5 flex gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-lg">{author.initials}</div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg leading-tight text-foreground">{author.name}</h3>
                  <p className="text-sm text-muted line-clamp-2">{author.bio}</p>
                  <div className="text-xs font-semibold text-primary mt-2">{author.postCount} posts</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Topics */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">Trending Topics</h2>
            <Link href="/blogs" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">Explore All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {dynamicTopics.map((topic) => (
              <Link
                key={topic}
                href={`/blogs?q=${encodeURIComponent(topic)}`}
                className="premium-card px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:border-primary transition-all"
              >
                {topic}
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA Section */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative px-8 py-12 md:px-16 md:py-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium">
                <Mail className="w-4 h-4" />
                <span>Join 10,000+ subscribers</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Master AI Before Everyone Else</h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto">
                Get weekly insights on the latest AI tools, tutorials, and industry trends delivered straight to your inbox.
              </p>
              <p className="text-white/60 text-xs">No spam. Unsubscribe anytime. We respect your privacy.</p>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "50+", label: "AI Guides" },
            { value: "100K+", label: "Monthly Readers" },
            { value: "25+", label: "Expert Authors" },
            { value: "15+", label: "Categories" },
          ].map((stat) => (
            <div key={stat.label} className="premium-card p-6 text-center">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ready to Start Your AI Journey?</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Explore our comprehensive collection of AI tutorials, tool reviews, and expert insights.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/blogs" className="premium-button inline-flex items-center gap-2 px-6 py-3 text-base font-bold">
              Browse Articles <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-card-border text-foreground font-semibold hover:bg-surface transition-all">
              Learn More About Us
            </Link>
          </div>
        </section>
      </div>
    </main>
    </>
  )
}