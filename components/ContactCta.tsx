import { introBookingHref, site } from "@/lib/site";
import Link from "next/link";
import Reveal from "./Reveal";

export default function ContactCta() {
  const bookingHref = introBookingHref();
  const bookingIsCal = Boolean(site.calUrl);

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 sm:py-32 text-center">
      <Reveal>
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          What&apos;s next?
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl dark:text-gray-900 [text-wrap:balance]">
          Let&apos;s build something useful.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-gray-300 dark:text-gray-700 sm:text-lg max-w-2xl mx-auto">
          Frontend roles, scoped product work through TemCraft, or teaching —
          book a short intro or write with what you need.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={bookingHref}
            {...(bookingIsCal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="btn-primary w-full sm:w-auto">
            Book a 15-min intro
          </a>
          <Link
            href="/contact"
            className="font-mono-ui min-h-11 text-[13px] tracking-wider text-[var(--text-muted)] hover:text-[var(--accent-text)] transition-colors py-3 px-6">
            Or send a message
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
