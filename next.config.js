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
