import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useStoreMe } from 'store-me';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import cn from 'classnames';

import {
  textColorPropTypes,
  positionPropTypes,
  paddingPropTypes,
  i18nTextPropType,
  marginPropTypes,
  elRefPropTypes,
} from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import styles from '../../themes/styles';
import Icon from './Icon';

const variantMap = {
  1: { color: 'accent_1', hoverColor: 'accent_1_darker', fontWeight: 400 },
  2: {
    color: 'text_secondary',
    hoverColor: 'text_primary',
    fontWeight: 500,
    alignContent: 'center',
  },
  3: { color: 'text_primary', hoverColor: 'text_primary', fontWeight: 400 },
};

const Anchor = ({
  children,
  to,
  rel,
  href,
  target,
  onClick,
  variant = 1,
  color,
  hoverColor,
  dataTestId,
  text,
  heading,
  body,
  weight,
  isCapsized,
  isDisabled,
  textAlign,
  isNotSelectable,
  prefixIcon,
  prefixIconSize = 14,
  suffixIcon,
  suffixIconSize = 14,
  id,
  maxWidth,
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
  onMouseEnter,
  onMouseLeave,
  isUnderlined,
  elRef,
  ...rest
}) => {
  const { i18n } = useStoreMe('i18n');
  let hrefValue = useMemo(() => {
    if (href) {
      return href;
    } else if (to) {
      return undefined;
    } else {
      return '#';
    }
  }, [href, to]);

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  return (
    <Wrap
      variant={variant}
      to={to}
      id={id}
      href={hrefValue}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : rel}
      onClick={e => {
        !to && !href && e.preventDefault();
        onClick && onClick(e);
      }}
      as={to ? Link : 'a'}
      color={color || variantMap[variant].color}
      data-testid={cn('anchor', dataTestId)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={node => handleForwardingRef(node, elRef)}
      /**
       * We are using "$" in front of some props because
       * the Link component is passing all props into the HTML, thus making React sad
       *
       * READ MORE: about the implementation below: https://styled-components.com/docs/api#transient-props
       */
      $hoverColor={hoverColor || variantMap[variant].hoverColor}
      $typographyType={heading ? 'headings' : 'body'}
      $typographySize={heading || body || 1}
      $isNotSelectable={isNotSelectable}
      $isUnderlined={isUnderlined}
      $isCapsized={isCapsized}
      $isDisabled={isDisabled}
      $weight={weight || variantMap[variant].fontWeight}
      $generatedStyles={generateStyles({
        textAlign,
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
        maxWidth,
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
      {prefixIcon && <Icon icon={prefixIcon} size={prefixIconSize} paddingRight={8} />}
      {text && (Array.isArray(text) ? i18n(text[0], text[1]) : i18n(text))}
      {children}
      {suffixIcon && <Icon icon={suffixIcon} size={suffixIconSize} paddingLeft={4} />}
    </Wrap>
  );
};

export default Anchor;

Anchor.propTypes = {
  dataTestId: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  target: PropTypes.string,
  href: PropTypes.string,
  rel: PropTypes.string,
  children: PropTypes.node,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  heading: PropTypes.oneOf(Object.keys(styles.typography.headings).map(Number)),
  body: PropTypes.oneOf(Object.keys(styles.typography.body).map(Number)),
  text: i18nTextPropType,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  weight: PropTypes.oneOf(styles.typography.weights),
  isCapsized: PropTypes.bool,
  isDisabled: PropTypes.bool,
  textAlign: PropTypes.string,
  isNotSelectable: PropTypes.bool,
  prefixIcon: PropTypes.string,
  prefixIconSize: PropTypes.oneOfType([
    PropTypes.exact({
      mobile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tablet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      desktop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    PropTypes.number,
    PropTypes.string,
  ]),
  prefixIconColor: textColorPropTypes,
  suffixIcon: PropTypes.string,
  suffixIconSize: PropTypes.oneOfType([
    PropTypes.exact({
      mobile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tablet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      desktop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    PropTypes.number,
    PropTypes.string,
  ]),
  suffixIconColor: textColorPropTypes,
  elRef: elRefPropTypes,
  maxWidth: PropTypes.oneOfType([
    PropTypes.exact({
      mobile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tablet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      desktop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    PropTypes.number,
    PropTypes.string,
  ]),
  ...positionPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
};

const Wrap = styled.div`
  font-size: ${props => styles.typography[props.$typographyType][props.$typographySize].font_size}px;
  font-weight: ${({ $weight }) => $weight};
  line-height: ${props =>
    props.$isCapsized ? '1' : styles.typography[props.$typographyType][props.$typographySize].line_height};
  color: ${({ theme, color }) => theme[color]};
  user-select: ${({ $isCapsized, $isNotSelectable }) => ($isCapsized || $isNotSelectable ? 'none' : 'auto')};
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'all')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
  text-decoration: ${({ $isUnderlined }) => ($isUnderlined ? 'underline' : 'none')};
  transition: color 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
  ${({ $generatedStyles }) => $generatedStyles};

  &:hover {
    color: ${({ theme, $hoverColor }) => theme[$hoverColor]};
    text-decoration: none;
  }

  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:before {
    margin-bottom: ${({ variant }) => variant === 1 && '0.0545em'};
  }

  &:after {
    margin-top: ${({ variant }) => variant === 1 && '-0.0545em'};
  }

  & > .font-icon {
    transition: none;
  }

  .tooltip-trigger {
    cursor: pointer;
  }

  span,
  i,
  b,
  strong {
    display: inline-block;
  }
`;
