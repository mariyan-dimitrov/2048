import { useRoutes } from 'react-router-dom';
import { routerRoutes } from './_constants/routesMap';
import { StyleSheetManager } from 'styled-components';
import getStylisPlugins from './utils/getStylisPlugins';
import ErrorBoundary from './components/general/ErrorBoundary';
import ThemeContextProvider from './components/contexts/ThemeContext';

const App = () => {
  const route = useRoutes(routerRoutes);

  return (
    <ThemeContextProvider>
      <StyleSheetManager stylisPlugins={getStylisPlugins()}>
        <ErrorBoundary placeContext="App">{route}</ErrorBoundary>
      </StyleSheetManager>
    </ThemeContextProvider>
  );
};

export default App;
