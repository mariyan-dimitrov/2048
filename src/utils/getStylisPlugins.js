import { isDevice } from '../_constants/devices';

const getStylisPlugins = () => {
  const plugins = [];

  if (isDevice) {
    plugins.push(removeHoverStylesForTouchDevices);
  }

  return plugins;
};

function removeHoverStylesForTouchDevices(contextId, content) {
  const STYLIS_CONTEXTS = {
    POST_PROCESS: -2,
    PREPARATION: -1,
    NEWLINE: 0,
    PROPERTY: 1,
    SELECTOR_BLOCK: 2,
    AT_RULE: 3,
  };

  if (contextId === STYLIS_CONTEXTS.PREPARATION && content.indexOf('&:hover') !== -1) {
    return content.replace(/&:hover/g, '&.hover-disabled-for-touch-devices');
  }

  return content;
}

export default getStylisPlugins;
