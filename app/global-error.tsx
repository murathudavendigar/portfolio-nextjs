"use client";

import { isChunkLoadError, reloadOnceForChunkError } from "@/lib/chunk-error";
import { useEffect, useState } from "react";

// This page replaces the root layout, so globals.css, the fonts and the
// next-themes class are all gone. Everything here is inline and the theme is
// read back from next-themes' localStorage key. Note the site's inversion:
// "dark" is the paper look, "light" is charcoal.
const palettes = {
  ink: {
    bg: "#211d1a",
    heading: "#ffffff",
    text: "#b8b0a8",
    accent: "#eb7d85",
    border: "rgba(255,255,255,0.14)",
    subtle: "rgba(255,255,255,0.04)",
  },
  paper: {
    bg: "#f3ede4",
    heading: "#1f1b18",
    text: "#5c564f",
    accent: "#a8323a",
    border: "rgba(31,27,24,0.16)",
    subtle: "rgba(31,27,24,0.03)",
  },
} as const;

type PaletteName = keyof typeof palettes;

function readPalette(): PaletteName {
  try {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") return "paper";
    if (theme === "light") return "ink";
  } catch {
    // Storage blocked: fall through to the OS preference.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "paper" : "ink";
}

const font =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [palette, setPalette] = useState<PaletteName>("ink");
  const [reloading, setReloading] = useState(false);
  const staleBuild = isChunkLoadError(error);

  useEffect(() => {
    console.error(error);
    setPalette(readPalette());
    if (staleBuild && reloadOnceForChunkError()) setReloading(true);
  }, [error, staleBuild]);

  const c = palettes[palette];

  const reload = () => {
    setReloading(true);
    window.location.reload();
  };

  return (
    <html lang="en">
      <head>
        <title>Something went wrong — Murat Öncü</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, backgroundColor: c.bg }}>
        <main
          style={{
            boxSizing: "border-box",
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1.5rem",
            textAlign: "center",
            backgroundColor: c.bg,
            color: c.text,
            fontFamily: font,
            WebkitFontSmoothing: "antialiased",
          }}>
          <div style={{ width: "100%", maxWidth: "32rem" }}>
            <p
              style={{
                margin: 0,
                fontFamily: mono,
                fontSize: "0.8125rem",
                letterSpacing: "0.02em",
                color: c.accent,
              }}>
              {staleBuild ? "New version available" : "Error"}
            </p>

            <h1
              style={{
                margin: "0.75rem 0 0",
                fontSize: "clamp(2rem, 6vw, 2.75rem)",
                lineHeight: 1.1,
                fontWeight: 650,
                letterSpacing: "-0.02em",
                color: c.heading,
                textWrap: "balance",
              }}>
              {staleBuild ? "The site was just updated." : "This page didn’t load."}
            </h1>

            <p
              style={{
                margin: "1rem auto 0",
                maxWidth: "26rem",
                fontSize: "1.0625rem",
                lineHeight: 1.6,
                textWrap: "pretty",
              }}>
              {staleBuild
                ? "Your tab still had the old version open. Reloading picks up the new one."
                : "Something failed before the page could render. A reload usually fixes it."}
            </p>

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.75rem",
              }}>
              <button
                type="button"
                onClick={reload}
                disabled={reloading}
                style={{
                  minHeight: "2.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #CA3E47",
                  backgroundColor: "#CA3E47",
                  color: "#ffffff",
                  padding: "0 1.25rem",
                  fontFamily: font,
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  cursor: reloading ? "progress" : "pointer",
                  opacity: reloading ? 0.75 : 1,
                }}>
                {reloading ? "Reloading…" : "Reload page"}
              </button>
              {/* A plain <a>, not next/link: the client router is what broke. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: "2.75rem",
                  boxSizing: "border-box",
                  borderRadius: "0.5rem",
                  border: `1px solid ${c.border}`,
                  backgroundColor: c.subtle,
                  color: c.heading,
                  padding: "0 1.25rem",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}>
                Back to homepage
              </a>
            </div>

            {error.digest && (
              <p
                style={{
                  margin: "2.5rem 0 0",
                  fontFamily: mono,
                  fontSize: "0.75rem",
                  opacity: 0.7,
                }}>
                Ref {error.digest}
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
