/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true, // Since we're serving static images
  },
  output: 'standalone',
};

export default nextConfig;