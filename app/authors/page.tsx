import { getAuthors } from "../../lib/site-data";
import type { Metadata } from "next";
import Script from "next/script";
import AuthorsClient from "../../components/AuthorsClient";

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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">Our Authors</h1>
        <p className="text-base sm:text-xl text-muted leading-relaxed">Meet the talented writers, researchers, and AI experts behind our insights and comprehensive guides. Our team is dedicated to making artificial intelligence accessible and actionable.</p>
      </div>

      <AuthorsClient initialAuthors={authors} />
    </div>
    </>
  );
}