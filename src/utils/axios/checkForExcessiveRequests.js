import axios from 'axios';

import log from '../log';

/*
  It's not uncommon for a useEffect dependency array to contain data that can change quite often.
  The data could be a simple type like string or number but it could also be an array or object which reference can change and this change will
  fire the useEffect again. Those dependency changes adn their frequency are not obvious until the developer start investigating them.
  This could lead to multiple unintentional API requests. The purpose of this function is to track the request frequency for each endpoint.
  The criteria to consider requests frequency for too high should be fine tuned along the way. It should be balanced between catching problems and not
  firing false warnings.
*/

const checkForExcessiveRequests = () => {
  const rangeOfSecondsToTrackExcessiveRequest = 1;
  const requestsCountToConsiderExcessive = 2;
  const requestTracker = {};

  axios.interceptors.request.use(function beforeRequestIsSend(config) {
    const { url } = config;
    const requestDate = Date.now();

    if (!requestTracker[url]) {
      requestTracker[url] = [];
    }

    if (requestTracker[url].length) {
      const secondsPassedSinceFirstRequest = (requestDate - requestTracker[url][0]) / 1000;
      const totalRequestsCount = requestTracker[url].length + 1;

      if (secondsPassedSinceFirstRequest <= rangeOfSecondsToTrackExcessiveRequest) {
        if (totalRequestsCount >= requestsCountToConsiderExcessive) {
          log.error(
            `"${url}" was called ${totalRequestsCount} times in ${secondsPassedSinceFirstRequest} seconds, please check if this is intended.`
          );
        }
      } else {
        requestTracker[url] = [];
      }
    }

    requestTracker[url].push(requestDate);

    return config;
  });
};

export default checkForExcessiveRequests;
