import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/nav";
import { getResumeHref } from "@/lib/resume";
import { site } from "@/lib/site";
import Link from "next/link";

const linkClass =
  "inline-block text-sm text-gray-200 transition-colors duration-300 hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] active:scale-[0.98] dark:text-gray-800";

export default function Footer() {
  const resumeHref = getResumeHref();

  return (
    <footer className="mt-auto border-t border-white/10 bg-inkDeep dark:border-gray-400/40 dark:bg-paperDeep">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] md:items-start md:gap-16 md:py-20">
        <div>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
            {site.shortName}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-300 dark:text-gray-700">
            Frontend engineer, co-founder of TemCraft Tech, and instructor.
            React, Next.js, TypeScript, and iOS — from the Netherlands.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block text-2xl font-semibold tracking-tight transition-colors duration-300 hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] active:scale-[0.98] sm:text-3xl">
            {site.email}
          </a>
          {resumeHref ? (
            <p className="mt-3">
              <a href={resumeHref} download className={linkClass}>
                Résumé (PDF)
              </a>
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 dark:border-gray-400/40 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <nav aria-label="Footer">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
              Pages
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className={linkClass}>
                  Home
                </Link>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/10 px-4 py-4 dark:border-gray-400/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono-ui text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-700">
          © {new Date().getFullYear()} {site.name}
        </p>
        <nav aria-label="Legal" className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="font-mono-ui text-[11px] uppercase tracking-wider text-gray-400 transition-colors hover:text-[var(--accent-text)] dark:text-gray-700">
            Privacy
          </Link>
          <a
            href="/feed.xml"
            className="font-mono-ui text-[11px] uppercase tracking-wider text-gray-400 transition-colors hover:text-[var(--accent-text)] dark:text-gray-700">
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
