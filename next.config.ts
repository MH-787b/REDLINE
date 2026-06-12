import type { NextConfig } from "next";

// GITHUB_PAGES is set by .github/workflows/nextjs.yml — Pages serves the site
// from /REDLINE/, so all asset URLs need that prefix there (but not locally).
const basePath = process.env.GITHUB_PAGES === "true" ? "/REDLINE" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // static export has no image optimizer; lib/imageLoader.ts also applies basePath
  images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" },
};

export default nextConfig;
