"use client";

import { sendContactMessage } from "@/app/contact/actions";
import LetterEnvelopeCinema, {
  type LetterPayload,
} from "@/components/contact/LetterEnvelopeCinema";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Phase = "form" | "packing" | "returning" | "success";

/** Strong ease-out — animate skill token (not built-in easeOut). */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const PENDING_HOLD_MS = 2000;
const CINEMA_SEEN_KEY = "contact-cinema-seen";

const formPanel = {
  initial: { opacity: 0, transform: "translateY(12px)" },
  animate: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transform: "translateY(-10px) scale(0.985)",
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

const successPanel = {
  initial: { opacity: 0, transform: "translateY(16px) scale(0.96)" },
  animate: {
    opacity: 1,
    transform: "translateY(0px) scale(1)",
    transition: { duration: 0.52, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transform: "translateY(-8px) scale(0.98)",
    transition: { duration: 0.28, ease: EASE_OUT },
  },
};

const packingPanel = {
  initial: { opacity: 0, transform: "translateY(12px) scale(0.98)" },
  animate: {
    opacity: 1,
    transform: "translateY(0px) scale(1)",
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    transform: "translateY(-8px) scale(0.98)",
    transition: { duration: 0.28, ease: EASE_OUT },
  },
};

const successContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const successItem = {
  hidden: { opacity: 0, transform: "translateY(14px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.48, ease: EASE_OUT },
  },
};

const checkSpring = {
  type: "spring" as const,
  duration: 0.55,
  bounce: 0.18,
};

function hasSeenCinema(): boolean {
  try {
    return sessionStorage.getItem(CINEMA_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markCinemaSeen() {
  try {
    sessionStorage.setItem(CINEMA_SEEN_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}

export default function ContactFormPanel() {
  const reduceMotion = useReducedMotion();
  const successTitleId = useId();
  const sendAnotherRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef(false);
  const cinemaDoneRef = useRef<((result: "sent" | "returned") => void) | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [phase, setPhase] = useState<Phase>("form");
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [payload, setPayload] = useState<LetterPayload | null>(null);

  useEffect(() => {
    if (phase === "success") {
      const id = window.requestAnimationFrame(() => {
        sendAnotherRef.current?.focus({ preventScroll: true });
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, [phase]);

  const restoreFormAfterReturn = useCallback(() => {
    abortRef.current = true;
    setSending(false);
    setSendFailed(false);
    setPhase("form");
    setPayload(null);
    toast.error("Returned to sender — please try again.");
  }, []);

  const onCinemaComplete = useCallback((result: "sent" | "returned") => {
    cinemaDoneRef.current?.(result);
    cinemaDoneRef.current = null;
  }, []);

  const goSuccess = useCallback(() => {
    markCinemaSeen();
    reset();
    setSending(false);
    setSendFailed(false);
    setPayload(null);
    setPhase("success");
  }, [reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    abortRef.current = false;
    setSendFailed(false);
    setSending(true);
    setPayload(data);

    let emailOk: boolean | null = null;
    const emailPromise = sendContactMessage(data)
      .then((result) => {
        emailOk = result.ok;
      })
      .catch(() => {
        emailOk = false;
      });

    const skipCinema = reduceMotion || hasSeenCinema();

    if (skipCinema) {
      await emailPromise;
      if (emailOk) {
        goSuccess();
      } else {
        setSending(false);
        setPayload(null);
        toast.error("Something went wrong. Please try again.");
      }
      return;
    }

    setPhase("packing");

    const cinemaPromise = new Promise<"sent" | "returned">((resolve) => {
      cinemaDoneRef.current = resolve;
    });

    // Fail mid-cinema → interrupt into return beat
    void emailPromise.finally(() => {
      if (emailOk === false && !abortRef.current) {
        setSendFailed(true);
      }
    });

    const cinemaResult = await cinemaPromise;
    if (abortRef.current) return;

    if (cinemaResult === "returned") {
      restoreFormAfterReturn();
      return;
    }

    if (emailOk === false) {
      setSendFailed(true);
      setPhase("returning");
      return;
    }

    if (emailOk === null) {
      await Promise.race([
        emailPromise,
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, PENDING_HOLD_MS);
        }),
      ]);
      if (abortRef.current) return;
    }

    if (emailOk) {
      goSuccess();
      return;
    }

    setSendFailed(true);
    setPhase("returning");
  };

  const onReturningComplete = useCallback(
    (result: "sent" | "returned") => {
      if (result === "returned") restoreFormAfterReturn();
    },
    [restoreFormAfterReturn],
  );

  const sendAnother = () => {
    abortRef.current = false;
    setSendFailed(false);
    setPayload(null);
    reset();
    setPhase("form");
  };

  const successCardClassName =
    "relative flex min-h-[28rem] flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] px-8 py-12 dark:border-gray-300/80 dark:bg-gray-900/[0.03]";

  if (reduceMotion) {
    return (
      <div className="min-h-[28rem]">
        {phase === "form" ||
        phase === "packing" ||
        phase === "returning" ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <ContactFields
              register={register}
              errors={errors}
              sending={sending}
            />
          </form>
        ) : (
          <div
            role="status"
            aria-live="polite"
            aria-labelledby={successTitleId}
            className={successCardClassName}>
            <div className="mx-auto max-w-sm text-center">
              <ContactSuccess
                titleId={successTitleId}
                onSendAnother={sendAnother}
                sendAnotherRef={sendAnotherRef}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-[28rem]">
      <AnimatePresence mode="wait">
        {phase === "form" ? (
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={formPanel.initial}
            animate={formPanel.animate}
            exit={formPanel.exit}>
            <ContactFields
              register={register}
              errors={errors}
              sending={sending}
            />
          </motion.form>
        ) : null}

        {phase === "packing" && payload ? (
          <motion.div
            key="contact-packing"
            initial={packingPanel.initial}
            animate={packingPanel.animate}
            exit={packingPanel.exit}>
            <LetterEnvelopeCinema
              payload={payload}
              mode="send"
              failed={sendFailed}
              onComplete={onCinemaComplete}
            />
          </motion.div>
        ) : null}

        {phase === "returning" && payload ? (
          <motion.div
            key="contact-returning"
            initial={packingPanel.initial}
            animate={packingPanel.animate}
            exit={packingPanel.exit}>
            <LetterEnvelopeCinema
              payload={payload}
              mode="return"
              onComplete={onReturningComplete}
            />
          </motion.div>
        ) : null}

        {phase === "success" ? (
          <motion.div
            key="contact-success"
            role="status"
            aria-live="polite"
            aria-labelledby={successTitleId}
            initial={successPanel.initial}
            animate={successPanel.animate}
            exit={successPanel.exit}
            className={successCardClassName}>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-[#CA3E47]/12 via-transparent to-transparent opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
            />
            <motion.div
              variants={successContainer}
              initial="hidden"
              animate="show"
              className="relative mx-auto max-w-sm text-center">
              <ContactSuccess
                titleId={successTitleId}
                onSendAnother={sendAnother}
                sendAnotherRef={sendAnotherRef}
                animated
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ContactSuccess({
  titleId,
  onSendAnother,
  sendAnotherRef,
  animated = false,
}: {
  titleId: string;
  onSendAnother: () => void;
  sendAnotherRef: RefObject<HTMLButtonElement | null>;
  animated?: boolean;
}) {
  const Item = animated ? motion.div : "div";
  const itemProps = animated ? { variants: successItem } : {};

  return (
    <>
      <Item {...itemProps} className="mx-auto flex justify-center">
        <span className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center">
          {animated ? (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[#CA3E47]/25"
              initial={{ opacity: 0.55, transform: "scale(0.88)" }}
              animate={{ opacity: 0, transform: "scale(1.45)" }}
              transition={{ duration: 0.75, ease: EASE_OUT }}
            />
          ) : null}
          {animated ? (
            <motion.span
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#CA3E47]/15 ring-1 ring-[#CA3E47]/40"
              initial={{ opacity: 0, transform: "scale(0.92) translateY(6px)" }}
              animate={{ opacity: 1, transform: "scale(1) translateY(0px)" }}
              transition={checkSpring}>
              <Check
                className="h-8 w-8 text-[#CA3E47]"
                strokeWidth={2.25}
                aria-hidden
              />
            </motion.span>
          ) : (
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#CA3E47]/15 ring-1 ring-[#CA3E47]/40">
              <Check
                className="h-8 w-8 text-[#CA3E47]"
                strokeWidth={2.25}
                aria-hidden
              />
            </span>
          )}
        </span>
      </Item>
      <Item {...itemProps}>
        <p className="font-mono-ui mt-8 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Message sent
        </p>
        <h2
          id={titleId}
          className="mt-3 text-2xl font-semibold tracking-tight [text-wrap:balance] dark:text-gray-900 sm:text-3xl">
          Thanks — I got it.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-300 dark:text-gray-700">
          I usually reply within a couple of days. If it is urgent, email{" "}
          <a
            href="mailto:contact@muratoncu.com"
            className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
            contact@muratoncu.com
          </a>{" "}
          directly.
        </p>
      </Item>
      <Item {...itemProps} className="mt-10">
        <Button
          ref={sendAnotherRef}
          type="button"
          variant="outline"
          size="lg"
          onClick={onSendAnother}
          className="w-full rounded-full uppercase tracking-widest">
          Send another message
        </Button>
      </Item>
    </>
  );
}

function ContactFields({
  register,
  errors,
  sending,
}: {
  register: ReturnType<typeof useForm<Inputs>>["register"];
  errors: ReturnType<typeof useForm<Inputs>>["formState"]["errors"];
  sending: boolean;
}) {
  return (
    <FieldGroup className="[&_[aria-invalid=true]]:border-destructive">
      <div className="grid gap-7 sm:grid-cols-2">
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            disabled={sending}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <FieldError id="contact-name-error">{errors.name.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={sending}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <FieldError id="contact-email-error">
              {errors.email.message}
            </FieldError>
          )}
        </Field>
      </div>

      <Field data-invalid={errors.subject ? true : undefined}>
        <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
        <Input
          id="contact-subject"
          type="text"
          placeholder="What this is about"
          disabled={sending}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={
            errors.subject ? "contact-subject-error" : undefined
          }
          {...register("subject", { required: "Subject is required" })}
        />
        {errors.subject && (
          <FieldError id="contact-subject-error">
            {errors.subject.message}
          </FieldError>
        )}
      </Field>

      <Field data-invalid={errors.message ? true : undefined}>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="What do you need?"
          className="resize-none"
          disabled={sending}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          {...register("message", { required: "Message is required" })}
        />
        {errors.message && (
          <FieldError id="contact-message-error">
            {errors.message.message}
          </FieldError>
        )}
      </Field>

      <Field>
        <motion.div
          animate={
            sending
              ? { opacity: 0.88, transform: "scale(0.995)" }
              : { opacity: 1, transform: "scale(1)" }
          }
          transition={{ duration: 0.16, ease: EASE_OUT }}>
          <Button
            type="submit"
            size="lg"
            disabled={sending}
            className="w-full rounded-full uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </motion.div>
      </Field>
    </FieldGroup>
  );
}
