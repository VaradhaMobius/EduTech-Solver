import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare quick-tunnel hostnames when running `next dev`.
  // Production (`next start` / Vercel) does not need this.
  allowedDevOrigins: ["*.trycloudflare.com"],
  poweredByHeader: false,
  // Extra defense for large JSON bodies to /api/*
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
