import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  positionPropTypes,
  paddingPropTypes,
  marginPropTypes,
  elRefPropTypes,
} from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import useColorMapping from './hooks/useColorMapping';
import styles from '../../themes/styles';

const ToggleSwitch = ({
  onChange,
  id,
  width = 43,
  height = 24,
  isDisabled = false,
  isActive = false,
  dataTestId,
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
  elRef,
  ...rest
}) => {
  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const isActiveRef = useRef(Boolean(isActive));
  const isAnimatingRef = useRef(false);
  const animationsCapturedRef = useRef(0);
  const colorName = useColorMapping(['text_primary', 'surface_2']);
  const onSwitch = () => {
    !isDisabled && !isAnimatingRef.current && onChange && onChange(!isActive);
  };

  useEffect(() => {
    if (isActiveRef.current !== Boolean(isActive)) {
      isActiveRef.current = Boolean(isActive);
      isAnimatingRef.current = true;
    }
  }, [isActive]);

  return (
    <Wrap
      onClick={onSwitch}
      id={id}
      toggleWidth={width}
      toggleHeight={height}
      onTransitionEnd={() => {
        animationsCapturedRef.current++;

        if (animationsCapturedRef.current === 2) {
          animationsCapturedRef.current = 0;
          isAnimatingRef.current = false;
        }
      }}
      ref={node => handleForwardingRef(node, elRef)}
      data-testid={cn('toggle-switch', dataTestId)}
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
      })}
    >
      <Inner
        className={cn({
          active: isActive,
        })}
        colorName={colorName}
        toggleWidth={width}
        toggleHeight={height}
        isDisabled={isDisabled}
      />
    </Wrap>
  );
};

export default ToggleSwitch;

ToggleSwitch.propTypes = {
  isActive: PropTypes.bool.isRequired,
  id: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  isDisabled: PropTypes.bool,
  elRef: elRefPropTypes,
  dataTestId: PropTypes.string,
  ...positionPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
};

const Wrap = styled.div`
  display: inline-block;
  min-width: ${({ toggleWidth }) => toggleWidth}px;
  height: ${({ toggleHeight }) => toggleHeight}px;
  ${({ generatedStyles }) => generatedStyles};
`;

const Inner = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: ${({ toggleHeight }) => toggleHeight}px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ theme }) => theme.border};
  transition: background-color 0.3s ease;

  &:before {
    position: absolute;
    height: ${({ toggleHeight }) => toggleHeight - styles.spacing._4}px;
    width: ${({ toggleHeight }) => toggleHeight - styles.spacing._4}px;
    left: ${styles.spacing._2}px;
    bottom: ${styles.spacing._2}px;
    border-radius: 50%;
    content: '';
    background-color: ${({ theme, colorName }) => theme[colorName]};
    transition: background-color 0.3s ease, transform 0.3s ease;
  }

  &.active {
    background-color: ${({ theme }) => theme.accent_1};

    &:before {
      transform: ${({ toggleHeight, toggleWidth }) => `translateX(${toggleWidth - toggleHeight}px)`};
    }
  }
`;
