import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { plugin as markdownPlugin, Mode } from "vite-plugin-markdown";

export default defineConfig(({ mode }) => {
  // Determine the base URL based on the environment
  let base = "/";

  if (mode === "production") {
    // Check if this is a GitHub Pages deployment
    if (
      process.env.GITHUB_PAGES === "true" ||
      process.env.GITHUB_ACTIONS === "true"
    ) {
      base = "https://jaryddiamond.com/";
    } else {
      // Vercel deployment
      base = "https://personal-site-jaryd-diamonds-projects.vercel.app/";
    }
  }

  return {
    plugins: [
      react(),
      markdownPlugin({
        mode: [Mode.MARKDOWN],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base,
  };
});
