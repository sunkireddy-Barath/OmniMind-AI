import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // Add your image domains here
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;