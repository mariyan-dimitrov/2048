import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import generateRandomTile from '../utils/generateRandomTile';
import { setStoreMe, useStoreMe } from 'store-me';

const Gamehandler = () => {
  const { tiles } = useStoreMe('tiles');

  useEffect(function startGame() {
    const generateStartingTiles = () => {
      // if (tiles.length < 2) {
      //   const newTile = generateRandomTile();
      //   const hasTileWithSameCoordinates = tiles.find(tile => tile.x === newTile.x && tile.y === newTile.y);

      //   if (hasTileWithSameCoordinates) {
      //     generateStartingTiles();
      //   } else {
      //     setStoreMe(({ tiles }) => ({ tiles: [...tiles, newTile] }));
      //   }
      // }

      setStoreMe({
        tiles: [
          { x: 0, y: 2, value: 2, id: uuidv4() },

          { x: 1, y: 2, value: 2, id: uuidv4() },
          { x: 2, y: 2, value: 2, id: uuidv4() },
          { x: 3, y: 2, value: 2, id: uuidv4() },

          { x: 1, y: 1, value: 2, id: uuidv4() },
          { x: 2, y: 1, value: 2, id: uuidv4() },
          { x: 3, y: 1, value: 2, id: uuidv4() },
        ],
      });
    };

    generateStartingTiles();
  }, []);
};

export default Gamehandler;
