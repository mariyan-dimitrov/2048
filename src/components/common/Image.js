import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useStoreMe } from 'store-me';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  allowedBackgroundColorValues,
  genericResponsivePropTypes,
  backgroundColorPropTypes,
  dimensionsPropTypes,
  positionPropTypes,
  paddingPropTypes,
  i18nTextPropType,
  marginPropTypes,
  elRefPropTypes,
} from '../../interfaces/designSystemInterfaces';
import { noPreviewImagePathDark, noPreviewImagePathLight } from '../../_constants/enums';
import handleForwardingRef from '../../utils/handleForwardingRef';
import { transparent_pixel_URL } from '../../_constants/config';
import developmentChecks from '../../utils/developmentChecks';
import { devicePixelRatio } from '../../_constants/devices';
import { useThemeContext } from '../general/ThemeContext';
import generateStyles from '../../utils/generateStyles';
import useColorMapping from './hooks/useColorMapping';
import useIsMounted from '../../hooks/useIsMounted';
import log from '../../utils/log';
import Spinner from './Spinner';
import Icon from './Icon';

const maxSupportedPixelRatio = 3;
const safeDevicePixelRatio = Math.min(Math.max(devicePixelRatio, 1), maxSupportedPixelRatio);
const additionalImageSizes = [2, 3];
const imagesInMemory = {};
const loadingImages = {};
const loadedImages = {};
const failedImages = {};

const generateSrcSet = src => {
  const srcParts = src.split('.');
  const imageExtension = srcParts.pop();

  return additionalImageSizes.reduce(
    (result, size) => ({ ...result, [size]: `${srcParts.join('.')}@${size}x.${imageExtension}` }),
    {}
  );
};

const isSrcSetNeeded = src =>
  src && !src.startsWith('http') && !src.startsWith('ipfs') && !src.startsWith('data:image') && !src.endsWith('.svg');

const SelectableImageFrame = ({ isSelected, sharedStyles, children }) => {
  const textColor = useColorMapping(['text_primary', 'surface_2']);
  const generatedSharedStyles = generateStyles({
    overflow: sharedStyles.borderRadius ? 'hidden' : undefined,
    ...sharedStyles,
  });

  return (
    <SelectedFrameWrap generatedSharedStyles={generatedSharedStyles}>
      {children}

      {isSelected && (
        <>
          <CheckedImageBorder generatedSharedStyles={generatedSharedStyles} id="checked-image-border" />
          <CheckedImageIcon data-testid="checked-image">
            <Icon icon="fa-check-circle" iconType="solid" size={12} color={textColor} />
          </CheckedImageIcon>
          <CheckedImageIconBackground generatedSharedStyles={generatedSharedStyles} />
        </>
      )}
    </SelectedFrameWrap>
  );
};

