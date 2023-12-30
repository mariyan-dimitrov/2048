import PropTypes from 'prop-types';

const getElementStylePropTypes = {
  element: PropTypes.instanceOf(HTMLElement),
  cssProperty: PropTypes.string,
};

const getElementStyle = (element, cssProperty) => {
  let strValue = undefined;

  PropTypes.checkPropTypes(getElementStylePropTypes, { element, cssProperty }, 'parameters', 'getElementStyle.js');

  if (window.getComputedStyle) {
    strValue = window.getComputedStyle(element, null).getPropertyValue(cssProperty);
  } else if (element.currentStyle) {
    try {
      strValue = element.currentStyle[cssProperty];
    } catch (e) {
      strValue = undefined;
    }
  }

  return strValue;
};

export default getElementStyle;
