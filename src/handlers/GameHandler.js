import { getStoreMe, setStoreMe, useStoreMe } from 'store-me';
import { useEffect } from 'react';

import generateRandomTile from '../utils/generateRandomTile';
import { initialAppState } from '../_constants/stateMap';
import CONFIG from '../_constants/config';

const GameHandler = () => {
  const {
    numberOfTilesThatWillMove,
    numberOfTilesMoved,
    shouldStartNewGame,
    shouldAddNewTile,
    isActionEnabled,
    startNewGame,
    gameOver,
    tiles,
  } = useStoreMe(
    'numberOfTilesThatWillMove',
    'numberOfTilesMoved',
    'shouldStartNewGame',
    'shouldAddNewTile',
    'isActionEnabled',
    'startNewGame',
    'gameOver',
    'tiles'
  );

  useEffect(
    function addInitialTiles() {
      const generateStartingTiles = () => {
        if (tiles.length < 2 || shouldAddNewTile || startNewGame) {
          const { tiles } = getStoreMe('tiles');

          const newTile = generateRandomTile();
          const hasTileWithSameCoordinates = tiles.find(tile => tile.x === newTile.x && tile.y === newTile.y);

          if (hasTileWithSameCoordinates) {
            generateStartingTiles();
          } else {
            setStoreMe(({ tiles }) => ({ tiles: [...tiles, newTile], shouldAddNewTile: false, isActionEnabled: true }));
          }
        }
      };

      generateStartingTiles();
    },
    [tiles.length, startNewGame, shouldAddNewTile]
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
      if (tiles.length === CONFIG.gridSize ** 2 && isActionEnabled) {
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
    [tiles, isActionEnabled]
  );

  useEffect(
    function handleGameOver() {
      gameOver && setStoreMe(({ score, highScore }) => ({ highScore: Math.max(score, highScore) }));
    },
    [gameOver]
  );

  useEffect(
    function handleNewGameStart() {
      if (shouldStartNewGame) {
        setStoreMe(prevState => ({
          ...initialAppState,
          highScore: Math.max(prevState.highScore, prevState.score),
        }));
      }
    },
    [shouldStartNewGame]
  );
};

export default GameHandler;
