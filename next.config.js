/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "www.citypng.com",
      "icon.icepanel.io",
    ],
  },
};

module.exports = nextConfig;
