/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { webpack }) => {
    config.module.noParse = /gun|sea\.js$/

    return config
  },
}

module.exports = nextConfig
