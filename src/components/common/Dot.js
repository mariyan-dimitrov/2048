import styled from 'styled-components';
import PropTypes from 'prop-types';
import cn from 'classnames';

import {
  backgroundColorPropTypes,
  allowedGradientValues,
  boxSizingPropTypes,
  positionPropTypes,
  marginPropTypes,
  elRefPropTypes,
} from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import log from '../../utils/log';

const Dot = ({
  size = 6,
  shouldSDotStretch,
  backgroundColor,
  gradientColors,
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
  border,
  borderColor,
  boxSizing,
  elRef,
  id,
  dataTestId,
  ...rest
}) => {
  if (process.env.NODE_ENV === 'development') {
    developmentChecks(rest);

    if (gradientColors && backgroundColor) {
      log.error(
        'Component "Dot": You have provided both "backgroundColor" and "gradientColors" prop. They are not compatible, please choose only one of them.'
      );
    }
  }

  return (
    <Wrap
      dotSize={size}
      id={id}
      data-testid={cn('dot', dataTestId)}
      shouldSDotStretch={shouldSDotStretch}
      borderColor={borderColor}
      backgroundColor={gradientColors ? undefined : backgroundColor || 'accent_1'}
      gradientColors={gradientColors}
      ref={node => handleForwardingRef(node, elRef)}
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
        boxSizing,
        border,
      })}
    />
  );
};

export default Dot;

Dot.propTypes = {
  size: PropTypes.oneOf([2, 4, 6, 8]),
  shouldSDotStretch: PropTypes.bool,
  gradientColors: PropTypes.arrayOf(PropTypes.oneOf(allowedGradientValues)),
  color: backgroundColorPropTypes,
  elRef: elRefPropTypes,
  border: PropTypes.string,
  borderColor: backgroundColorPropTypes,
  boxSizing: boxSizingPropTypes,
  id: PropTypes.string,
  dataTestId: PropTypes.string,
  ...positionPropTypes,
  ...marginPropTypes,
};

const Wrap = styled.span`
  min-width: ${({ shouldSDotStretch, dotSize }) => (shouldSDotStretch ? dotSize * 2 : dotSize)}px;
  max-width: ${({ shouldSDotStretch, dotSize }) => (shouldSDotStretch ? dotSize * 2 : dotSize)}px;
  min-height: ${({ dotSize }) => dotSize}px;
  max-height: ${({ dotSize }) => dotSize}px;
  color: ${({ theme, borderColor }) => theme[borderColor]};
  border-radius: ${({ dotSize }) => dotSize}px;
  transition: background-color 0.3s ease, background-image 0.3s ease, color 0.3s ease, width 0.3s ease;
  background-color: ${({ backgroundColor, theme }) => (backgroundColor ? theme[backgroundColor] : undefined)};
  background-image: ${({ gradientColors, theme }) =>
    gradientColors
      ? `linear-gradient(270deg, ${theme[gradientColors[0]]} 0%, ${theme[gradientColors[1]]} 100%)`
      : undefined};
  ${({ generatedStyles }) => generatedStyles};
`;
