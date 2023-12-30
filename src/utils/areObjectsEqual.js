import PropTypes from 'prop-types';

const areObjectsEqualPropTypes = {
  obj1: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  obj2: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

const areObjectsEqual = (obj1, obj2) => {
  PropTypes.checkPropTypes(areObjectsEqualPropTypes, { obj1, obj2 }, 'parameters', 'areObjectsEqual.js');

  if (obj1 == null && obj2 == null) {
    return true;
  } else if (obj1 == null || obj2 == null) {
    return false;
  }

  for (let p in obj1) {
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
      return false;
    }

    switch (typeof obj1[p]) {
      case 'object':
        if (!areObjectsEqual(obj1[p], obj2[p])) {
          return false;
        }

        break;

      case 'function':
        if (
          typeof obj2[p] == 'undefined' ||
          obj2[p] == null ||
          (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())
        ) {
          return false;
        }

        break;

      default:
        if (obj1[p] !== obj2[p]) {
          return false;
        }
    }
  }

  for (let p in obj2) {
    if (typeof obj1[p] == 'undefined' && obj1[p] !== obj2[p]) {
      return false;
    }
  }

  return true;
};

export default areObjectsEqual;
