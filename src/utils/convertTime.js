import PropTypes from 'prop-types';

import log from '../log';

const convertMap = {
  ns: {
    ms: t => t / 1000000,
    s: t => t / 1000000 / 1000,
    m: t => t / 1000000 / 1000 / 60,
    h: t => t / 1000000 / 1000 / 60 / 60,
    d: t => t / 1000000 / 1000 / 60 / 60 / 24,
  },
  ms: {
    ns: t => t * 1000000,
    s: t => t / 1000,
    m: t => t / 1000 / 60,
    h: t => t / 1000 / 60 / 60,
    d: t => t / 1000 / 60 / 60 / 24,
  },
  s: {
    ns: t => t * 1000 * 1000000,
    ms: t => t * 1000,
    m: t => t / 60,
    h: t => t / 60 / 60,
    d: t => t / 60 / 60 / 24,
  },
  m: {
    ns: t => t * 60 * 1000 * 1000000,
    ms: t => t * 60 * 1000,
    s: t => t * 60,
    h: t => t / 60,
    d: t => t / 60 / 24,
  },
  h: {
    ns: t => t * 60 * 60 * 1000000,
    ms: t => t * 60 * 60 * 1000,
    s: t => t * 60 * 60,
    m: t => t * 60,
    d: t => t / 24,
  },
  d: {
    ns: t => t * 24 * 60 * 60 * 1000000,
    ms: t => t * 24 * 60 * 60 * 1000,
    s: t => t * 24 * 60 * 60,
    m: t => t * 24 * 60,
    h: t => t * 24,
  },
  w: {
    ns: t => t * 7 * 24 * 60 * 60 * 1000 * 1000000,
    ms: t => t * 7 * 24 * 60 * 60 * 1000,
    s: t => t * 7 * 24 * 60 * 60,
    m: t => t * 7 * 24 * 60,
    h: t => t * 7 * 24,
    d: t => t * 7,
  },
};

const convertTimePropTypes = {
  time: PropTypes.string,
  to: PropTypes.string,
};

const convertTime = (time = '1h', to = 'ms') => {
  PropTypes.checkPropTypes(convertTimePropTypes, { time, to }, 'parameters', 'convertTime.js');

  const [value, format] = time.match(/[a-z]+|[^a-z]+/gi);
  const result = convertMap?.[format]?.[to] ? convertMap[format][to](value) : time;

  if (process.env.NODE_ENV === 'development') {
    result === time && log.error(`We don't support ${format}-${to} conversion.`);
  }

  return result;
};

export default convertTime;
