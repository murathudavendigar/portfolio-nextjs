"use client";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/nav";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";

function isActive(pathname: string | null, href: string) {
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

function SocialLinks({ size = 32 }: { size?: number }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const charcoalPage = !mounted || resolvedTheme !== "dark";

  return (
    <div className="flex items-center">
      {SOCIAL_LINKS.map((social) => (
        <SocialIcon
          key={social.url}
          url={social.url}
          label={social.label}
          target="_blank"
          rel="noopener noreferrer"
          fgColor={charcoalPage ? "#e5e7eb" : "#4b5563"}
          bgColor="transparent"
          style={{ height: size, width: size }}
        />
      ))}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

const TOGGLE_CLASS =
  "inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-200 transition-colors hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:text-gray-800 [&>svg]:h-5 [&>svg]:w-5";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // The icon depends on the resolved theme, which is unknown on the server.
  if (!mounted) {
    return <span aria-hidden className="block h-10 w-10" />;
  }

  // next-themes `dark` is this site's paper (visually light) look.
  const paperPage = resolvedTheme === "dark";

  return (
    <AnimatedThemeToggler
      theme={paperPage ? "dark" : "light"}
      onThemeChange={setTheme}
      variant="circle"
      duration={reducedMotion ? 0 : 400}
      aria-label={paperPage ? "Switch to dark mode" : "Switch to light mode"}
      className={TOGGLE_CLASS}
    />
  );
}

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 isolate border-b border-white/10 bg-ink text-white dark:border-gray-400/40 dark:bg-paper dark:text-gray-800">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-[#CA3E47] focus:px-3 focus:py-2 focus:text-sm focus:text-white">
        Skip to content
      </a>

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold uppercase tracking-widest text-gray-200 transition-colors hover:text-[var(--accent-text)] dark:text-gray-900">
          Murat Öncü
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm uppercase tracking-wider md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA3E47] ${
                isActive(pathname, link.href)
                  ? "text-[var(--accent-text)]"
                  : "text-gray-300 hover:text-[var(--accent-text)] dark:text-gray-800"
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <SocialLinks />
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-200 transition-colors hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:text-gray-800 md:hidden"
              aria-label="Open menu">
              <Bars3Icon className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent
              side="right"
              aria-describedby={undefined}
              className="w-[86%] border-l border-white/10 bg-ink text-white dark:border-gray-400/40 dark:bg-paper dark:text-gray-800">
              <SheetTitle className="sr-only">Menu</SheetTitle>

              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-md px-2 py-3 text-sm uppercase tracking-wider transition-colors ${
                      isActive(pathname, link.href)
                        ? "text-[var(--accent-text)]"
                        : "text-gray-200 hover:text-[var(--accent-text)] dark:text-gray-800"
                    }`}>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 dark:border-gray-400/40">
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                  Appearance
                </p>
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
