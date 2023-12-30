import styled from 'styled-components';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  allowedBackgroundColorValues,
  allowedTextColorValues,
  positionPropTypes,
  allowedIconTypes,
  paddingPropTypes,
  marginPropTypes,
  elRefPropTypes,
} from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import styles from '../../themes/styles';
import Icon from './Icon';

const sizeVariantsMap = {
  1: 18,
  2: 24,
  3: 32,
  4: 36,
  5: [54, 36],
  6: [54, 82],
};

const IconButton = ({
  icon = 'fa-times',
  iconSize,
  isActive,
  isDisabled,
  sizeVariant = 2,
  iconType = 'regular',
  hoverBgColorKey = 'accent_2',
  color,
  onHoverColor,
  bgColorKey,
  onClick,
  children,
  cursor = 'pointer',
  id,
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

  return (
    <Wrap
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      variant={3}
      bgColorKey={bgColorKey}
      hoverBgColorKey={hoverBgColorKey}
      hoverColor={onHoverColor}
      btnSize={Array.isArray(sizeVariantsMap[sizeVariant]) ? null : sizeVariantsMap[sizeVariant]}
      btnWidth={Array.isArray(sizeVariantsMap[sizeVariant]) && sizeVariantsMap[sizeVariant][0]}
      btnHeight={Array.isArray(sizeVariantsMap[sizeVariant]) && sizeVariantsMap[sizeVariant][1]}
      color={color}
      cursor={cursor}
      onClick={isDisabled ? undefined : onClick}
      id={id}
      className={cn({ 'is-active': isActive, 'is-disabled': isDisabled })}
      ref={node => handleForwardingRef(node, elRef)}
      data-testid={cn('icon-button', dataTestId)}
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
      <Icon icon={icon} iconType={iconType} size={iconSize} />
      {children}
    </Wrap>
  );
};

export default IconButton;

IconButton.propTypes = {
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  isActive: PropTypes.bool,
  sizeVariant: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  isDisabled: PropTypes.bool,
  iconType: PropTypes.oneOf(allowedIconTypes),
  hoverBgColorKey: PropTypes.oneOf([...allowedBackgroundColorValues, false]),
  color: PropTypes.oneOf(allowedTextColorValues),
  onHoverColor: PropTypes.oneOf(allowedTextColorValues),
  bgColorKey: PropTypes.oneOf([...allowedBackgroundColorValues, false]),
  onClick: PropTypes.func,
  id: PropTypes.string,
  children: PropTypes.node,
  elRef: elRefPropTypes,
  dataTestId: PropTypes.string,
  ...positionPropTypes,
  ...marginPropTypes,
  ...paddingPropTypes,
};

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ btnSize, btnWidth }) => btnWidth || btnSize}px;
  min-height: ${({ btnSize, btnHeight }) => btnHeight || btnSize}px;
  border-radius: ${styles.borderRadius.radius_1}px;
  background-color: ${({ bgColorKey, theme }) => theme[bgColorKey] || null};
  color: ${({ color, theme }) => theme[color] || null};
  transition: background-color 0.3s ease;
  ${({ generatedStyles }) => generatedStyles};

  &:hover:not(.is-disabled),
  &.is-active {
    cursor: ${({ cursor }) => cursor};
    background-color: ${({ hoverBgColorKey, theme }) => (hoverBgColorKey ? theme[hoverBgColorKey] : null)};
    color: ${({ hoverColor, theme }) => theme[hoverColor] || null};

    .tooltip-trigger {
      cursor: pointer;
    }
  }
`;
