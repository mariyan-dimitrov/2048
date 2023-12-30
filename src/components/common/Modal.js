import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useStoreMe } from 'store-me';
import PropTypes from 'prop-types';
import cn from 'classnames';

import getElementScrollbarWidth from '../../utils/getElementScrollbarWidth';
import { isCapacitor, isDevice, isIOS } from '../../_constants/devices';
import { onModalUnmount, closeModal } from '../../actions/modal';
import developmentChecks from '../../utils/developmentChecks';
import NavigationMobileHeader from './NavigationMobileHeader';
import { hex_to_rgb } from '../../utils/js/convertColorType';
import useWindowSize from '../../hooks/useWindowSize';
import ErrorBoundary from '../general/ErrorBoundary';
import useBreakpoints from './hooks/useBreakpoints';
import Tooltip from '../design-system/Tooltip';
import styles from '../../themes/styles';
import Text from '../design-system/Text';
import IconButton from './IconButton';
import Button from './Button';

const scrollGradientHeight = 70;
const defaultAnimations = {
  desktop: {
    wrapperShow: 'fade-in 0.4s ease forwards',
    wrapperHide: 'fade-out 0.4s ease forwards',
    contentShow: 'half-slide-from-bottom 0.4s ease forwards',
    contentHide: 'half-slide-from-top 0.4s ease forwards',
  },
  mobile: {
    wrapperShow: 'slide-from-right 0.4s ease forwards',
    wrapperHide: 'slide-to-right 0.4s ease forwards',
    contentShow: 'fade-in 0.4s ease forwards',
    contentHide: 'fade-out 0.4s ease forwards',
  },
};

defaultAnimations.tablet = defaultAnimations.mobile;

