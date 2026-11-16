import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/nav";
import { getResumeHref } from "@/lib/resume";
import { site, temcraftUrl } from "@/lib/site";
import Link from "next/link";
import LiveTime from "./LiveTime";
import EmailCopyLink from "./EmailCopyLink";

const linkClass =
  "inline-block text-[15px] text-gray-200 transition-colors duration-200 hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] active:scale-[0.98] dark:text-gray-800";

const smallLinkClass =
  "text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-text)]";

/**
 * A designed close: the name first at full width, then how to reach me
 * and where else the work lives. Surfaces are separated by tone, not lines.
 */
export default function Footer() {
  const resumeHref = getResumeHref();

  return (
    <footer className="mt-auto bg-inkDeep dark:bg-paperDeep">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-16 md:px-10 md:pt-24">
        <p
          aria-hidden
          className="whitespace-nowrap text-[clamp(3rem,11.5vw,9.5rem)] font-extrabold leading-[0.85] tracking-[-0.045em] text-white dark:text-gray-900">
          {site.shortName}
        </p>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <p className="max-w-md text-[17px] leading-relaxed text-gray-200 dark:text-gray-800">
              Frontend engineer and co-founder of{" "}
              <a
                href={temcraftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47] dark:decoration-gray-400">
                TemCraft Tech
              </a>
              . React, Next.js, TypeScript and React Native, from the
              Netherlands.
            </p>
            <EmailCopyLink />
            <div className="mt-5">
              <LiveTime />
            </div>
            {resumeHref ? (
              <p className="mt-4">
                <a href={resumeHref} download className={linkClass}>
                  Download my résumé (PDF)
                </a>
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <nav aria-label="Footer">
              <p className="text-[15px] font-semibold text-white dark:text-gray-900">
                Pages
              </p>
              <ul className="mt-4 space-y-2.5">
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
              <p className="text-[15px] font-semibold text-white dark:text-gray-900">
                Elsewhere
              </p>
              <ul className="mt-4 space-y-2.5">
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

        <div className="mt-16 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[var(--text-muted)]">
            © {new Date().getFullYear()} {site.name}
          </p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link href="/privacy" className={smallLinkClass}>
              Privacy
            </Link>
            <a href="/feed.xml" className={smallLinkClass}>
              RSS
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
