"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

const senderSnippet = `
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
`;

export default function SenderFormEmbed() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <>
      <Script id="sender-net-script" strategy="afterInteractive">
        {senderSnippet}
      </Script>
      <div className="min-h-[150px] relative flex flex-col items-center">
        {mounted ? (
          <div
            style={{ width: "100%", textAlign: "left" }}
            className="sender-form-field"
            data-sender-form-id="eERpR0"
            suppressHydrationWarning
          />
        ) : null}
      </div>
    </>
  );
}