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
        <Script id="theme-init" strategy="beforeInteractive">
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
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag("consent", "default", {
              ad_personalization: "denied",
              ad_storage: "denied",
              ad_user_data: "denied",
              analytics_storage: "denied",
              functionality_storage: "denied",
              personalization_storage: "denied",
              security_storage: "granted",
              wait_for_update: 500,
            });
            gtag("set", "ads_data_redaction", true);
            gtag("set", "url_passthrough", false);
          `}
        </Script>
        
        <Script
          id="cookiebot"
          strategy="beforeInteractive"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="402f2129-fdd2-44e0-b450-f6d922daebf4"
          data-blockingmode="auto"
          type="text/javascript"
        />

        <Script id="gtag" strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-HWT034PQT2" />
        <Script id="gtag-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HWT034PQT2');
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

        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8450943980358095" crossOrigin="anonymous" strategy="afterInteractive" />
        <meta name="google-adsense-account" content="ca-pub-8450943980358095" />

        {/* Sender.net Newsletter Integration */}
        <Script id="sender-net-script" strategy="afterInteractive">
          {`
            (function (s, e, n, d, er) {
              s['Sender'] = er;
              s[er] = s[er] || function () {
                (s[er].q = s[er].q || []).push(arguments)
              }, s[er].l = 1 * new Date();
              s[er].on = function(event, callback) {
                s[er].listeners = s[er].listeners || {};
                (s[er].listeners[event] = s[er].listeners[event] || []).push(callback);
              };
              var a = e.createElement(n),
                  m = e.getElementsByTagName(n)[0];
              a.async = 1;
              a.src = d;
              m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://cdn.sender.net/accounts_resources/universal.js', 'sender');
            sender('6ec66dfe790619');
          `}
        </Script>
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground font-sans">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPVWNXWV" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
