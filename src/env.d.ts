/// <reference types="astro/client" />
/// <reference types="@unplugin-pwa/core/vanillajs" />
/// <reference types="@unplugin-pwa/core/info" />

interface ImportMetaEnv {
  readonly API_TARGET_URL?: string;
  readonly PUBLIC_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
