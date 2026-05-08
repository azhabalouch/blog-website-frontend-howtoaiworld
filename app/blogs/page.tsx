import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import BlogsContent from "./BlogsContent";
import { getBlogs, getCategories, getAuthors } from "../../lib/site-data";

export const metadata: Metadata = {
  title: "All Blogs - Howtoaiworld | AI Guides & Tutorials",
  description: "Browse our complete collection of AI guides, tutorials, and reviews. Find practical insights on artificial intelligence tools, machine learning, and more.",
  keywords: ["AI blogs", "artificial intelligence articles", "AI tutorials", "machine learning guides", "AI tools reviews"],
  openGraph: {
    title: "All Blogs - Howtoaiworld",
    description: "Browse our complete collection of AI guides, tutorials, and reviews.",
    url: "https://howtoaiworld.com/blogs",
    type: "website",
  },
  alternates: {
    canonical: "https://howtoaiworld.com/blogs",
  },
};

// CollectionPage structured data
const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "All Blogs - Howtoaiworld",
  "description": "Browse our complete collection of AI guides, tutorials, and reviews",
  "url": "https://howtoaiworld.com/blogs",
  "breadcrumb": {
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
      }
    ]
  }
};

export default function BlogsPage() {
  const rawBlogsList = getBlogs().map(blog => {
    // Strip large fields like content, content_images, captions
    const { content, faq, content_images, captions, ...rest } = blog;
    return rest;
  });

  const categoriesList = getCategories();
  const authorsList = getAuthors().map(author => ({
    name: author.name,
    slug: author.slug,
    postCount: author.postCount
  }));

  return (
    <>
      <Script
        id="collectionpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <Suspense fallback={<div className="p-12 text-center">Loading blogs...</div>}>
        <BlogsContent 
          initialBlogs={rawBlogsList} 
          categories={categoriesList} 
          authors={authorsList} 
        />
      </Suspense>
    </>
  );
}
