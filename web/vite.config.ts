import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  test: {
    globals: true,
  },
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,

    proxy: {
      "/api": {
        target: "http://api:3333",
        changeOrigin: true,

        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
