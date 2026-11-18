import { describe, expect, it } from "vitest";
import { isChunkLoadError } from "../chunk-error";

describe("isChunkLoadError", () => {
  it("matches webpack and Safari/Firefox chunk failures", () => {
    const named = new Error("x");
    named.name = "ChunkLoadError";
    expect(isChunkLoadError(named)).toBe(true);
    expect(isChunkLoadError(new Error("Loading chunk 456 failed."))).toBe(true);
    expect(isChunkLoadError(new Error("Loading CSS chunk 12 failed"))).toBe(true);
    expect(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: /x.js"))).toBe(true);
    expect(isChunkLoadError(new TypeError("Importing a module script failed."))).toBe(true);
  });

  it("ignores ordinary errors and non-errors", () => {
    expect(isChunkLoadError(new Error("Cannot read properties of undefined"))).toBe(false);
    expect(isChunkLoadError("Loading chunk 1 failed")).toBe(false);
  });
});
