// @ts-nocheck

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/hyrox', destination: '/hybrid', permanent: true },
      // Refonte « story » : les anciennes pages pointent vers leur chapitre
      { source: '/planning', destination: '/#planning', permanent: false },
      { source: '/tarifs', destination: '/#tarifs', permanent: false },
      { source: '/contact', destination: '/#essai', permanent: false },
      { source: '/concept', destination: '/#la-tribu', permanent: false },
      { source: '/activites', destination: '/#la-seance', permanent: false },
      { source: '/wods', destination: '/#la-seance', permanent: false },
    ];
  },

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