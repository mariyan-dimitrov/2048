import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  overscrollBehaviorPropTypes,
  genericResponsivePropTypes,
  negativeSpacingPropTypes,
  flexWrapAllowedValues,
  dimensionsPropTypes,
  positionPropTypes,
  paddingPropTypes,
  spacingPropTypes,
  elRefPropTypes,
} from '../../interfaces/designSystemInterfaces';
import generateDevFileNameClassName from '../../utils/generateDevFileNameClassName';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import useBreakpoints from './hooks/useBreakpoints';

const directionMarginProp = {
  row: 'marginRight',
  'row-reverse': 'marginLeft',
};

const Stack = ({
  direction = 'column',
  component = 'div',
  justifyContent,
  pointerEvents,
  alignItems,
  dataTestId,
  children,
  flexWrap,
  spacing,
  flex,
  width = 'auto',
  height = 'auto',
  position,
  top,
  left,
  right,
  bottom,
  inset,
  zIndex,
  cursor,
  overflow,
  overflowX,
  overflowY,
  transform,
  overscrollBehaviorY,
  overscrollBehaviorX,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
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
  onClick,
  elRef,
  id,
  ...rest
}) => {
  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const { currentBreakpoint } = useBreakpoints();
  const currentDirection = direction?.[currentBreakpoint] || direction;
  const childrenStyles = generateStyles({
    [directionMarginProp[currentDirection] || 'marginBottom']: spacing,
  });

  return (
    <Wrap
      id={id}
      className={process.env.NODE_ENV === 'development' && generateDevFileNameClassName(children)}
      childrenStyles={childrenStyles}
      data-testid={dataTestId}
      as={component}
      onClick={onClick}
      ref={node => handleForwardingRef(node, elRef)}
      generatedStyles={generateStyles({
        position,
        justifyContent,
        flexDirection: direction,
        pointerEvents,
        alignItems,
        flexWrap,
        flex,
        width,
        height,
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
        overscrollBehaviorY,
        overscrollBehaviorX,
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
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
        cursor: onClick ? 'pointer' : cursor,
      })}
    >
      {children}
    </Wrap>
  );
};

export default Stack;

const stringTypes = PropTypes.oneOfType([
  PropTypes.exact({
    mobile: PropTypes.string,
    tablet: PropTypes.string,
    desktop: PropTypes.string,
  }),
  PropTypes.string,
]);

Stack.propTypes = {
  spacing: spacingPropTypes,
  direction: stringTypes,
  justifyContent: stringTypes,
  alignItems: stringTypes,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.object, PropTypes.array]),
  component: PropTypes.oneOf(['div', 'span', 'section', 'ul']),
  dataTestId: stringTypes,
  flex: genericResponsivePropTypes,
  flexWrap: PropTypes.oneOf(flexWrapAllowedValues),
  onClick: PropTypes.func,
  overscrollBehaviorY: overscrollBehaviorPropTypes,
  overscrollBehaviorX: overscrollBehaviorPropTypes,
  id: PropTypes.string,
  elRef: elRefPropTypes,
  margin: PropTypes.oneOfType([spacingPropTypes, negativeSpacingPropTypes]),
  marginY: PropTypes.oneOfType([spacingPropTypes, negativeSpacingPropTypes]),
  marginX: PropTypes.oneOfType([spacingPropTypes, negativeSpacingPropTypes]),
  marginTop: PropTypes.oneOfType([spacingPropTypes, negativeSpacingPropTypes]),
  marginLeft: PropTypes.oneOfType([spacingPropTypes, negativeSpacingPropTypes]),
  marginRight: PropTypes.oneOfType([spacingPropTypes, negativeSpacingPropTypes]),
  marginBottom: PropTypes.oneOfType([spacingPropTypes, negativeSpacingPropTypes]),
  ...positionPropTypes,
  ...dimensionsPropTypes,
  ...paddingPropTypes,
};

const Wrap = styled.div`
  display: flex;
  ${({ generatedStyles }) => generatedStyles};

  & > *:not(:last-child) {
    ${({ childrenStyles }) => childrenStyles};
  }
`;
