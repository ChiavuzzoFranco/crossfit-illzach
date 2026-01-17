import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. AUTORISER LES IMAGES
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      // AJOUT 1 : Nécessaire pour certaines photos Unsplash récentes
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '**',
      },
      // AJOUT 2 : Nécessaire pour l'effet de grain (Noise) dans la modale
      {
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app',
        pathname: '**',
      },
    ],
  },

  // 2. LE CORRECTIF WEBPACK (On le garde, c'est une sécurité)
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