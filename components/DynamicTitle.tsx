"use client";

import { useEffect, useRef } from "react";

export default function DynamicTitle() {
  const originalTitle = useRef<string>("");

  useEffect(() => {
    // Only run this logic on the client
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        originalTitle.current = document.title;
        document.title = "👋 Don't forget me!";
      } else {
        // Only restore if we have an original title saved
        if (originalTitle.current) {
          document.title = originalTitle.current;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
