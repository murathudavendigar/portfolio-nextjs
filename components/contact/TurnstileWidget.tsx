"use client";

import { turnstileSiteKey } from "@/lib/turnstile";
import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      appearance?: "always" | "execute" | "interaction-only";
      size?: "normal" | "flexible" | "compact";
      theme?: "auto" | "light" | "dark";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("turnstile missing"));
    script.onerror = () => {
      scriptPromise = null;
      script.remove();
      reject(new Error("turnstile script failed"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * The site's `.dark` class means the paper (light) palette, so match the widget
 * to what is on screen instead of the class name or the OS setting.
 */
function pageTheme(): "light" | "dark" {
  const match = getComputedStyle(document.body).backgroundColor.match(
    /(\d+(?:\.\d+)?)/g,
  );
  if (!match || match.length < 3) return "light";
  const [r, g, b] = match.slice(0, 3).map(Number);
  return 0.299 * r + 0.587 * g + 0.114 * b > 128 ? "light" : "dark";
}

/**
 * Cloudflare Turnstile, shown only when Cloudflare wants an interaction.
 * Tokens are single-use: remount (change the React key) after each submit.
 */
export default function TurnstileWidget({
  onToken,
  onError,
}: {
  onToken: (token: string | null) => void;
  /** The script was blocked or Cloudflare could not run the check. */
  onError: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    let widgetId: string | null = null;
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetId = turnstile.render(containerRef.current, {
          sitekey: turnstileSiteKey,
          action: "contact",
          appearance: "interaction-only",
          size: "flexible",
          theme: pageTheme(),
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => {
            onTokenRef.current(null);
            onErrorRef.current();
          },
        });
      })
      .catch(() => {
        onTokenRef.current(null);
        onErrorRef.current();
      });

    return () => {
      cancelled = true;
      onTokenRef.current(null);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  return <div ref={containerRef} />;
}
