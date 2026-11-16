"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SIZE = 5;

/**
 * Fixed 5×5 skyscraper tutorial (not the live daily board).
 * Clues on edges = how many buildings are visible looking into the row/col.
 * Solution is a Latin square of heights 1..5.
 */
const SOLUTION = [
  [2, 1, 4, 3, 5],
  [1, 3, 5, 4, 2],
  [4, 5, 3, 2, 1],
  [3, 2, 1, 5, 4],
  [5, 4, 2, 1, 3],
];

/** Locked starter cells — same format as the App Store daily. */
const GIVENS: (number | null)[][] = [
  [null, null, 4, null, 5],
  [null, 3, null, null, null],
  [4, null, 3, null, null],
  [null, null, null, 5, null],
  [5, null, null, null, null],
];

const CLUES = {
  top: [3, 3, 2, 3, 1],
  right: [1, 3, 4, 2, 3],
  bottom: [1, 2, 3, 2, 3],
  left: [3, 3, 2, 2, 1],
};

function initialBoard(): (number | null)[][] {
  return GIVENS.map((row) => row.map((cell) => cell));
}

function isGiven(r: number, c: number): boolean {
  return GIVENS[r][c] != null;
}

function visibleCount(line: number[]): number {
  let max = 0;
  let count = 0;
  for (const h of line) {
    if (h > max) {
      max = h;
      count += 1;
    }
  }
  return count;
}

function boardComplete(board: (number | null)[][]): board is number[][] {
  return board.every((row) => row.every((cell) => cell != null && cell >= 1));
}

function BuildingGlyph({ height }: { height: number }) {
  const barClass = [
    "h-1",
    "h-1.5",
    "h-2",
    "h-2.5",
    "h-3",
  ] as const;

  return (
    <span className="flex h-[70%] w-[40%] flex-col-reverse items-stretch justify-start gap-[2px]">
      {barClass.map((cls, i) => {
        const level = i + 1;
        const on = level <= height;
        return (
          <span
            key={level}
            aria-hidden
            className={`block w-full rounded-[1px] ${cls} ${
              on
                ? "bg-[#CA3E47]"
                : "bg-white/10 dark:bg-gray-400/25"
            }`}
          />
        );
      })}
    </span>
  );
}

