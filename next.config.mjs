/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    // images: {
    //   unoptimized: true, // Disable image optimization
    // },
    reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'], // Allow Firebase Storage images
  },
  };
  
  export default nextConfig;
  