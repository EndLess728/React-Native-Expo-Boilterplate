/**
 * Toast — single source of truth.
 *
 * Wraps `react-native-toast-message` with a themed UI and ergonomic helpers.
 *
 * Public surface:
 *   - `toastConfig`  → pass to <Toast config={toastConfig} /> in App.tsx
 *   - `showSuccessToast` / `showErrorToast` / `showInfoToast` / `showWarningToast`
 *   - `ToastParams` type (extends ToastShowParams; renames text1→title, text2→message)
 *
 * `CustomToast` is intentionally not exported — it's a private renderer used
 * only by `toastConfig`.
 */

import React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import Toast, { ToastShowParams } from 'react-native-toast-message';
import { Ionicons } from '@react-native-vector-icons/ionicons';

import { ms } from '@/shared/utils/scale';

type ToastType = 'success' | 'error' | 'info' | 'warning';

// ─────────────────────────────────────────────────────────────
//  UI (private)
// ─────────────────────────────────────────────────────────────

// Toast accent colors are intentionally NOT pulled from the theme. They are
// semantic UI signals (green = success, red = error, …) that should read the
// same in light and dark mode, and keeping them here makes the toast
// self-contained — no theme migration is needed to drop it into another app.
const TYPE_COLORS: Record<ToastType, string> = {
  success: '#22C55E',
  error: '#EF4444',
  info: '#3B82F6',
  warning: '#F59E0B',
};

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TYPE_ICONS: Record<ToastType, IoniconsName> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  warning: 'warning',
};

interface CustomToastProps {
  type: ToastType;
  title: string;
  message?: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ type, title, message }) => {
  // Live width, so the toast resizes on rotation / iPad split view instead of
  // staying pinned to the cold-start width.
  const { width } = useWindowDimensions();
  const accentColor = TYPE_COLORS[type];

  return (
    <View
      className="mx-4 mt-2 min-h-14 flex-row items-center rounded-xl bg-background px-4 py-3"
      style={{
        borderColor: accentColor,
        borderWidth: 0.4,
        maxWidth: width - ms(32),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View className="mr-3">
        <Ionicons color={accentColor} name={TYPE_ICONS[type]} size={ms(24)} />
      </View>
      <View className="flex-1 justify-center">
        <Text
          className="mb-0.5 text-[15px] leading-5 font-opensans-semibold"
          numberOfLines={2}
          style={{ color: accentColor }}
        >
          {title}
        </Text>
        {message ? (
          <Text className="text-caption font-opensans text-text-gray" numberOfLines={2}>
            {message}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  Config — passed to <Toast />
// ─────────────────────────────────────────────────────────────

type ToastConfigProps = { text1?: string; text2?: string };

export const toastConfig = {
  success: (props: ToastConfigProps) => (
    <CustomToast message={props.text2} title={props.text1 ?? ''} type="success" />
  ),
  error: (props: ToastConfigProps) => (
    <CustomToast message={props.text2} title={props.text1 ?? ''} type="error" />
  ),
  info: (props: ToastConfigProps) => (
    <CustomToast message={props.text2} title={props.text1 ?? ''} type="info" />
  ),
  warning: (props: ToastConfigProps) => (
    <CustomToast message={props.text2} title={props.text1 ?? ''} type="warning" />
  ),
};

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Extends `ToastShowParams` from react-native-toast-message so callers can pass
 * any supported option (`position`, `visibilityTime`, `autoHide`, `onPress`,
 * `topOffset`, `bottomOffset`, `swipeable`, `props`, …) — see the library's
 * types for the full list.
 *
 * - `type` is overridden internally by each helper.
 * - `text1` / `text2` are renamed to `title` / `message` for ergonomics.
 */
export type ToastParams = Omit<ToastShowParams, 'type' | 'text1' | 'text2'> & {
  title: string;
  message?: string;
};

const show = (type: ToastType, params: ToastParams): void => {
  const { title, message, ...rest } = params;
  Toast.show({ ...rest, type, text1: title, text2: message });
};

export const showSuccessToast = (params: ToastParams): void => show('success', params);
export const showErrorToast = (params: ToastParams): void => show('error', params);
export const showInfoToast = (params: ToastParams): void => show('info', params);
export const showWarningToast = (params: ToastParams): void => show('warning', params);
