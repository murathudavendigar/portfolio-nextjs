import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// open-next.config.ts serves pages from the read-only static-assets cache.
// That cache cannot revalidate: an ISR page that goes stale tries to queue a
// rebuild, the queue is a dummy, and the request fails. So no page or fetch
// may set a numeric revalidate. Data refreshes on every deploy instead.
const ROOTS = ["app", "lib", "components"];
const ISR = /revalidate\s*[:=]\s*\d/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === "__tests__" || name === "node_modules") return [];
    if (statSync(path).isDirectory()) return files(path);
    return /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

describe("static-only rendering", () => {
  it("no page or fetch uses time-based revalidation", () => {
    const offenders = ROOTS.flatMap(files).filter((f) =>
      ISR.test(readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });

  it("OpenNext uses the static-assets cache with interception", () => {
    const config = readFileSync("open-next.config.ts", "utf8");
    expect(config).toContain("staticAssetsIncrementalCache");
    expect(config).toContain("enableCacheInterception: true");
  });
});
