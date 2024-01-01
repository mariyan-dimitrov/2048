import { storeMeSubscriber } from 'store-me';
import { persistenceKeys } from '../_constants/stateMap';
import local_storage from '../utils/local_storage';
import { useEffect } from 'react';

const LocalStorageSetter = () => {
  useEffect(() => {
    const unsubsribe = storeMeSubscriber([...persistenceKeys], state => {
      for (const key in state) {
        local_storage.set(key, state[key]);
      }
    });

    return () => unsubsribe();
  }, []);
};

export default LocalStorageSetter;
