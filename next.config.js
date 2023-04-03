/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 1000,
  experimental: {
    swcWasmLoader: false,
  },
}

module.exports = nextConfig
