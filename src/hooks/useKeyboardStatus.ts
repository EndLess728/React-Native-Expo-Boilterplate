import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * Tracks the soft-keyboard visibility and height.
 *
 * Uses `keyboardWillShow`/`keyboardWillHide` on iOS (which fire before the
 * animation starts, so UI can respond synchronously) and `keyboardDidShow`/
 * `keyboardDidHide` on Android (the "will" events don't exist there).
 *
 * @example
 * const { isVisible, keyboardHeight } = useKeyboardStatus();
 * if (isVisible) hideFooter();
 */
export function useKeyboardStatus(): { isVisible: boolean; keyboardHeight: number } {
  const [isVisible, setIsVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setIsVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return { isVisible, keyboardHeight };
}
