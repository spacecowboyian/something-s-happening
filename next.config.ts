import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/something-s-happening';

const nextConfig: NextConfig = {
  // Only use static export for production builds (GitHub Pages)
  // In development, we need server features for API routes and database
  ...(isProd && { output: 'export' }),
  basePath: isProd ? basePath : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
