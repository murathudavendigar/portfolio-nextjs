import Link from "next/link";
import Reveal from "./Reveal";

export default function ContactCta() {
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
          Whether you need a frontend engineer for your team, a freelance partner to build a product from scratch, or an instructor to level up your developers — my inbox is open.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-primary w-full sm:w-auto">
            Get in touch
          </Link>
          <a
            href="mailto:contact@muratoncu.com"
            className="font-mono-ui text-[13px] tracking-wider text-gray-400 hover:text-[var(--accent-text)] transition-colors py-3 px-6">
            contact@muratoncu.com
          </a>
        </div>
      </Reveal>
    </section>
  );
}
