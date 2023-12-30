import { useEffect, useCallback } from 'react';
import { setStoreMe } from 'store-me';
import i18next from 'i18next';

const useLocaleSwitch = () => {
  const changeLocale = useCallback(locale => {
    i18next.changeLanguage(locale);
  }, []);

  useEffect(() => {
    i18next.on('languageChanged', locale => setStoreMe({ locale }));
  }, []);

  return changeLocale;
};

export default useLocaleSwitch;
