import Link from "next/link";
import Image from "next/image";
import { getAuthors } from "../../lib/site-data";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Our Authors - Howtoaiworld | Meet Our AI Experts",
  description: "Meet the talented writers and AI experts behind Howtoaiworld. Discover our team of contributors dedicated to making artificial intelligence accessible.",
  keywords: ["howtoaiworld authors", "AI writers", "AI experts", "blog authors", "AI content creators"],
  openGraph: {
    title: "Our Authors - Howtoaiworld",
    description: "Meet the talented team of AI experts and writers behind Howtoaiworld.",
    url: "https://howtoaiworld.com/authors",
    type: "website",
  },
  alternates: {
    canonical: "https://howtoaiworld.com/authors",
  },
};

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <>
      <Script
        id="collection-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Our Authors - Howtoaiworld",
            "description": "Meet the talented writers and AI experts behind Howtoaiworld",
            "url": "https://howtoaiworld.com/authors",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": getAuthors().map((author, index) => ({
                "@type": "Person",
                "position": index + 1,
                "name": author.name,
                "description": author.bio,
                "url": `https://howtoaiworld.com/authors/${author.slug}`,
                "jobTitle": "AI Content Writer"
              }))
            }
          })
        }}
      />
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Our Authors</h1>
        <p className="text-muted mt-2">Meet the talented writers behind our AI insights and guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {authors.map((author) => (
          <Link key={author.slug} href={`/authors/${author.slug}`} className="premium-card p-6 text-center hover:shadow-elevated transition-all">
            <div className="w-24 h-24 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold overflow-hidden shadow-premium">
              {author.featuredImage ? (
                <Image src={author.featuredImage} alt={author.name} width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                author.initials
              )}
            </div>
            <h3 className="font-bold text-lg mb-1 text-foreground">{author.name}</h3>
            <p className="text-primary text-sm font-medium mb-3">{author.postCount} article{author.postCount === 1 ? "" : "s"}</p>
            <p className="text-muted text-sm">{author.bio}</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {author.categories.slice(0, 3).map((cat) => (
                <span key={cat} className="text-[11px] font-semibold rounded-full bg-primary-light text-primary-dark px-2 py-1">{cat}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
    </>
  );
}