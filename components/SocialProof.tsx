import Reveal from "@/components/Reveal";
import { PROOF_SIGNALS, testimonials } from "@/data/proof";

export default function SocialProof() {
  const hasQuotes = testimonials.length > 0;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <Reveal>
        <p className="font-mono-ui text-center text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Proof
        </p>
        <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
          {hasQuotes
            ? "What people say — and where the work lives"
            : "Where the work lives outside this site"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-gray-300 dark:text-gray-700">
          {hasQuotes
            ? "Quotes with permission, plus the public places you can verify shipping and teaching."
            : "No invented testimonials — verify teaching roles, App Store listings, and npm packages yourself."}
        </p>
      </Reveal>

      {hasQuotes ? (
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <Reveal key={item.name}>
              <blockquote className="border-t border-white/10 pt-6 dark:border-gray-400/40">
                <p className="text-base leading-relaxed text-gray-200 dark:text-gray-800 [text-wrap:pretty]">
                  “{item.quote}”
                </p>
                <footer className="mt-4">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white transition-colors hover:text-[var(--accent-text)] dark:text-gray-900">
                      {item.name}
                    </a>
                  ) : (
                    <p className="font-semibold text-white dark:text-gray-900">
                      {item.name}
                    </p>
                  )}
                  <p className="mt-1 font-mono-ui text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {item.role}
                  </p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      ) : null}

      <div
        className={`grid gap-8 sm:grid-cols-2 ${
          hasQuotes ? "mt-16" : "mt-12"
        }`}>
        {PROOF_SIGNALS.map((signal, index) => (
          <Reveal key={signal.label} delay={Math.min(index, 3) * 0.04}>
            <div className="border-t border-white/10 pt-5 dark:border-gray-400/40">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
                {signal.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                {signal.detail}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
