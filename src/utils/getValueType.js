import isObject from './isObject';

const getValueType = value => {
  if (Array.isArray(value)) {
    return 'array';
  } else if (isObject(value)) {
    return 'object';
  } else if (value === null) {
    return 'null';
  } else {
    return typeof value;
  }
};

export default getValueType;
