// @ts-nocheck

/** @type {import('next').NextConfig} */
const nextConfig = {
  // On ignore les erreurs TypeScript pour le build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuration des images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;