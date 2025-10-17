import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "landing", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "landing"),
  base: "./", // Usar caminhos relativos
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/landing"),
    emptyOutDir: true,
  },
  server: {
    port: 3001, // Porta diferente para evitar conflito
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
