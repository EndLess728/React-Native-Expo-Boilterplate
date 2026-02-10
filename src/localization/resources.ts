import ar from '@/localization/translations/ar.json';
import en from '@/localization/translations/en.json';
import es from '@/localization/translations/es.json';

export const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  ar: {
    translation: ar,
  },
};

export type Language = keyof typeof resources;
