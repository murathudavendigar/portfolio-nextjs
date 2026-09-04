/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "www.citypng.com" },
      { protocol: "https", hostname: "icon.icepanel.io" },
    ],
  },
  async redirects() {
    return [
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
