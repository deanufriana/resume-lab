import { defineConfig, lazyPlugins } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import { version } from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [vue()]),
  // Use relative paths for local builds (works with live servers)
  // Use VITE_BASE_PATH when set (for GitHub Pages deployment)
  base: process.env.VITE_BASE_PATH || "./",
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
});
