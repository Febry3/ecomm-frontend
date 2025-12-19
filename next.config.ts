import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Double asterisk matches subdomains AND root paths often
      },
      {
        protocol: "http", // Allow http specifically for the URL you have
        hostname: "**.googleusercontent.com",
      },
      // Explicit fallback for the root domain if wildcard acts up
      {
        protocol: "https",
        hostname: "googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "iatwxegpjmgnhtevhuir.supabase.co"
      }
    ],
  },
  async headers() {
    return [
      {
        source: "/register",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
