const reverseAxisMap = {
  x: 'y',
  y: 'x',
};

const getTilesFromGroupAxis = (tiles, rowIndex, axis, direction) => {
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

export default getTilesFromGroupAxis;