const ImageWrap = ({
  src,
  alt = '',
  width = 'auto',
  height = 'auto',
  isSelected,
  isSelectable,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  borderRadius,
  isWithoutLoadingBorder,
  isImageLoadPaused,
  hasRevealAnimation,
  spinnerSize = 40,
  dataTestId,
  onClick,
  cursor,
  border,
  borderColor,
  id,
  position = 'relative',
  top,
  left,
  right,
  bottom,
  inset,
  zIndex,
  overflow,
  overflowX,
  overflowY,
  transform,
  margin,
  marginX,
  marginY,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  padding,
  paddingX,
  paddingY,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  isBackgroundImage,
  backgroundClip,
  backgroundSize,
  backgroundColor,
  backgroundRepeat,
  backgroundOrigin,
  backgroundPosition,
  backgroundAttachment,
  elRef,
  ...rest
}) => {
  const { i18n } = useStoreMe('i18n');
  const { theme } = useThemeContext();
  const imageIsCached = Boolean(loadedImages[src]);
  const hasCachedError = Boolean(failedImages[src]);
  const shouldUseSrcSet = useRef(isSrcSetNeeded(src));
  const isImageSafeToLoad = src && !src.startsWith('ipfs');
  const [sizeToLoad, setSizeToLoad] = useState(shouldUseSrcSet.current && !hasCachedError ? safeDevicePixelRatio : 1);
  const [isLoaded, setIsLoaded] = useState(isImageSafeToLoad && !imageIsCached && !hasCachedError ? false : true);
  const [error, setError] = useState(!isImageSafeToLoad || hasCachedError);
  const isMounted = useIsMounted();
  const srcSet = useRef(shouldUseSrcSet.current ? generateSrcSet(src) : {});
  const isDefaultSize = sizeToLoad === 1;
  const noPreviewImage = theme.themeName === 'dark' ? noPreviewImagePathDark : noPreviewImagePathLight;
  const srcToTestLoad = isDefaultSize ? src : srcSet.current[sizeToLoad];
  const srcToDisplay = getSrcToDisplay();
  const sharedStyles = {
    borderRadius,
    margin,
    marginX,
    marginY,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
  };

  process.env.NODE_ENV === 'development' && developmentChecks({ ...rest, borderRadius });

  function getSrcToDisplay() {
    if (imageIsCached) {
      return loadedImages[src];
    } else if (hasCachedError) {
      return transparent_pixel_URL;
    } else if (isLoaded) {
      if (error) {
        return transparent_pixel_URL;
      } else {
        return isDefaultSize ? src : srcSet.current[sizeToLoad];
      }
    } else {
      return transparent_pixel_URL;
    }
  }

  function getBackgroundImage() {
    let result;

    if (error && isLoaded && isDefaultSize) {
      result = noPreviewImage;
    } else if (isBackgroundImage) {
      result = srcToDisplay;
    }

    return result ? `url(${result})` : undefined;
  }

  useEffect(
    function tryLoadingImage() {
      const isImageAlreadyLoading = Boolean(Object.keys(loadingImages[src] || {}).length);
      const loadId = uuidv4();
      let dummyImage;

      function onLoaded() {
        loadedImages[src] = srcToTestLoad;

        if (dummyImage) {
          imagesInMemory[src] = dummyImage;
        }

        delete loadingImages[src][loadId];

        for (let id in loadingImages[src]) {
          loadingImages[src][id].onLoaded();
        }

        if (isMounted.current) {
          setIsLoaded(true);
          setError(false);
        }
      }

      function onFailed() {
        if (!srcToTestLoad.includes('@2x') && !srcToTestLoad.includes('@3x')) {
          failedImages[src] = true;
        }

        delete loadingImages[src][loadId];

        for (let id in loadingImages[src]) {
          loadingImages[src][id].onFailed();
        }

        isMounted.current && setError(true);
      }

      if (!imageIsCached && srcToTestLoad && isImageSafeToLoad && !isImageLoadPaused) {
        if (!loadingImages[src]) {
          loadingImages[src] = {};
        }

        loadingImages[src][loadId] = {
          onLoaded,
          onFailed,
        };

        if (!isImageAlreadyLoading) {
          dummyImage = new window.Image();

          dummyImage.onerror =
            dummyImage.onstalled =
            dummyImage.onsuspend =
              () => loadingImages[src][loadId].onFailed();
          dummyImage.onload = () => loadingImages[src][loadId].onLoaded();

          dummyImage.src = srcToTestLoad;
        }
      }
    },
    [srcToTestLoad, isImageSafeToLoad, imageIsCached, isMounted, src, isImageLoadPaused]
  );

  useEffect(
    function handleMissingImageSize() {
      if (!imageIsCached && error && isImageSafeToLoad) {
        if (isDefaultSize) {
          setIsLoaded(true);
        } else {
          setSizeToLoad(prevSize => prevSize - 1);
          setError(false);
        }
      }
    },
    [error, isImageSafeToLoad, isDefaultSize, imageIsCached]
  );

  useEffect(
    function enforcingImageSizesUsage() {
      if (
        process.env.NODE_ENV === 'development' &&
        shouldUseSrcSet.current &&
        isImageSafeToLoad &&
        !isImageLoadPaused
      ) {
        const dummyImage = new window.Image();

        dummyImage.onerror = () =>
          log.error(`Component "Image": The provided image URL should support at least 2@x size! - "${src}"`);
        dummyImage.src = generateSrcSet(src)[2];
      }
    },
    [isImageSafeToLoad, src, isImageLoadPaused]
  );

  const imageContent = (
    <ImageElement
      as={isBackgroundImage ? 'div' : 'img'}
      backgroundColorKey={backgroundColor}
      className={cn({
        'has-error': error,
        'no-border': isWithoutLoadingBorder,
        'is-loaded': isLoaded && !error,
        'hide-with-opacity': !isBackgroundImage && !isLoaded,
        'has-reveal-animation': hasRevealAnimation,
        'has-border-from-outside': border,
      })}
      border={border}
      borderColor={borderColor}
      onClick={onClick}
      id={id}
      src={isBackgroundImage ? undefined : srcToDisplay}
      alt={(!isBackgroundImage && (Array.isArray(alt) ? i18n(alt[0], alt[1]) : i18n(alt) || '')) || undefined}
      style={{ backgroundImage: getBackgroundImage() }}
      ref={node => handleForwardingRef(node, elRef)}
      data-testid={cn('image', dataTestId)}
      generatedStyles={generateStyles({
        position,
        top,
        left,
        right,
        bottom,
        inset,
        zIndex,
        overflow,
        overflowX,
        overflowY,
        transform,
        height,
        width,
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
        backgroundClip,
        backgroundSize: backgroundSize || (isBackgroundImage ? 'cover' : undefined),
        backgroundRepeat: backgroundRepeat || (isBackgroundImage ? 'no-repeat' : undefined),
        backgroundPosition: backgroundPosition || (isBackgroundImage ? 'center' : undefined),
        backgroundOrigin,
        backgroundAttachment,
        borderRadius,
        cursor: cursor || onClick ? 'pointer' : 'inherit',
        padding,
        paddingX,
        paddingY,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        ...(isSelectable && !error ? {} : sharedStyles),
      })}
    >
      {isBackgroundImage && !isLoaded ? <Spinner loadingSize={spinnerSize} /> : undefined}
    </ImageElement>
  );

  if (isSelectable && !error) {
    return (
      <SelectableImageFrame sharedStyles={sharedStyles} isSelected={isSelected}>
        {!isBackgroundImage && !isLoaded && <Spinner loadingSize={spinnerSize} />}
        {imageContent}
      </SelectableImageFrame>
    );
  } else if (isBackgroundImage) {
    return imageContent;
  } else if (!isLoaded) {
    return (
      <LoadingImageWrap>
        {!isLoaded && <Spinner loadingSize={spinnerSize} />}
        {imageContent}
      </LoadingImageWrap>
    );
  } else {
    return imageContent;
  }
};

