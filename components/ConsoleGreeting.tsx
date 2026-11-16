"use client";

import { site } from "@/lib/site";
import { useEffect } from "react";

const SOURCE_URL = `${site.socials.github}/portfolio-nextjs`;

/** A short note for people who open DevTools. Runs once per page load. */
export default function ConsoleGreeting() {
  useEffect(() => {
    const w = window as Window & { __mhoGreeted?: boolean };
    if (w.__mhoGreeted) return;

    // After hydration logs, so it isn't buried under them.
    const timer = setTimeout(() => {
      // Set here, not above: strict mode clears the first timer.
      w.__mhoGreeted = true;
      // No text colours: DevTools picks readable ones for light and dark.
      console.log(
        "%cHi, I'm Murat.",
        "font-size: 15px; font-weight: 600; font-family: sans-serif;",
      );
      console.log(
        [
          "This site is Next.js, TypeScript and Tailwind on Cloudflare Workers.",
          `The source is public: ${SOURCE_URL}`,
          "",
          `Hiring a frontend engineer? ${site.email}`,
          ...(site.calUrl ? [`Or book 15 minutes: ${site.calUrl}`] : []),
        ].join("\n"),
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
