import local_storage from '../utils/local_storage';

export const persistenceKeys = new Set([]);

export const syncKeys = new Set([]);

const appState = {
  themeMode: 'light',
  tiles: [],
  gameOver: false,
  shouldAddNewTile: false,
  hasActionEnded: true,
  numberOfTilesThatWillMove: 0,
  numberOfTilesMoved: 0,
};

const functions = {
  i18n: text => text,
};

export const generateInitialState = () => {
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
      console.error(`State keys for persistence were not found in state object: ${notExistingStateKeys.join(', ')}`);
  }

  return stateMap;
};
