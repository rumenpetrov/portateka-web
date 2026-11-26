import {
  detectBrowserLocale,
  extractLocaleFromPathname,
} from "../src/i18n/localeRouting";

interface AssetsBinding {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: AssetsBinding;
}

const SPA_ROUTE_PATTERN = /^\/(?:en-US|bg-BG)\/app(?:\/.*)?$/i;

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

    if (SPA_ROUTE_PATTERN.test(url.pathname)) {
      const appUrl = new URL("/app", url);
      return env.ASSETS.fetch(new Request(appUrl, request));
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return response;
    }

    const locale =
      extractLocaleFromPathname(url.pathname)?.locale ??
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
