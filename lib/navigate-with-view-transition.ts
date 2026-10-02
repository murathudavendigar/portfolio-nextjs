"use client";

/**
 * Navigate with the View Transitions API when available so matching
 * `view-transition-name` elements (work covers) can morph between routes.
 */
export function navigateWithViewTransition(
  href: string,
  push: (url: string) => void,
) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    reduce ||
    typeof document === "undefined" ||
    typeof document.startViewTransition !== "function"
  ) {
    push(href);
    return;
  }

  document.startViewTransition(() => {
    push(href);
  });
}
