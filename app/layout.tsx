import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Virtuals - Base Mini App",
  description: "Browse and discover virtual tokens on Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Base App SDK ready() caller - runs as early as possible */}
        <Script
          id="base-sdk-ready"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log('[Base SDK] Initializing ready() caller...');
                var readyCalled = false;
                
                // Function to call ready() when SDK is available
                function callReady() {
                  if (readyCalled) {
                    console.log('[Base SDK] ready() already called, skipping');
                    return true;
                  }
                  
                  // Debug: Log all possible SDK locations
                  console.log('[Base SDK] Checking for SDK...');
                  console.log('[Base SDK] window.sdk:', window.sdk);
                  console.log('[Base SDK] window.parent.sdk:', window.parent && window.parent.sdk);
                  console.log('[Base SDK] window.top.sdk:', window.top && window.top.sdk);
                  console.log('[Base SDK] window.farcaster:', window.farcaster);
                  console.log('[Base SDK] window.base:', window.base);
                  
                  var sdk = null;
                  
                  // Check window.sdk first (most common)
                  if (window.sdk && window.sdk.actions && typeof window.sdk.actions.ready === 'function') {
                    sdk = window.sdk;
                    console.log('[Base SDK] Found SDK at window.sdk');
                  }
                  // Check parent window (iframe context)
                  else if (window.parent && window.parent.sdk && window.parent.sdk.actions && typeof window.parent.sdk.actions.ready === 'function') {
                    sdk = window.parent.sdk;
                    console.log('[Base SDK] Found SDK at window.parent.sdk');
                  }
                  // Check top window
                  else if (window.top && window.top.sdk && window.top.sdk.actions && typeof window.top.sdk.actions.ready === 'function') {
                    sdk = window.top.sdk;
                    console.log('[Base SDK] Found SDK at window.top.sdk');
                  }
                  // Check other possible locations
                  else if (window.farcaster && window.farcaster.sdk && window.farcaster.sdk.actions && typeof window.farcaster.sdk.actions.ready === 'function') {
                    sdk = window.farcaster.sdk;
                    console.log('[Base SDK] Found SDK at window.farcaster.sdk');
                  }
                  else if (window.base && window.base.sdk && window.base.sdk.actions && typeof window.base.sdk.actions.ready === 'function') {
                    sdk = window.base.sdk;
                    console.log('[Base SDK] Found SDK at window.base.sdk');
                  }
                  
                  if (sdk && sdk.actions && sdk.actions.ready) {
                    try {
                      console.log('[Base SDK] Calling ready()...');
                      sdk.actions.ready();
                      readyCalled = true;
                      console.log('[Base SDK] ✓ ready() called successfully!');
                      return true;
                    } catch (e) {
                      console.error('[Base SDK] ✗ Error calling ready():', e);
                    }
                  } else {
                    console.log('[Base SDK] SDK not found yet');
                  }
                  return false;
                }
                
                // Try immediately
                callReady();
                
                // Retry with very frequent intervals
                var attempts = 0;
                var maxAttempts = 300; // 30 seconds
                var interval = setInterval(function() {
                  attempts++;
                  if (callReady() || attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (attempts >= maxAttempts && !readyCalled) {
                      console.error('[Base SDK] ✗ ready() not called after maximum attempts. SDK may not be available.');
                      console.log('[Base SDK] Debug info - window keys:', Object.keys(window).filter(function(k) { return k.toLowerCase().includes('sdk') || k.toLowerCase().includes('base') || k.toLowerCase().includes('farcaster'); }));
                    }
                  }
                }, 100);
                
                // Also try on various events
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                  callReady();
                } else {
                  window.addEventListener('load', function() {
                    console.log('[Base SDK] Window load event fired');
                    callReady();
                  }, { once: true });
                  document.addEventListener('DOMContentLoaded', function() {
                    console.log('[Base SDK] DOMContentLoaded event fired');
                    callReady();
                  }, { once: true });
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}

