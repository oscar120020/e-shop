/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 1000,
  experimental: {
    forceSwcTransforms: true,
  }
}

module.exports = nextConfig
