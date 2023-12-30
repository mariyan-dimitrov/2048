const generateDevFileNameClassName = children => {
  const child = Array.isArray(children) ? children.filter(Boolean)[0] : children;
  const result = [];

  const getName = filePathName => (filePathName ? filePathName.split('/').pop().split('.').shift() : '');
  const extractFileName = child => getName(child?._source?.fileName);
  const extractOwnerFileName = child => getName(child?._owner?._debugSource?.fileName);

  result.push(extractOwnerFileName(child));
  result.push(extractFileName(child));

  return [...new Set(result)].join('__');
};

export default generateDevFileNameClassName;
