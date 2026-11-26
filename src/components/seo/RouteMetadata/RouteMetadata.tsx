import { useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { SeoRouteKey } from "@/i18n/types";

export interface RouteMetadataProps {
  routeKey: SeoRouteKey;
}

export function RouteMetadata({ routeKey }: RouteMetadataProps) {
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
  }, [locale, routeKey, t]);

  return null;
}
