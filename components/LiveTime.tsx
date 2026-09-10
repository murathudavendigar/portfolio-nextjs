"use client";

import { useEffect, useState } from "react";

export default function LiveTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Amsterdam",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(formatter.format(now));
    };

    updateTime(); // Initial set
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch by not rendering the time on the server
  if (!time) {
    return <span className="opacity-0">00:00:00</span>;
  }

  return (
    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      {time} CEST — Based in the Netherlands
    </span>
  );
}
