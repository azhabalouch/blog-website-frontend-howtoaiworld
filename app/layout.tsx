import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
 
export const metadata: Metadata = {
  title: {
    default: "Howtoaiworld - Learn AI the Simple Way",
    template: "%s | Howtoaiworld",
  },
  description: "Howtoaiworld makes Artificial Intelligence easy to understand. Practical guides, honest reviews, and step-by-step tutorials for everyone.",
  keywords: ["AI", "artificial intelligence", "AI tools", "AI guides", "machine learning", "AI tutorials", "AI for beginners", "AI news"],
  authors: [{ name: "Howtoaiworld", url: "https://howtoaiworld.com" }],
  creator: "Howtoaiworld",
  publisher: "Howtoaiworld",
  metadataBase: new URL("https://howtoaiworld.com"),
  alternates: {
    canonical: "https://howtoaiworld.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://howtoaiworld.com",
    siteName: "Howtoaiworld",
    title: "Howtoaiworld - Learn AI the Simple Way",
    description: "Practical AI guides, honest reviews, and step-by-step tutorials for everyone.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Howtoaiworld - Learn AI the Simple Way",
    description: "Practical AI guides, honest reviews, and step-by-step tutorials for everyone.",
    creator: "@howtoaiworld",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="afterInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })();
          `}
        </Script>
 
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HWT034PQT2"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HWT034PQT2');
          `}
        </Script>
 
        <link rel="alternate" type="application/rss+xml" title="Howtoaiworld RSS Feed" href="https://howtoaiworld.com/rss.xml" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preload" as="script" href="https://www.googletagmanager.com/gtag/js?id=G-HWT034PQT2" />
        <link rel="preconnect" href="https://cdn.sender.net" />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground font-sans">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPVWNXWV" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}