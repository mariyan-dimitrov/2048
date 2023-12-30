import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import cn from 'classnames';

import developmentChecks from '../../utils/developmentChecks';
import { animationsNames } from '../../css/globalKeyFrames';

const Animated = ({
  shouldStartAnimation,
  children,
  component = 'div',
  shouldToggleNodeInDom = false,
  shouldPreserveChildren = false,
  inAnimation = 'fade-in 0.3s forwards ease',
  outAnimation = 'fade-out 0.3s forwards ease',
  shouldSkipInitialInAnimation = false,
  shouldSkipInitialOutAnimation = false,
  onInAnimationCompleted,
  onOutAnimationCompleted,
  onAnimationStart,
  onAnimationEnd,
  ...rest
}) => {
  const [shouldRemoveFromDOM, setShouldRemoveFromDOM] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const inAnimationAllowed = useRef(!shouldSkipInitialInAnimation);
  const outAnimationAllowed = useRef(!shouldSkipInitialOutAnimation);
  const childrenRef = useRef(null);

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  useEffect(() => {
    if (children) {
      childrenRef.current = children;
    }
  }, [shouldPreserveChildren, children]);

  useEffect(() => {
    shouldStartAnimation && shouldToggleNodeInDom && shouldRemoveFromDOM && setShouldRemoveFromDOM(false);
  }, [shouldStartAnimation, shouldToggleNodeInDom, shouldRemoveFromDOM]);

  useEffect(() => {
    if (!shouldStartAnimation && shouldSkipInitialInAnimation && !inAnimationAllowed.current) {
      inAnimationAllowed.current = true;
    }

    if (shouldStartAnimation && shouldSkipInitialOutAnimation && !outAnimationAllowed.current) {
      outAnimationAllowed.current = true;
    }
  }, [shouldStartAnimation, shouldSkipInitialInAnimation, shouldSkipInitialOutAnimation]);

  if (shouldRemoveFromDOM) {
    return null;
  }

  return (
    <Wrap
      component={component}
      className={cn({
        'animate-in': inAnimationAllowed.current && shouldStartAnimation,
        'animate-out': outAnimationAllowed.current && !shouldStartAnimation,
        'force-out': !outAnimationAllowed.current && !shouldStartAnimation,
        'is-animating': isAnimating,
      })}
      inAnimation={inAnimation}
      outAnimation={outAnimation}
      onAnimationStart={e => {
        onAnimationStart && onAnimationStart(e);

        if (outAnimation.includes(e.animationName) || inAnimation.includes(e.animationName)) {
          setIsAnimating(true);
        }
      }}
      onAnimationEnd={e => {
        onAnimationEnd && onAnimationEnd(e);

        if (inAnimation.includes(e.animationName)) {
          setIsAnimating(false);
          onInAnimationCompleted && onInAnimationCompleted();
        }

        if (outAnimation.includes(e.animationName)) {
          childrenRef.current = false;

          setIsAnimating(false);
          shouldToggleNodeInDom && setShouldRemoveFromDOM(true);
          onOutAnimationCompleted && onOutAnimationCompleted();
        }
      }}
      {...rest}
    >
      {children || (shouldPreserveChildren && childrenRef.current)}
    </Wrap>
  );
};

const propTypesAnimationName = (props, componentName, animationTypeToValidate) => {
  const value = props[animationTypeToValidate];
  let error;

  if (value) {
    const providedAnimationName = value.split(' ')[0];
    const isAnimationSupported = animationsNames.some(name => name === providedAnimationName);

    if (!isAnimationSupported) {
      return new Error(
        `Not supported animation "${value}" supplied in "${componentName}.js". Please choose one of the following from our design system: ${animationsNames}`
      );
    }
  }

  return error;
};

export default Animated;

Animated.propTypes = {
  shouldStartAnimation: PropTypes.bool,
  children: PropTypes.node,
  component: PropTypes.oneOf(['div', 'span', 'p', 'i', 'b', 'strong', 'ul', 'section']),
  shouldToggleNodeInDom: PropTypes.bool,
  shouldPreserveChildren: PropTypes.bool,
  inAnimation: (props, key, componentName) => propTypesAnimationName(props, componentName, 'inAnimation'),
  outAnimation: (props, key, componentName) => propTypesAnimationName(props, componentName, 'outAnimation'),
  shouldSkipInitialInAnimation: PropTypes.bool,
  shouldSkipInitialOutAnimation: PropTypes.bool,
  onInAnimationCompleted: PropTypes.func,
  onOutAnimationCompleted: PropTypes.func,
  onAnimationStart: PropTypes.func,
  onAnimationEnd: PropTypes.func,
};

const Wrap = styled.div`
  &.force-out {
    display: none;
  }

  &.animate-in {
    animation: ${({ inAnimation }) => inAnimation};
  }

  &.animate-out {
    animation: ${({ outAnimation }) => outAnimation};
  }

  &.is-animating {
    pointer-events: none;
  }
`;
