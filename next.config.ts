import path from "node:path";
import type { NextConfig } from "next";

const stylesDir = path.join(process.cwd(), "src", "styles");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Lets every module write `@use "abstracts" as *;`
  sassOptions: { loadPaths: [stylesDir], includePaths: [stylesDir] },
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
