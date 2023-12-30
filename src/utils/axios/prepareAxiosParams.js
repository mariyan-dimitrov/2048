import log from '../log';

const prepareAxiosParams = params => {
  const result = {};

  for (let key in params) {
    if (key === 'controller') {
      result.signal = params[key].signal;
    } else {
      result[key] = params[key];
    }

    if (process.env.NODE_ENV === 'development') {
      if (key === 'signal') {
        log.error(
          'It appears you want to use "new AbortController();" for an API request. We have small abstraction over this, so you should pass the entire controller as a parameter. Search for apiServices calls in the project if you want to see how.'
        );
      }
    }
  }

  return result;
};

export default prepareAxiosParams;
