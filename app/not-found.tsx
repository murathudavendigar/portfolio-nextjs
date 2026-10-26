import NotFoundGame from "@/components/NotFoundGame";
import { LAB_EXPERIMENTS } from "@/data/lab";
import { getPosts } from "@/lib/blog";
import { NAV_LINKS } from "@/lib/nav";
import { getProjects } from "@/lib/projects";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

/** Every real page, so the 404 can guess which one was meant. */
function knownPaths(): string[] {
  return [
    ...NAV_LINKS.map((l) => l.href),
    ...getProjects().map((p) => `/work/${p.slug}`),
    ...getPosts().map((p) => `/writing/${p.slug}`),
    ...LAB_EXPERIMENTS.map((e) => `/lab/${e.slug}`),
  ];
}

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 py-20 text-center text-white dark:bg-paper dark:text-gray-700">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
        Error 404
      </p>
      <h1 className="text-4xl font-semibold tracking-tight [text-wrap:balance] sm:text-5xl dark:text-gray-900">
        This route doesn&apos;t exist.
      </h1>

      <NotFoundGame known={knownPaths()} />

      <nav aria-label="Main pages" className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {[
          { href: "/", label: "Home" },
          { href: "/work", label: "Work" },
          { href: "/writing", label: "Writing" },
          { href: "/lab", label: "Lab" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center text-[var(--text-muted)] underline decoration-white/20 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
            {l.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
