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
      <body className="antialiased bg-white text-gray-900">
        {/* Base Mini App SDK - loaded automatically by Base App, but we ensure it's available */}
        <Script
          id="base-sdk"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Wait for Base SDK to be available
              (function() {
                function checkSDK() {
                  if (window.sdk && window.sdk.actions && window.sdk.actions.ready) {
                    // SDK is available, ready() will be called from page component
                    return;
                  }
                  // Retry after a short delay
                  setTimeout(checkSDK, 100);
                }
                checkSDK();
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}

