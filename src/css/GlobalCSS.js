/* stylelint-disable declaration-block-single-line-max-declarations, length-zero-no-unit */
import { createGlobalStyle, css } from 'styled-components';

import globalKeyFrames from './globalKeyFrames';

export const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  html {
    color: ${({ theme }) => theme.text_primary};
    background-color: ${({ theme }) => theme.surface_1};

    &.modal-blur {
      #root {
        filter: blur(7px);
      }
    }
  }

  html,
  body,
  #root {
    height: 100%;
  }

  #root {
    display: flex;
    flex-direction: column;
    width: 100%;
    transition: filter 0.2s ease;
  }

  html,
  html * {
    scrollbar-color: ${({ theme }) => theme.native_scrollbar} rgb(255 255 255 / 0%);
    -webkit-tap-highlight-color: rgb(0 0 0 / 0%);
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.native_scrollbar};
      border-radius: 3px;
    }
  }

  .thin-accent-scrollbar {
    scrollbar-color: ${({ theme }) => theme.accent_1} rgb(255 255 255 / 0%);
    -webkit-tap-highlight-color: ${({ theme }) => theme.accent_2};

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.accent_2};
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.accent_1};
      border-radius: 3px;
    }
  }

  .contain-scroll-behavior-y {
    overscroll-behavior-y: contain;
  }

  .contain-scroll-behavior-x {
    overscroll-behavior-x: contain;
  }

  .no-selection * {
    &:not(input, textarea) {
      user-select: none;
    }
  }

  .no-scrollbars * {
    -ms-overflow-style: none;
    scrollbar-width: none;

    ::-webkit-scrollbar,
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .no-pointer-events {
    pointer-events: none;
  }

  .auto-pointer-events {
    pointer-events: auto;
  }

  a {
    text-decoration: none;
  }

  a,
  button {
    user-select: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 0;
  }

  a,
  button,
  [role='button'],
  [role='region'] {
    outline: none;
  }

  iframe {
    border: 0;
  }
`;

const GlobalStyle = createGlobalStyle`${globalStyles}${globalKeyFrames}`;

const GlobalCSS = props => <GlobalStyle {...props} />;

export default GlobalCSS;
