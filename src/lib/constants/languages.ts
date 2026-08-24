export interface ResearchLanguage {
  code: string;
  englishName: string;
  nativeName: string;
}

export const SUPPORTED_RESEARCH_LANGUAGES: ResearchLanguage[] = [
  { code: "en", englishName: "English", nativeName: "English" },
  { code: "es", englishName: "Spanish", nativeName: "Español" },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी" },
  { code: "pt-BR", englishName: "Portuguese (Brazil)", nativeName: "Português (Brasil)" },
  { code: "ja", englishName: "Japanese", nativeName: "日本語" },
  { code: "de", englishName: "German", nativeName: "Deutsch" },
  { code: "fr", englishName: "French", nativeName: "Français" },
  { code: "ko", englishName: "Korean", nativeName: "한국어" },
  { code: "id", englishName: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ar", englishName: "Arabic", nativeName: "العربية" },
];

export const DEFAULT_RESEARCH_LANGUAGE = "en";

export function isSupportedLanguage(code?: string): boolean {
  return !!code && SUPPORTED_RESEARCH_LANGUAGES.some((l) => l.code === code);
}

export function getLanguageByCode(code?: string): ResearchLanguage {
  return (
    SUPPORTED_RESEARCH_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_RESEARCH_LANGUAGES[0]
  );
}

/**
 * Kept separate from the "ignore non-English UI/nav garbage" instruction in research-engine.ts,
 * which governs how the model treats noisy scraped source text, not what language it writes in.
 */
export function getLanguageInstruction(code?: string): string {
  const lang = getLanguageByCode(code);
  if (lang.code === "en") {
    return "The output MUST strictly be in professional English (US).";
  }
  return `The output MUST strictly be in professional, natural ${lang.englishName} (${lang.nativeName}). Do not mix in English except for untranslatable proper nouns, model numbers, or brand names.`;
}
