import { setStoreMe, useStoreMe } from 'store-me';

import getTilesFromGroupAxis from '../utils/getTilesFromGroupAxis';
import useEventListener from '../hooks/useEventListener';
import CONFIG from '../_constants/config';

const actionsMap = {
  ArrowLeft: () => handleAction('decrement', 'x'),
  ArrowRight: () => handleAction('increment', 'x'),
  ArrowDown: () => handleAction('increment', 'y'),
  ArrowUp: () => handleAction('decrement', 'y'),
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

    let numberOfTilesThatWillMove = 0;

    for (let groupIndex = 0; groupIndex < CONFIG.gridSize; groupIndex++) {
      const tilesInGroup = getTilesFromGroupAxis(newTiles, groupIndex, axis, direction);

      for (let tileIndex = 0; tileIndex < tilesInGroup.length; tileIndex++) {
        const tileToMove = tilesInGroup[tileIndex];

        // TODO: Need to optimize the edge cases
        // if (tileToMove[axis] !== 0) {
        for (let indexToMove = 1; indexToMove <= CONFIG.gridSize; indexToMove++) {
          if (direction === 'decrement') {
            tileToMove[axis] = tileToMove[axis] - 1;
          } else {
            tileToMove[axis] = tileToMove[axis] + 1;
          }

          const tilesInGroup = getTilesFromGroupAxis(newTiles, groupIndex, axis, direction);
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
          } else if (tileToMove[axis] > CONFIG.gridSize - 1) {
            tileToMove[axis] = CONFIG.gridSize - 1;
            break;
          }
        }

        if (tileToMove.x !== newTiles[tileToMove.id].x || tileToMove.y !== newTiles[tileToMove.id].y) {
          numberOfTilesThatWillMove++;
        }

        newTiles[tileToMove.id] = tileToMove;
        // }
      }
    }

    return {
      tiles: Object.values(newTiles),
      numberOfTilesThatWillMove,
      areControlsLocked: numberOfTilesThatWillMove > 0,
    };
  });
};

const ControlHandler = () => {
  const { areControlsLocked } = useStoreMe('areControlsLocked');

  useEventListener('keydown', ({ code }) => !areControlsLocked && actionsMap[code] && actionsMap[code]());
};

export default ControlHandler;
