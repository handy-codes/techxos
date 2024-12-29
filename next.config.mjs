/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'utfs.io'},
      { hostname: 'img.clerk.com'},
      { hostname: 'i.ibb.co' } // Add this line
    ]
  }
};

export default nextConfig;
