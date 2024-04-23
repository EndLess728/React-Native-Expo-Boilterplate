import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import * as enL from "./translations/en.json";
import * as esL from "./translations/es.json";

const translations = {
  en: enL,
  ja: esL,
};
const i18n = new I18n(translations);

i18n.locale = Localization.locale;
i18n.enableFallback = true;
export default i18n;