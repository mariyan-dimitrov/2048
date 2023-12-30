import PropTypes from 'prop-types';

function isInViewport(element, keyboardHeight = 0) {
  const { top, left, bottom, right } = element.getBoundingClientRect();

  PropTypes.checkPropTypes(
    {
      element: PropTypes.object.isRequired,
      keyboardHeight: PropTypes.number,
    },
    { element, keyboardHeight },
    'prop',
    'isInViewport'
  );

  return (
    top >= 0 &&
    left >= 0 &&
    bottom + keyboardHeight <= (window.innerHeight || document.documentElement.clientHeight) &&
    right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export default isInViewport;
