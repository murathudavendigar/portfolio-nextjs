"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

/** Set by the inline script in the root layout before first paint. */
export const INTRO_ATTR = "data-intro";
const SEEN_KEY = "mho_intro_seen";
const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Runs before React, so a first-time visitor gets the intro from the very
 * first frame and everyone else never sees it (no flash either way).
 */
export const introBootScript = `try{if(!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("${INTRO_ATTR}","")}catch(e){}`;

/**
 * First visit per session: MHO draws in the middle, then shrinks and flies
 * into the header logo while the page fades in underneath. About 1.6s,
 * and any click, key or scroll skips it.
 */
export default function HomeIntro() {
  const [active, setActive] = useState(true);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute(INTRO_ATTR)) {
      setActive(false);
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "true");
      } catch {}
      root.removeAttribute(INTRO_ATTR);
      setActive(false);
    };

    const skip = async () => {
      if (done) return;
      await animate(scope.current, { opacity: 0 }, { duration: 0.2 });
      finish();
    };

    const run = async () => {
      await animate("[data-mho-path]", { pathLength: 1, opacity: 1 }, { duration: 0.9, ease: "easeInOut" });
      await new Promise((r) => setTimeout(r, 150));
      if (done) return;

      // Fly from the centre of the screen to the header logo.
      const mark = scope.current.querySelector("[data-mho-mark]") as HTMLElement | null;
      const target = document.querySelector("[data-site-logo]") as HTMLElement | null;
      let flight: { x: number; y: number; scale: number } = { x: 0, y: -40, scale: 0.6 };
      if (mark && target) {
        const from = mark.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const scale = Math.min(1, (to.height * 1.1) / from.height);
        flight = {
          x: to.left + (from.width * scale) / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale,
        };
      }

      animate("[data-mho-chrome]", { opacity: 0 }, { duration: 0.2 });
      animate("[data-mho-backdrop]", { opacity: 0 }, { duration: 0.6, ease: EASE });
      await animate("[data-mho-mark]", flight, { duration: 0.6, ease: EASE });
      // Hand over: the real logo fades in (CSS) as the mark fades out.
      root.removeAttribute(INTRO_ATTR);
      await animate("[data-mho-mark]", { opacity: 0 }, { duration: 0.3 });
      finish();
    };

    const events = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    events.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
    run();

    return () => {
      done = true;
      events.forEach((e) => window.removeEventListener(e, skip));
    };
  }, [animate, scope]);

  if (!active) return null;

  return (
    <div ref={scope} className="mho-intro fixed inset-0 z-[100] items-center justify-center" aria-hidden="true">
      <div data-mho-backdrop className="absolute inset-0 bg-ink dark:bg-paper" />
      <div className="relative flex items-center font-mono-ui text-2xl font-semibold text-[#CA3E47]">
        <span data-mho-chrome className="mr-2 text-gray-500 opacity-50 dark:text-gray-400">
          &lt;
        </span>
        <motion.svg
          data-mho-mark
          width="96"
          height="32"
          viewBox="0 0 72 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative -top-[1px] inline-block origin-center">
          <motion.path
            data-mho-path
            d="M4 20 L4 4 L12 12 L20 4 L20 20 M28 4 L28 20 M28 12 L44 12 M44 4 L44 20 M52 12 A 8 8 0 1 1 68 12 A 8 8 0 1 1 52 12"
            initial={{ pathLength: 0, opacity: 0 }}
          />
        </motion.svg>
        <span data-mho-chrome className="ml-[10px] flex items-center">
          <motion.span
            className="inline-block h-[24px] w-3 bg-current"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity }}
          />
          <span className="ml-2 text-gray-500 opacity-50 dark:text-gray-400">/&gt;</span>
        </span>
      </div>
    </div>
  );
}
