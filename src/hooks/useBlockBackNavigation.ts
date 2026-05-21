import { useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface Options {
  /** Title shown in the confirm dialog. Defaults to "Discard changes?". */
  title?: string;
  /** Body of the confirm dialog. Defaults to a generic warning. */
  message?: string;
  /** Cancel button label. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Confirm/leave button label. Defaults to "Leave". */
  confirmLabel?: string;
}

/**
 * Blocks back navigation (Android hardware back + React Navigation gesture)
 * when `shouldBlock` is true, prompting the user to confirm.
 *
 * Common use case: a form with unsaved changes.
 *
 * @example
 * const dirty = useFormState();
 * useBlockBackNavigation(dirty, {
 *   title: 'Unsaved changes',
 *   message: 'Your edits will be lost.',
 * });
 */
export function useBlockBackNavigation(shouldBlock: boolean, options: Options = {}): void {
  const {
    title = 'Discard changes?',
    message = 'You have unsaved changes. Are you sure you want to leave?',
    cancelLabel = 'Cancel',
    confirmLabel = 'Leave',
  } = options;

  const promptUser = useCallback(
    (onConfirm: () => void): void => {
      Alert.alert(title, message, [
        { text: cancelLabel, style: 'cancel' },
        { text: confirmLabel, style: 'destructive', onPress: onConfirm },
      ]);
    },
    [title, message, cancelLabel, confirmLabel],
  );

  // Block the Android hardware back button while the screen is focused.
  useFocusEffect(
    useCallback(() => {
      if (!shouldBlock) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        promptUser(() => BackHandler.exitApp());
        return true; // prevent default back behavior
      });
      return () => sub.remove();
    }, [shouldBlock, promptUser]),
  );
}
