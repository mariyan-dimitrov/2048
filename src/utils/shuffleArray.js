import PropTypes from 'prop-types';

const shuffleArrayPropTypes = {
  sourceArray: PropTypes.array,
};

const shuffleArray = sourceArray => {
  PropTypes.checkPropTypes(shuffleArrayPropTypes, { sourceArray }, 'parameter', 'shuffleArray.js');

  const array = [...sourceArray];
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

export default shuffleArray;
