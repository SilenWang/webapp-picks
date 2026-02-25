import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SerwistProvider } from "./serwist";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Webapp Picks",
  description: "A curated collection of web applications for FydeOS",
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
