import { fileURLToPath, URL } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { AstroPWAIntegration } from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import {
  LOCALE_NOT_FOUND_PATTERN,
  SITE_ORIGIN,
  SPA_ROUTE_PATTERN,
} from "./src/i18n/localeRouting";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./src/i18n/types";
import cssConfig from "./vite.css.config.mjs";

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
const apiTarget = env.API_TARGET_URL || "http://localhost:8787";

/** @returns {import("vite").Plugin} */
function spaDevRewritePlugin() {
  return {
    name: "spa-dev-rewrite",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? "";
        const queryIndex = url.indexOf("?");
        const pathname = queryIndex === -1 ? url : url.slice(0, queryIndex);
        const query = queryIndex === -1 ? "" : url.slice(queryIndex);

        if (SPA_ROUTE_PATTERN.test(pathname)) {
          req.url = `/app${query}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  site: SITE_ORIGIN,
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
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(
          SUPPORTED_LOCALES.map((locale) => [locale, locale]),
        ),
      },
      filter: (page) => {
        const { pathname } = new URL(page);
        if (
          pathname === "/" ||
          pathname === "/404" ||
          pathname === "/404.html" ||
          LOCALE_NOT_FOUND_PATTERN.test(pathname)
        ) {
          return false;
        }
        if (
          pathname === "/app" ||
          pathname.startsWith("/app/") ||
          SPA_ROUTE_PATTERN.test(pathname)
        ) {
          return false;
        }
        return true;
      },
    }),
    AstroPWAIntegration({
      registerType: "prompt",
      injectRegister: null,
      includeManifestIcons: false,
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
      generateSW: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/app",
        navigateFallbackAllowlist: [/^\/app(?:\/|$)/, SPA_ROUTE_PATTERN],
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
    plugins: [...cssConfig.plugins, spaDevRewritePlugin()],
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
