import { useRoutes } from 'react-router-dom';
import { routerRoutes } from './_constants/routesMap';
import { StyleSheetManager } from 'styled-components';

import ThemeContextProvider from './components/contexts/ThemeContext';
import LocalStorageSetter from './handlers/LocalStorageSetter';
import ErrorBoundary from './components/general/ErrorBoundary';
import ControlHandler from './handlers/ControlHandler';
import getStylisPlugins from './utils/getStylisPlugins';
import GameHandler from './handlers/GameHandler';
import GlobalCSS from './css/GlobalCSS';

const App = () => {
  const route = useRoutes(routerRoutes);

  return (
    <ThemeContextProvider>
      <StyleSheetManager stylisPlugins={getStylisPlugins()}>
        <GlobalCSS />
        <ErrorBoundary placeContext="App">
          <ControlHandler />
          <GameHandler />
          <LocalStorageSetter />

          {route}
        </ErrorBoundary>
      </StyleSheetManager>
    </ThemeContextProvider>
  );
};

export default App;
