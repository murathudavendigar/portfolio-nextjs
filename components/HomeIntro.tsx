"use client";

import { animate as animateGlobal, motion, useAnimate } from "framer-motion";
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

/** The MHO monogram, one path per letter (each fits a 24×24 box). */
const LETTERS = [
  { key: "m", viewBox: "0 0 24 24", d: "M4 20 L4 4 L12 12 L20 4 L20 20" },
  { key: "h", viewBox: "24 0 24 24", d: "M28 4 L28 20 M28 12 L44 12 M44 4 L44 20" },
  { key: "o", viewBox: "48 0 24 24", d: "M52 12 A 8 8 0 1 1 68 12 A 8 8 0 1 1 52 12" },
] as const;
const LETTER_PX = 32;
/** Ink height of a glyph in its 24-unit box: y 4–20 plus the 2.5 stroke. */
const GLYPH_RATIO = 18.5 / 24;

const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/**
 * Centre of a capital letter's ink. Letter-spacing adds space after the
 * glyph inside its box, and caps sit above the middle of the line box, so
 * both are measured from the font itself.
 */
const glyphCenter = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const spacing = parseFloat(style.letterSpacing) || 0;
  let y = r.top + r.height / 2;
  let cap = (parseFloat(style.fontSize) || 14) * 0.7;
  const ctx = document.createElement("canvas").getContext("2d");
  if (ctx) {
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const m = ctx.measureText("M");
    const ascent = m.fontBoundingBoxAscent;
    const descent = m.fontBoundingBoxDescent;
    if (ascent && descent) {
      const baseline = r.top + (r.height - (ascent + descent)) / 2 + ascent;
      y = baseline - m.actualBoundingBoxAscent / 2;
      cap = m.actualBoundingBoxAscent;
    }
  }
  return { x: r.left + (r.width - spacing) / 2, y, cap };
};

/**
 * First visit per session: MHO draws in the middle, flies into the header,
 * and the name grows out of its initials — M becomes the M of MURAT, O the
 * Ö of ÖNCÜ, H drifts away and the letters in between open up. About 2.2s;
 * any click, key, scroll or touch skips it.
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

    const logoChars = Array.from(
      document.querySelectorAll<HTMLElement>("[data-site-logo] [data-logo-char]"),
    );

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
      animateGlobal(logoChars, { opacity: 1, y: 0 }, { duration: 0.2 });
      await animate(scope.current, { opacity: 0 }, { duration: 0.2 });
      finish();
    };

    const run = async () => {
      await animate("[data-mho-path]", { pathLength: 1, opacity: 1 }, { duration: 0.8, ease: "easeInOut" });
      await new Promise((r) => setTimeout(r, 150));
      if (done) return;

      const group = scope.current.querySelector("[data-mho-mark]") as HTMLElement | null;
      const letter = (k: string) =>
        scope.current.querySelector(`[data-mho-letter="${k}"]`) as HTMLElement | null;
      const targetM = logoChars.find((el) => el.dataset.logoChar === "m");
      const targetO = logoChars.find((el) => el.dataset.logoChar === "o");
      const m = letter("m");
      const o = letter("o");

      if (!group || !m || !o || !targetM || !targetO) {
        // No header to land in: just fade out.
        await animate(scope.current, { opacity: 0 }, { duration: 0.4 });
        finish();
        return;
      }

      // 1. Fly: scale the monogram to the logo's cap height and land M on M.
      const tm = glyphCenter(targetM);
      const scale = tm.cap / (LETTER_PX * GLYPH_RATIO);
      const g = center(group.getBoundingClientRect());
      const mc = center(m.getBoundingClientRect());
      const fly = {
        x: tm.x - (g.x + (mc.x - g.x) * scale),
        y: tm.y - (g.y + (mc.y - g.y) * scale),
        scale,
        // Arrive in the logo's own colour so the hand-over has no colour jump.
        color: getComputedStyle(targetM).color,
      };

      animate("[data-mho-chrome]", { opacity: 0 }, { duration: 0.2 });
      animate("[data-mho-backdrop]", { opacity: 0 }, { duration: 0.6, ease: EASE });
      await animate(group, fly, { duration: 0.6, ease: EASE });
      if (done) return;

      // 2. Spread: O slides to Ö, H drifts up and away.
      const oc = center(o.getBoundingClientRect());
      const to = glyphCenter(targetO);
      animate('[data-mho-letter="h"]', { opacity: 0, y: -10 }, { duration: 0.25, ease: "easeOut" });
      await animate(
        o,
        { x: (to.x - oc.x) / scale, y: (to.y - oc.y) / scale },
        { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      );
      if (done) return;

      // 3. Hand over: the stroke initials become real letters, the rest open up.
      animate([m, o], { opacity: 0 }, { duration: 0.15 });
      animateGlobal([targetM, targetO], { opacity: 1 }, { duration: 0.12 });
      const rest = logoChars.filter((el) => !el.dataset.logoChar);
      rest.forEach((el, i) => {
        animateGlobal(
          el,
          { opacity: [0, 1], y: [4, 0] },
          { duration: 0.25, delay: 0.05 + i * 0.03, ease: "easeOut" },
        );
      });
      await new Promise((r) => setTimeout(r, 350 + rest.length * 30));
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
        <div data-mho-mark className="relative -top-[1px] flex origin-center">
          {LETTERS.map((l) => (
            <svg
              key={l.key}
              data-mho-letter={l.key}
              width={LETTER_PX}
              height={LETTER_PX}
              viewBox={l.viewBox}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block overflow-visible">
              <motion.path data-mho-path d={l.d} initial={{ pathLength: 0, opacity: 0 }} />
            </svg>
          ))}
        </div>
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
