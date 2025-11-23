import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      closeBundle() {
        const srcPath = path.resolve(__dirname, 'public/_redirects');
        const destPath = path.resolve(__dirname, 'dist/_redirects');
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log('✓ _redirects copied to dist/');
        }
      }
    }
  ],
});
