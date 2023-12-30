import PropTypes from 'prop-types';

import isObject from './isObject';

const deepFreezePropTypes = {
  obj: PropTypes.object,
};

const deepFreeze = obj => {
  PropTypes.checkPropTypes(deepFreezePropTypes, { obj }, 'parameter', 'deepFreeze.js');

  Object.freeze(obj);

  for (let key in obj) {
    isObject(obj[key]) && deepFreeze(obj[key]);
  }

  return obj;
};

export default deepFreeze;
