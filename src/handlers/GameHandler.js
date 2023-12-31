import { getStoreMe, setStoreMe, useStoreMe } from 'store-me';
import { useEffect } from 'react';

import generateRandomTile from '../utils/generateRandomTile';
import CONFIG from '../_constants/config';

const Gamehandler = () => {
  const { numberOfTilesThatWillMove, numberOfTilesMoved, shouldAddNewTile, hasActionEnded, gameOver, tiles } =
    useStoreMe(
      'numberOfTilesThatWillMove',
      'numberOfTilesMoved',
      'shouldAddNewTile',
      'hasActionEnded',
      'gameOver',
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
            setStoreMe(({ tiles }) => ({ tiles: [...tiles, newTile], shouldAddNewTile: false, hasActionEnded: true }));
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
          numberOfTilesThatWillMove: 0,
          numberOfTilesMoved: 0,
          shouldAddNewTile: true,
        });
    },
    [numberOfTilesThatWillMove, numberOfTilesMoved]
  );

  useEffect(
    function detectEndOfGame() {
      if (tiles.length === CONFIG.gridSize ** 2 && hasActionEnded) {
        const allTilesObject = {};
        let doesHaveActionsLeft = false;

        for (let index = 0; index < tiles.length; index++) {
          const { x, y, value } = tiles[index];

          allTilesObject[`${x}-${y}`] = value;
        }

        const matrix = [];

        for (let x = 0; x < CONFIG.gridSize; x++) {
          matrix[x] = [];

          for (let y = 0; y < CONFIG.gridSize; y++) {
            matrix[x][y] = allTilesObject[`${y}-${x}`];
          }
        }

        for (let x = 0; x < CONFIG.gridSize; x++) {
          for (let y = 0; y < CONFIG.gridSize; y++) {
            const currentValue = allTilesObject[`${x}-${y}`];
            const nextValueInRow = allTilesObject[`${x + 1}-${y}`];

            if (currentValue === nextValueInRow) {
              doesHaveActionsLeft = true;
            } else {
              const nextValueInColumn = allTilesObject[`${x}-${y + 1}`];

              if (currentValue === nextValueInColumn) {
                doesHaveActionsLeft = true;
              }
            }
          }
        }

        setStoreMe({ gameOver: !doesHaveActionsLeft });
      }
    },
    [tiles, hasActionEnded]
  );

  useEffect(() => {
    if (gameOver) {
      window.alert('Game ended');
    }
  }, [gameOver]);
};

export default Gamehandler;
