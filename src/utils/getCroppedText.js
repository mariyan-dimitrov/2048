import PropTypes from 'prop-types';

export const textSizes = {
  extraSmall: { from: 6, to: -4 },
  small: { from: 6, to: -6 },
  medium: { from: 9, to: -6 },
  large: { from: 10, to: -13 },
};

const minTextLengthBySize = {
  extraSmall: 12,
  small: 15,
  medium: 20,
  large: 25,
};

const getCroppedTextPropTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.oneOf(Object.keys(textSizes)),
};

const getCroppedText = (text, size = 'medium') => {
  const { from, to } = textSizes[size] || {};

  PropTypes.checkPropTypes(getCroppedTextPropTypes, { text, size }, 'prop', 'getCroppedText');

  return text.length < minTextLengthBySize[size] ? text : text.slice(0, from) + '...' + text.slice(to);
};

export default getCroppedText;
