import { useEffect, useRef, useCallback } from 'react';

const useOutsideClickHandler = callback => {
  const domNodeRef = useRef();

  const onDocumentClick = useCallback(
    e => {
      if (callback && domNodeRef.current && !domNodeRef.current.contains(e.target)) {
        callback();
      }
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('mousedown', onDocumentClick);

    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [onDocumentClick]);

  return domNodeRef;
};

export default useOutsideClickHandler;
