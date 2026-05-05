import Image from "next/image";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "About Us - Howtoaiworld | Making AI Simple for Everyone",
  description: "Learn about Howtoaiworld's mission to make Artificial Intelligence accessible. Meet our team of AI experts, writers, and developers dedicated to simplifying AI for everyone.",
  keywords: ["about howtoaiworld", "AI education team", "AI experts", "AI mission", "artificial intelligence blog"],
  openGraph: {
    title: "About Howtoaiworld - Making AI Simple for Everyone",
    description: "Meet the team behind Howtoaiworld. Our mission is to make AI accessible through practical guides and honest reviews.",
    url: "https://howtoaiworld.com/about",
    type: "website",
  },
  alternates: {
    canonical: "https://howtoaiworld.com/about",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Howtoaiworld",
  "url": "https://howtoaiworld.com",
  "logo": "https://howtoaiworld.com/logo.jpg",
  "description": "Making Artificial Intelligence Simple, Practical, and Accessible for Everyone",
  "foundingDate": "2024",
  "sameAs": [
    "https://x.com/howtoaiworld",
    "https://www.facebook.com/people/Howtoaiworld/61587792413577",
    "https://www.instagram.com/howtoaiworld"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@howtoaiworld.com",
    "contactType": "customer support",
    "areaServed": "Worldwide",
    "availableLanguage": "English"
  }
};

