import { useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { buildCanonicalUrl } from "@/i18n/localeRouting";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/types";
import type { SeoRouteKey } from "@/i18n/types";

export interface RouteMetadataProps {
  routeKey: SeoRouteKey;
  indexable?: boolean;
  canonicalSubpath?: string;
}

const ROUTE_SEO_ATTR = "data-route-seo";

export function RouteMetadata({
  routeKey,
  indexable = false,
  canonicalSubpath,
}: RouteMetadataProps) {
  const { locale, t } = useI18n();

  useEffect(() => {
    const metadata = t.seo.routes[routeKey];
    document.title = metadata.title;

    let descriptionMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute("content", metadata.description);

    const existingManagedNodes = document.head.querySelectorAll(
      `[${ROUTE_SEO_ATTR}="true"]`,
    );
    for (const node of existingManagedNodes) {
      node.remove();
    }

    if (indexable && canonicalSubpath !== undefined) {
      const canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute(
        "href",
        buildCanonicalUrl(locale, canonicalSubpath),
      );
      canonicalLink.setAttribute(ROUTE_SEO_ATTR, "true");
      document.head.appendChild(canonicalLink);

      for (const supportedLocale of SUPPORTED_LOCALES) {
        const alternateLink = document.createElement("link");
        alternateLink.setAttribute("rel", "alternate");
        alternateLink.setAttribute("hreflang", supportedLocale);
        alternateLink.setAttribute(
          "href",
          buildCanonicalUrl(supportedLocale, canonicalSubpath),
        );
        alternateLink.setAttribute(ROUTE_SEO_ATTR, "true");
        document.head.appendChild(alternateLink);
      }

      const xDefaultLink = document.createElement("link");
      xDefaultLink.setAttribute("rel", "alternate");
      xDefaultLink.setAttribute("hreflang", "x-default");
      xDefaultLink.setAttribute(
        "href",
        buildCanonicalUrl(DEFAULT_LOCALE, canonicalSubpath),
      );
      xDefaultLink.setAttribute(ROUTE_SEO_ATTR, "true");
      document.head.appendChild(xDefaultLink);
    } else {
      const robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      robotsMeta.setAttribute("content", "noindex, nofollow");
      robotsMeta.setAttribute(ROUTE_SEO_ATTR, "true");
      document.head.appendChild(robotsMeta);
    }
  }, [locale, routeKey, indexable, canonicalSubpath, t]);

  return null;
}
