import styled from 'styled-components';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  dimensionsPropTypes,
  textColorPropTypes,
  positionPropTypes,
  paddingPropTypes,
  marginPropTypes,
  elRefPropTypes,
  iconTypeMap,
} from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';

const Icon = ({
  icon,
  size = 14,
  iconType = 'regular',
  color = 'inherit',
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
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
  backgroundColor,
  elRef,
  id,
  dataTestId,
  ...rest
}) => {
  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  return (
    <Wrap
      className={cn('font-icon', icon, iconTypeMap[iconType])}
      id={id}
      iconSize={size}
      color={color}
      backgroundColorKey={backgroundColor}
      ref={node => handleForwardingRef(node, elRef)}
      data-testid={cn('icon', dataTestId)}
      generatedStyles={generateStyles({
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
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
    />
  );
};

export default Icon;

Icon.propTypes = {
  icon: PropTypes.string,
  id: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconType: PropTypes.oneOf(Object.keys(iconTypeMap)),
  color: textColorPropTypes,
  backgroundColor: textColorPropTypes,
  elRef: elRefPropTypes,
  dataTestId: PropTypes.string,
  ...positionPropTypes,
  ...dimensionsPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
};

const Wrap = styled.i`
  font-size: ${({ iconSize }) => (isFinite(iconSize) ? `${iconSize}px` : iconSize)};
  color: ${({ theme, color }) => theme[color]};
  transition: color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
  background-color: ${({ backgroundColorKey, theme }) => theme[backgroundColorKey] || null};
  ${({ generatedStyles }) => generatedStyles};
`;
