import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SerwistProvider } from "./serwist";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = "https://webapp-picks.cc";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Webapp Picks",
  description: "A curated collection of web applications for FydeOS",
  keywords: [
    "webapp",
    "PWA",
    "FydeOS",
    "web applications",
    "在线工具",
    "网页应用",
    "自托管",
    "self-hosted",
  ],
  authors: [{ name: "Sylens Wong" }],
  creator: "Sylens Wong",
  publisher: "Sylens Wong",
  applicationName: "Webapp Picks",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Webapp Picks",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN", "en_US"],
    url: BASE_URL,
    siteName: "Webapp Picks",
    title: "Webapp Picks",
    description: "A curated collection of web applications for FydeOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Webapp Picks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Webapp Picks",
    description: "A curated collection of web applications for FydeOS",
    images: ["/og-image.png"],
    creator: "@webapppicks",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Webapp Picks",
              url: BASE_URL,
              description: "A curated collection of web applications for FydeOS",
              inLanguage: ["en", "zh"],
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${BASE_URL}/{search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else if (theme === 'light') {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SerwistProvider swUrl="/sw.js">{children}</SerwistProvider>
        <Analytics />
      </body>
    </html>
  );
}