const Image = ({
  src,
  alt = '',
  width = 'auto',
  height = 'auto',
  isSelected,
  isSelectable,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  borderRadius,
  isWithoutLoadingBorder,
  isImageLoadPaused,
  hasRevealAnimation,
  spinnerSize = 40,
  onClick,
  cursor,
  dataTestId,
  border,
  borderColor,
  id,
  position = 'relative',
  top,
  left,
  right,
  bottom,
  inset,
  zIndex,
  overflow,
  overflowX,
  overflowY,
  transform,
  margin,
  marginX,
  marginY,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  padding,
  paddingX,
  paddingY,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  isBackgroundImage,
  backgroundClip,
  backgroundSize,
  backgroundColor,
  backgroundRepeat,
  backgroundOrigin,
  backgroundPosition,
  backgroundAttachment,
  elRef,
  ...rest
}) => (
  <ImageWrap
    src={src}
    alt={alt}
    width={width}
    height={height}
    isSelected={isSelected}
    isSelectable={isSelectable}
    maxWidth={maxWidth}
    maxHeight={maxHeight}
    minWidth={minWidth}
    minHeight={minHeight}
    borderRadius={borderRadius}
    isWithoutLoadingBorder={isWithoutLoadingBorder}
    isImageLoadPaused={isImageLoadPaused}
    hasRevealAnimation={hasRevealAnimation}
    spinnerSize={spinnerSize}
    onClick={onClick}
    cursor={cursor}
    border={border}
    borderColor={borderColor}
    position={position}
    top={top}
    left={left}
    right={right}
    bottom={bottom}
    inset={inset}
    zIndex={zIndex}
    overflow={overflow}
    overflowX={overflowX}
    overflowY={overflowY}
    transform={transform}
    margin={margin}
    marginX={marginX}
    marginY={marginY}
    marginLeft={marginLeft}
    marginRight={marginRight}
    marginTop={marginTop}
    marginBottom={marginBottom}
    padding={padding}
    paddingX={paddingX}
    paddingY={paddingY}
    paddingLeft={paddingLeft}
    paddingRight={paddingRight}
    paddingTop={paddingTop}
    paddingBottom={paddingBottom}
    isBackgroundImage={isBackgroundImage}
    backgroundClip={backgroundClip}
    backgroundSize={backgroundSize}
    backgroundColor={backgroundColor}
    backgroundRepeat={backgroundRepeat}
    backgroundOrigin={backgroundOrigin}
    backgroundPosition={backgroundPosition}
    backgroundAttachment={backgroundAttachment}
    id={id}
    elRef={elRef}
    {...rest}
    key={src}
    dataTestId={dataTestId}
  />
);

