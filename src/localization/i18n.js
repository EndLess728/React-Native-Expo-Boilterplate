import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import enL from "./translations/en.json";
import esL from "./translations/es.json";

// Define your translations
const translations = {
  en: enL,
  es: esL,
};

// Initialize i18n
const i18n = new I18n(translations);
i18n.locale = Localization.getLocales()[0].languageCode; // Device language (e.g., "en-US" → "en")
i18n.enableFallback = true; // Fallback to "en" if translation missing
i18n.defaultLocale = "en"; // Safety net

export default i18n;
