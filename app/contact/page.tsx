import { Mail, MapPin, Clock, Send, Sparkles, MessageSquare, Users } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Contact Us - Howtoaiworld | Get in Touch",
  description: "Contact Howtoaiworld for AI-related questions, partnership inquiries, or content suggestions. We're here to help you navigate the world of artificial intelligence.",
  keywords: ["contact howtoaiworld", "AI support", "AI questions", "partnership inquiry", "AI blog contact"],
  openGraph: {
    title: "Contact Howtoaiworld",
    description: "Have questions about AI? Get in touch with our team of experts.",
    url: "https://howtoaiworld.com/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://howtoaiworld.com/contact",
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Howtoaiworld",
  "description": "Contact us for AI-related questions and partnerships",
  "url": "https://howtoaiworld.com/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "Howtoaiworld",
    "email": "contact@howtoaiworld.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "208-A, Basement Commercial Zone, Sector C, Chambelli Block",
      "addressLocality": "Bahria Town",
      "addressRegion": "Lahore",
      "postalCode": "53720",
      "addressCountry": "PK"
    }
  }
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pb-16" style={{ backgroundColor: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_80%,white,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
            Have questions about AI tools, partnerships, or just want to say hello? 
            We&apos;d love to hear from you!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="premium-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Send us a Message</h2>
                  <p className="text-sm text-muted">Fill out the form below and we&apos;ll get back to you</p>
                </div>
              </div>

              <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5">
                <input type="hidden" name="access_key" value="62765342-bb78-41ba-8e76-7d7a8b5b8bb0" />
                <input type="hidden" name="redirect" value="https://howtoaiworld.com/thanks.html" />
                <input type="hidden" name="subject" value="New Contact Form Submission - Howtoaiworld" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="name">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      className="w-full border border-card-border rounded-xl px-4 py-3 bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="email">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="w-full border border-card-border rounded-xl px-4 py-3 bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="topic">
                    Topic
                  </label>
                  <select 
                    name="topic" 
                    id="topic"
                    className="w-full border border-card-border rounded-xl px-4 py-3 bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="">Select a topic...</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership & Collaboration</option>
                    <option value="content">Content Suggestion</option>
                    <option value="technical">Technical Issue</option>
                    <option value="advertising">Advertising</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="message">
                    Your Message <span className="text-primary">*</span>
                  </label>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows={5} 
                    className="w-full border border-card-border rounded-xl px-4 py-3 bg-background text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" 
                    placeholder="Tell us how we can help you..." 
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="premium-button w-full md:w-auto px-8 py-3.5 font-bold flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Back to Home */}
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-card-border hover:bg-surface transition-colors text-sm font-medium text-foreground"
            >
              ← Back to Home
            </Link>

          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Contact Cards */}
            <div className="premium-card p-6">
              <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Quick Contacts
              </h3>
              <div className="space-y-4">
                <a 
                  href="mailto:contact@howtoaiworld.com" 
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block">Email Us</span>
                    <span className="text-sm text-muted">contact@howtoaiworld.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block">Response Time</span>
                    <span className="text-sm text-muted">Usually within 24-48 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block">Office Location</span>
                    <span className="text-sm text-muted leading-relaxed">
                      208-A, Basement Commercial Zone<br />
                      Sector C, Chambelli Block<br />
                      Bahria Town, Lahore 53720<br />
                      Pakistan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Mini Section */}
            <div className="premium-card p-6">
              <h3 className="font-bold text-foreground mb-4">Common Questions</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Can I contribute content?</h3>
                  <p className="text-muted leading-relaxed">
                    Yes! We welcome guest contributors. Send us your pitch via the contact form.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Do you offer partnerships?</h3>
                  <p className="text-muted leading-relaxed">
                    We collaborate with AI companies and educational institutions. Reach out to discuss.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Found a broken link?</h3>
                  <p className="text-muted leading-relaxed">
                    Let us know through the form and we&apos;ll fix it ASAP.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
