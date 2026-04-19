import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Use relative paths for local builds (works with live servers)
  // Use VITE_BASE_PATH when set (for GitHub Pages deployment)
  base: process.env.VITE_BASE_PATH || './',
  define: {
    __APP_VERSION__: JSON.stringify(version)
  }
})
