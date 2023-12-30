import { css } from 'styled-components';

import styles from '../themes/styles';
import isObject from './js/isObject';
import memoize from './memoize';
import log from './log';

const forbiddenCssKeys = new Set(['fontWeight', 'fontSize']);
const nonReactiveKeys = new Set(['color', 'backgroundColor']);
const stylesWithoutPx = new Set(['opacity', 'flex', 'zIndex']);

const cssMap = {
  display: val => `display: ${val};`,
  width: val => `width: ${val};`,
  maxWidth: val => `max-width: ${val};`,
  minWidth: val => `min-width: ${val};`,
  height: val => `height: ${val};`,
  maxHeight: val => `max-height: ${val};`,
  minHeight: val => `min-height: ${val};`,
  margin: val => `margin: ${val};`,
  marginX: val => `margin-left: ${val}; margin-right: ${val};`,
  marginY: val => `margin-top: ${val}; margin-bottom: ${val};`,
  marginTop: val => `margin-top: ${val};`,
  marginLeft: val => `margin-left: ${val};`,
  marginRight: val => `margin-right: ${val};`,
  marginBottom: val => `margin-bottom: ${val};`,
  padding: val => `padding: ${val};`,
  paddingX: val => `padding-left: ${val}; padding-right: ${val};`,
  paddingY: val => `padding-top: ${val}; padding-bottom: ${val};`,
  paddingTop: val => `padding-top: ${val};`,
  paddingLeft: val => `padding-left: ${val};`,
  paddingRight: val => `padding-right: ${val};`,
  paddingBottom: val => `padding-bottom: ${val};`,
  flex: val => `flex: ${val};`,
  flexWrap: val => `flex-wrap: ${val};`,
  flexDirection: val => `flex-direction: ${val};`,
  justifyContent: val => `justify-content: ${val};`,
  alignItems: val => `align-items: ${val};`,
  alignSelf: val => `align-self: ${val};`,
  textAlign: val => `text-align: ${val};`,
  border: val => `border: ${val};`,
  borderX: val => `border-left: ${val}; border-right: ${val};`,
  borderY: val => `border-top: ${val}; border-bottom: ${val};`,
  borderTop: val => `border-top: ${val};`,
  borderLeft: val => `border-left: ${val};`,
  borderRight: val => `border-right: ${val};`,
  borderBottom: val => `border-bottom: ${val};`,
  position: val => `position: ${val};`,
  left: val => `left: ${val};`,
  right: val => `right: ${val};`,
  top: val => `top: ${val};`,
  bottom: val => `bottom: ${val};`,
  inset: val => `inset: ${val};`,
  zIndex: val => `z-index: ${val};`,
  borderRadius: val => `border-radius: ${val};`,
  opacity: val => `opacity: ${val};`,
  transition: val => `transition: ${val};`,
  animation: val => `animation: ${val};`,
  transform: val => `transform: ${val};`,
  color: val => `color: ${val};`,
  cursor: val => `cursor: ${val};`,
  boxShadow: val => `box-shadow: ${val};`,
  boxSizing: val => `box-sizing: ${val};`,
  overflow: val => `overflow: ${val};`,
  overflowY: val => `overflow-y: ${val};`,
  overflowX: val => `overflow-x: ${val};`,
  overscrollBehaviorY: val => `overscroll-behavior-y: ${val};`,
  overscrollBehaviorX: val => `overscroll-behavior-x: ${val};`,
  outline: val => `outline: ${val};`,
  appearance: val => `appearance: ${val};`,
  backgroundColor: val => `background-color: ${val};`,
  backgroundImage: val => `background-image: ${val};`,
  backgroundPosition: val => `background-position: ${val};`,
  backgroundSize: val => `background-size: ${val};`,
  backgroundRepeat: val => `background-repeat: ${val};`,
  backgroundOrigin: val => `background-origin: ${val};`,
  backgroundClip: val => `background-clip: ${val};`,
  backgroundAttachment: val => `background-attachment: ${val};`,
  background: val => `background: ${val};`,
  onHoverColor: val => `&:hover { color: ${val}; }`,
  whiteSpace: val => `white-space: ${val};`,
  textOverflow: val => `text-overflow: ${val};`,
  pointerEvents: val => `pointer-events: ${val};`,
};

const formatValue = (styleKey, styleValue) => {
  if (styleValue || styleValue === 0) {
    const shouldUsePixels = typeof styleValue === 'number' && !stylesWithoutPx.has(styleKey);
    const transformedValue = shouldUsePixels ? `${styleValue}px` : styleValue;

    return cssMap[styleKey](transformedValue);
  } else {
    return false;
  }
};

const generateCss = stylesProps => {
  const stylesResult = {
    mobile: '',
    tablet: '',
    desktop: '',
  };
  let result = '';

  for (const styleKey in stylesProps) {
    const styleValue = stylesProps[styleKey];

    if (typeof styleValue !== 'undefined' && cssMap[styleKey]) {
      if (typeof styleValue === 'object') {
        for (const breakpoint in styleValue) {
          const cssForBreakpoint = formatValue(styleKey, styleValue[breakpoint]);

          if (cssForBreakpoint) {
            stylesResult[breakpoint] += cssForBreakpoint;
          }
        }
      } else {
        const formattedValue = formatValue(styleKey, styleValue);

        if (formattedValue) {
          result += formattedValue;
        }
      }
    }
  }

  if (stylesResult.desktop) {
    result += `@media ${styles.grid.breakpoints.desktop} {
      ${stylesResult.desktop}
    }`;
  }

  if (stylesResult.tablet) {
    result += `@media ${styles.grid.breakpoints.tablet} {
      ${stylesResult.tablet}
    }`;
  }

  if (stylesResult.mobile) {
    result += `@media ${styles.grid.breakpoints.mobile} {
      ${stylesResult.mobile}
    }`;
  }

  return css`
    ${result}
  `;
};

const memoizedGenerateCss = memoize(generateCss);

const generateStyles = props => {
  let result = [];

  if (process.env.NODE_ENV === 'development') {
    for (const key in props) {
      if (forbiddenCssKeys.has(key)) {
        log.error(`"${key}" usage is intended to NOT be used as a style property. Use "Text" component instead.`);
      } else if (nonReactiveKeys.has(key)) {
        log.error(`"${key}" usage is NOT intended because the theme change won't cause "${key}" to change accordingly`);
      } else if (!cssMap[key]) {
        log.error(`Unsupported style property "${key}". In order to support it, add it into generateStyles.js file`);
      } else {
        const unsupportedResponsiveKey =
          isObject(props[key]) &&
          Object.keys(props[key]).find(objectKey => !Object.keys(styles.grid.breakpoints).includes(objectKey));

        unsupportedResponsiveKey && log.error(`Unsupported responsive key "${unsupportedResponsiveKey}".`);
      }
    }
  }

  result = memoizedGenerateCss(props);

  return result;
};

export default generateStyles;
