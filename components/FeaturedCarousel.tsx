"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateSlug } from "../lib/site-data";
import { useState, useEffect, useCallback } from "react";

type BlogRecord = {
  title: string;
  author: string;
  category?: string;
  date?: string;
  excerpt?: string;
  featured_image?: string;
};

export default function FeaturedCarousel({ blogs }: { blogs: BlogRecord[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = blogs.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next, total]);

  if (total === 0) return null;

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-elevated aspect-video lg:aspect-[2/1] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Persistent DOM Nodes for Preloading */}
      {blogs.map((blog, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <Link href={`/blogs/${generateSlug(blog.title)}`} className="block relative w-full h-full">
            <Image
              src={blog.featured_image || "https://placehold.co/800x400"}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest mb-2 opacity-80">{blog.category || "Featured"}</span>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">{blog.title}</h3>
              <p className="text-white/80 line-clamp-2 text-sm md:text-base max-w-2xl">{blog.excerpt}</p>
              <div className="flex items-center gap-3 mt-4 text-sm text-white/60">
                <span className="font-medium text-white/90">{blog.author}</span>
                <span>·</span>
                <span>{blog.date}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/25 transition-all border border-white/20 z-20"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/25 transition-all border border-white/20 z-20"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {blogs.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); setCurrent(idx); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}