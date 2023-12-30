import Dashboard from '../components/pages/Dashboard';
import cloneDeep from '../utils/cloneDeep';

const routesStructure = {
  dashboard: {
    path: '/',
    title: 'Dashboard',
    element: <Dashboard />,
  },
};

/* START generation of usable structures */

export const routerRoutes = Object.keys(routesStructure).map(key => generateRouterStructure(routesStructure[key]));

export const routesMap = {};

export const routes = {};

generateFlatRoutesWithFullPaths('', routesStructure); // Populate "routesMap"
prepareRoutesForUsage([], routesStructure); // Populate "routes"

Object.freeze(routesStructure);
Object.freeze(routerRoutes);
Object.freeze(routesMap);
Object.freeze(routes);

function prepareRoutesForUsage(parentKeys, obj) {
  for (let key in obj) {
    const route = cloneDeep(obj[key]);
    const { children, path } = route;
    const hasChildren = Boolean(children);

    delete route.element;

    if (parentKeys.length) {
      const prevParentKeys = [...parentKeys];

      prevParentKeys.pop();

      const parentRoute = accessObject(routes, prevParentKeys);
      const parentPath = parentRoute.fullPath || parentRoute.path;
      const fullPath = `${parentPath}${parentPath ? '/' : ''}${path}`;

      accessObject(routes, parentKeys)[key] = { ...route, fullPath };
    } else {
      accessObject(routes, parentKeys)[key] = route;
    }

    hasChildren && prepareRoutesForUsage([...parentKeys, key, 'children'], route.children);
  }

  function accessObject(object, pathKeys) {
    let result = object;

    pathKeys.forEach(key => {
      result = result[key];
    });

    return result;
  }
}

function generateRouterStructure(obj) {
  if (obj.children) {
    const { children, ...rest } = obj;

    return {
      ...rest,
      children: Object.keys(children).map(key => generateRouterStructure(children[key])),
    };
  } else {
    return obj;
  }
}

function generateFlatRoutesWithFullPaths(parentPath, obj) {
  for (let key in obj) {
    const { path, title, children, useAsMenuItemForMenuTypes } = obj[key];
    const hasChildren = Boolean(children);
    const fullPath = `${parentPath}${parentPath ? '/' : ''}${path}`;

    routesMap[fullPath] = {
      title,
      hasChildren,
      useAsMenuItemForMenuTypes,
    };

    if (hasChildren) {
      generateFlatRoutesWithFullPaths(fullPath, children);
    }
  }
}
