import * as deviceInfo from 'react-device-detect';

export const isMobile = deviceInfo.isMobileOnly;
export const isTablet = deviceInfo.isTablet;
export const isDevice = deviceInfo.isMobile; // This will return true for mobile and tablet devices
export const isAndroid = deviceInfo.isAndroid;
export const isIOS = deviceInfo.isIOS;
export const isBraveBrowser = Boolean(
  (deviceInfo.isChrome &&
    !deviceInfo.isChromium &&
    typeof window.navigator.brave === 'object' &&
    typeof window.navigator.brave.isBrave === 'function') ||
    deviceInfo.getUA.toLocaleLowerCase().includes('brave')
);

export const devicePixelRatio = Math.floor(window.devicePixelRatio);
