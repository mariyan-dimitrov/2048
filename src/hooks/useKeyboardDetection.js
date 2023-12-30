import { setStoreMe, useStoreMe } from 'store-me';
import { useEffect, useRef } from 'react';

import { isDevice, isIOS } from '../_constants/devices';
import useEventListener from './useEventListener';
import useWindowSize from './useWindowSize';

const nativeKeyboardHidingAnimationMS = 400;
const focusableElements = ['INPUT', 'TEXTAREA'];

const useKeyboardDetection = () => {
  const { isDeviceKeyboardOpened } = useStoreMe('isDeviceKeyboardOpened');
  const { orientation, windowResized } = useWindowSize();
  const focusedElementRef = useRef(false);
  const closingTimerRef = useRef(false);
  const isPortrait = orientation === 'portrait';
  const screenHeightRef = useRef({
    portraitInitialHeight: isPortrait ? window.innerHeight : window.innerWidth,
    landscapeInitialHeight: isPortrait ? window.innerWidth : window.innerHeight,
  });

  const checkFocusedElement = () => {
    if (!isDeviceKeyboardOpened && focusableElements.includes(document.activeElement.tagName)) {
      focusedElementRef.current = document.activeElement;
      focusedElementRef.current.addEventListener('blur', handleBlur);
      setStoreMe({ isDeviceKeyboardOpened: true });
    }
  };

  const handleBlur = () => {
    if (focusedElementRef.current) {
      focusedElementRef.current.removeEventListener('blur', handleBlur);
      focusedElementRef.current = false;

      closingTimerRef.current = setTimeout(() => {
        setStoreMe({ isDeviceKeyboardOpened: false });
      }, nativeKeyboardHidingAnimationMS);
    }
  };

  useEventListener('focus', () => isDevice && checkFocusedElement(), document);
  useEventListener('click', () => isDevice && checkFocusedElement(), document);
  useEventListener('blur', () => isDevice && handleBlur(), document);

  useEffect(
    function checkIfAndroidKeyboardIsOpened() {
      const minKeyboardHeight = 280;
      const currentScreenHeight = window.innerHeight;
      const { portraitInitialHeight, landscapeInitialHeight } = screenHeightRef.current;
      const lastScreenHeight = isPortrait ? portraitInitialHeight : landscapeInitialHeight;

      setStoreMe({
        isDeviceKeyboardOpened: lastScreenHeight - currentScreenHeight > minKeyboardHeight,
      });
    },
    [windowResized, isPortrait]
  );

  useEffect(() => {
    return () => {
      clearTimeout(closingTimerRef.current);
    };
  }, []);
};

export default useKeyboardDetection;
