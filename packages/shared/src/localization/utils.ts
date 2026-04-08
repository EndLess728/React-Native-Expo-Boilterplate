import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TOptions } from 'i18next';
import i18n from 'i18next';

import { resources } from './resources';
import type { RecursiveKeyOf } from './types';

type DefaultLocale = typeof resources.en.translation;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

/**
 * Translates text (non-reactive, use for static content).
 * For components that need to react to language changes, use useTranslate() hook.
 */
export function translate(key: TxKeyPath, options?: TOptions): string {
  if (i18n.isInitialized) {
    return i18n.t(key, options);
  }
  return key;
}

/**
 * A hook that returns a translate function that reacts to language changes.
 * Use this in components for UI that should update when language changes.
 */
export const useTranslate = () => {
  const { t } = useTranslation();
  return useCallback((key: TxKeyPath, options?: TOptions): string => t(key, options), [t]);
};