const Modal = ({
  shouldShow,
  title,
  ctaText,
  ctaIcon,
  ctaClick,
  children,
  isLoading = false,
  width = 540,
  className,
  modalName,
  ctaLoading,
  dataTestId,
  noAnimation,
  ctaDisabled,
  hideBackdrop,
  onModalClose,
  footerContent,
  closeButtonTooltip,
  removeCloseButton,
  disableCloseButton,
  disableSwipeClosing,
  closingSwipeDirection = 'Right',
  isInCurrentDomElement,
  disableBackdropClose,
  onModalReadyVisibilityChange,
  showAnimation,
  hideAnimation,
  shouldHideScrollGradient,
  contentShowAnimation,
  contentHideAnimation,
  ...rest
}) => {
  const { keyboardHeight, i18n } = useStoreMe('keyboardHeight', 'i18n');
  const [showScrollGradient, setShowScrollGradient] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const swipeHandlers = useSwipeable({
    onSwipeStart: ({ dir }) => {
      if (!disableSwipeClosing && dir === closingSwipeDirection && shouldShow) {
        modalName && closeModal(modalName);
        onModalClose && onModalClose();
      }
    },
    delta: 30,
  });
  const { inDesktop, currentBreakpoint } = useBreakpoints();
  const { windowResized } = useWindowSize();
  const contentInnerRef = useRef();
  const modalWrapRef = useRef();
  const scrollingContentRef = useRef();
  const hasTitle = Array.isArray(title) ? i18n(title[0], title[1]) : i18n(title);
  const responsiveShowAnimationName = showAnimation || defaultAnimations[currentBreakpoint].wrapperShow;
  const responsiveContentShowAnimationName = hideAnimation || defaultAnimations[currentBreakpoint].contentShow;
  const responsiveHideAnimationName = contentShowAnimation || defaultAnimations[currentBreakpoint].wrapperHide;
  const responsiveContentHideAnimationName = contentHideAnimation || defaultAnimations[currentBreakpoint].contentHide;
  let modal;

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const onAnimationEnd = e => {
    if (modalWrapRef.current === e.target) {
      const [showAnimationName] = responsiveShowAnimationName.split(' ');
      const [hideAnimationName] = responsiveHideAnimationName.split(' ');

      if (hideAnimationName === e.animationName) {
        setShowModal(false);
        onModalReadyVisibilityChange && onModalReadyVisibilityChange(false);
      } else if (showAnimationName === e.animationName) {
        onModalReadyVisibilityChange && onModalReadyVisibilityChange(true);
      }
    }
  };

  const handleCloseModal = () => {
    modalName && closeModal(modalName);
    onModalClose && onModalClose();
  };

  useEffect(() => {
    if (modalName) {
      return () => onModalUnmount(modalName);
    }
  }, [modalName]);

  useEffect(() => {
    if (inDesktop && !hideBackdrop) {
      document.documentElement.classList[shouldShow ? 'add' : 'remove']('modal-blur');
    }
  }, [shouldShow, hideBackdrop, inDesktop]);

  useEffect(() => {
    if (!isLoading && showModal && scrollingContentRef.current && contentInnerRef.current) {
      const contentWrapHeight = scrollingContentRef.current.clientHeight;
      const contentHeight = contentInnerRef.current.clientHeight;

      setShowScrollGradient(contentHeight > contentWrapHeight);
      setScrollbarWidth(getElementScrollbarWidth(scrollingContentRef.current));
    }
  }, [isLoading, showModal, windowResized]);

  useEffect(() => {
    if (shouldShow) {
      setShowModal(true);
    } else if (noAnimation) {
      setShowModal(false);
    }
  }, [shouldShow, noAnimation, modalName]);

  if (showModal) {
    const submitExistingForm = () => {
      const existingForm = document.getElementById(modalName).querySelector('form');

      if (existingForm) {
        existingForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    };

    modal = (
      <Wrap
        id={modalName}
        className={cn(className, {
          show: shouldShow && !noAnimation,
          hide: !shouldShow && !noAnimation,
          'has-title': hasTitle,
          'in-device': !inDesktop,
          'no-scrollbars': isCapacitor,
          'has-footer': Boolean(ctaText || footerContent),
        })}
        inDesktop={inDesktop}
        keyboardHeight={isDevice ? keyboardHeight : 0}
        showAnimation={responsiveShowAnimationName}
        hideAnimation={responsiveHideAnimationName}
        contentShowAnimation={responsiveContentShowAnimationName}
        contentHideAnimation={responsiveContentHideAnimationName}
        isInCurrentDomElement={isInCurrentDomElement}
        onAnimationEnd={onAnimationEnd}
        ref={modalWrapRef}
        data-testid={cn('modal-wrap', dataTestId)}
      >
        <Inner
          className={cn('modal-wrapper-inner', {
            'in-device': !inDesktop,
          })}
          modalWidth={width}
          {...swipeHandlers}
        >
          {inDesktop ? (
            <Header
              className={cn('modal-header', {
                'has-title': hasTitle,
              })}
            >
              {title && (
                <Text
                  maxWidth="100%"
                  text={title}
                  heading={3}
                  weight={500}
                  dataTestId="modal-title"
                  isOverflowingEllipsis
                />
              )}

              {!removeCloseButton && (
                <CloseButton
                  className={cn('modal-close-button', { 'is-disabled': disableCloseButton })}
                  onClick={handleCloseModal}
                  data-testid="modal-close-button"
                >
                  <IconButton icon="fa-times" iconSize={20} sizeVariant={1} hoverBgColorKey={false} />
                  {closeButtonTooltip && <Tooltip placement="top" tooltip={closeButtonTooltip} isMask />}
                </CloseButton>
              )}
            </Header>
          ) : (
            <NavigationMobileHeader
              isWithoutBackButton={removeCloseButton}
              onBackButtonClick={handleCloseModal}
              title={title}
            />
          )}

          <ContentWrap
            className={cn('modal-content-wrap', {
              'has-title': hasTitle,
              'in-device': !inDesktop,
            })}
          >
            <Content
              className={cn('modal-content', {
                'in-device': !inDesktop,
                'has-title': hasTitle,
                'has-footer': Boolean(ctaText || footerContent),
              })}
              scrollbarWidth={scrollbarWidth}
              onScroll={() => {
                if (!shouldHideScrollGradient) {
                  if (
                    scrollingContentRef.current.scrollTop + scrollGradientHeight >=
                    scrollingContentRef.current.scrollHeight - scrollingContentRef.current.offsetHeight
                  ) {
                    !scrolledToBottom && setScrolledToBottom(true);
                  } else {
                    scrolledToBottom && setScrolledToBottom(false);
                  }
                }
              }}
              ref={scrollingContentRef}
            >
              <ContentInner
                className={cn('modal-content-inner', {
                  'is-loading': isLoading,
                  'in-device': !inDesktop,
                  'has-footer': Boolean(ctaText || footerContent),
                })}
                ref={contentInnerRef}
              >
                <ErrorBoundary placeContext={`Modal - ${modalName}`}>{children}</ErrorBoundary>
              </ContentInner>
            </Content>
          </ContentWrap>

          {(ctaText || footerContent) && (
            <Footer className="modal-footer">
              {!shouldHideScrollGradient && showScrollGradient && (
                <ScrollGradient
                  className={cn('scroll-gradient', { 'fade-out': scrolledToBottom })}
                  scrollbarWidth={scrollbarWidth}
                />
              )}

              {footerContent}

              {ctaText && (
                <Button
                  onClick={e => {
                    submitExistingForm();
                    ctaClick && ctaClick(e);
                  }}
                  isFluid
                  type="submit"
                  size={2}
                  text={ctaText}
                  icon={ctaIcon}
                  isLoading={ctaLoading}
                  isDisabled={ctaDisabled}
                  dataTestId={cn('modal-cta-button', dataTestId)}
                />
              )}
            </Footer>
          )}
        </Inner>

        {inDesktop && !hideBackdrop && (
          <ModalBackdrop
            onClick={() => !disableBackdropClose && handleCloseModal()}
            isInCurrentDomElement={isInCurrentDomElement}
            data-testid="modal-overlay"
          />
        )}
      </Wrap>
    );
  }

  if (isInCurrentDomElement) {
    return showModal && modal;
  } else {
    return showModal && createPortal(modal, document.body);
  }
};

export default Modal;

Modal.propTypes = {
  shouldShow: PropTypes.bool,
  width: PropTypes.number,
  title: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  ]),
  ctaText: PropTypes.string,
  ctaIcon: PropTypes.string,
  ctaClick: PropTypes.func,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  modalName: PropTypes.string,
  ctaLoading: PropTypes.bool,
  dataTestId: PropTypes.string,
  noAnimation: PropTypes.bool,
  ctaDisabled: PropTypes.bool,
  hideBackdrop: PropTypes.bool,
  onModalClose: PropTypes.func,
  footerContent: PropTypes.node,
  closeButtonTooltip: PropTypes.string,
  disableSwipeClosing: PropTypes.bool,
  removeCloseButton: PropTypes.bool,
  disableCloseButton: PropTypes.bool,
  isInCurrentDomElement: PropTypes.bool,
  disableBackdropClose: PropTypes.bool,
  shouldHideScrollGradient: PropTypes.bool,
  showAnimation: PropTypes.string,
  hideAnimation: PropTypes.string,
  contentShowAnimation: PropTypes.string,
  contentHideAnimation: PropTypes.string,
  closingSwipeDirection: PropTypes.oneOf(['Left', 'Right', 'Top', 'Bottom']),
  onModalReadyVisibilityChange: PropTypes.func.isRequired,
};

