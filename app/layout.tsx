import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import Providers from "./providers";
import { site } from "@/lib/site";
import "@/styles/globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
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
};

export const viewport: Viewport = {
  themeColor: "#313131",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={nunitoSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
