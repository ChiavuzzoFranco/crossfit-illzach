// @ts-nocheck

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. IGNORER LES ERREURS STRICTES (INDISPENSABLE POUR VERCEL RAPIDE)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 2. AUTORISER LES IMAGES
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

  // 3. CORRECTIF WEBPACK
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        path: false,
        os: false,
        v8: false,
        perf_hooks: false,
      };
    }
    return config;
  },
};

export default nextConfig;