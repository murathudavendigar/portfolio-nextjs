import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import Providers from "./providers";
import "@/styles/globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s — Murat Öncü",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.shortName,
    title: site.title,
    description: site.description,
    images: [{ url: site.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    title: site.title,
    description: site.description,
    images: [site.defaultOgImage],
  },
  icons: { icon: "/favicon.ico" },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export const viewport: Viewport = {
  themeColor: "#211d1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${nunitoSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
