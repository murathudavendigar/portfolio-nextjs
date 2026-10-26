"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fades content in as it scrolls into view. The server always renders it
 * visible; only blocks that start below the fold are hidden (before first
 * paint) and revealed, so nothing is blank while JavaScript loads.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Render as a list item when Reveal sits directly inside a <ul>/<ol>. */
  as?: "div" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [armed, setArmed] = useState(false);

  useIsoLayoutEffect(() => {
    if (reduceMotion || !ref.current) return;
    if (ref.current.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [reduceMotion]);

  const show = !armed || inView;

  const props = {
    initial: false as const,
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: show ? { duration: 0.5, ease: "easeOut" as const, delay } : { duration: 0 },
    className,
  };

  return as === "li" ? (
    <motion.li ref={ref as React.Ref<HTMLLIElement>} {...props}>
      {children}
    </motion.li>
  ) : (
    <motion.div ref={ref as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </motion.div>
  );
}
