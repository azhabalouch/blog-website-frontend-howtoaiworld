"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, X } from "lucide-react";
import SenderFormEmbed from "./SenderFormEmbed";

export default function NewsletterCTAClient() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);

    // Focus trap
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const handleTabTrap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      modal.addEventListener("keydown", handleTabTrap);
      // Focus close button on open
      closeButtonRef.current?.focus();
      return () => {
        document.removeEventListener("keydown", handleEscape);
        modal.removeEventListener("keydown", handleTabTrap);
      };
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl cursor-pointer group" onClick={() => setIsOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsOpen(true); } }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent opacity-95 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative px-5 sm:px-8 py-10 sm:py-12 md:px-16 md:py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors">
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>Join 10,000+ subscribers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-heading">Master AI Before Everyone Else</h2>
            <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto">
              Get weekly insights on the latest AI tools, tutorials, and industry trends delivered straight to your inbox.
            </p>
            <div>
               <button ref={triggerRef} className="bg-white text-primary font-bold py-3.5 px-8 rounded-xl hover:bg-white/90 transition-all shadow-xl hover:-translate-y-1 transform min-h-[44px]">
                 Subscribe For Free
               </button>
            </div>
            <p className="text-white/60 text-xs">No spam. Unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </section>

      {/* The background overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => { setIsOpen(false); triggerRef.current?.focus(); }}
        aria-hidden={!isOpen}
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Newsletter subscription"
          className={`relative w-full max-w-md premium-card p-6 sm:p-8 shadow-2xl transition-all duration-200 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
          onClick={e => e.stopPropagation()}
        >
          <button ref={closeButtonRef} onClick={() => { setIsOpen(false); triggerRef.current?.focus(); }} className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors bg-surface rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close newsletter dialog">
            <X className="w-5 h-5" />
          </button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-foreground font-heading">Join Our Newsletter</h2>
            <p className="text-muted mt-2">Get the latest AI insights delivered to your inbox weekly.</p>
          </div>

          <SenderFormEmbed />

          <p className="text-xs text-center text-muted mt-6">We&apos;ll never share your email with anyone else.</p>
        </div>
      </div>
    </>
  );
}