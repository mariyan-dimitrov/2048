import { useStoreMe, setStoreMe } from 'store-me';
import { ThemeProvider } from 'styled-components';
import { useContext, createContext } from 'react';

import light from '../../themes/light';
import dark from '../../themes/dark';

const ThemeContext = createContext();
const ThemeActionsContext = createContext({});
const themes = { light, dark };

export const useThemeContext = () => useContext(ThemeContext);

export const useThemeActionsContext = () => useContext(ThemeActionsContext);

const ThemeContextProvider = ({ children }) => {
  const { themeMode } = useStoreMe('themeMode');

  const toggleTheme = () => setStoreMe({ themeMode: themeMode === 'light' ? 'dark' : 'light' });

  return (
    <ThemeContext.Provider value={{ theme: themes[themeMode] }}>
      <ThemeActionsContext.Provider value={{ toggleTheme }}>
        <ThemeProvider theme={themes[themeMode]}>{children}</ThemeProvider>
      </ThemeActionsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
