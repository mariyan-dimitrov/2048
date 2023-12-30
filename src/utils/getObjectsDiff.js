import getValueType from './getValueType';

const getObjectsDiff = (a, b) => {
  if (getValueType(a) !== 'object' || getValueType(b) !== 'object') {
    return {};
  }

  const diff = {};

  for (let key in b) {
    if (a.hasOwnProperty(key)) {
      const aValue = a[key];
      const bValue = b[key];
      const aType = getValueType(aValue);
      const bType = getValueType(bValue);

      if (aType !== bType) {
        diff[key] = b[key];
      } else if (['array', 'object'].includes(bType)) {
        if (bType === 'array') {
          const changes = [];

          bValue.forEach((value, i) => {
            if (aValue.hasOwnProperty(i)) {
              if (
                aValue[i] !== bValue[i] &&
                !['array', 'object', 'function'].includes(getValueType(aValue[i])) &&
                !['array', 'object', 'function'].includes(getValueType(bValue[i]))
              ) {
                changes.push(value);
              }
            } else {
              changes.push(value);
            }
          });

          if (changes.length) {
            diff[key] = changes;
          }
        } else {
          const changes = {};

          for (let n in bValue) {
            if (aValue.hasOwnProperty(n)) {
              if (
                aValue[n] !== bValue[n] &&
                !['array', 'object', 'function'].includes(getValueType(aValue[n])) &&
                !['array', 'object', 'function'].includes(getValueType(bValue[n]))
              ) {
                changes[n] = bValue[n];
              }
            } else {
              changes[n] = bValue[n];
            }
          }

          if (Object.keys(changes).length) {
            diff[key] = changes;
          }
        }
      } else if (aValue !== bValue && bType !== 'function') {
        diff[key] = b[key];
      }
    } else {
      diff[key] = b[key];
    }
  }

  return diff;
};

export default getObjectsDiff;
