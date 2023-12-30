import { useSwipeable } from 'react-swipeable';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { elRefPropTypes } from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import { percentage, percentOfNumber } from '../../utils/math';
import { isCapacitor, isIOS } from '../../_constants/devices';
import developmentChecks from '../../utils/developmentChecks';
import styles from '../../themes/styles';
import Text from './Text';

const maxContentHeightInPercent = 70;
const backdropMaximumOpacity = 0.85;
const hiddenDrawerAreaInPercentageToCauseClose = 50;
const velocityToConsiderClosing = 0.5;

const Drawer = ({
  show,
  title,
  header,
  footer,
  onDrawerClose,
  onDrawerClosed,
  maxHeightInPercent = maxContentHeightInPercent,
  children,
  elRef,
  id,
  dataTestId,
  ...rest
}) => {
  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const [manuallyClosing, setManuallyClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [stayShown, setStayShown] = useState(false);
  const contentWrapRef = useRef();
  const backdropRef = useRef();
  const stateRef = useRef({
    manuallyClosedDrawerContentAnimationEnded: false,
    manuallyClosedBackdropAnimationEnded: false,
    animationsAreRunning: false,
    lastTransitionY: 0,
    lastVelocity: 0,
  });

  const getHiddenContentAreaInPercentage = yPosition => {
    const contentHeight = contentWrapRef.current.clientHeight;

    return percentage(Math.abs(yPosition), contentHeight);
  };

  const swipeHandlers = useSwipeable({
    onSwipeStart: ({ dir, deltaY }) => {
      if (dir === 'Down') {
        !isDragging && setIsDragging(true);
        stateRef.lastTransitionY = deltaY;
        stateRef.lastVelocity = 0;
      }
    },
    onSwiping: ({ dir, deltaY, velocity }) => {
      if (dir === 'Down') {
        const newYPosition = Math.round(deltaY);
        const deltaIsChanged = stateRef.lastTransitionY !== newYPosition;
        const opacityToRemoveFromBackdrop = percentOfNumber(
          backdropMaximumOpacity,
          getHiddenContentAreaInPercentage(newYPosition)
        );

        if (deltaIsChanged) {
          stateRef.lastTransitionY = Math.round(deltaY);
          stateRef.lastVelocity = velocity;
          contentWrapRef.current.style.transform = `translateY(${stateRef.lastTransitionY}px)`;

          if (opacityToRemoveFromBackdrop <= backdropMaximumOpacity) {
            backdropRef.current.style.opacity = backdropMaximumOpacity - opacityToRemoveFromBackdrop;
          }
        }
      }
    },
    onTouchEndOrOnMouseUp: () => {
      setIsDragging(false);

      if (
        getHiddenContentAreaInPercentage(stateRef.lastTransitionY) >= hiddenDrawerAreaInPercentageToCauseClose ||
        stateRef.lastVelocity >= velocityToConsiderClosing
      ) {
        setManuallyClosing(true);
        onDrawerClose();

        contentWrapRef.current.style.transform = `translateY(100%)`;
        backdropRef.current.style.opacity = '0';
        stateRef.animationsAreRunning = true;
      } else {
        contentWrapRef.current.style.transform = '';
        backdropRef.current.style.opacity = '';
        stateRef.animationsAreRunning = true;
      }
    },
  });
  const stateClassnames = cn({
    'manually-closing': manuallyClosing,
    'stay-shown': stayShown,
    'animate-show': !stayShown && show,
    'animate-hide': !manuallyClosing && !show,
    'is-dragging': isDragging,
  });

  return createPortal(
    <Wrap id={id} dataTestId={cn('drawer', dataTestId)} ref={node => handleForwardingRef(node, elRef)}>
      <Backdrop
        className={stateClassnames}
        onClick={() => {
          if (!isDragging && !stateRef.animationsAreRunning) {
            onDrawerClose();
          }
        }}
        onTransitionEnd={({ propertyName, target }) => {
          if (propertyName === 'opacity' && target === backdropRef.current) {
            stateRef.animationsAreRunning = false;

            if (backdropRef.current.style.opacity === '0') {
              stateRef.manuallyClosedBackdropAnimationEnded = true;

              if (stateRef.manuallyClosedDrawerContentAnimationEnded) {
                onDrawerClosed();
                document.activeElement.blur();
              }
            }
          }
        }}
        ref={backdropRef}
      />

      <ContentWrap
        className={stateClassnames}
        maxHeightInPercent={maxHeightInPercent}
        ref={contentWrapRef}
        onAnimationEnd={({ animationName }) => {
          animationName === 'show-drawer' && setStayShown(true);

          if (animationName === 'hide-drawer') {
            onDrawerClosed();
            document.activeElement.blur();
          }
        }}
        onTransitionEnd={({ propertyName, target }) => {
          if (propertyName === 'transform' && target === contentWrapRef.current) {
            stateRef.animationsAreRunning = false;

            if (contentWrapRef.current.style.transform === 'translateY(100%)') {
              stateRef.manuallyClosedDrawerContentAnimationEnded = true;

              if (stateRef.manuallyClosedBackdropAnimationEnded) {
                onDrawerClosed();
                document.activeElement.blur();
              }
            }
          }
        }}
      >
        <TopElementsWrap>
          <DraggableArea {...swipeHandlers}>
            <Handle />

            {title && <Text text={title} heading={3} weight={500} paddingTop={12} />}
          </DraggableArea>

          {header}
        </TopElementsWrap>

        <Content className={cn({ 'no-footer': !footer, 'is-ios-capacitor': isCapacitor && isIOS })}>{children}</Content>

        {footer && <Footer>{footer}</Footer>}

        <BackgroundFixer />
      </ContentWrap>
    </Wrap>,
    document.body
  );
};

export default Drawer;

Drawer.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  onDrawerClose: PropTypes.func,
  onDrawerClosed: PropTypes.func,
  maxHeightInPercent: PropTypes.number,
  children: PropTypes.node,
  elRef: elRefPropTypes,
  id: PropTypes.string,
};

