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
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var readyCalled = false;
                
                // Function to call ready() when SDK is available
                function callReady() {
                  if (readyCalled) return true;
                  
                  var sdk = null;
                  
                  // Check various possible SDK locations
                  if (window.sdk && window.sdk.actions && typeof window.sdk.actions.ready === 'function') {
                    sdk = window.sdk;
                  } else if (window.farcaster && window.farcaster.sdk && window.farcaster.sdk.actions && typeof window.farcaster.sdk.actions.ready === 'function') {
                    sdk = window.farcaster.sdk;
                  } else if (window.base && window.base.sdk && window.base.sdk.actions && typeof window.base.sdk.actions.ready === 'function') {
                    sdk = window.base.sdk;
                  }
                  
                  if (sdk && sdk.actions && sdk.actions.ready) {
                    try {
                      sdk.actions.ready();
                      readyCalled = true;
                      console.log('[Base SDK] ready() called successfully');
                      return true;
                    } catch (e) {
                      console.error('[Base SDK] Error calling ready():', e);
                    }
                  }
                  return false;
                }
                
                // Try immediately
                if (callReady()) return;
                
                // Use MutationObserver to watch for SDK injection
                if (window.MutationObserver) {
                  var observer = new MutationObserver(function(mutations) {
                    if (callReady()) {
                      observer.disconnect();
                    }
                  });
                  
                  observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['data-sdk', 'data-base-sdk']
                  });
                  
                  // Disconnect after 10 seconds
                  setTimeout(function() {
                    observer.disconnect();
                  }, 10000);
                }
                
                // Retry with intervals
                var attempts = 0;
                var maxAttempts = 200; // 20 seconds
                var interval = setInterval(function() {
                  attempts++;
                  if (callReady() || attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (attempts >= maxAttempts && !readyCalled) {
                      console.warn('[Base SDK] ready() not called after maximum attempts. SDK may not be available.');
                    }
                  }
                }, 100);
                
                // Also try on various events
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                  callReady();
                } else {
                  window.addEventListener('load', callReady, { once: true });
                  document.addEventListener('DOMContentLoaded', callReady, { once: true });
                }
                
                // Watch for window.sdk property changes
                var sdkCheckInterval = setInterval(function() {
                  if (callReady()) {
                    clearInterval(sdkCheckInterval);
                  }
                }, 50);
                
                // Clear interval after 20 seconds
                setTimeout(function() {
                  clearInterval(sdkCheckInterval);
                }, 20000);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}

