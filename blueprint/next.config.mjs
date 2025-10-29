/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/users/:path*',
        destination: '/api/serve-user-file/:path*',
      },
    ];
  },
};

export default nextConfig;
