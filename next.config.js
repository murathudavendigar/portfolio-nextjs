// Enforced since 2026-11-18: report-only showed no violations on a production
// spot check, and a local production build passed with it enforced. A strict
// script-src broke client JS once (commit 1db1709).
// `next dev` needs eval and a websocket for React refresh; production does not.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  // Next.js inlines its RSC payload; static pages cannot carry a nonce.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://static.cloudflareinsights.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://cloudflareinsights.com${isDev ? " ws:" : ""}`,
  // Turnstile on the contact form renders in an iframe from this origin.
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "www.citypng.com" },
      { protocol: "https", hostname: "icon.icepanel.io" },
    ],
  },
  async redirects() {
    const prunedWorkSlugs = [
      "nextjs-amazon-clone",
      "nextjs-instagram-clone",
      "nextjs-chatgpt",
      "nextjs-netflix-app",
      "click-game",
      "cheers-app",
      "weather-app-with-typescript-and-reactjs",
      "movie-app",
      "bored-app",
      "typescript-quiz-app",
      "linktree-clone",
      "fireblog-app",
      "brawl-stars-app",
      "weather-app-with-pure-js",
    ];

    return [
      ...prunedWorkSlugs.flatMap((slug) => [
        {
          source: `/work/${slug}`,
          destination: "/work",
          permanent: true,
        },
        {
          source: `/projects/${slug}`,
          destination: "/work",
          permanent: true,
        },
      ]),
      {
        source: "/projects/:slug*",
        destination: "/work/:slug*",
        permanent: true,
      },
      // Lab placeholders removed 2026-11-11; send visitors to the case studies.
      { source: "/lab/courai", destination: "/work/courai", permanent: true },
      {
        source: "/lab/autoinvoice",
        destination: "/work/autoinvoice-pro",
        permanent: true,
      },
      // 2026-11-16: Lab demos moved into their case studies, /now became the
      // "Right now" list on /about, /hire merged into /contact.
      {
        source: "/lab/choose",
        destination: "/work/choose-game#try-it",
        permanent: true,
      },
      {
        source: "/lab/daily-skyline",
        destination: "/work/daily-skyline#try-it",
        permanent: true,
      },
      { source: "/lab", destination: "/work", permanent: true },
      { source: "/now", destination: "/about#now", permanent: true },
      { source: "/hire", destination: "/contact#how-we-work", permanent: true },
      { source: "/blogs", destination: "/writing", permanent: true },
      {
        source: "/blogs/:slug*",
        destination: "/writing/:slug*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
          { key: "Content-Security-Policy", value: csp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
