/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // ✅ keep serverActions, remove serverExternalPackages
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'img.clerk.com',
      'images.clerk.dev',
      'uploadthing.com',
      'placehold.co',
      'utfs.io',
      'hipextwinx.blob.core.windows.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'hipextwinx.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
};

module.exports = nextConfig;
