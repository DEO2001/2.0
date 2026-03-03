import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // En développement, redirige les appels /api vers le backend
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  define: {
    // Permet à getApiBase() de trouver l'URL en prod
    VITE_API_URL: JSON.stringify(process.env.VITE_API_URL || ""),
  },
});
