"use client";

import {
  CHOOSE_LAB_LIVES,
  CHOOSE_LAB_ROUNDS,
  CHOOSE_LAB_SECONDS,
} from "@/data/lab-choose";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING_POP = { type: "spring" as const, duration: 0.45, bounce: 0.35 };
const FEEDBACK_HOLD_MS = 1100;

type Phase = "intro" | "play" | "feedback" | "done";

function Hearts({ lives, max }: { lives: number; max: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`${lives} lives left`}>
      {Array.from({ length: max }, (_, i) => {
        const on = i < lives;
        return (
          <motion.span
            key={i}
            aria-hidden
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              on ? "bg-[#CA3E47]" : "bg-white/15 dark:bg-gray-400/40"
            }`}
            animate={on ? { scale: 1 } : { scale: 0.85, opacity: 0.45 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          />
        );
      })}
    </div>
  );
}

export default function ChooseLab() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(CHOOSE_LAB_LIVES);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lastOk, setLastOk] = useState<boolean | null>(null);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CHOOSE_LAB_SECONDS);
  const [shake, setShake] = useState(false);
  const livesRef = useRef(CHOOSE_LAB_LIVES);
  const advanceTimer = useRef<number | null>(null);

  const round = CHOOSE_LAB_ROUNDS[index];
  const total = CHOOSE_LAB_ROUNDS.length;
  const progress =
    phase === "intro"
      ? 0
      : phase === "done"
        ? 100
        : ((index + (phase === "feedback" ? 1 : 0)) / total) * 100;

  const clearAdvance = () => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  const start = () => {
    clearAdvance();
    livesRef.current = CHOOSE_LAB_LIVES;
    setPhase("play");
    setIndex(0);
    setScore(0);
    setLives(CHOOSE_LAB_LIVES);
    setCombo(0);
    setBestCombo(0);
    setLastOk(null);
    setPickedId(null);
    setTimedOut(false);
    setSecondsLeft(CHOOSE_LAB_SECONDS);
    setShake(false);
  };

  const goDone = useCallback(() => {
    clearAdvance();
    setPhase("done");
  }, []);

  const advance = useCallback(() => {
    clearAdvance();
    if (livesRef.current <= 0 || index + 1 >= total) {
      goDone();
      return;
    }
    setIndex((i) => i + 1);
    setPhase("play");
    setLastOk(null);
    setPickedId(null);
    setTimedOut(false);
    setSecondsLeft(CHOOSE_LAB_SECONDS);
    setShake(false);
  }, [goDone, index, total]);

  const resolvePick = useCallback(
    (choiceId: string | null, scored: boolean, fromTimeout = false) => {
      if (phase !== "play") return;
      setPickedId(choiceId);
      setTimedOut(fromTimeout);
      setLastOk(scored);

      if (scored) {
        setScore((s) => s + 1);
        setCombo((c) => {
          const next = c + 1;
          setBestCombo((b) => Math.max(b, next));
          return next;
        });
      } else {
        const nextLives = Math.max(0, livesRef.current - 1);
        livesRef.current = nextLives;
        setLives(nextLives);
        setCombo(0);
        if (!reduceMotion) {
          setShake(true);
          window.setTimeout(() => setShake(false), 420);
        }
      }

      setPhase("feedback");
      clearAdvance();
      advanceTimer.current = window.setTimeout(() => {
        if (livesRef.current <= 0 || index + 1 >= total) {
          goDone();
        } else {
          advance();
        }
      }, reduceMotion ? 400 : FEEDBACK_HOLD_MS);
    },
    [advance, goDone, index, phase, reduceMotion, total],
  );

  // Round timer
  useEffect(() => {
    if (phase !== "play" || reduceMotion) return;
    setSecondsLeft(CHOOSE_LAB_SECONDS);
    const started = Date.now();
    const id = window.setInterval(() => {
      const left = Math.max(
        0,
        CHOOSE_LAB_SECONDS - Math.floor((Date.now() - started) / 1000),
      );
      setSecondsLeft(left);
      if (left <= 0) {
        window.clearInterval(id);
        resolvePick(null, false, true);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [phase, index, reduceMotion, resolvePick]);

  useEffect(() => () => clearAdvance(), []);

  const timerPct = (secondsLeft / CHOOSE_LAB_SECONDS) * 100;

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Persistent HUD once playing */}
      {phase !== "intro" ? (
        <div className="mb-8 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Hearts lives={lives} max={CHOOSE_LAB_LIVES} />
            <div className="flex items-center gap-3 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {combo > 1 ? (
                <motion.span
                  key={combo}
                  initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_POP}
                  className="text-[var(--accent-text)]">
                  ×{combo} combo
                </motion.span>
              ) : null}
              <span className="tabular-nums text-white dark:text-gray-900">
                {score}
                <span className="text-[var(--text-muted)]"> pts</span>
              </span>
            </div>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10 dark:bg-gray-400/30">
            <motion.div
              className="h-full rounded-full bg-[#CA3E47]"
              initial={false}
              animate={{ width: `${Math.min(100, progress || (index / total) * 100)}%` }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            />
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div
            key="intro"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
            className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#CA3E47]/40 bg-[#CA3E47]/10">
              <span className="font-mono-ui text-lg font-semibold tracking-widest text-[#CA3E47]">
                ✕
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight dark:text-gray-900 sm:text-4xl">
              Wrong is right
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gray-300 dark:text-gray-700">
              The CHOOSE rule, compressed: tap the{" "}
              <span className="text-white dark:text-gray-900">incorrect</span>{" "}
              option to score. Tap the correct one — or run out of time — and
              you burn a life. Combos reward streaks.
            </p>
            <ul className="mx-auto mt-6 grid max-w-xs gap-2 text-left text-sm text-gray-400 dark:text-gray-600">
              <li className="flex justify-between border-t border-white/10 pt-2 dark:border-gray-400/40">
                <span>Rounds</span>
                <span className="tabular-nums text-gray-200 dark:text-gray-800">
                  {total}
                </span>
              </li>
              <li className="flex justify-between border-t border-white/10 pt-2 dark:border-gray-400/40">
                <span>Lives</span>
                <span className="tabular-nums text-gray-200 dark:text-gray-800">
                  {CHOOSE_LAB_LIVES}
                </span>
              </li>
              <li className="flex justify-between border-t border-white/10 pt-2 dark:border-gray-400/40">
                <span>Timer</span>
                <span className="tabular-nums text-gray-200 dark:text-gray-800">
                  {CHOOSE_LAB_SECONDS}s / round
                </span>
              </li>
            </ul>
            <button type="button" onClick={start} className="btn-primary mt-8">
              Play the demo
            </button>
            <p className="mt-5 text-sm text-gray-500 dark:text-gray-600">
              <Link
                href="/work/choose-game"
                className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
                Full CHOOSE case study →
              </Link>
            </p>
          </motion.div>
        ) : null}

        {phase === "play" || phase === "feedback" ? (
          <motion.div
            key={`round-${round.id}-${index}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={
              shake
                ? { opacity: 1, x: [0, -6, 6, -4, 4, 0], y: 0 }
                : { opacity: 1, x: 0, y: 0 }
            }
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: shake ? 0.4 : 0.35, ease: EASE_OUT }}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
                {round.category}
              </p>
              {!reduceMotion && phase === "play" ? (
                <p
                  className={`font-mono-ui text-[11px] tabular-nums tracking-wider ${
                    secondsLeft <= 3
                      ? "text-[#CA3E47]"
                      : "text-[var(--text-muted)]"
                  }`}>
                  {secondsLeft}s
                </p>
              ) : (
                <p className="font-mono-ui text-[11px] text-[var(--text-muted)]">
                  {index + 1}/{total}
                </p>
              )}
            </div>

            {!reduceMotion && phase === "play" ? (
              <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/10 dark:bg-gray-400/30">
                <motion.div
                  className="h-full origin-left rounded-full bg-white/50 dark:bg-gray-700"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: timerPct / 100 }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
              </div>
            ) : null}

            <h2 className="mt-5 text-2xl font-semibold tracking-tight [text-wrap:balance] dark:text-gray-900 sm:text-[1.75rem]">
              {round.prompt}
            </h2>
            <p className="mt-2 font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Tap the wrong answer
            </p>

            <ul className="mt-7 grid gap-2.5">
              {round.choices.map((choice, i) => {
                const selected = pickedId === choice.id;
                const revealing = phase === "feedback";
                const isTrap = revealing && choice.correct;
                const isWin = revealing && selected && lastOk === true;
                const isLose =
                  revealing &&
                  ((selected && lastOk === false) || (timedOut && choice.correct));

                return (
                  <motion.li
                    key={choice.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      ease: EASE_OUT,
                      delay: reduceMotion ? 0 : i * 0.04,
                    }}>
                    <button
                      type="button"
                      disabled={phase !== "play"}
                      onClick={() => resolvePick(choice.id, !choice.correct)}
                      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-[border-color,background-color,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] disabled:cursor-default ${
                        isWin
                          ? "border-[#CA3E47] bg-[#CA3E47]/20 text-white dark:text-gray-900"
                          : isLose || isTrap
                            ? "border-white/20 bg-white/[0.03] text-gray-500 line-through decoration-white/30 dark:border-gray-400/40 dark:text-gray-500"
                            : "border-white/12 bg-white/[0.03] text-gray-100 hover:-translate-y-0.5 hover:border-[#CA3E47]/45 dark:border-gray-400/35 dark:bg-gray-200/25 dark:text-gray-900 dark:hover:border-[#CA3E47]/55"
                      }`}>
                      <span className="font-mono-ui flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-[10px] uppercase tracking-wider text-[var(--text-muted)] dark:border-gray-400/40">
                        {choice.id}
                      </span>
                      <span className="flex-1 leading-snug">{choice.label}</span>
                      {isWin ? (
                        <motion.span
                          initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={SPRING_POP}
                          className="font-mono-ui text-[10px] uppercase tracking-wider text-[#CA3E47]">
                          +1
                        </motion.span>
                      ) : null}
                      {isTrap && !selected ? (
                        <span className="font-mono-ui text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                          trap
                        </span>
                      ) : null}
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {phase === "feedback" ? (
              <motion.p
                role="status"
                aria-live="polite"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center text-sm font-medium text-gray-200 dark:text-gray-800">
                {timedOut
                  ? "Time — life lost."
                  : lastOk
                    ? combo > 1
                      ? `Wrong answer. Combo ×${combo}.`
                      : "Wrong answer. Point."
                    : livesRef.current > 0
                      ? "That was correct — life lost."
                      : "Out of lives."}
              </motion.p>
            ) : null}
          </motion.div>
        ) : null}

        {phase === "done" ? (
          <motion.div
            key="done"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="text-center">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Run complete
            </p>
            <h2 className="mt-3 text-5xl font-semibold tracking-tight tabular-nums dark:text-gray-900">
              {score}
              <span className="text-2xl text-[var(--text-muted)]">/{total}</span>
            </h2>
            {bestCombo > 1 ? (
              <p className="mt-2 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Best combo ×{bestCombo}
              </p>
            ) : null}
            <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-gray-300 dark:text-gray-700">
              {score >= 5
                ? "You internalized the inverted rule. The real game adds Classic, Endless, Timer, and a live leaderboard."
                : score >= 3
                  ? "Solid instincts. CHOOSE layers bilingual play and cloud sync on this core loop."
                  : "Counterintuitive on purpose — that friction is the product hook."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={start} className="btn-primary">
                Run it again
              </button>
              <Link href="/work/choose-game" className="btn-secondary">
                Case study
              </Link>
              <a
                href="https://choosegame.muratoncu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary">
                Play full CHOOSE
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
