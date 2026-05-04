"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { getBlogs, getCategories, getAuthors, generateSlug } from "../../lib/site-data";

export default function BlogsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawBlogs = getBlogs();
  const categories = getCategories();
  const authors = getAuthors();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedAuthor, setSelectedAuthor] = useState(searchParams.get('author') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Update URL when filters change (reset page to 1)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedAuthor) params.set('author', selectedAuthor);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedCategory, selectedAuthor, sortBy, router]);

  // Sync state with URL params on mount
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedAuthor(searchParams.get('author') || '');
    setSortBy(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  const filteredBlogs = useMemo(() => {
    let blogs = [...rawBlogs];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      blogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(query) || 
        blog.author.toLowerCase().includes(query) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(query)) ||
        (blog.keywords && blog.keywords.some(k => k.toLowerCase().includes(query)))
      );
    }
    
    if (selectedCategory) {
      blogs = blogs.filter(blog => 
        (blog.category || '').toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    if (selectedAuthor) {
      blogs = blogs.filter(blog => 
        blog.author.toLowerCase() === selectedAuthor.toLowerCase()
      );
    }
    
    // Sort blogs
    blogs.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case 'oldest':
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    
    return blogs;
  }, [rawBlogs, searchQuery, selectedCategory, selectedAuthor, sortBy]);

  const hasActiveFilters = searchQuery || selectedCategory || selectedAuthor || sortBy !== 'newest';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAuthor('');
    setSortBy('newest');
  };

  const blogsPerPage = 9;

  // Pagination from URL for SEO/crawlability
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Helper to build query string with current filters and page
  const buildQueryString = (pageNum: number, overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedAuthor) params.set('author', selectedAuthor);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (pageNum > 1) params.set('page', pageNum.toString());
    // Apply overrides
    Object.entries(overrides).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    return params.toString() ? `?${params.toString()}` : '';
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-foreground">
          {searchQuery ? `Search Results for "${searchQuery}"` : 
           selectedCategory ? `Category: ${selectedCategory}` : 
           selectedAuthor ? `Author: ${selectedAuthor}` : "All Blogs"}
        </h1>
        <p className="text-muted font-medium">Found {filteredBlogs.length} articles</p>
      </div>

      {/* Filter Bar */}
      <div className="premium-surface p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237A7572'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.name}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Author Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237A7572'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author.slug} value={author.name}>
                  {author.name} ({author.postCount})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237A7572'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 border border-card-border rounded-lg text-muted hover:text-foreground hover:border-primary transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-card-border">
            <span className="text-sm text-muted">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary-dark text-sm rounded-full">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="hover:text-primary">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary-dark text-sm rounded-full">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:text-primary">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {selectedAuthor && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary-dark text-sm rounded-full">
                {selectedAuthor}
                <button onClick={() => setSelectedAuthor('')} className="hover:text-primary">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary-dark text-sm rounded-full">
                {sortBy === 'oldest' ? 'Oldest First' : sortBy === 'title-asc' ? 'A-Z' : 'Z-A'}
                <button onClick={() => setSortBy('newest')} className="hover:text-primary">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="premium-card p-12 text-center text-muted">
          No blogs found matching your criteria. Try a different search!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentBlogs.map((blog, idx) => (
              <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`}>
                <div className="premium-card overflow-hidden flex flex-col h-full group">
                  <div className="relative aspect-video overflow-hidden">
                     <Image src={blog.featured_image || "https://placehold.co/400x250"} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-primary uppercase mb-2">{blog.category || "Category"}</span>
                    <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-foreground">{blog.title}</h2>
                    <p className="text-muted text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
                    {blog.keywords && blog.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.keywords.slice(0, 3).map((keyword) => (
                          <span key={keyword} className="text-[11px] font-semibold rounded-full bg-primary-light text-primary-dark px-2 py-1">{keyword}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between text-sm text-muted">
                      <span className="font-medium">{blog.author}</span>
                      <span>{blog.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Link 
                href={`/blogs${buildQueryString(currentPage - 1)}`}
                aria-label="Previous page"
                className={`premium-button px-4 py-2 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                Previous
              </Link>
              <span className="text-muted font-medium text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Link 
                href={`/blogs${buildQueryString(currentPage + 1)}`}
                aria-label="Next page"
                className={`premium-button px-4 py-2 ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                Next
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
