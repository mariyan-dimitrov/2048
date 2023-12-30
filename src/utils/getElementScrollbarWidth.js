import PropTypes from 'prop-types';

const getElementScrollbarWidthPropTypes = {
  el: PropTypes.instanceOf(HTMLElement),
};

const getElementScrollbarWidth = el => {
  PropTypes.checkPropTypes(getElementScrollbarWidthPropTypes, { el }, 'parameter', 'getElementScrollbarWidth.js');

  return el ? el.offsetWidth - el.clientWidth : 0;
};

export default getElementScrollbarWidth;
