import Reveal from "@/components/Reveal";
import { HIRE_ENGAGEMENTS, HIRE_STEPS } from "@/data/hire";
import { getResumeHref } from "@/lib/resume";
import { introBookingHref, site } from "@/lib/site";
import Link from "next/link";

export default function Hire() {
  const bookingHref = introBookingHref();
  const bookingIsCal = Boolean(site.calUrl);
  const resumeHref = getResumeHref();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Hire
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight [text-wrap:balance] sm:text-4xl md:text-5xl dark:text-gray-900">
          How we can work together
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 dark:text-gray-700">
          Frontend roles, scoped product work through TemCraft, or teaching.
          Pick the path that matches — then book a short intro or write with
          what you need.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={bookingHref}
            {...(bookingIsCal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="btn-primary">
            Book a 15-min intro
          </a>
          <Link href="/contact" className="btn-secondary">
            Send a message
          </Link>
          {resumeHref ? (
            <a href={resumeHref} download className="btn-secondary">
              Download résumé
            </a>
          ) : null}
        </div>
      </Reveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {HIRE_ENGAGEMENTS.map((engagement, index) => (
          <Reveal key={engagement.id} delay={Math.min(index, 2) * 0.05}>
            <article className="flex h-full flex-col border-t border-white/10 pt-6 dark:border-gray-400/40">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
                {engagement.id}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight dark:text-gray-900">
                {engagement.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                {engagement.summary}
              </p>
              <div className="mt-6">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Good fit when
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                  {engagement.fit.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Send me
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                  {engagement.send.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight dark:text-gray-900">
          What happens next
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300 dark:text-gray-700">
          A simple process — no forms maze, no fake scarcity.
        </p>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {HIRE_STEPS.map((item) => (
            <li
              key={item.step}
              className="border-t border-white/10 pt-6 dark:border-gray-400/40">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
                Step {item.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold dark:text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                {item.detail}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-20 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight dark:text-gray-900">
          Based in the Netherlands
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
          Open to NL, EU, and remote. Prefer email or a booked intro over cold
          LinkedIn pitches with no role context. Reach me at{" "}
          <a
            href={`mailto:${site.email}`}
            className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
            {site.email}
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
