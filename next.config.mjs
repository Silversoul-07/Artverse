/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
      return [
        {
          source: "/api/:path*",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/api/:path*"
              : "https://upright-content-cricket.ngrok-free.app/api/:path*",
        },
        {
          source: "/images/:path*",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/images/:path*"
              : "https://upright-content-cricket.ngrok-free.app/images/:path*",
        },
        {
          source: "/avatar/:path*",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/avatar/:path*"
              : "https://upright-content-cricket.ngrok-free.app/avatar/:path*",
        }
      ];
    },
  };
  
  export default nextConfig;
  