import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import generateRandomTile from '../utils/generateRandomTile';
import { setStoreMe, useStoreMe } from 'store-me';
const size = 4;

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
        tiles: [...Array(size)]
          .map((_, x) =>
            [...Array(size)].map((_, y) => ({
              x,
              y,
              value: 2,
              id: uuidv4(),
            }))
          )
          .flat(),
      });
    };

    generateStartingTiles();
  }, []);
};

export default Gamehandler;
