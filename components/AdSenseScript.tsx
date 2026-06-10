'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdSenseScript() {
  const pathname = usePathname();

  // Pages where ads should NOT be displayed
  const noAdPages = ['/legal', '/contact', '/about'];
  const shouldDisableAds = noAdPages.some(page => pathname.startsWith(page));

  useEffect(() => {
    if (shouldDisableAds) return;

    // Inject AdSense script directly to avoid data-nscript attribute issue
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5501938670097396';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, [shouldDisableAds]);

  return null;
}
