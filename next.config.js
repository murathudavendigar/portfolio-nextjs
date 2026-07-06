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
};

module.exports = nextConfig;
