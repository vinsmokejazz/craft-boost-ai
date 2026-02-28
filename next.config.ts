import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Allow <Image> to load from cloud storage & AI service domains */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.stability.ai" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  /** Ensure these keys are NEVER bundled into the client JS */
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
