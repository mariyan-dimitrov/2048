import { v4 as uuidv4 } from 'uuid';

import getTileValueBasedOnHighestTileValue from './getTileValueBasedOnHighestTileValue';
import generateRandomNumberBetweenRange from './generateRandomNumberBetweenRange';

const min = 0;
const max = 3;

const generateRandomTile = highestTileValue => {
  return {
    value: getTileValueBasedOnHighestTileValue(highestTileValue),
    x: generateRandomNumberBetweenRange(min, max),
    y: generateRandomNumberBetweenRange(min, max),
    id: uuidv4(),
  };
};

export default generateRandomTile;
