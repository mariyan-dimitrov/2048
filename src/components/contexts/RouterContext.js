import { useEffect, useContext, createContext, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router';
import { getStoreMe, setStoreMe } from 'store-me';

import getSearchQueryFromObject from '../../utils/getSearchQueryFromObject';
import getObjFromSearchQuery from '../../utils/getObjFromSearchQuery';
import useIsMounted from '../hooks/useIsMounted';
import isObject from '../../utils/isObject';

const RouterContext = createContext({});

export const useRouterContext = () => useContext(RouterContext);

let isRedirecting = false;

const RouterContextProvider = ({ children }) => {
  const { pathname } = useLocation();
  const isMounted = useIsMounted();
  const history = useHistory();

  const pushRoute = useCallback(
    (route, params, shouldReplace) => {
      let safeRoute = route;
      let safeParams = params || {};
      let routeParts = route.split('?');

      if (routeParts.length > 1) {
        safeParams = getObjFromSearchQuery(routeParts[1]);
        safeRoute = routeParts[0];
      }

      if (safeRoute && safeRoute !== pathname) {
        isRedirecting = safeRoute;
        const historyFunction = shouldReplace ? history.replace : history.push;

        historyFunction({
          pathname: safeRoute,
          search: getSearchQueryFromObject(safeParams),
        });
      }
    },
    [history, pathname]
  );

  const updateQuery = useCallback(
    (params = {}) => {
      const search = window.location.search;
      const queryObj = { ...getObjFromSearchQuery(search) };
      const keys = Object.keys(params);
      let queryString = '';

      keys.forEach(key => {
        queryObj[key] = isObject(params[key]) ? JSON.stringify(params[key]) : params[key];
      });

      queryString = getSearchQueryFromObject(queryObj);

      if (queryString !== search && !isRedirecting) {
        if (typeof window.history.replaceState === 'function') {
          window.history.replaceState(null, '', `${pathname}${queryString}`);
        } else {
          history.push({ pathname, search: queryString });
        }
      }
    },
    [history, pathname]
  );

  const goBack = useCallback(() => {
    const { previousPathname, isLogged, routes } = getStoreMe('previousPathname', 'isLogged', 'routes');

    if (
      isLogged &&
      [routes.login, routes.register, routes.resetPassword, routes.forgotPassword].includes(previousPathname)
    ) {
      pushRoute(routes.root);
    } else {
      history.goBack();
    }
  }, [history, pushRoute]);

  useEffect(() => {
    const isStillMounted = isMounted.current;

    if (isRedirecting && isRedirecting === pathname) {
      isRedirecting = false;
    }

    return () => isStillMounted && setStoreMe({ previousPathname: pathname });
  }, [pathname, isMounted]);

  return <RouterContext.Provider value={{ goBack, pushRoute, updateQuery }}>{children}</RouterContext.Provider>;
};

export default RouterContextProvider;
