/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
