const memoize = fn => {
  const cache = {};

  return (...args) => {
    let cacheArgs;

    try {
      cacheArgs = JSON.stringify(args);
    } catch (e) {
      cacheArgs = null;
    }

    if (typeof cacheArgs === 'string' && cache[cacheArgs]) {
      return cache[cacheArgs];
    } else {
      return (cache[cacheArgs] = fn(...args));
    }
  };
};

export default memoize;
