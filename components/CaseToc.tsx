"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

/**
 * "On this page" for a case study. Desktop: a sticky list beside the text
 * that marks the section being read. Mobile: one row of jump links.
 */
export default function CaseToc({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    // A section is "current" once its top passes the upper third of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <>
      <nav aria-label="On this page" className="lg:hidden">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 border-y border-white/10 py-3 dark:border-gray-300">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-11 items-center font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-text)]">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="On this page" className="hidden h-full lg:block">
        <div className="sticky top-24">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            On this page
          </p>
          <ul className="mt-4 space-y-1 border-l border-white/10 dark:border-gray-300">
            {sections.map((s) => {
              const current = s.id === active;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={current ? "location" : undefined}
                    className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                      current
                        ? "border-[var(--accent-text)] text-[var(--accent-text)]"
                        : "border-transparent text-[var(--text-muted)] hover:text-white dark:hover:text-gray-900"
                    }`}>
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
