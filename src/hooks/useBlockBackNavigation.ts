import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, usePreventRemove } from '@react-navigation/native';

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
 * Blocks back navigation (Android hardware back, iOS swipe-back, and any
 * programmatic `navigation.goBack()`) when `shouldBlock` is true, prompting
 * the user to confirm before leaving. On confirm, the originally-attempted
 * navigation action is dispatched so the user ends up where they wanted.
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

  const navigation = useNavigation();

  const handlePreventRemove = useCallback(
    ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
      Alert.alert(title, message, [
        { text: cancelLabel, style: 'cancel' },
        {
          text: confirmLabel,
          style: 'destructive',
          onPress: () => navigation.dispatch(data.action),
        },
      ]);
    },
    [navigation, title, message, cancelLabel, confirmLabel],
  );

  usePreventRemove(shouldBlock, handlePreventRemove);
}
