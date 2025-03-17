/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  images: {
    domains: ['assets.coingecko.com', 'via.placeholder.com'],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Use static export for simpler deployments
  output: 'standalone',
};

module.exports = nextConfig; 