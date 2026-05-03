import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Howtoaiworld",
  description: "Howtoaiworld is a practical AI blog built with articles, guides, and tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body className="flex flex-col min-h-screen bg-[#F4F6F8] font-sans text-gray-800">
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
