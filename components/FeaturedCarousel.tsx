"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateSlug } from "../lib/site-data";
import { useState, useEffect, useCallback, useRef } from "react";

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
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1 || prefersReducedMotion.current) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next, total]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  }, [next, prev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (total === 0) return null;

  return (
    <div
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Stories"
      aria-live="polite"
      className="relative rounded-2xl overflow-hidden shadow-elevated aspect-[4/3] sm:aspect-video lg:aspect-[2/1] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Persistent DOM Nodes for Preloading */}
      {blogs.map((blog, idx) => (
        <div
          key={idx}
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${idx + 1} of ${total}: ${blog.title}`}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          } ${prefersReducedMotion.current ? "!transition-none" : ""}`}
        >
          <Link href={`/blogs/${generateSlug(blog.title)}`} className="block relative w-full h-full" tabIndex={idx === current ? 0 : -1}>
            <Image
              src={blog.featured_image || "https://placehold.co/800x400"}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-10 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest mb-1.5 sm:mb-2 opacity-80">{blog.category || "Featured"}</span>
              <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight">{blog.title}</h3>
              <p className="text-white/80 line-clamp-2 text-xs sm:text-sm md:text-base max-w-2xl">{blog.excerpt}</p>
              <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-xs sm:text-sm text-white/60">
                <span className="font-medium text-white/90">{blog.author}</span>
                <span aria-hidden="true">·</span>
                <span>{blog.date}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Navigation Arrows - larger touch targets for mobile */}
      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-full hover:bg-white/25 active:bg-white/30 transition-all border border-white/20 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 rounded-full hover:bg-white/25 active:bg-white/30 transition-all border border-white/20 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* Dot Indicators - larger touch targets for mobile */}
      {total > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20" role="tablist" aria-label="Slide navigation">
          {blogs.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              onClick={(e) => { e.preventDefault(); setCurrent(idx); }}
              className={`rounded-full transition-all duration-300 min-w-[44px] min-h-[28px] flex items-center justify-center ${
                idx === current
                  ? "h-3 sm:h-2 w-8 sm:w-8 bg-white"
                  : "h-3 sm:h-2 w-3 sm:w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-selected={idx === current}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}