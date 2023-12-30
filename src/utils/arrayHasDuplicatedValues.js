import PropTypes from 'prop-types';

const arrayHasDuplicatedValuesPropTypes = {
  array: PropTypes.array.isRequired,
};

const arrayHasDuplicatedValues = array => {
  PropTypes.checkPropTypes(arrayHasDuplicatedValuesPropTypes, { array }, 'parameter', 'arrayHasDuplicatedValues.js');

  return array.length !== new Set(array).size;
};

export default arrayHasDuplicatedValues;
