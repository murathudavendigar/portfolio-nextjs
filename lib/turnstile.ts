import { site } from "@/lib/site";

/** Cloudflare's documented test keys: the widget always passes, siteverify always succeeds. */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";
export const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const isProduction = process.env.NODE_ENV === "production";

/** Real key in production builds; the real key only works on muratoncu.com. */
export const turnstileSiteKey = isProduction
  ? site.turnstileSiteKey
  : TURNSTILE_TEST_SITE_KEY;

function turnstileSecret(): string | null {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (secret) return secret;
  return isProduction ? null : TURNSTILE_TEST_SECRET;
}

/**
 * Checks a Turnstile token with Cloudflare. Fails closed: no token, no secret,
 * a network error or an unexpected answer all count as not verified.
 */
export async function verifyTurnstileToken(
  token: unknown,
  remoteIp?: string | null,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return false;
  }

  const secret = turnstileSecret();
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY is not set");
    return false;
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetchImpl(SITEVERIFY_URL, { method: "POST", body });
    if (!response.ok) return false;
    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (result.success !== true) {
      console.warn("[turnstile] rejected", result["error-codes"]);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[turnstile] siteverify failed", error);
    return false;
  }
}
