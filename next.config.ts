import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sitio 100% estático: `next build` genera out/, que se sube a Firebase Hosting
  output: "export",
  images: { unoptimized: true }, // sin servidor no hay optimizador de imágenes
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
