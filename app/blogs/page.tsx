"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { getBlogs, generateSlug } from "../../lib/site-data";

function BlogsContent() {
  const searchParams = useSearchParams();
  const rawBlogs = getBlogs();
  
  const query = (searchParams.get('q') || '').toLowerCase();
  const category = (searchParams.get('category') || '').toLowerCase();

  const filteredBlogs = rawBlogs.filter(blog => {
    let matches = true;
    if (query) {
      matches = blog.title.toLowerCase().includes(query) || blog.author.toLowerCase().includes(query);
    }
    if (matches && category) {
      matches = (blog.category || '').toLowerCase().includes(category);
    }
    return matches;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [query, category]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">
          {query ? `Search Results for "${query}"` : category ? `Category: ${searchParams.get('category')}` : "All Blogs"}
        </h1>
        <p className="text-gray-500 font-medium">Found {filteredBlogs.length} articles</p>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm text-gray-500">
          No blogs found matching your criteria. Try a different search!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentBlogs.map((blog, idx) => (
              <Link key={idx} href={`/blogs/${generateSlug(blog.title)}`}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                     <Image src={blog.featured_image || "https://placehold.co/400x250"} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase mb-2">{blog.category || "Category"}</span>
                    <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{blog.title}</h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.excerpt}</p>
                    {blog.keywords && blog.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.keywords.slice(0, 3).map((keyword) => (
                          <span key={keyword} className="text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 px-2 py-1">{keyword}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
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
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-600 font-medium text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading blogs...</div>}>
      <BlogsContent />
    </Suspense>
  );
}
