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
 
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MPVWNXWV');
          `}
        </Script>
 
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8450943980358095"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
 
        <meta name="google-adsense-account" content="ca-pub-8450943980358095" />
        <link rel="alternate" type="application/rss+xml" title="Howtoaiworld RSS Feed" href="https://howtoaiworld.com/rss.xml" />
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