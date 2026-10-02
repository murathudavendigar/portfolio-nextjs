"use client";

import { site } from "@/lib/site";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type LetterPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type CinemaMode = "send" | "return";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const SEAL_SPRING = {
  type: "spring" as const,
  duration: 0.55,
  bounce: 0.38,
};

/** Beat timestamps from cinema start (ms). Address after flap so names never get covered. */
const BEATS = {
  letter: 0,
  insert: 600,
  flap: 1500,
  seal: 2200,
  address: 2700,
  fly: 4300,
  done: 5300,
} as const;

const RETURN_MS = 1600;

type Beat = keyof typeof BEATS | "return";

type LetterEnvelopeCinemaProps = {
  payload: LetterPayload;
  mode?: CinemaMode;
  /** When true mid-send, interrupt into return-to-sender. */
  failed?: boolean;
  onComplete: (result: "sent" | "returned") => void;
};

function TypeLine({
  text,
  active,
  className,
  staggerMs = 34,
}: {
  text: string;
  active: boolean;
  className?: string;
  staggerMs?: number;
}) {
  const chars = useMemo(() => [...text], [text]);

  return (
    <span className={`block truncate ${className ?? ""}`} aria-hidden={!active}>
      {chars.map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          className="inline"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{
            duration: 0.1,
            ease: EASE_OUT,
            delay: active ? index * (staggerMs / 1000) : 0,
          }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function previewMessage(message: string) {
  const trimmed = message.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 120) return trimmed;
  return `${trimmed.slice(0, 117)}…`;
}

function AddressCard({
  toLine,
  toEmail,
  fromLine,
  fromEmail,
  addressActive,
  showReturnStamp,
}: {
  toLine: string;
  toEmail: string;
  fromLine: string;
  fromEmail: string;
  addressActive: boolean;
  showReturnStamp: boolean;
}) {
  return (
    <div className="absolute bottom-[6%] right-[3%] z-40 w-[min(72%,14.5rem)] sm:bottom-[7%] sm:right-[4%]">
      <div className="rounded-md border border-white/15 bg-black/80 px-3 py-2.5 shadow-md backdrop-blur-sm dark:border-gray-400/50 dark:bg-[#f7f4ee]">
        <div className="font-mono-ui min-w-0 text-[11px] leading-snug text-white sm:text-[12px] dark:text-gray-900">
          <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--accent-text)]">
            To
          </p>
          <TypeLine text={toLine} active={addressActive} />
          <TypeLine
            text={toEmail}
            active={addressActive}
            staggerMs={26}
            className="text-gray-400 dark:text-gray-600"
          />
        </div>
        <div className="font-mono-ui mt-2 min-w-0 border-t border-white/10 pt-2 text-[11px] leading-snug text-white sm:text-[12px] dark:border-gray-400/40 dark:text-gray-900">
          <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--accent-text)]">
            From
          </p>
          <TypeLine text={fromLine} active={addressActive} staggerMs={30} />
          <TypeLine
            text={fromEmail}
            active={addressActive}
            staggerMs={24}
            className="text-gray-400 dark:text-gray-600"
          />
        </div>
      </div>

      <AnimatePresence>
        {showReturnStamp ? (
          <motion.p
            key="return-stamp"
            className="font-mono-ui pointer-events-none absolute -left-2 -top-3 rotate-[-8deg] border-2 border-[#CA3E47] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#CA3E47]"
            initial={{ opacity: 0, transform: "scale(0.85) rotate(-8deg)" }}
            animate={{ opacity: 1, transform: "scale(1) rotate(-8deg)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}>
            Return to sender
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function LetterEnvelopeCinema({
  payload,
  mode = "send",
  failed = false,
  onComplete,
}: LetterEnvelopeCinemaProps) {
  const isReturn = mode === "return";
  const [beat, setBeat] = useState<Beat>(isReturn ? "return" : "letter");
  const [waitingForSend, setWaitingForSend] = useState(false);
  const [sealPressed, setSealPressed] = useState(isReturn);
  const failedRef = useRef(failed);
  const finishedRef = useRef(false);
  failedRef.current = failed;

  const finish = useCallback(
    (result: "sent" | "returned") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onComplete(result);
    },
    [onComplete],
  );

  useEffect(() => {
    if (isReturn) {
      const id = window.setTimeout(() => finish("returned"), RETURN_MS);
      return () => window.clearTimeout(id);
    }

    let cancelled = false;
    const timers: number[] = [];
    const schedule = (ms: number, next: Beat | "complete") => {
      timers.push(
        window.setTimeout(() => {
          if (cancelled || failedRef.current || finishedRef.current) return;
          if (next === "complete") {
            setWaitingForSend(true);
            finish("sent");
            return;
          }
          if (next === "seal") {
            setSealPressed(true);
            setBeat("flap");
            return;
          }
          setBeat(next);
        }, ms),
      );
    };

    schedule(BEATS.insert, "insert");
    schedule(BEATS.flap, "flap");
    schedule(BEATS.seal, "seal");
    schedule(BEATS.address, "address");
    schedule(BEATS.fly, "fly");
    schedule(BEATS.done, "complete");

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
  }, [isReturn, finish]);

  useEffect(() => {
    if (isReturn || !failed) return;
    setBeat("return");
    setSealPressed(true);
    setWaitingForSend(false);
    const id = window.setTimeout(() => finish("returned"), RETURN_MS);
    return () => window.clearTimeout(id);
  }, [failed, isReturn, finish]);

  const returning = beat === "return";
  const showLetter = beat === "letter" || beat === "insert";
  const letterInserted = beat !== "letter";
  // Address only after flap is closed — sits above the flap as a label.
  const addressActive =
    returning || beat === "address" || beat === "fly";
  const flapClosed =
    returning ||
    beat === "flap" ||
    beat === "seal" ||
    beat === "address" ||
    beat === "fly";
  const flying = beat === "fly" && !returning;

  const toLine = site.shortName;
  const toEmail = site.email;
  const fromLine = payload.name.trim() || "Visitor";
  const fromEmail = payload.email.trim();

  const statusLabel = returning
    ? "Returned to sender…"
    : waitingForSend
      ? "Sending…"
      : beat === "letter"
        ? "Folding your message…"
        : beat === "insert"
          ? "Tucking it in…"
          : beat === "flap" || beat === "seal"
            ? "Closing…"
            : beat === "address"
              ? "Writing the address…"
              : beat === "fly"
                ? "On its way…"
                : "";

  return (
    <div
      className="relative flex min-h-[30rem] flex-col items-center justify-center overflow-hidden px-2"
      aria-busy="true"
      aria-live="polite">
      <p className="sr-only">
        {returning ? "Message could not be delivered." : "Sending your message…"}
      </p>

      <motion.div
        className="relative w-full max-w-[360px] sm:max-w-[400px]"
        style={{ perspective: 900 }}
        animate={
          returning
            ? {
                opacity: 1,
                transform: "translate(0px, 12px) scale(1) rotate(-2deg)",
              }
            : flying
              ? {
                  opacity: 0,
                  transform: "translate(56px, -80px) scale(0.9) rotate(7deg)",
                }
              : {
                  opacity: 1,
                  transform: "translate(0px, 0px) scale(1) rotate(0deg)",
                }
        }
        transition={{ duration: returning ? 0.7 : 1.05, ease: EASE_OUT }}>
        <div className="relative mx-auto h-[280px] w-full sm:h-[300px]">
          {/* Back — charcoal on ink, cream on paper */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 z-0 h-[58%] rounded-md border border-white/12 bg-[#2a2a2a] shadow-sm dark:border-gray-400/40 dark:bg-[#ddd6c8]"
          />

          <AnimatePresence>
            {showLetter && !returning ? (
              <motion.div
                key="letter"
                className="absolute left-1/2 z-10 w-[88%] -translate-x-1/2 overflow-hidden rounded-sm border border-neutral-300/80 bg-[#f7f4ee] px-4 py-3.5 shadow-md"
                initial={{
                  opacity: 0,
                  transform: "translateX(-50%) translateY(12px) scale(0.97)",
                }}
                animate={{
                  opacity: letterInserted ? 0.9 : 1,
                  transform: letterInserted
                    ? "translateX(-50%) translateY(118px) scale(0.92)"
                    : "translateX(-50%) translateY(8px) scale(1)",
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.25, ease: EASE_OUT },
                }}
                transition={{ duration: 0.85, ease: EASE_OUT }}>
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  From: {fromLine}
                </p>
                <p className="mt-2 text-[13px] font-semibold leading-snug text-neutral-800">
                  {payload.subject.trim() || "Message"}
                </p>
                <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-neutral-600">
                  {previewMessage(payload.message)}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Front face — no address here; label sits above the flap */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[58%] overflow-hidden rounded-md border border-white/12 bg-[#333] shadow-lg dark:border-gray-400/45 dark:bg-[#e8e1d3]">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden>
              <path
                d="M0 0 L50 28 L100 0"
                fill="none"
                stroke="currentColor"
                className="text-white dark:text-black"
                strokeWidth="0.6"
              />
            </svg>
          </div>

          {/* Shorter flap — tip stays above the address label zone */}
          <motion.div
            className="absolute left-[-1px] right-[-1px] z-30"
            style={{
              top: "42%",
              height: "24%",
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
            }}
            initial={false}
            animate={{
              transform: flapClosed ? "rotateX(0deg)" : "rotateX(-168deg)",
            }}
            transition={{ duration: 0.7, ease: EASE_OUT }}>
            <div
              className="relative h-full w-full"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: flapClosed
                  ? "linear-gradient(180deg, #3a3a3a 0%, #2c2c2c 100%)"
                  : "linear-gradient(180deg, #444 0%, #333 100%)",
                boxShadow: flapClosed
                  ? "0 8px 16px rgba(0,0,0,0.35)"
                  : "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
            <div
              className="absolute inset-0 hidden dark:block"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: flapClosed
                  ? "linear-gradient(180deg, #d8cfbf 0%, #c9bfae 100%)"
                  : "linear-gradient(180deg, #e4dccf 0%, #d2c8b8 100%)",
              }}
            />
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-[62%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CA3E47] shadow-md ring-2 ring-[#CA3E47]/35 sm:h-[1.15rem] sm:w-[1.15rem]"
              initial={false}
              animate={{
                opacity: flapClosed ? 1 : 0,
                transform: sealPressed
                  ? "translateX(-50%) translateY(-50%) scale(1)"
                  : flapClosed
                    ? "translateX(-50%) translateY(-50%) scale(1.35)"
                    : "translateX(-50%) translateY(-50%) scale(0.5)",
              }}
              transition={
                sealPressed
                  ? { ...SEAL_SPRING, delay: 0.05 }
                  : { duration: 0.2, ease: EASE_OUT }
              }
            />
          </motion.div>

          {/* Address label above flap — types after close */}
          <AddressCard
            toLine={toLine}
            toEmail={toEmail}
            fromLine={fromLine}
            fromEmail={fromEmail}
            addressActive={addressActive}
            showReturnStamp={returning}
          />
        </div>
      </motion.div>

      <p className="font-mono-ui mt-8 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {statusLabel}
      </p>
    </div>
  );
}