const Wrap = styled.div`
  position: ${({ isInCurrentDomElement, inDesktop }) => (isInCurrentDomElement || !inDesktop ? 'absolute' : 'fixed')};
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-height: ${({ keyboardHeight }) =>
    isCapacitor && isIOS && `calc(100% - ${keyboardHeight}px + var(--capacitor-bottom-offset))`};
  max-width: 100%;
  min-width: 100px;
  min-height: 100px;
  padding: 20px;
  z-index: ${({ isInCurrentDomElement }) => (isInCurrentDomElement ? '11' : '9999')};

  &.show {
    animation: ${({ showAnimation }) => showAnimation};

    .modal-wrapper-inner {
      animation: ${({ contentShowAnimation }) => contentShowAnimation};
    }
  }

  &.hide {
    animation: ${({ hideAnimation }) => hideAnimation};

    .modal-wrapper-inner {
      animation: ${({ contentHideAnimation }) => contentHideAnimation};
    }
  }

  &.has-footer {
    .modal-content-inner {
      padding-bottom: 0;
    }
  }

  &.in-device {
    padding: 0;
    padding-top: ${() => isCapacitor && `var(--capacitor-top-offset)`};
    padding-bottom: ${() => isCapacitor && isIOS && `var(--capacitor-bottom-offset)`};

    .modal-close-button {
      &:before {
        position: static;
      }
    }
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 3;
  width: ${({ modalWidth }) => modalWidth}px;
  max-width: 100%;
  max-height: calc(100% - 40px);
  border-radius: ${styles.borderRadius.radius_1}px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow_general};
  background-color: ${({ theme }) => theme.surface_2};

  &.in-device {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
`;

