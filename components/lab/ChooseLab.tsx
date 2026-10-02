"use client";

import { CHOOSE_LAB_LIVES, CHOOSE_LAB_ROUNDS } from "@/data/lab-choose";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useState } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type Phase = "intro" | "play" | "feedback" | "done";

export default function ChooseLab() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(CHOOSE_LAB_LIVES);
  const [lastOk, setLastOk] = useState<boolean | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const round = CHOOSE_LAB_ROUNDS[index];
  const total = CHOOSE_LAB_ROUNDS.length;

  const start = () => {
    setPhase("play");
    setIndex(0);
    setScore(0);
    setLives(CHOOSE_LAB_LIVES);
    setLastOk(null);
    setPickedId(null);
  };

  const advance = useCallback(() => {
    const next = index + 1;
    if (lives <= 0 || next >= total) {
      setPhase("done");
      return;
    }
    setIndex(next);
    setPhase("play");
    setLastOk(null);
    setPickedId(null);
  }, [index, lives, total]);

  const pick = (choiceId: string, correct: boolean) => {
    if (phase !== "play") return;
    setPickedId(choiceId);
    // CHOOSE rule: wrong answer = score; right answer = lose a life
    const scored = !correct;
    setLastOk(scored);
    if (scored) {
      setScore((s) => s + 1);
    } else {
      setLives((l) => Math.max(0, l - 1));
    }
    setPhase("feedback");
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div
            key="intro"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="text-center">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Lab · CHOOSE
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight dark:text-gray-900 sm:text-3xl">
              Pick the wrong answer
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-300 dark:text-gray-700">
              A tiny demo of the CHOOSE rule: score when you pick the{" "}
              <span className="text-white dark:text-gray-900">incorrect</span>{" "}
              option. Pick the correct one and you lose a life.{" "}
              {total} rounds · {CHOOSE_LAB_LIVES} lives.
            </p>
            <button
              type="button"
              onClick={start}
              className="btn-primary mt-8">
              Start demo
            </button>
            <p className="mt-6 text-sm text-gray-400 dark:text-gray-600">
              Full product:{" "}
              <Link
                href="/work/choose-game"
                className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
                CHOOSE case study
              </Link>
            </p>
          </motion.div>
        ) : null}

        {phase === "play" || phase === "feedback" ? (
          <motion.div
            key={`round-${round.id}`}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}>
            <div className="flex items-center justify-between gap-4 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <span>
                Round {index + 1}/{total}
              </span>
              <span className="tabular-nums">
                Score {score} · Lives {lives}
              </span>
            </div>

            <h2 className="mt-6 text-xl font-semibold tracking-tight [text-wrap:balance] dark:text-gray-900 sm:text-2xl">
              {round.prompt}
            </h2>
            <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
              Choose the wrong answer
            </p>

            <ul className="mt-8 grid gap-3">
              {round.choices.map((choice) => {
                const selected = pickedId === choice.id;
                const showResult = phase === "feedback" && selected;
                const won = showResult && lastOk === true;
                const lost = showResult && lastOk === false;

                return (
                  <li key={choice.id}>
                    <button
                      type="button"
                      disabled={phase !== "play"}
                      onClick={() => pick(choice.id, choice.correct)}
                      className={`w-full rounded-lg border px-4 py-3.5 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] disabled:cursor-default ${
                        won
                          ? "border-[#CA3E47]/60 bg-[#CA3E47]/15 text-white dark:text-gray-900"
                          : lost
                            ? "border-white/20 bg-white/[0.04] text-gray-400 dark:border-gray-400/50 dark:text-gray-600"
                            : "border-white/15 bg-white/[0.03] text-gray-200 hover:border-[#CA3E47]/40 dark:border-gray-400/40 dark:bg-gray-200/20 dark:text-gray-800 dark:hover:border-[#CA3E47]/50"
                      }`}>
                      <span className="font-mono-ui mr-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        {choice.id}
                      </span>
                      {choice.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {phase === "feedback" ? (
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className="text-sm font-medium"
                  role="status"
                  aria-live="polite">
                  {lastOk
                    ? "Nice — wrong answer. Point scored."
                    : lives > 0
                      ? "That was the correct answer — life lost."
                      : "Out of lives."}
                </p>
                <button type="button" onClick={advance} className="btn-primary">
                  {lives <= 0 || index + 1 >= total ? "See result" : "Next round"}
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}

        {phase === "done" ? (
          <motion.div
            key="done"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="text-center">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Demo complete
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight dark:text-gray-900">
              Score {score}/{total}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-300 dark:text-gray-700">
              {score >= 4
                ? "You get the inverted rule. The real game adds modes, combos, and a leaderboard."
                : score >= 2
                  ? "Solid. The full CHOOSE product layers power-ups and bilingual play on top of this idea."
                  : "The trick is counterintuitive on purpose — that is the product hook."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button type="button" onClick={start} className="btn-primary">
                Play again
              </button>
              <Link href="/work/choose-game" className="btn-secondary">
                Read the case study
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
