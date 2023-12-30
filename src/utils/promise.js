/* eslint-disable no-param-reassign */
import log from './log';

// TODO: Now we retry 3 times on any error. Find out on which BE errors we should do the retrying.
const promise = (request, bodyParams) => {
  const { numberOfRetries = 3, waitTimeAfterResponse = 1000, skipRetrying = true } = bodyParams || {};
  let requestCount = 0;
  let timeout;

  if (bodyParams && bodyParams.controller) {
    const abortCopy = bodyParams.controller.abort.bind(bodyParams.controller);

    bodyParams.controller.abort = () => {
      !bodyParams.controller.resolved && abortCopy();
      clearTimeout(timeout);
    };
  }

  return new Promise((resolve, reject) => {
    const handleOnError = response => {
      const isWalletError = !response.response;
      const errorData = isWalletError ? response : response.response.data || response.response;

      if (bodyParams && bodyParams.controller) {
        bodyParams.controller.resolved = true;
      }

      if (
        response instanceof Error &&
        (response instanceof TypeError || response instanceof SyntaxError || response instanceof ReferenceError)
      ) {
        log.error(response);
      }

      // If the controller.abort() is called, we don't want to have a .catch() event, se we just exit the promise
      if (errorData?.code === 'ERR_CANCELED') {
        clearTimeout(timeout);

        return;
      }

      // To have the error code accessible within the .catch body
      if (response.code) {
        errorData.axiosCode = response.code;

        if (!errorData.errors) {
          errorData.errors = [response.code];
        }
      }

      if (skipRetrying || requestCount >= numberOfRetries || !bodyParams?.controller) {
        clearTimeout(timeout);
        reject(errorData);
      } else {
        if (waitTimeAfterResponse) {
          timeout = setTimeout(makeRequest, waitTimeAfterResponse);
        } else {
          makeRequest();
        }
      }
    };

    const handleOnSuccess = response => {
      const { headers, errors, data } = typeof response === 'object' ? response : {};

      if (bodyParams && bodyParams.controller) {
        bodyParams.controller.resolved = true;
      }

      if (skipRetrying || requestCount >= numberOfRetries || !hasErrors(errors)) {
        clearTimeout(timeout);
        resolve(
          (process.env.FAST_REFRESH && process.env.NODE_ENV === 'development') || headers ? data || response : response
        );
      } else {
        if (waitTimeAfterResponse) {
          timeout = setTimeout(makeRequest, waitTimeAfterResponse);
        } else {
          makeRequest();
        }
      }
    };

    const makeRequest = () => {
      requestCount++;

      request(handleOnSuccess, handleOnError);
    };

    makeRequest();
  });
};

export default promise;

const hasErrors = errors => Boolean(Array.isArray(errors) ? errors.length : errors);
