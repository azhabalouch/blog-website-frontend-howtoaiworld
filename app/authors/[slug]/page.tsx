import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getAuthorBySlug, getAuthors, generateSlug } from "../../../lib/site-data";

export function generateStaticParams() {
  return getAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return { title: "Author Not Found - Howtoaiworld" };
  }

  return {
    title: `${author.name} - Howtoaiworld Author`,
    description: author.bio,
    alternates: {
      canonical: `https://howtoaiworld.com/authors/${author.slug}`,
    },
    openGraph: {
      title: `${author.name} - Howtoaiworld Author`,
      description: author.bio,
      url: `https://howtoaiworld.com/authors/${author.slug}`,
      type: "profile",
      images: author.featuredImage ? [author.featuredImage] : undefined,
    },
  };
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // Person structured data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "url": `https://howtoaiworld.com/authors/${author.slug}`,
    "description": author.bio,
    "image": author.featuredImage,
    "jobTitle": "AI Content Writer",
    "worksFor": {
      "@type": "Organization",
      "name": "Howtoaiworld"
    }
  };

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
        "name": "Authors",
        "item": "https://howtoaiworld.com/authors"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": author.name,
        "item": `https://howtoaiworld.com/authors/${author.slug}`
      }
    ]
  };

  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      <section className="premium-card p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[200px] -z-10"></div>
        <div className="flex flex-col md:flex-row gap-10 items-start z-10">
          <div className="w-40 h-40 shrink-0 rounded-full overflow-hidden text-primary flex items-center justify-center text-4xl font-bold shadow-premium border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-premium)' }}>
            {author.featuredImage ? (
              <Image src={author.featuredImage} alt={author.name} width={160} height={160} className="object-cover w-full h-full" />
            ) : (
              author.initials
            )}
          </div>
          
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight font-heading">{author.name}</h1>
                  {author.rated_by_us && (
                    <div className="flex items-center gap-1.5 bg-primary-light text-primary-dark px-3 py-1.5 rounded-full text-xs font-bold premium-glow border border-primary/20">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      {author.rated_by_us}
                    </div>
                  )}
                </div>
                <p className="text-xl text-muted font-medium leading-relaxed max-w-2xl">{author.bio}</p>
              </div>

              {author.email && (
                <a href={`mailto:${author.email}`} className="premium-button inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold shrink-0 text-sm w-full md:w-auto">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Connect
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-8 border-t" style={{ borderTopColor: "var(--card-border)" }}>
              {author.location && (
                <div>
                  <div className="text-xs text-muted uppercase tracking-widest font-bold mb-2">Location</div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {author.location}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-muted uppercase tracking-widest font-bold mb-2">Contributions</div>
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  {author.postCount} Published
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted uppercase tracking-widest font-bold mb-3">Expertise</div>
                <div className="flex flex-wrap gap-2">
                  {author.categories.slice(0, 4).map((category) => (
                    <span key={category} className="px-3 py-1.5 rounded-full bg-surface text-foreground text-[11px] font-bold uppercase tracking-wider border" style={{ borderColor: "var(--card-border)" }}>{category}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {author.details && (
          <div className="mt-10 pt-10 border-t relative z-10" style={{ borderTopColor: "var(--card-border)" }}>
            <h2 className="text-2xl font-bold mb-6 font-heading text-foreground">About the Author</h2>
            <div className="article-content">
              <p className="text-lg leading-relaxed text-muted">{author.details}</p>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-8">
        <div className="flex items-end justify-between border-b pb-4" style={{ borderBottomColor: "var(--card-border)" }}>
          <div>
            <h2 className="text-3xl font-bold text-foreground font-heading">Recent Publications</h2>
            <p className="text-muted mt-2">The latest insights and articles from {author.name.split(' ')[0]}.</p>
          </div>
          <span className="text-sm font-bold px-4 py-1.5 premium-surface rounded-full text-foreground hidden md:block">{author.postCount} Articles Total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {author.blogs.map((blog) => (
            <Link key={blog.title} href={`/blogs/${generateSlug(blog.title)}`} className="premium-card overflow-hidden hover:shadow-elevated transition-all flex flex-col group">
              <div className="relative aspect-video overflow-hidden border-b" style={{ borderBottomColor: 'var(--card-border)' }}>
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                <Image src={blog.featured_image || "https://placehold.co/600x400"} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col bg-card-bg">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
                  <span className="text-primary">{blog.category || "Category"}</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="font-bold text-xl leading-snug text-foreground group-hover:text-primary transition-colors font-heading">{blog.title}</h3>
                <p className="text-[15px] text-muted line-clamp-3 mt-auto leading-relaxed">{blog.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}