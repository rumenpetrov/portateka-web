import { bgBG } from "./bg-BG";
import { enUS } from "./en-US";
import type { SupportedLocale, TranslationDictionary } from "./types";

export const DICTIONARIES: Record<SupportedLocale, TranslationDictionary> = {
  "en-US": enUS,
  "bg-BG": bgBG,
};

export function getDictionary(locale: SupportedLocale): TranslationDictionary {
  return DICTIONARIES[locale];
}
