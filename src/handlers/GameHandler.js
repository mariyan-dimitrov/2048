import { getStoreMe, setStoreMe, useStoreMe } from 'store-me';
import { useEffect } from 'react';

import generateRandomTile from '../utils/generateRandomTile';

const Gamehandler = () => {
  const { numberOfTilesThatWillMove, numberOfTilesMoved, shouldAddNewTile, tiles } = useStoreMe(
    'numberOfTilesThatWillMove',
    'numberOfTilesMoved',
    'shouldAddNewTile',
    'tiles'
  );

  useEffect(
    function startGame() {
      const generateStartingTiles = () => {
        if (tiles.length < 2 || shouldAddNewTile) {
          const { tiles } = getStoreMe('tiles');

          const newTile = generateRandomTile();
          const hasTileWithSameCoordinates = tiles.find(tile => tile.x === newTile.x && tile.y === newTile.y);

          if (hasTileWithSameCoordinates) {
            generateStartingTiles();
          } else {
            setStoreMe(({ tiles }) => ({ tiles: [...tiles, newTile], shouldAddNewTile: false }));
          }
        }
      };

      generateStartingTiles();
    },
    [tiles.length, shouldAddNewTile]
  );

  useEffect(
    function addTileAfterAllTilesMovements() {
      numberOfTilesThatWillMove &&
        numberOfTilesMoved === numberOfTilesThatWillMove &&
        setStoreMe({
          shouldAddNewTile: true,
          numberOfTilesThatWillMove: 0,
          numberOfTilesMoved: 0,
          areControlsLocked: false,
        });
    },
    [numberOfTilesThatWillMove, numberOfTilesMoved]
  );
};

export default Gamehandler;
