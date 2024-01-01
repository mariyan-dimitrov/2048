import { useRef } from 'react';

const usePrevious = (value, compareSameTypes) => {
  const isChanged = useRef(false);
  const previous = useRef(value);
  const current = useRef(value);

  if (compareSameTypes && typeof current.current !== typeof value && Boolean(current.current) === Boolean(value)) {
    current.current = value;
  }

  if (
    current.current !== value &&
    (!compareSameTypes || (compareSameTypes && typeof current.current === typeof value))
  ) {
    previous.current = current.current;
    isChanged.current = Date.now();
    current.current = value;
  }

  return [previous.current, current.current, isChanged.current];
};

export default usePrevious;
