'use client';

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function AdSenseScript() {
  const pathname = usePathname();

  // Pages where ads should NOT be displayed
  const noAdPages = ['/legal', '/contact', '/about'];
  const shouldDisableAds = noAdPages.some(page => pathname.startsWith(page));

  if (shouldDisableAds) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5501938670097396"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
