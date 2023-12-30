import PropTypes from 'prop-types';

const scrollToPropTypes = {
  el: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.object]),
  y: PropTypes.number,
  x: PropTypes.number,
  smoothScroll: PropTypes.bool,
};

const scrollTo = (el, y = 0, x = 0, smoothScroll = true) => {
  PropTypes.checkPropTypes(scrollToPropTypes, { el, y, x, smoothScroll }, 'prop', 'scrollTo');

  let scrollFunc = false;

  if (el?.scrollTo) {
    scrollFunc = 'scrollTo';
  } else if (el?.scroll) {
    scrollFunc = 'scroll';
  }

  if (scrollFunc) {
    if (smoothScroll) {
      el[scrollFunc]({ left: x, top: y, behavior: 'smooth' });
    } else {
      el[scrollFunc](x, y);
    }
  } else if (typeof el.scrollIntoView !== 'undefined') {
    el.scrollIntoView({ behavior: smoothScroll ? 'smooth' : 'auto' });
  }
};

export default scrollTo;
