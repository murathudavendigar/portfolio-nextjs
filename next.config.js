const cspEnforced = [
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const cspReportOnly = [
  "default-src 'self'",
  // Next.js inlines its RSC payload; static pages cannot carry a nonce.
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
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
          // Enforced: directives that cannot block the site's own scripts.
          { key: "Content-Security-Policy", value: cspEnforced },
          // Full policy in report-only mode. A strict script-src broke client JS
          // once (commit 1db1709), so watch the browser console for violations
          // on production before moving any of this into the enforced header.
          { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
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
