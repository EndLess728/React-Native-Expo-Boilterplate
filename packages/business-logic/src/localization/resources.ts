import ar from './translations/ar.json';
import en from './translations/en.json';
import es from './translations/es.json';

export const resources = {
  en: { translation: en },
  es: { translation: es },
  ar: { translation: ar },
};

export type Language = keyof typeof resources;
