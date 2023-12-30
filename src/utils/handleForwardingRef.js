const handleForwardingRef = (node, elRef) => {
  if (elRef) {
    if (typeof elRef === 'object') {
      // eslint-disable no-param-reassign
      elRef.current = node;
    } else if (typeof elRef === 'function') {
      elRef(node);
    }
  }
};

export default handleForwardingRef;