const Wrap = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999999;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: ${({ theme }) => theme.surface_1};
  transition: background-color 0.3s ease;

  &:not(.is-dragging) {
    transition: background-color 0.3s ease, opacity 0.15s ease;
  }

  &.stay-shown {
    opacity: ${backdropMaximumOpacity};
  }

  &.animate-show {
    animation: drawer-backdrop-fade-in 0.2s ease forwards;
  }

  &:not(.manually-closing) {
    &.animate-hide {
      animation: drawer-backdrop-fade-out 0.3s ease forwards;
    }
  }
`;

const ContentWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  transform: translateY(100%);
  box-shadow: ${({ theme }) => theme.shadow_general};
  border-radius: ${styles.spacing._24}px ${styles.spacing._24}px 0 0;
  max-height: ${props => props.maxHeightInPercent}%;
  background-color: ${({ theme }) => theme.surface_2};
  will-change: transform;

  &.is-dragging {
    pointer-events: none;
  }

  &:not(.is-dragging) {
    transition: background-color 0.3s ease, transform 0.15s linear;
  }

  &.stay-shown {
    transform: translateY(0%);
  }

  &.animate-show {
    animation: show-drawer 0.4s ease-out forwards;
  }

  &:not(.manually-closing) {
    &.animate-hide {
      animation: hide-drawer 0.3s ease forwards;
    }
  }
`;

const DraggableArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: ${styles.spacing._12}px 0;
`;

const TopElementsWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Handle = styled.div`
  width: 48px;
  height: 4px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.accent_2};
  transition: background-color 0.3s ease;
`;

const Content = styled.div`
  overflow: auto;
  padding: 0 ${styles.spacing._16}px;

  &.no-footer {
    padding-bottom: ${styles.spacing._16}px;
  }

  &.is-ios-capacitor {
    padding-bottom: var(--capacitor-bottom-offset);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${styles.spacing._16}px ${styles.spacing._24}px;
`;

const BackgroundFixer = styled.div`
  position: absolute;
  height: 11%;
  width: 100%;
  left: 0;
  bottom: -11%;
  background-color: ${({ theme }) => theme.surface_2};
  transition: background-color 0.3s ease;
`;
