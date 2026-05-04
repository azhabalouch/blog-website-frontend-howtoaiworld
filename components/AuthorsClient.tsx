"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { AuthorProfile } from "../lib/site-data";

export default function AuthorsClient({ initialAuthors }: { initialAuthors: AuthorProfile[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filteredAndSortedAuthors = useMemo(() => {
    let sorted = [...initialAuthors];

    // Filter by search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      sorted = sorted.filter(
        (author) =>
          author.name.toLowerCase().includes(lowerSearch) ||
          author.bio.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    sorted.sort((a, b) => {
      if (sortBy === "rating") {
        const ratingA = parseFloat(a.rated_by_us || "0");
        const ratingB = parseFloat(b.rated_by_us || "0");
        return ratingB - ratingA;
      }
      if (sortBy === "published") {
        return b.postCount - a.postCount;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0; // fallback
    });

    return sorted;
  }, [initialAuthors, searchTerm, sortBy]);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 premium-surface p-4 mt-12 mb-8">
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border-[var(--border-premium)] rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
            style={{ border: "var(--border-premium)" }}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm font-semibold text-muted whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto bg-background rounded-lg py-2 pl-3 pr-8 text-sm focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer relative"
            style={{ border: "var(--border-premium)" }}
          >
            <option value="rating">Top Rated</option>
            <option value="published">Most Published</option>
            <option value="name-asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {filteredAndSortedAuthors.length === 0 ? (
        <div className="text-center py-20 premium-card">
          <p className="text-lg text-muted">No authors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {filteredAndSortedAuthors.map((author) => (
            <Link key={author.slug} href={`/authors/${author.slug}`} className="premium-card p-8 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 text-primary rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden shadow-premium group-hover:shadow-elevated transition-shadow duration-300" style={{ backgroundColor: 'var(--surface)' }}>
                  {author.featuredImage ? (
                    <Image src={author.featuredImage} alt={author.name} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    author.initials
                  )}
                </div>
                {author.rated_by_us && (
                  <div className="flex items-center gap-1.5 bg-primary-light text-primary-dark px-3 py-1.5 rounded-full text-xs font-bold premium-glow border border-primary/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    {author.rated_by_us}
                  </div>
                )}
              </div>
              
              <div className="flex-1 z-10">
                <h3 className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors mb-2 font-heading">{author.name}</h3>
                <div className="text-muted text-[13px] uppercase tracking-wider font-semibold mb-5 flex items-center gap-3">
                  {author.location && <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {author.location}
                  </span>}
                  {author.location && <span className="w-1 h-1 rounded-full bg-primary/40"></span>}
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    {author.postCount} {author.postCount === 1 ? 'Publication' : 'Publications'}
                  </span>
                </div>
                <p className="text-muted text-[15px] leading-relaxed mb-8 line-clamp-3 group-hover:text-foreground/80 transition-colors">{author.bio}</p>
              </div>

              <div className="pt-6 border-t flex flex-wrap gap-2 items-center mt-auto z-10" style={{ borderTopColor: "var(--card-border)" }}>
                {author.categories.slice(0, 3).map((cat) => (
                  <span key={cat} className="text-[11px] font-bold uppercase tracking-wider rounded-full bg-surface text-foreground px-3 py-1.5 group-hover:bg-primary group-hover:text-white transition-colors border" style={{ borderColor: 'var(--card-border)' }}>{cat}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}