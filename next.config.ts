import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.hirefit.live',
          },
        ],
        destination: 'https://hirefit.live/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;