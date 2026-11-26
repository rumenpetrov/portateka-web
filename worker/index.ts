import {
  SPA_ROUTE_PATTERN,
  detectBrowserLocale,
  extractLocaleFromPathname,
  replaceLocaleInUrl,
} from "../src/i18n/localeRouting";

interface AssetsBinding {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: AssetsBinding;
  API_TARGET_URL?: string;
}

const API_PROXY_PATTERN = /^\/(?:api|health)(?:\/|$)/;

function parseAcceptLanguage(header: string | null): string[] {
  if (!header) {
    return [];
  }

  return header
    .split(",")
    .map((part) => {
      const tag = part.split(";")[0]?.trim();
      return tag ?? "";
    })
    .filter((tag) => tag.length > 0);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Local `npm run preview` (`wrangler dev`) loads `API_TARGET_URL` from `.env` when
    // `PUBLIC_API_BASE_URL` is empty; production builds bake `PUBLIC_API_BASE_URL` and leave this unset.
    if (env.API_TARGET_URL && API_PROXY_PATTERN.test(url.pathname)) {
      const targetUrl = new URL(
        `${url.pathname}${url.search}`,
        env.API_TARGET_URL,
      );
      const headers = new Headers(request.headers);
      headers.delete("host");
      headers.delete("origin");

      const init: RequestInit = {
        method: request.method,
        headers,
      };
      if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = request.body;
      }

      return fetch(targetUrl, init);
    }

    const extracted = extractLocaleFromPathname(url.pathname);
    if (extracted && !extracted.isCanonical) {
      const canonicalPath = replaceLocaleInUrl(
        url.pathname,
        url.search,
        "",
        extracted.locale,
      );
      return Response.redirect(new URL(canonicalPath, url), 308);
    }

    if (SPA_ROUTE_PATTERN.test(url.pathname)) {
      const appUrl = new URL("/app", url);
      return env.ASSETS.fetch(new Request(appUrl, request));
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return response;
    }

    const locale =
      extracted?.locale ??
      detectBrowserLocale(
        parseAcceptLanguage(request.headers.get("Accept-Language")),
      );

    const notFoundUrl = new URL(`/${locale}/404`, url);
    const notFoundResponse = await env.ASSETS.fetch(
      new Request(notFoundUrl, {
        method: request.method === "HEAD" ? "HEAD" : "GET",
        headers: request.headers,
      }),
    );

    return new Response(notFoundResponse.body, {
      status: 404,
      headers: notFoundResponse.headers,
    });
  },
};
