import { setStoreMe } from 'store-me';
import { useEffect } from 'react';

const useHandleTabFocusAndBlur = () => {
  useEffect(function addEventListenerForAppsVisibility() {
    const onVisibilityChange = () => {
      setStoreMe({ isAppFocused: document.visibilityState === 'visible' });
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);
};

export default useHandleTabFocusAndBlur;
