"use client";

import { site } from "@/lib/site";
import { useEffect, useRef } from "react";

export default function ConsoleGreeting() {
  const greeted = useRef(false);

  useEffect(() => {
    if (greeted.current || process.env.NODE_ENV !== "production") {
      // In development, strict mode double-fires and clutters the console.
      // We also don't want to annoy you while you are actively developing.
      // Let's run it once safely.
    }

    if (greeted.current) return;
    greeted.current = true;

    // Use a slight delay so it appears cleanly after all Next.js hydration logs
    const timer = setTimeout(() => {
      const ascii = `
  █▀▄▀█ █░█ █▀█ 
  █░▀░█ █▀█ █▄█ 
      `;

      console.log(
        `%c${ascii}`,
        "color: #CA3E47; font-weight: bold; font-family: monospace;"
      );
      
      console.log(
        "%cHey! If you're looking under the hood, we should probably talk.",
        "font-size: 14px; font-weight: bold; color: #111; dark:color: #fff; font-family: sans-serif;"
      );
      
      console.log(
        "%cThis portfolio was built with Next.js App Router, Tailwind CSS, and Framer Motion.\nIf you need a frontend engineer who sweats the micro-details, my inbox is open.",
        "font-size: 12px; color: #888; font-family: sans-serif; line-height: 1.6;"
      );
      
      console.log(
        `%c👉 ${site.email}`,
        "font-size: 13px; font-weight: bold; color: #CA3E47; font-family: sans-serif; line-height: 2.5;"
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
