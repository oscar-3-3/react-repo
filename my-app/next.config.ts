import type { NextConfig } from "next";

// When building in GitHub Actions, the site is served from
// https://<user>.github.io/<repo>/ (a project page), so assets and
// links need to be prefixed with the repo name.
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // GitHub Pages has no server to run Next.js's image optimizer.
    unoptimized: true,
  },
  basePath: isGithubActions ? `/${repo}` : "",
  assetPrefix: isGithubActions ? `/${repo}/` : "",
};

export default nextConfig;
