"use client";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/nav";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
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

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === "light";

  return (
    <button
      type="button"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] ${
        isLight ? "justify-end bg-[#CA3E47]" : "justify-start bg-gray-500/70"
      }`}
      onClick={() => setTheme(isLight ? "dark" : "light")}>
      <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
    </button>
  );
}

const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
          <button
            type="button"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-200 transition-colors hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:text-gray-800 md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id={menuId}
          className="border-t border-white/10 bg-ink px-4 py-4 dark:border-gray-400/40 dark:bg-paper md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
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
        </div>
      )}
    </header>
  );
};

export default Header;
