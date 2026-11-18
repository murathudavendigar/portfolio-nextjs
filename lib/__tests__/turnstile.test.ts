import { describe, expect, it, vi } from "vitest";
import { TURNSTILE_TEST_SECRET, verifyTurnstileToken } from "../turnstile";

function answer(body: unknown, ok = true) {
  return vi.fn(async () => ({ ok, json: async () => body }) as Response);
}

describe("verifyTurnstileToken", () => {
  it("rejects a missing or malformed token without calling Cloudflare", async () => {
    const fetchImpl = answer({ success: true });
    expect(await verifyTurnstileToken(undefined, null, fetchImpl)).toBe(false);
    expect(await verifyTurnstileToken("", null, fetchImpl)).toBe(false);
    expect(await verifyTurnstileToken("x".repeat(2049), null, fetchImpl)).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("accepts only an explicit success from siteverify", async () => {
    expect(await verifyTurnstileToken("t", null, answer({ success: true }))).toBe(true);
    expect(await verifyTurnstileToken("t", null, answer({ success: false }))).toBe(false);
    expect(await verifyTurnstileToken("t", null, answer({}))).toBe(false);
    expect(await verifyTurnstileToken("t", null, answer({ success: true }, false))).toBe(false);
  });

  it("fails closed on a network error", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    });
    expect(await verifyTurnstileToken("t", null, fetchImpl)).toBe(false);
  });

  it("sends the token, the test secret off production, and the visitor IP", async () => {
    const fetchImpl = answer({ success: true });
    await verifyTurnstileToken("tok", "203.0.113.7", fetchImpl);
    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const body = init.body as URLSearchParams;
    expect(body.get("response")).toBe("tok");
    expect(body.get("secret")).toBe(TURNSTILE_TEST_SECRET);
    expect(body.get("remoteip")).toBe("203.0.113.7");
  });
});
