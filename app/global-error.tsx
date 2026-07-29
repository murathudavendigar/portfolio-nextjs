"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            padding: "5rem 1.5rem",
            textAlign: "center",
            backgroundColor: "#313131",
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600, margin: 0 }}>
            The application crashed.
          </h1>
          <p style={{ color: "#d1d5db", maxWidth: "28rem", margin: 0 }}>
            Something went wrong at the top level and the page couldn&apos;t
            render. Try reloading — if it keeps happening, the site owner has
            already been notified.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              borderRadius: "0.5rem",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "#CA3E47",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
