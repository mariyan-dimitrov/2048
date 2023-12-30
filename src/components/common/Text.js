import styled from 'styled-components';
import { useStoreMe } from 'store-me';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  whiteSpacePropTypes,
  textColorPropTypes,
  positionPropTypes,
  paddingPropTypes,
  i18nTextPropType,
  marginPropTypes,
  elRefPropTypes,
  textPropTypes,
} from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import styles from '../../themes/styles';
import log from '../../utils/log';

const Text = ({
  marketing,
  heading,
  body,
  component,
  weight = 400,
  color = 'text_primary',
  onHoverColor,
  text,
  prefix = '',
  suffix = '',
  maxWidth,
  children,
  isCapsized,
  id,
  onClick,
  textAlign,
  isOverflowingEllipsis = false,
  isNotSelectable,
  textTransform,
  wordBreak,
  onTransitionEnd,
  dataTestId,
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
  whiteSpace,
  elRef,
  ...rest
}) => {
  const { i18n } = useStoreMe('i18n');

  if (process.env.NODE_ENV === 'development') {
    developmentChecks(rest);

    if (marketing && (heading || body)) {
      log.error(
        'Component "Text": You have provided both "heading" and "marketing"/"body" prop. They are not compatible, please choose only one of them.'
      );
    }

    if (heading && body) {
      log.error(
        'Component "Text": You have provided both "heading" and "body" prop. They are not compatible, please choose only one of them.'
      );
    }
  }

  return (
    <Wrap
      className={cn({ 'with-ellipsis': isOverflowingEllipsis })}
      typographyType={(marketing && 'marketing') || (heading && 'headings') || 'body'}
      typographySize={marketing || heading || body || 1}
      weight={weight}
      id={id}
      onClick={onClick}
      hoverColor={onHoverColor}
      textColor={color}
      as={component || (heading ? `h${heading}` : undefined)}
      isCapsized={isCapsized}
      isNotSelectable={isNotSelectable}
      textTransform={textTransform}
      wordBreak={wordBreak}
      onTransitionEnd={onTransitionEnd}
      ref={node => handleForwardingRef(node, elRef)}
      data-testid={cn(dataTestId, 'text')}
      generatedStyles={generateStyles({
        cursor: onClick ? 'pointer' : 'inherit',
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
        whiteSpace: isOverflowingEllipsis ? 'nowrap' : whiteSpace,
      })}
    >
      <>
        {prefix}
        {children || (Array.isArray(text) ? i18n(text[0], text[1]) : i18n(text))}
        {suffix}
      </>
    </Wrap>
  );
};

export default Text;

Text.propTypes = {
  text: i18nTextPropType,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
  marketing: PropTypes.oneOf(Object.keys(styles.typography.marketing).map(Number)),
  heading: PropTypes.oneOf(Object.keys(styles.typography.headings).map(Number)),
  body: PropTypes.oneOf(Object.keys(styles.typography.body).map(Number)),
  component: PropTypes.oneOf(['div', 'span', 'p', 'i', 'b', 'strong']),
  weight: PropTypes.oneOf(styles.typography.weights),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  dataTestId: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  color: textColorPropTypes,
  isCapsized: PropTypes.bool,
  isNotSelectable: PropTypes.bool,
  textAlign: PropTypes.string,
  onHoverColor: textColorPropTypes,
  isOverflowingEllipsis: PropTypes.bool,
  onTransitionEnd: PropTypes.func,
  textTransform: PropTypes.oneOf(['capitalize', 'uppercase', 'lowercase', 'none']),
  wordBreak: PropTypes.oneOf(['normal', 'break-all', 'break-word']),
  maxWidth: PropTypes.oneOfType([
    PropTypes.exact({
      mobile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tablet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      desktop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    PropTypes.number,
    PropTypes.string,
  ]),
  whiteSpace: PropTypes.oneOfType([
    PropTypes.exact({
      mobile: whiteSpacePropTypes,
      tablet: whiteSpacePropTypes,
      desktop: whiteSpacePropTypes,
    }),
    PropTypes.string,
  ]),
  elRef: elRefPropTypes,
  ...positionPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
  ...textPropTypes,
};

/*
  Our font-family has uneven top and bottom space which is causing trouble when you want to vertically align our typography elements.
  We can fix that manually by with a CSS trick by using :before and :after elements which will adjust the text with combination of positive and negative margins.
*/

const Wrap = styled.div`
  font-size: ${props => styles.typography[props.typographyType][props.typographySize].font_size}px;
  font-weight: ${({ weight }) => weight};
  line-height: ${props =>
    props.isCapsized ? '1' : styles.typography[props.typographyType][props.typographySize].line_height};
  text-transform: ${({ textTransform }) => textTransform};
  word-break: ${({ wordBreak }) => wordBreak};
  color: ${({ theme, textColor }) => theme[textColor]};
  user-select: ${({ isCapsized, isNotSelectable }) => (isCapsized || isNotSelectable ? 'none' : 'auto')};
  transition: color 0.3s ease;
  ${({ generatedStyles }) => generatedStyles};

  &.with-ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &:hover {
    color: ${({ theme, hoverColor }) => theme[hoverColor]};
  }

  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:before {
    margin-bottom: 0.0545em;
  }

  &:after {
    margin-top: -0.0545em;
  }

  & > i.font-icon {
    transition: none;
  }

  a {
    font-size: inherit;
    font-weight: inherit;

    &:before,
    &:after {
      display: none;
    }
  }

  span,
  a,
  i,
  b,
  strong {
    display: inline-block;
  }
`;
