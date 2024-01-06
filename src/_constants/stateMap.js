import local_storage from '../utils/local_storage';

export const persistenceKeys = new Set(['highScore', 'highestTileValue', 'score', 'tiles']);

export const syncKeys = new Set([]);

export const initialAppState = {
  themeMode: 'light',
  tiles: [],
  highestTileValue: 2,
  gameOver: false,
  shouldAddNewTile: false,
  isActionEnabled: true,
  shouldStartNewGame: false,
  numberOfTilesThatWillMove: 0,
  numberOfTilesMoved: 0,
  score: 0,
  highScore: 0,
  lastAction: false,
};

const functions = {
  i18n: text => text,
};

export const generateInitialState = () => {
  const stateMap = {
    ...initialAppState,
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
