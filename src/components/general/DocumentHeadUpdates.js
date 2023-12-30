import { useLocation, matchPath } from 'react-router';
import { useStoreMe } from 'store-me';
import { useEffect } from 'react';

import { routesMap } from '../../_constants/routesMap';

const DocumentHeadUpdates = () => {
  const { i18n } = useStoreMe('i18n');
  const { pathname } = useLocation();

  useEffect(() => {
    const route = routesMap[pathname];
    let title = '';

    if (route) {
      title = route.title;
    } else {
      Object.keys(routesMap).forEach(key => {
        const matchedPath = matchPath({ path: key }, pathname);

        if (matchedPath && key !== '*') {
          title = routesMap[matchedPath.pattern.path].title;
        }
      });
    }

    if (!title) {
      title = i18n('PAGE_TITLE.GENERAL');
    }

    document.title = i18n(title);
  }, [i18n, pathname]);

  return null;
};

export default DocumentHeadUpdates;
