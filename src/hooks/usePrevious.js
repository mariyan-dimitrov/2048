import { useRef } from 'react';

/*
  1. TODO: Add story
  2. Describe what does the "compareSameTypes" prop do (TLDR: control when the comparison should start, which is useful if initially the value is loading and it starts as undefined but ends as string, we don't want to track this as a change).
  3. Add PropTypes
*/

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
