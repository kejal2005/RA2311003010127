/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  optimizeFonts: true,
  productionBrowserSourceMaps: false,
  
  // Environment variables
  env: {
    NEXT_PUBLIC_AUTH_TOKEN: process.env.NEXT_PUBLIC_AUTH_TOKEN || "YOUR_BEARER_TOKEN_HERE",
    NEXT_PUBLIC_LOG_API: process.env.NEXT_PUBLIC_LOG_API || "http://20.207.122.201/evaluation-service/logs",
    NEXT_PUBLIC_NOTIFICATION_API: process.env.NEXT_PUBLIC_NOTIFICATION_API || "http://20.207.122.201/evaluation-service/notifications",
  },

  // TypeScript support
  typescript: {
    strictNullChecks: true,
  },

  // Image optimization (optional, not used in this app but good for production)
  images: {
    unoptimized: true,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Server configuration
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },

  publicRuntimeConfig: {
    staticFolder: "/public",
  },
};

module.exports = nextConfig;
