const local_storage = {
  set: (key, data) => {
    let valueToSet = data;

    if (typeof data === 'object') {
      valueToSet = JSON.stringify(data);
    }

    localStorage.setItem(`nexo.${key}`, valueToSet);
  },
  get: key => {
    const localStorageKey = `nexo.${key}`;
    let result;

    try {
      result = JSON.parse(localStorage.getItem(localStorageKey));
    } catch (e) {
      result = localStorage.getItem(localStorageKey);
    }

    if (result === 'undefined' || result === null) {
      return undefined;
    }

    return result;
  },
  remove: key => {
    if (Array.isArray(key)) {
      key.forEach(k => {
        localStorage.removeItem(`nexo.${k}`);
      });
    } else {
      localStorage.removeItem(`nexo.${key}`);
    }
  },
};

export default local_storage;
