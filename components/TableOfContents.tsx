"use client";

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (headings.length === 0) {
    return (
      <div className="premium-card p-5">
        <h3 className="font-bold text-base mb-4 text-foreground border-b border-card-border pb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Contents
        </h3>
        <p className="text-sm text-muted">No sections available</p>
      </div>
    );
  }

  return (
    <div className="premium-card p-5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between font-bold text-base mb-0 text-foreground border-b border-card-border pb-3"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Contents
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          isExpanded ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr] mt-0"
        }`}
      >
        <div className="overflow-hidden">
        <nav className="space-y-2 text-sm">
          {headings.filter(h => h.id).map((heading, idx) => (
            <a
              key={idx}
              href={`#${heading.id}`}
              className={`block hover:text-primary transition-colors ${
                heading.level === 1
                  ? "font-semibold text-foreground"
                  : heading.level === 2
                  ? "font-medium text-muted pl-3"
                  : "text-muted/80 pl-5"
              }`}
              style={{
                paddingLeft: heading.level > 1 ? `${(heading.level - 1) * 12}px` : "0",
              }}
            >
              {heading.text}
            </a>
          ))}
        </nav>
        </div>
      </div>
    </div>
  );
}
