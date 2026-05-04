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
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <section className="premium-card p-8 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-primary text-white flex items-center justify-center text-4xl font-bold mx-auto md:mx-0 shadow-elevated">
          {author.featuredImage ? (
            <Image src={author.featuredImage} alt={author.name} width={160} height={160} className="object-cover w-full h-full" />
          ) : (
            author.initials
          )}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Author Profile</p>
          <h1 className="text-4xl font-bold mt-1 text-foreground">{author.name}</h1>
          <p className="text-muted mt-3">{author.bio}</p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm text-muted">
            <span className="px-3 py-1 rounded-full bg-surface text-muted">{author.postCount} posts</span>
            {author.categories.slice(0, 4).map((category) => (
              <span key={category} className="px-3 py-1 rounded-full bg-primary-light text-primary-dark">{category}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {author.blogs.map((blog) => (
            <Link key={blog.title} href={`/blogs/${generateSlug(blog.title)}`} className="premium-card overflow-hidden hover:shadow-elevated transition-all flex flex-col">
              <div className="relative aspect-video">
                <Image src={blog.featured_image || "https://placehold.co/600x400"} alt={blog.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="p-5 space-y-3">
                <div className="text-xs font-semibold uppercase text-primary">{blog.category || "Category"}</div>
                <h3 className="font-bold text-lg leading-tight text-foreground">{blog.title}</h3>
                <p className="text-sm text-muted line-clamp-3">{blog.excerpt}</p>
                <div className="text-xs text-muted">{blog.date}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}