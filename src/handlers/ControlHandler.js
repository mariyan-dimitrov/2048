import { setStoreMe } from 'store-me';

import useEventListener from '../hooks/useEventListener';

const size = 4;

const sortTilesForRow = (tileA, tileB) => tileA.x - tileB.x;

const actionsMap = {
  ArrowLeft: () => {
    setStoreMe(({ tiles }) => {
      const newTiles = tiles.reduce(
        (result, tile) => ({
          ...result,
          [tile.id]: { ...tile },
        }),
        {}
      );

      for (let rowIndex = 0; rowIndex < size; rowIndex++) {
        const tilesInRow = getTilesFromRow(newTiles, rowIndex);

        for (let tileIndex = 0; tileIndex < tilesInRow.length; tileIndex++) {
          const tileToMove = tilesInRow[tileIndex];

          if (tileToMove.x !== 0) {
            for (let indexToMove = 1; indexToMove <= size; indexToMove++) {
              tileToMove.x = tileToMove.x - 1;

              const tilesInRow = getTilesFromRow(newTiles, rowIndex);
              const tileInNextPosition = tilesInRow.find(tileInRow => tileInRow.x === tileToMove.x);

              if (tileInNextPosition) {
                if (tileInNextPosition.value === tileToMove.value && !tileInNextPosition.idBeingMerged) {
                  newTiles[tileInNextPosition.id].idBeingMerged = tileToMove.id;
                  tileToMove.goingToMergeIntoId = tileInNextPosition.id;
                  break;
                }

                tileToMove.x = tileToMove.x + 1;
                break;
              } else if (tileToMove.x < 0) {
                tileToMove.x = 0;
                break;
              }
            }

            newTiles[tileToMove.id] = tileToMove;
          }
        }
      }

      return { tiles: Object.values(newTiles) };
    });
  },
  // ArrowRight: () => handleInput('increment', 'x'),
  // ArrowDown: () => handleInput('increment', 'y'),
  // ArrowUp: () => handleInput('decrement', 'y'),
};

const ControlHandler = () => useEventListener('keydown', ({ code }) => actionsMap[code] && actionsMap[code]());

export default ControlHandler;

const getTilesFromRow = (tiles, rowIndex) => {
  const result = [];
  const tilesArray = Object.values(tiles);

  for (let index = 0; index < tilesArray.length; index++) {
    const tile = tilesArray[index];

    if (tile.y === rowIndex) {
      result.push({ ...tile });
    }
  }

  return result.sort(sortTilesForRow);
};

const getTilesFromColumn = (tiles, columnIndex) => {};

/**
 *
 * [
 *    [false, false, false, false]
 *    [2, false, false, false]
 *    [false, false, false, false]
 *    [2, false, false, false]
 * ]
 */