export default Image;

Image.propTypes = {
  src: PropTypes.string,
  id: PropTypes.string,
  alt: i18nTextPropType,
  isSelected: PropTypes.bool,
  isSelectable: PropTypes.bool,
  width: genericResponsivePropTypes,
  height: genericResponsivePropTypes,
  isWithoutLoadingBorder: PropTypes.bool,
  isImageLoadPaused: PropTypes.bool,
  border: PropTypes.string,
  borderColor: backgroundColorPropTypes,
  hasRevealAnimation: PropTypes.bool,
  spinnerSize: PropTypes.number,
  borderRadius: PropTypes.node,
  backgroundClip: PropTypes.string,
  backgroundSize: PropTypes.string,
  backgroundColor: PropTypes.oneOf(allowedBackgroundColorValues),
  backgroundRepeat: PropTypes.string,
  backgroundOrigin: PropTypes.string,
  backgroundPosition: PropTypes.string,
  backgroundAttachment: PropTypes.string,
  cursor: PropTypes.string,
  onClick: PropTypes.func,
  elRef: elRefPropTypes,
  dataTestId: PropTypes.string,
  ...dimensionsPropTypes,
  ...positionPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
};

const ImageElement = styled.div`
  user-select: none;
  border: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.3s ease, border-color 0.3s ease;
  background-color: ${({ backgroundColorKey, theme }) => (backgroundColorKey ? `${theme[backgroundColorKey]}` : null)};
  background-repeat: no-repeat;
  ${({ generatedStyles }) => generatedStyles};

  &.no-border,
  &.has-error {
    border: none;
  }

  &.is-loaded {
    border: ${({ border }) => (border ? border : 'none')};

    &.has-reveal-animation {
      animation: fade-in 0.3s ease;
    }
  }

  &.hide-with-opacity {
    opacity: 0;
  }

  &.has-error {
    background-color: ${({ theme }) => theme.surface_3};
    background-size: auto 50%;
    background-position: center;
  }

  &.has-border-from-outside {
    border-color: ${({ borderColor, theme }) => (borderColor ? theme[borderColor] : 'transparent')};
  }
`;

const CheckedImageBorder = styled.div`
  position: absolute;
  inset: 0;
  border: 2px solid ${({ theme }) => theme.accent_1};
  transition: border-color 0.3s ease;
  animation: fade-in 0.3s ease forwards;
  cursor: default;
  z-index: 2;
  ${({ generatedSharedStyles }) => generatedSharedStyles};
`;

const CheckedImageIconBackground = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.accent_1};
  transition: background-color 0.3s ease;
  animation: fade-in 0.3s ease forwards;
  ${({ generatedSharedStyles }) => generatedSharedStyles};
`;

const CheckedImageIcon = styled.div`
  position: absolute;
  bottom: 2px;
  right: 6px;
  z-index: 1;
  animation: checkbox-pop-in 0.3s ease forwards;
`;

const LoadingImageWrap = styled.div`
  position: relative;
`;

const SelectedFrameWrap = styled.div`
  position: relative;
  ${({ generatedSharedStyles }) => generatedSharedStyles};
`;
