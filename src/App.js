import { useRoutes } from 'react-router-dom';
import { routerRoutes } from './_constants/routesMap';
import { StyleSheetManager } from 'styled-components';
import getStylisPlugins from './utils/getStylisPlugins';
import ErrorBoundary from './components/general/ErrorBoundary';

const App = () => {
  const route = useRoutes(routerRoutes);

  return (
    <StyleSheetManager stylisPlugins={getStylisPlugins()}>
      <ErrorBoundary placeContext="App">{route}</ErrorBoundary>
    </StyleSheetManager>
  );
};

export default App;
