import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://seoairegent.com"),
  title: {
    default: "SEO AI Regent",
    template: "%s | SEO AI Regent",
  },
  description:
    "Editorial-grade content scoring for Google and AI search, with Content Score, GEO Score, citability analysis, and canonical score explanations.",
  keywords: [
    "SEO AI Regent",
    "content scoring",
    "GEO score",
    "AI search",
    "editorial SEO",
    "SERP analysis",
    "content optimization",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SEO AI Regent",
    description:
      "Score content for Google and AI search before you publish, from one canonical model.",
    url: "https://seoairegent.com",
    siteName: "SEO AI Regent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO AI Regent",
    description:
      "Score content for Google and AI search before you publish, from one canonical model.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
