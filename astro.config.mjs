import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { AstroPWAIntegration } from "@vite-pwa/astro";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import cssConfig from "./vite.css.config.mjs";

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
const apiTarget = env.API_TARGET_URL || "http://localhost:8787";

/** @returns {import("vite").Plugin} */
function hybridRoutingDevPlugin() {
  const spaRoutePattern = /^\/(?:en-US|bg-BG)\/app(?:\/.*)?$/i;
  const localizedSubpathPattern = /^\/(en-US|bg-BG)\/(.+)$/i;
  const rootDir = fileURLToPath(new URL(".", import.meta.url));

  /**
   * @param {string} rawLocale
   * @returns {"en-US" | "bg-BG"}
   */
  function toCanonicalLocale(rawLocale) {
    if (rawLocale.toLowerCase() === "bg-bg") {
      return "bg-BG";
    }
    return "en-US";
  }

  /**
   * @param {string} pathname
   * @param {boolean} isPreview
   * @returns {boolean}
   */
  function localizedPublicRouteExists(pathname, isPreview) {
    const match = localizedSubpathPattern.exec(pathname);
    if (!match) {
      return true;
    }

    const rawLocale = match[1] ?? "";
    const subpath = (match[2] ?? "").replace(/\/+$/, "");
    if (/^(?:app|404)(?:\/|$)/i.test(subpath)) {
      return true;
    }

    if (isPreview) {
      const distDir = join(rootDir, "dist");
      const cleanPath = `/${toCanonicalLocale(rawLocale)}/${subpath}`;
      return (
        existsSync(join(distDir, cleanPath)) ||
        existsSync(join(distDir, `${cleanPath}.html`)) ||
        existsSync(join(distDir, cleanPath, "index.html"))
      );
    }

    const publicFile = join(rootDir, "public", pathname);
    if (existsSync(publicFile)) {
      return true;
    }

    const pagesLocaleDir = join(rootDir, "src", "pages", "[locale]");
    return (
      existsSync(join(pagesLocaleDir, `${subpath}.astro`)) ||
      existsSync(join(pagesLocaleDir, subpath, "index.astro"))
    );
  }

  /**
   * @param {boolean} isPreview
   * @returns {import("vite").Connect.NextHandleFunction}
   */
  function createRoutingMiddleware(isPreview) {
    const appTarget = isPreview ? "/app.html" : "/app";
    const notFoundSuffix = isPreview ? "/404.html" : "/404";

    return (req, res, next) => {
      const url = req.url ?? "";
      const queryIndex = url.indexOf("?");
      const pathname = queryIndex === -1 ? url : url.slice(0, queryIndex);
      const query = queryIndex === -1 ? "" : url.slice(queryIndex);

      if (spaRoutePattern.test(pathname)) {
        req.url = `${appTarget}${query}`;
        next();
        return;
      }

      const localeMatch = localizedSubpathPattern.exec(pathname);
      if (localeMatch && !localizedPublicRouteExists(pathname, isPreview)) {
        const canonicalLocale = toCanonicalLocale(localeMatch[1] ?? "");
        req.url = `/${canonicalLocale}${notFoundSuffix}`;
        if (isPreview) {
          res.statusCode = 404;
        } else {
          const originalWriteHead = res.writeHead.bind(res);
          res.writeHead = /** @type {typeof res.writeHead} */ (
            (statusCode, ...rest) => {
              const nextStatus = statusCode === 200 ? 404 : statusCode;
              return originalWriteHead(nextStatus, ...rest);
            }
          );
        }
      }

      next();
    };
  }

  return {
    name: "hybrid-routing-dev",
    configureServer(server) {
      server.middlewares.use(createRoutingMiddleware(false));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createRoutingMiddleware(true));
    },
  };
}

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
          pathname === "/404.html" ||
          /^\/(?:en-US|bg-BG)\/404(?:\.html|\/)?$/i.test(pathname)
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
        navigateFallbackAllowlist: [
          /^\/app(?:\/|$)/,
          /^\/(?:en-US|bg-BG)\/app(?:\/|$)/i,
        ],
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
    plugins: [...cssConfig.plugins, hybridRoutingDevPlugin()],
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
