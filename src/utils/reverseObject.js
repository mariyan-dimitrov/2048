const reverseObject = object =>
  Object.entries(object).reduce((result, entry) => {
    const [key, value] = entry;

    return { ...result, [value]: isNaN(Number(key)) ? key : Number(key) };
  }, {});

export default reverseObject;
