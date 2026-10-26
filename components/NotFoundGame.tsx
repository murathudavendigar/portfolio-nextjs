"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { closestPath } from "@/lib/routeGuess";
import { useCallback, useEffect, useMemo, useState } from "react";

/** Deterministic shuffle that never returns the word in order. */
function scramble(word: string): string[] {
  const letters = word.split("");
  if (new Set(letters).size < 2) return letters;
  let seed = word.length * 31;
  for (const c of word) seed = (seed * 33 + c.charCodeAt(0)) % 2147483647;
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  let out = letters;
  for (let attempt = 0; attempt < 10 && out.join("") === word; attempt++) {
    out = [...letters];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
  }
  return out.join("") === word ? [...letters.slice(1), letters[0]] : out;
}

/**
 * The 404 fixes the typo as a puzzle: it guesses the page you meant, then
 * scrambles that page's name. Tap (or type) the letters in order to rebuild
 * the route.
 */
export default function NotFoundGame({ known }: { known: string[] }) {
  // The 404 is prerendered, so the typed address is only known in the browser.
  const [pathname, setPathname] = useState<string | null>(null);
  useEffect(() => setPathname(window.location.pathname), []);
  if (!pathname) return <div aria-hidden="true" className="min-h-[19rem] w-full max-w-md" />;
  return <RouteGame pathname={pathname} known={known} />;
}

function RouteGame({ pathname, known }: { pathname: string; known: string[] }) {
  const reduceMotion = useReducedMotion();
  const target = useMemo(() => closestPath(pathname, known), [pathname, known]);
  const word = target.split("/")[1] || "work";
  const tiles = useMemo(() => scramble(word), [word]);

  const [used, setUsed] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const solved = used.length === word.length;
  const typed = used.map((i) => tiles[i]).join("");

  const press = useCallback(
    (index: number) => {
      if (solved || used.includes(index)) return;
      if (tiles[index] === word[used.length]) {
        setUsed((u) => [...u, index]);
      } else {
        setShake(index);
        window.setTimeout(() => setShake(null), 350);
      }
    },
    [solved, used, tiles, word],
  );

  // Typing works too: the first unused tile with that letter.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const key = e.key.toLowerCase();
      const index = tiles.findIndex((c, i) => c === key && !used.includes(i));
      if (index >= 0) press(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tiles, used, press]);

  return (
    <section aria-labelledby="fix-route" className="min-h-[19rem] w-full max-w-md">
      <p className="text-sm text-[var(--text-muted)]">
        Did you mean{" "}
        <Link
          href={target}
          className="font-mono-ui text-[var(--accent-text)] underline decoration-white/25 underline-offset-4 hover:decoration-[var(--accent-text)]">
          {target}
        </Link>
        ?
      </p>

      <h2 id="fix-route" className="mt-10 font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
        Or fix the route yourself
      </h2>

      {/* What has been rebuilt so far */}
      <p className="mt-4 font-mono-ui text-2xl tracking-[0.2em]" aria-live="polite">
        <span className="text-[var(--text-muted)]">/</span>
        {word.split("").map((c, i) => (
          <span
            key={i}
            className={i < typed.length ? "text-white dark:text-gray-900" : "text-white/20 dark:text-gray-400"}>
            {i < typed.length ? c : "_"}
          </span>
        ))}
        <span className="sr-only">{solved ? `Route fixed: /${word}` : `${typed.length} of ${word.length} letters`}</span>
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Scrambled letters">
        {tiles.map((c, i) => {
          const isUsed = used.includes(i);
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => press(i)}
              disabled={isUsed || solved}
              aria-label={`Letter ${c.toUpperCase()}`}
              animate={shake === i && !reduceMotion ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className={`h-12 w-12 rounded-lg border font-mono-ui text-lg font-semibold uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] ${
                isUsed
                  ? "border-transparent bg-transparent text-white/20 dark:text-gray-400"
                  : shake === i
                    ? "border-[var(--accent-text)] text-[var(--accent-text)]"
                    : "border-white/15 bg-white/5 hover:border-[var(--accent-text)] dark:border-gray-400/60 dark:bg-white/60"
              }`}>
              {c}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 min-h-12">
        {solved ? (
          <Link href={target} className="btn-primary">
            Route fixed — go to {target}
          </Link>
        ) : (
          <p className="text-xs text-[var(--text-muted)]">Tap the letters in order, or just type.</p>
        )}
      </div>
    </section>
  );
}
