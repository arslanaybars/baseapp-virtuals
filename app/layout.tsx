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
        {/* Base App SDK - ensure SDK is available globally */}
        <Script
          id="base-sdk-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Create global SDK object if Base App hasn't injected it yet
              if (typeof window !== 'undefined' && !window.sdk) {
                window.sdk = window.sdk || {};
                window.sdk.actions = window.sdk.actions || {};
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}

