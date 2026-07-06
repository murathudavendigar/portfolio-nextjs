import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.muratoncu.com"),
  title: {
    default: "Murat Hüdavendigâr Öncü — Frontend Developer",
    template: "%s — Murat Öncü",
  },
  description:
    "Frontend developer building fast, polished web apps with React, Next.js and TypeScript.",
  openGraph: {
    type: "website",
    siteName: "Murat Öncü",
    images: [{ url: "/img/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@murathoncu",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#313131",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
