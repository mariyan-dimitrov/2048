import { setStoreMe } from 'store-me';

import useEventListener from '../hooks/useEventListener';

const size = 4;

const reverseAxisMap = {
  x: 'y',
  y: 'x',
};

const handleAction = (direction, axis) => {
  setStoreMe(({ tiles }) => {
    const newTiles = tiles.reduce(
      (result, tile) => ({
        ...result,
        [tile.id]: { ...tile },
      }),
      {}
    );

    for (let groupIndex = 0; groupIndex < size; groupIndex++) {
      const tilesInGroup = getTilesFromGroup(newTiles, groupIndex, axis, direction);

      for (let tileIndex = 0; tileIndex < tilesInGroup.length; tileIndex++) {
        const tileToMove = tilesInGroup[tileIndex];

        // TODO: Need to optimize the edge cases
        // if (tileToMove[axis] !== 0) {
        for (let indexToMove = 1; indexToMove <= size; indexToMove++) {
          if (direction === 'decrement') {
            tileToMove[axis] = tileToMove[axis] - 1;
          } else {
            tileToMove[axis] = tileToMove[axis] + 1;
          }

          const tilesInGroup = getTilesFromGroup(newTiles, groupIndex, axis, direction);
          const tileInNextPosition = tilesInGroup.find(tileInRow => tileInRow[axis] === tileToMove[axis]);

          if (tileInNextPosition) {
            if (tileInNextPosition.value === tileToMove.value && !tileInNextPosition.idBeingMerged) {
              newTiles[tileInNextPosition.id].idBeingMerged = tileToMove.id;
              tileToMove.goingToMergeIntoId = tileInNextPosition.id;
              break;
            }

            if (direction === 'decrement') {
              tileToMove[axis] = tileToMove[axis] + 1;
            } else {
              tileToMove[axis] = tileToMove[axis] - 1;
            }

            break;
          } else if (tileToMove[axis] < 0) {
            tileToMove[axis] = 0;
            break;
          } else if (tileToMove[axis] > size - 1) {
            tileToMove[axis] = size - 1;
            break;
          }
        }

        newTiles[tileToMove.id] = tileToMove;
        // }
      }
    }

    return { tiles: Object.values(newTiles) };
  });
};

const actionsMap = {
  ArrowLeft: () => handleAction('decrement', 'x'),
  ArrowRight: () => handleAction('increment', 'x'),
  ArrowDown: () => handleAction('increment', 'y'),
  ArrowUp: () => handleAction('decrement', 'y'),
};

const ControlHandler = () => useEventListener('keydown', ({ code }) => actionsMap[code] && actionsMap[code]());

export default ControlHandler;

const getTilesFromGroup = (tiles, rowIndex, axis, direction) => {
  let result = [];
  const tilesArray = Object.values(tiles);

  for (let index = 0; index < tilesArray.length; index++) {
    const tile = tilesArray[index];

    if (tile[reverseAxisMap[axis]] === rowIndex) {
      result.push({ ...tile });
    }
  }

  result = result.sort((tileA, tileB) => tileA[axis] - tileB[axis]);

  direction === 'increment' && result.reverse();

  return result;
};

/**
 *
 * [
 *    [false, false, false, false]
 *    [2, false, false, false]
 *    [false, false, false, false]
 *    [2, false, false, false]
 * ]
 */