export default function AboutPage() {
    return (
        <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
            <section className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-foreground">About Howtoaiworld</h1>
                <p className="text-lg text-muted">Making Artificial Intelligence Simple, Practical, and Accessible for Everyone</p>
            </section>

            <section className="premium-card p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div><div className="text-3xl font-bold text-primary">Daily</div><div className="text-sm text-muted uppercase tracking-wide">Fresh Content</div></div>
                    <div><div className="text-3xl font-bold text-primary">Researched</div><div className="text-sm text-muted uppercase tracking-wide">AI Insights</div></div>
                    <div><div className="text-3xl font-bold text-primary">Simple</div><div className="text-sm text-muted uppercase tracking-wide">Easy Explanations</div></div>
                    <div><div className="text-3xl font-bold text-primary">Free</div><div className="text-sm text-muted uppercase tracking-wide">Always Accessible</div></div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="premium-card p-8 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Our Goal</h2>
                    <p className="text-muted leading-relaxed">At Howtoaiworld, our main goal is pretty simple. We want to make Artificial Intelligence easy for everyone to understand. There is a lot of hype out there right now, and it can get really confusing. We want to help you figure out what AI can actually do for you and what is just fake news. Whether you are a student, a business owner, or just curious, we want to be the place you go for clear and simple answers.</p>
                </div>
                <div className="premium-card p-8 rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
                    <p className="text-muted leading-relaxed">We are on a mission to help people use AI in a good way. We don't want to just talk about complicated code or boring theories. We want to share practical tips that actually help you save time or money. We believe that learning about the future shouldn't be hard. We dig through all the news and research so you don't have to, and we break it down into stuff that actually makes sense.</p>
                </div>
            </section>

            <section className="premium-card p-8 rounded-xl shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-foreground">What We Cover</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div><h3 className="font-semibold text-primary mb-2">Business Tools</h3><p className="text-muted">How to use AI to help with marketing, online stores, or just organizing your work.</p></div>
                    <div><h3 className="font-semibold text-primary mb-2">Money and Finance</h3><p className="text-muted">We look at how new apps are changing the way we save, invest, and handle insurance.</p></div>
                    <div><h3 className="font-semibold text-primary mb-2">Tech News</h3><p className="text-muted">The latest updates on things like cloud hosting, new software, and cool gadgets.</p></div>
                    <div><h3 className="font-semibold text-primary mb-2">Right vs Wrong</h3><p className="text-muted">We talk about the ethics of AI and how to stay safe and private online.</p></div>
                    <div><h3 className="font-semibold text-primary mb-2">Simple Guides</h3><p className="text-muted">We write step-by-step tutorials on how to use tools for writing and creativity.</p></div>
                    <div><h3 className="font-semibold text-primary mb-2">Practical Applications</h3><p className="text-muted">Real-world examples and case studies showing AI in action across different industries.</p></div>
                </div>
            </section>

            <section className="premium-card p-8 rounded-xl shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><h3 className="font-semibold text-foreground mb-2">Honesty</h3><p className="text-muted">We try our best to check our facts. If something is just a rumor, we will tell you.</p></div>
                    <div><h3 className="font-semibold text-foreground mb-2">People First</h3><p className="text-muted">We think technology should help humans, not replace them.</p></div>
                    <div><h3 className="font-semibold text-foreground mb-2">Keep it Real</h3><p className="text-muted">We don't use big fancy words when simple ones work better.</p></div>
                    <div><h3 className="font-semibold text-foreground mb-2">Being Useful</h3><p className="text-muted">We focus on tools you can actually use today, not just crazy sci-fi ideas.</p></div>
                </div>
            </section>

            <section className="premium-card p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Our Journey</h2>
                <div className="space-y-6 border-l-2 border-primary pl-6">
                    <div>
                        <div className="font-semibold text-primary">2024 - BEGINNING</div>
                        <h3 className="font-bold text-lg text-foreground">The Spark</h3>
                        <p className="text-muted">Started as a small blog with a mission to demystify AI for everyday people. We realized there was a huge gap between complex AI research and practical applications.</p>
                    </div>
                    <div>
                        <div className="font-semibold text-primary">2025 - GROWTH</div>
                        <h3 className="font-bold text-lg text-foreground">Expanding Horizons</h3>
                        <p className="text-muted">Grew our team of writers and experts. Published over 200 articles covering business tools, finance applications, and ethical AI discussions.</p>
                    </div>
                    <div>
                        <div className="font-semibold text-primary">2026 - TODAY</div>
                        <h3 className="font-bold text-lg text-foreground">Start of Horizon</h3>
                        <p className="text-muted">Created our website and now serving daily online readers and building a community of AI enthusiasts, professionals, and learners who believe in accessible technology.</p>
                    </div>
                    <div>
                        <div className="font-semibold text-primary">FUTURE</div>
                        <h3 className="font-bold text-lg text-foreground">What's Next</h3>
                        <p className="text-muted">Launching interactive tutorials, video content, and a community forum where everyone can learn, share, and grow together in the AI revolution.</p>
                    </div>
                </div>
            </section>

            <section className="premium-card p-8 rounded-xl shadow-sm space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Meet Us</h2>
                <p className="text-muted leading-relaxed">We are a group of tech enthusiasts and writers who are really interested in how the world is changing. We aren't just faceless experts. We are real people, including students and professionals, who are learning and exploring these tools every day. We write about things like finance, business, and tech myths because we want to share what we learn with you. We believe technology should be fun and helpful, and we try to write like we are talking to a friend.</p>
            </section>

            <section className="premium-card p-8 rounded-xl shadow-sm space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Meet Our Team</h2>
                    <p className="text-muted">The passionate people behind Howtoaiworld</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="premium-card p-5">
                        <div className="relative w-16 h-16 overflow-hidden rounded-full mb-4">
                            <Image src="/authors/azha-balouch.jpg" alt="Azha Balouch" fill className="object-cover" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Azha Balouch</h3>
                        <div className="text-primary text-sm font-medium mb-3">Lead Developer</div>
                        <p className="text-muted text-sm mb-4">Azha brings cutting-edge AI solutions to life. With expertise in machine learning and web development, he ensures our platform delivers the best user experience while integrating the latest AI technologies.</p>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
                            <span className="bg-primary-light px-2 py-1 rounded-full">Fullstack</span>
                            <span className="bg-primary-light px-2 py-1 rounded-full">HTML/CSS/JS</span>
                            <span className="bg-primary-light px-2 py-1 rounded-full">Python</span>
                        </div>
                    </div>
                    <div className="premium-card p-5">
                        <div className="relative w-16 h-16 overflow-hidden rounded-full mb-4">
                            <Image src="/authors/zawiyar-ahmad.jpg" alt="Zawiyar Ahmed" fill className="object-cover" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Zawiyar Ahmed</h3>
                        <div className="text-primary text-sm font-medium mb-3">Blog Manager</div>
                        <p className="text-muted text-sm mb-4">Zawiyar curates and manages all our content, ensuring every article is engaging, accurate, and easy to understand. He has a talent for breaking down complex topics into bite-sized, actionable insights.</p>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
                            <span className="bg-primary-light px-2 py-1 rounded-full">Content Strategy</span>
                            <span className="bg-primary-light px-2 py-1 rounded-full">Writing</span>
                            <span className="bg-primary-light px-2 py-1 rounded-full">Editing</span>
                        </div>
                    </div>
                    <div className="premium-card p-5">
                        <div className="relative w-16 h-16 overflow-hidden rounded-full mb-4">
                            <Image src="/authors/ramish-kamran.jpg" alt="Ramish Kamran" fill className="object-cover" />
                        </div>
                        <h3 className="font-bold text-lg text-foreground">Ramish Kamran</h3>
                        <div className="text-primary text-sm font-medium mb-3">SEO Specialist</div>
                        <p className="text-muted text-sm mb-4">Ramish ensures our content reaches the right audience at the right time. His expertise in search optimization and digital marketing helps thousands discover valuable AI insights every day.</p>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
                            <span className="bg-primary-light px-2 py-1 rounded-full">SEO</span>
                            <span className="bg-primary-light px-2 py-1 rounded-full">Analytics</span>
                            <span className="bg-primary-light px-2 py-1 rounded-full">Marketing</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="premium-card p-8 rounded-xl shadow-sm text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Get In Touch</h2>
                <p className="text-muted">Have questions or want to collaborate? We'd love to hear from you! Reach out and let's make AI accessible together.</p>
                <a href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-dark transition-colors">Contact Us</a>
            </section>
        </div>
    </>
    );
}
