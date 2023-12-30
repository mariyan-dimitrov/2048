import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/* Usage: const debouncedValue = useDebounce([primitiveValue, delayInMS]); */

const useDebouncePropTypes = {
  props: PropTypes.oneOf([PropTypes.array, PropTypes.string, PropTypes.number]),
};

const useDebounce = props => {
  const value = props[0] || '';
  const delay = props[1] || 100;
  const [state, setState] = useState(value);
  const previousValue = useRef(value);
  const previousTimeOut = useRef(null);

  useEffect(() => {
    return () => clearTimeout(previousTimeOut.current);
  }, []);

  useEffect(() => {
    if (previousValue.current !== value) {
      previousValue.current = value;
    }

    clearTimeout(previousTimeOut.current);

    previousTimeOut.current = setTimeout(() => {
      if (state !== previousValue.current) {
        setState(previousValue.current);
      }
    }, delay);
  }, [delay, state, value]);

  PropTypes.checkPropTypes(useDebouncePropTypes, props, 'prop', 'useDebounce');

  return state;
};

export default useDebounce;
