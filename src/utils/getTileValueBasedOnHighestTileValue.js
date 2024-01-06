const getTileValueBasedOnHighestTileValue = highestTileValue => {
  const possibleNewTileValues = getPossibleNewTileValues(highestTileValue);

  return selectRandomTileValue(possibleNewTileValues);
};

export default getTileValueBasedOnHighestTileValue;

const getPossibleNewTileValues = value => {
  const results = [];
  let newValue = value;

  while (newValue !== 1) {
    results.push(newValue);
    newValue = newValue / 2;
  }

  return results;
};

function selectRandomTileValue(possibleNewTileValue, weightingFactor = 0.25) {
  const totalWeight = possibleNewTileValue.reduce((acc, _, index) => acc + 1 / Math.pow(weightingFactor, index), 0);
  const randomNumber = Math.random() * totalWeight;

  let cumulativeWeight = 0;

  for (let index = 0; index < possibleNewTileValue.length; index++) {
    cumulativeWeight += 1 / Math.pow(weightingFactor, index);

    if (randomNumber <= cumulativeWeight) {
      return possibleNewTileValue[index];
    }
  }

  return possibleNewTileValue[possibleNewTileValue.length - 1];
}
