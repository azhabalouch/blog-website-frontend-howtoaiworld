"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Code } from "lucide-react";

// Custom Social Icons as SVG components
const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
  </svg>
);

interface ShareSectionProps {
  title: string;
  excerpt?: string;
  url: string;
}

export default function ShareSection({ title, excerpt, url }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const shareToX = () => {
    const text = encodeURIComponent(`${title} ${url}`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const shareToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const toggleEmbed = () => {
    setShowEmbed(!showEmbed);
  };

  const copyEmbedCode = async () => {
    const embedCode = `<iframe src="${url}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="font-bold text-sm text-foreground mb-3">Share Article</h4>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={shareToLinkedIn}
          className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-muted hover:text-[#0A66C2] hover:border-[#0A66C2] hover:bg-surface transition-all"
          title="Share on LinkedIn"
        >
          <LinkedInIcon />
        </button>
        <button
          onClick={shareToX}
          className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-muted hover:text-black hover:border-black hover:bg-surface transition-all dark:hover:text-white dark:hover:border-white"
          title="Share on X"
        >
          <XIcon />
        </button>
        <button
          onClick={shareToFacebook}
          className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-muted hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-surface transition-all"
          title="Share on Facebook"
        >
          <FacebookIcon />
        </button>
        <button
          onClick={handleCopy}
          className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-muted hover:text-primary hover:border-primary hover:bg-surface transition-all"
          title={copied ? "Link copied!" : "Copy link"}
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
        </button>
        <button
          onClick={toggleEmbed}
          className="w-9 h-9 rounded-lg border border-card-border flex items-center justify-center text-muted hover:text-primary hover:border-primary hover:bg-surface transition-all"
          title="Embed article"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>
      {copied && (
        <p className="text-xs text-green-600 mt-2">Link copied to clipboard!</p>
      )}
      {showEmbed && (
        <div className="mt-3 p-3 rounded-lg bg-surface border border-card-border">
          <p className="text-xs text-muted mb-2">Copy this code to embed the article:</p>
          <code className="text-xs break-all text-foreground block mb-2">
            {`<iframe src="${url}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`}
          </code>
          <button
            onClick={copyEmbedCode}
            className="text-xs px-3 py-1.5 rounded bg-primary text-white hover:bg-primary-dark transition"
          >
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      )}
    </div>
  );
}
