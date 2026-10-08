import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const api = "http://127.0.0.1:3000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  server: {
    proxy: Object.fromEntries(
      ["/v1", "/media", "/app-config", "/ready", "/health"].map((p) => [p, api]),
    ),
  },
  build: { outDir: "dist", emptyOutDir: true, sourcemap: false },
});
