import PropTypes from 'prop-types';

const getSearchQueryFromObjectPropTypes = {
  obj: PropTypes.object,
};

function getSearchQueryFromObject(obj) {
  PropTypes.checkPropTypes(getSearchQueryFromObjectPropTypes, { obj }, 'parameter', 'getSearchQueryFromObject.js');

  let result = '';

  for (let key in obj) {
    if (obj[key]) {
      result += `&${key}=${encodeURIComponent(obj[key])}`;
    }
  }

  return result.replace('&', '?');
}

export default getSearchQueryFromObject;
