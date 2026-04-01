import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

/** https://vite.dev/config/ */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3350,
    proxy: {
      "/api": {
        target: "http://localhost:4300",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          /** React core libraries */
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-vendor";
          }

          /** PrimeReact UI library */
          if (id.includes("node_modules/primereact/")) {
            return "primereact-vendor";
          }

          /** Three.js 3D libraries */
          if (
            id.includes("node_modules/three/") ||
            id.includes("node_modules/@react-three/")
          ) {
            return "three-vendor";
          }

          /** Animation library */
          if (
            id.includes("node_modules/lottie-react/") ||
            id.includes("node_modules/lottie-web/")
          ) {
            return "lottie-vendor";
          }

          /** Other large vendors */
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
      onwarn(warning, warn) {
        /** Suppress eval warnings from lottie-web */
        if (warning.code === "EVAL" && warning.id?.includes("lottie-web")) {
          return;
        }
        /** Suppress unresolved imports warnings for optional dependencies */
        if (
          warning.code === "UNRESOLVED_IMPORT" &&
          (warning.message?.includes("chart.js") ||
            warning.message?.includes("quill"))
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
