import local_storage from '../utils/local_storage';
import log from '../utils/log';

/* Add to "persistenceKeys" any state key that you want to be persisted in the local storage. */
export const persistenceKeys = new Set([]);

/* Add to "syncKeys" any state key that you want to be update real time across opened tabs and windows. */
export const syncKeys = new Set([]);

/* START state declarations */

const appState = {};

const functions = {
  i18n: text => text,
};

/* END state declarations */

export const generateInitialState = routes => {
  const stateMap = {
    ...appState,
    ...functions,
  };

  persistenceKeys.forEach(key => {
    stateMap[key] = local_storage.get(key) ?? stateMap[key];
  });

  Object.freeze(stateMap);

  if (process.env.NODE_ENV === 'development') {
    let notExistingStateKeys = [];

    persistenceKeys.forEach(key => !stateMap.hasOwnProperty(key) && notExistingStateKeys.push(key));

    notExistingStateKeys.length &&
      log.error(`State keys for persistence were not found in state object: ${notExistingStateKeys.join(', ')}`);
  }

  return stateMap;
};
