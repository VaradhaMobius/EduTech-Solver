import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare quick-tunnel hostnames when running `next dev`.
  // Production (`next start`) does not need this.
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
