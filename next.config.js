/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure static files are served correctly
  images: {
    unoptimized: false,
  },
}

module.exports = nextConfig

