import { describe, expect, it } from "vitest";
import {
  formatByteSize,
  npmPackageFromUrl,
  npmStatsLine,
  parseNpmRegistry,
} from "../npm";

const skillbriefRegistry = {
  name: "skillbrief",
  "dist-tags": { latest: "1.0.0" },
  time: {
    created: "2026-09-08T18:32:00.142Z",
    modified: "2026-09-08T18:32:00.707Z",
    "1.0.0": "2026-09-08T18:32:00.379Z",
  },
  versions: {
    "1.0.0": {
      dist: { unpackedSize: 58817 },
    },
  },
};

describe("npmPackageFromUrl", () => {
  it("reads the package name from an npmjs.com URL", () => {
    expect(
      npmPackageFromUrl("https://www.npmjs.com/package/skillbrief"),
    ).toBe("skillbrief");
    expect(
      npmPackageFromUrl("https://www.npmjs.com/package/dev-console-kit"),
    ).toBe("dev-console-kit");
  });

  it("returns null for a non-npm URL", () => {
    expect(npmPackageFromUrl("https://github.com/murathudavendigar/skillbrief")).toBe(
      null,
    );
  });
});

describe("parseNpmRegistry", () => {
  it("reads latest version, publish time, size, and runtime dep count", () => {
    const info = parseNpmRegistry(skillbriefRegistry);
    expect(info).toEqual({
      name: "skillbrief",
      version: "1.0.0",
      publishedAt: "2026-09-08T18:32:00.379Z",
      dependencyCount: 0,
      unpackedSize: 58817,
      weeklyDownloads: null,
      monthlyDownloads: null,
      totalDownloads: null,
    });
  });

  it("counts runtime dependencies only", () => {
    const info = parseNpmRegistry({
      name: "with-deps",
      "dist-tags": { latest: "2.0.0" },
      time: { "2.0.0": "2026-01-01T00:00:00.000Z" },
      versions: {
        "2.0.0": {
          dependencies: { leftpad: "1.0.0", chalk: "5.0.0" },
          dist: { unpackedSize: 1200 },
        },
      },
    });
    expect(info?.dependencyCount).toBe(2);
  });

  it("returns null when latest is missing", () => {
    expect(parseNpmRegistry({ name: "empty" })).toBeNull();
  });
});

describe("formatByteSize", () => {
  it("formats unpacked sizes in KB", () => {
    expect(formatByteSize(58817)).toBe("57 KB");
    expect(formatByteSize(102690)).toBe("100 KB");
    expect(formatByteSize(512)).toBe("512 B");
  });
});

describe("npmStatsLine", () => {
  it("builds the case-study stats line and skips zero downloads", () => {
    const info = parseNpmRegistry(skillbriefRegistry)!;
    expect(npmStatsLine(info)).toEqual([
      "v1.0.0",
      "0 deps",
      "57 KB",
      "published Sep 8",
    ]);
  });

  it("adds weekly downloads when they are above zero", () => {
    const info = {
      ...parseNpmRegistry(skillbriefRegistry)!,
      weeklyDownloads: 12,
      totalDownloads: 321,
    };
    expect(npmStatsLine(info)).toEqual([
      "v1.0.0",
      "0 deps",
      "57 KB",
      "published Sep 8",
      "12 weekly downloads",
      "321 total downloads",
    ]);
  });

  it("falls back to last-month downloads when weekly is zero", () => {
    const info = {
      ...parseNpmRegistry(skillbriefRegistry)!,
      weeklyDownloads: 0,
      monthlyDownloads: 44,
      totalDownloads: 321,
    };
    expect(npmStatsLine(info)).toEqual([
      "v1.0.0",
      "0 deps",
      "57 KB",
      "published Sep 8",
      "44 downloads last month",
      "321 total downloads",
    ]);
  });
});
