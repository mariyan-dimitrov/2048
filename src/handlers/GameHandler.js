import { useEffect } from 'react';

import generateRandomTile from '../utils/generateRandomTile';
import { getStoreMe, setStoreMe, useStoreMe } from 'store-me';

const Gamehandler = () => {
  const { tiles, addNewTile } = useStoreMe('tiles', 'addNewTile');

  useEffect(
    function startGame() {
      const generateStartingTiles = () => {
        if (tiles.length < 2 || addNewTile) {
          const { tiles } = getStoreMe('tiles');

          const newTile = generateRandomTile();
          const hasTileWithSameCoordinates = tiles.find(tile => tile.x === newTile.x && tile.y === newTile.y);

          if (hasTileWithSameCoordinates) {
            generateStartingTiles();
          } else {
            setStoreMe(({ tiles }) => ({ tiles: [...tiles, newTile], addNewTile: false }));
          }
        }
      };

      generateStartingTiles();
    },
    [tiles.length, addNewTile]
  );
};

export default Gamehandler;