export default function SkylineLab() {
  const reduceMotion = useReducedMotion();
  const [board, setBoard] = useState<(number | null)[][]>(initialBoard);
  const [status, setStatus] = useState<"idle" | "ok" | "bad">("idle");
  const [boardIn, setBoardIn] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setBoardIn(true);
      return;
    }
    const id = window.setTimeout(() => setBoardIn(true), 120);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  const filled = useMemo(
    () => board.flat().filter((c) => c != null).length,
    [board],
  );

  const cycle = (r: number, c: number) => {
    if (isGiven(r, c)) return;
    setStatus("idle");
    setBoard((prev) => {
      const next = prev.map((row) => [...row]);
      const cur = next[r][c];
      next[r][c] = cur == null ? 1 : cur >= SIZE ? null : cur + 1;
      return next;
    });
  };

  const check = () => {
    if (!boardComplete(board)) {
      setStatus("bad");
      return;
    }
    for (let i = 0; i < SIZE; i++) {
      const row = board[i] as number[];
      const col = board.map((r) => r[i] as number);
      if (new Set(row).size !== SIZE || new Set(col).size !== SIZE) {
        setStatus("bad");
        return;
      }
    }
    for (let i = 0; i < SIZE; i++) {
      const row = board[i] as number[];
      const col = board.map((r) => r[i] as number);
      if (visibleCount(row) !== CLUES.left[i]) {
        setStatus("bad");
        return;
      }
      if (visibleCount([...row].reverse()) !== CLUES.right[i]) {
        setStatus("bad");
        return;
      }
      if (visibleCount(col) !== CLUES.top[i]) {
        setStatus("bad");
        return;
      }
      if (visibleCount([...col].reverse()) !== CLUES.bottom[i]) {
        setStatus("bad");
        return;
      }
    }
    setStatus("ok");
  };

  const reveal = () => {
    setBoard(SOLUTION.map((row) => [...row]));
    setStatus("ok");
  };

  const reset = () => {
    setBoard(initialBoard());
    setStatus("idle");
  };

  const clueClass =
    "flex h-8 w-8 items-center justify-center font-mono-ui text-[11px] tabular-nums text-[var(--accent-text)] sm:h-9 sm:w-9 sm:text-xs";

  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Tutorial · 5×5
        </p>
        <p className="font-mono-ui text-[10px] tabular-nums tracking-wider text-[var(--text-muted)]">
          {filled}/{SIZE * SIZE}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
        Edge numbers = buildings visible looking in. Taller ones hide shorter
        ones behind. Tap a cell to cycle height 1–{SIZE}. Locked cells are
        givens.
      </p>

      <div className="mt-8 flex justify-center overflow-x-auto pb-1">
        <div
          className="grid shrink-0 gap-1 sm:gap-1.5"
          style={{
            gridTemplateColumns: `1.75rem repeat(${SIZE}, minmax(2.4rem, 2.75rem)) 1.75rem`,
            gridTemplateRows: `1.75rem repeat(${SIZE}, minmax(2.4rem, 2.75rem)) 1.75rem`,
          }}>
          <span />
          {CLUES.top.map((n, i) => (
            <span key={`t-${i}`} className={clueClass}>
              {n}
            </span>
          ))}
          <span />

          {board.map((row, r) => (
            <div key={`row-${r}`} className="contents">
              <span className={clueClass}>{CLUES.left[r]}</span>
              {row.map((cell, c) => {
                const given = isGiven(r, c);
                return (
                  <motion.button
                    key={`${r}-${c}`}
                    type="button"
                    disabled={given}
                    onClick={() => cycle(r, c)}
                    aria-label={`Row ${r + 1} column ${c + 1}, height ${cell ?? "empty"}${given ? ", given" : ""}`}
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            transform: "translateY(12px) scale(0.88)",
                          }
                    }
                    animate={
                      boardIn
                        ? { opacity: 1, transform: "translateY(0px) scale(1)" }
                        : {
                            opacity: 0,
                            transform: "translateY(12px) scale(0.88)",
                          }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            duration: 0.45,
                            bounce: 0.35,
                            delay: 0.04 * (r * SIZE + c),
                          }
                    }
                    whileTap={
                      given || reduceMotion ? undefined : { scale: 0.94 }
                    }
                    className={`relative flex h-full min-h-[2.4rem] w-full min-w-[2.4rem] flex-col items-center justify-end gap-0.5 rounded-md border pb-1 pt-1.5 font-mono-ui text-[10px] tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] sm:min-h-[2.75rem] sm:min-w-[2.75rem] sm:text-[11px] ${
                      given
                        ? "cursor-default border-[#CA3E47]/35 bg-[#CA3E47]/10 text-white dark:text-gray-900"
                        : "border-white/15 bg-white/[0.04] text-white hover:border-[#CA3E47]/50 dark:border-gray-400/45 dark:bg-gray-200/25 dark:text-gray-900"
                    } ${status === "ok" ? "border-[#CA3E47]/55" : ""}`}>
                    {cell != null ? (
                      <>
                        <BuildingGlyph height={cell} />
                        <span className="leading-none opacity-90">{cell}</span>
                      </>
                    ) : (
                      <span className="mb-2 text-white/25 dark:text-gray-500">
                        ·
                      </span>
                    )}
                  </motion.button>
                );
              })}
              <span className={clueClass}>{CLUES.right[r]}</span>
            </div>
          ))}

          <span />
          {CLUES.bottom.map((n, i) => (
            <span key={`b-${i}`} className={clueClass}>
              {n}
            </span>
          ))}
          <span />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={check} className="btn-primary">
          Check board
        </button>
        <button type="button" onClick={reset} className="btn-secondary">
          Reset
        </button>
        <button type="button" onClick={reveal} className="btn-secondary">
          Reveal
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status !== "idle" ? (
          <motion.p
            key={status}
            role="status"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className={`mt-6 text-sm font-medium ${
              status === "ok"
                ? "text-[#CA3E47]"
                : "text-gray-200 dark:text-gray-800"
            }`}>
            {status === "ok"
              ? "Solved — same 5×5 loop as the daily puzzle, seeded by the calendar date in the real app."
              : "Not yet — unique heights per row/column, and every edge clue must match."}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
