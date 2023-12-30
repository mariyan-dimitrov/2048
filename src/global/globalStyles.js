import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *:after, &:before {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Open-Sans, Helvetica, Sans-Serif;
    width: 100vw;
    height: 100vh;
  }

  #root { 
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyle;
