import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  positionPropTypes,
  paddingPropTypes,
  displayPropTypes,
  marginPropTypes,
  elRefPropTypes,
} from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import useBreakpoints from './hooks/useBreakpoints';

const Separator = ({
  direction = 'horizontal',
  display,
  position,
  borderOffset = 0,
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
  id,
  ...rest
}) => {
  const { currentBreakpoint } = useBreakpoints();
  const minWidth =
    direction?.[currentBreakpoint] === 'horizontal' || direction === 'horizontal'
      ? `calc(100% - ${borderOffset * 2}px)`
      : '1px';
  const minHeight =
    direction?.[currentBreakpoint] === 'horizontal' || direction === 'horizontal'
      ? '1px'
      : `calc(100% - ${borderOffset * 2}px)`;

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  return (
    <Wrap
      ref={node => handleForwardingRef(node, elRef)}
      id={id}
      generatedStyles={generateStyles({
        display,
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
      })}
    />
  );
};

export default Separator;

Separator.propTypes = {
  elRef: elRefPropTypes,
  id: PropTypes.string,
  borderOffset: PropTypes.number,
  direction: PropTypes.oneOfType([
    PropTypes.exact({
      mobile: PropTypes.oneOf(['horizontal', 'vertical']),
      tablet: PropTypes.oneOf(['horizontal', 'vertical']),
      desktop: PropTypes.oneOf(['horizontal', 'vertical']),
    }),
    PropTypes.oneOf(['horizontal', 'vertical']),
  ]),
  ...positionPropTypes,
  ...displayPropTypes,
  ...paddingPropTypes,
  ...marginPropTypes,
};

const Wrap = styled.div`
  background-color: ${({ theme }) => theme.border};
  transition: background-color 0.3s ease;
  ${({ generatedStyles }) => generatedStyles};
`;
