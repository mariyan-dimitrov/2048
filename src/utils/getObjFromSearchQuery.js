import PropTypes from 'prop-types';

const getObjFromSearchQueryPropTypes = {
  queryString: PropTypes.string,
};

const getObjFromSearchQuery = (queryString = '') => {
  PropTypes.checkPropTypes(getObjFromSearchQueryPropTypes, { queryString }, 'parameter', 'getObjFromSearchQuery.js');

  const query = queryString.replace('?', '').split('&');
  const result = {};

  query.forEach(item => {
    const [key, value] = item.split('=');

    if (key && value) {
      result[key] = decodeURIComponent(value);
    }
  });

  return result;
};

export default getObjFromSearchQuery;
