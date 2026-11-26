import { fileURLToPath, URL } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { AstroPWAIntegration } from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import cssConfig from "./vite.css.config.mjs";

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
const apiTarget = env.API_TARGET_URL || "http://localhost:8787";

export default defineConfig({
  site: "https://portateka.rpetrov.dev",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  server: {
    port: 5173,
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: "en-US",
        locales: {
          "en-US": "en-US",
          "bg-BG": "bg-BG",
        },
      },
      filter: (page) => {
        const { pathname } = new URL(page);
        if (
          pathname === "/" ||
          pathname === "/404" ||
          pathname === "/404.html"
        ) {
          return false;
        }
        if (
          pathname === "/app" ||
          pathname.startsWith("/app/") ||
          /^\/(?:en-US|bg-BG)\/app(?:\/|$)/i.test(pathname)
        ) {
          return false;
        }
        return true;
      },
    }),
    AstroPWAIntegration({
      registerType: "prompt",
      injectRegister: "auto",
      includeAssets: [
        "logo.svg",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "pwa-maskable-512x512.png",
      ],
      manifest: {
        id: "/",
        name: "Portateka",
        short_name: "Portateka",
        description:
          "Web app where you organize and manage your property portfolio information.",
        start_url: "/app",
        scope: "/",
        display: "standalone",
        background_color: "#111318",
        theme_color: "#111318",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/app.html",
        navigateFallbackDenylist: [
          /^\/api(?:\/|$)/,
          /^\/health(?:\/|$)/,
          /^\/robots\.txt$/,
          /^\/sitemap.*\.xml$/,
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  vite: {
    plugins: cssConfig.plugins,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
        },
        "/health": {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  },
});
