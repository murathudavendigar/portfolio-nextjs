import { describe, expect, it } from "vitest";
import { buildLiveStats, formatCompact } from "@/lib/liveStats";

const app = (over = {}) => ({
  name: "Daily Skyline",
  averageRating: 5,
  ratingCount: 3,
  version: "1.30",
  lastUpdated: "2026-10-20T10:00:00Z",
  ...over,
});
const pkg = (over = {}) => ({
  name: "codebrief",
  version: "1.2.0",
  publishedAt: "2026-10-24T10:00:00Z",
  totalDownloads: 1250,
  ...over,
});

describe("buildLiveStats", () => {
  it("uses live store and npm numbers when present", () => {
    const { stats, isLive } = buildLiveStats({
      apps: [app(), app({ name: "Courai", averageRating: 4, ratingCount: 1 })],
      packages: [pkg(), pkg({ name: "skillbrief", totalDownloads: 300 })],
      liveProducts: 8,
    });
    expect(isLive).toBe(true);
    expect(stats).toEqual([
      { value: "8", label: "Products live today" },
      { value: "4.8★", label: "App Store rating · 4 ratings" },
      { value: "1.6k", label: "npm downloads, all time" },
      { value: "24 Oct", label: "Last release · codebrief 1.2.0" },
    ]);
  });

  it("falls back to plain facts when every request failed", () => {
    const { stats, isLive } = buildLiveStats({
      apps: [app({ averageRating: null, ratingCount: 0, version: "", lastUpdated: "" })],
      packages: [pkg({ totalDownloads: null, version: "", publishedAt: "" })],
      liveProducts: 8,
    });
    expect(isLive).toBe(false);
    expect(stats.map((s) => s.value)).toEqual(["8", "1", "1", "2022"]);
  });
});

describe("formatCompact", () => {
  it("keeps small numbers and shortens thousands", () => {
    expect(formatCompact(999)).toBe("999");
    expect(formatCompact(1000)).toBe("1k");
    expect(formatCompact(1540)).toBe("1.5k");
    expect(formatCompact(23400)).toBe("23k");
  });
});
