import fs from "node:fs";
import path from "path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { marked } from "marked";

const README_PATH = "public/files/README.md";

/**
 * Everything on the desktop is fetched and rendered at runtime, so anything that
 * doesn't run JS — crawlers, link previews, LLM fetchers — sees an empty
 * `<div id="root">`. Inline the README into the HTML at build time so the page
 * actually says who Jaryd is when read as source.
 */
function inlineReadme(): Plugin {
  return {
    name: "inline-readme",
    transformIndexHtml() {
      const markdown = fs.readFileSync(
        path.resolve(__dirname, README_PATH),
        "utf8",
      );

      return [
        {
          tag: "noscript",
          injectTo: "body",
          children: `<h1>Jaryd Diamond</h1>\n${marked.parse(markdown, {
            async: false,
          })}`,
        },
      ];
    },
    // Keep the dev server in sync while the README is being edited
    handleHotUpdate({ file, server }) {
      if (file.endsWith(path.normalize(README_PATH))) {
        server.restart();
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineReadme()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