const Header = styled.div`
  position: relative;

  &.has-title {
    padding: ${styles.spacing._24}px ${styles.spacing._32}px 0 ${styles.spacing._32}px;
  }

  &.is-flex-column {
    flex-direction: column;
  }

  @media ${styles.grid.breakpoints.mobile} {
    min-height: calc(
      ${styles.typography.headings[3].font_size}px * ${parseFloat(styles.typography.headings[3].line_height) / 100}
    );
    box-sizing: content-box;

    &.has-title {
      padding: ${styles.spacing._16}px 0;
    }
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 24px 30px 8px 8px;
  font-size: 19px;
  cursor: pointer;
  text-align: center;
  z-index: 1;
  color: ${({ theme }) => theme.text_secondary};
  transition: opacity 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }

  &.is-disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  @media ${styles.grid.breakpoints.mobile} {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    padding: 0 16px;
  }
`;

const ContentWrap = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  overflow-y: auto;
  min-height: 84px;
  margin-top: ${styles.spacing._32}px;

  &.has-title {
    margin-top: ${styles.spacing._24}px;
  }

  &.in-device {
    margin-top: 0;
  }
`;

/*
  Padding bottom 1px will fix layout issue if there is a Text component in the end of the modal content.
  This happens because our font-family has a weird line-height which is fixed with a negative margin hack which
  can be seen in Text.js component.
*/
const Content = styled.div`
  position: relative;
  width: 100%;
  overflow-x: hidden;
  padding-left: ${styles.spacing._32}px;
  padding-right: ${props => styles.spacing._32 - props.scrollbarWidth}px;
  padding-bottom: 1px;

  &.in-device {
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: ${styles.spacing._32}px;

    &.has-title {
      padding-top: ${styles.spacing._16}px;
      padding-bottom: ${styles.spacing._16}px;
    }

    &.has-footer {
      padding-bottom: 0;
    }
  }

  @media ${styles.grid.breakpoints.mobile} {
    padding-left: 16px;
    padding-right: ${props => 16 - props.scrollbarWidth}px;
  }
`;

const ContentInner = styled.div`
  padding-bottom: ${styles.spacing._32}px;
  transition: opacity 0.3s ease;

  &.is-loading {
    opacity: 0.8;
    pointer-events: none;

    & > * {
      user-select: none;
    }
  }

  &.in-device {
    padding-bottom: 0;
  }
`;

const Footer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding: ${styles.spacing._32}px;

  @media ${styles.grid.breakpoints.mobile} {
    padding: ${styles.spacing._32}px ${styles.spacing._16}px;
    padding-bottom: ${() => isCapacitor && isIOS && `${styles.spacing._16}px`};
  }
`;

const ScrollGradient = styled.div`
  position: absolute;
  left: 0;
  top: 1px;
  pointer-events: none;
  width: calc(100% - ${props => props.scrollbarWidth}px);
  height: ${scrollGradientHeight}px;
  opacity: 0.5;
  transform: translateY(-100%);
  animation: fade-in 0.3s forwards ease;
  background: linear-gradient(
    0deg,
    ${({ theme }) => hex_to_rgb({ hex: theme.surface_2, opacity: 1 })} 0%,
    ${({ theme }) => hex_to_rgb({ hex: theme.surface_2, opacity: 0 })} 100%
  );

  &.fade-out {
    animation: fade-out 0.3s forwards ease;
  }
`;

const ModalBackdrop = styled.div`
  position: ${({ isInCurrentDomElement }) => (isInCurrentDomElement ? 'absolute' : 'fixed')};
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0.85;
  background-color: ${({ theme }) => theme.surface_1};
`;
