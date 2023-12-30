import styled from 'styled-components';
import PropTypes from 'prop-types';

import { positionPropTypes, marginPropTypes, elRefPropTypes } from '../../interfaces/designSystemInterfaces';
import handleForwardingRef from '../../utils/handleForwardingRef';
import developmentChecks from '../../utils/developmentChecks';
import { hex_to_rgb } from '../../utils/js/convertColorType';
import { useThemeContext } from '../general/ThemeContext';
import generateStyles from '../../utils/generateStyles';

const Spinner = ({
  loadingBaseColor = 'text_primary',
  loadingThickness,
  loadingColor = 'text_primary',
  loadingSize = 50,
  dataTestId,
  offsetLeft = 0,
  offsetTop = 0,
  isWrapped,
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
  elRef,
  id,
  ...rest
}) => {
  const { theme } = useThemeContext();
  const loadingBaseColorHex = theme[loadingBaseColor];
  const loadingColorHex = theme[loadingColor];

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  const spinner = (
    <SpinnerElement
      loadingSize={loadingSize}
      loadingColor={loadingColorHex}
      offsetLeft={isWrapped ? 0 : offsetLeft}
      offsetTop={isWrapped ? 0 : offsetTop}
      loadingThickness={loadingThickness}
      loadingBaseColor={hex_to_rgb({ hex: loadingBaseColorHex, opacity: 0.2 })}
    />
  );

  if (isWrapped) {
    return (
      <Wrap
        ref={node => handleForwardingRef(node, elRef)}
        id={id}
        loadingSize={loadingSize}
        data-testid={dataTestId}
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
        })}
      >
        {spinner}
      </Wrap>
    );
  } else {
    return spinner;
  }
};

export default Spinner;

Spinner.propTypes = {
  loadingBaseColor: PropTypes.string,
  loadingThickness: PropTypes.number,
  loadingColor: PropTypes.string,
  loadingSize: PropTypes.number,
  dataTestId: PropTypes.string,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  isWrapped: PropTypes.bool,
  elRef: elRefPropTypes,
  id: PropTypes.string,
  ...positionPropTypes,
  ...marginPropTypes,
};

const Wrap = styled.span`
  display: inline-block;
  width: ${({ loadingSize }) => loadingSize}px;
  height: ${({ loadingSize }) => loadingSize}px;
  ${({ generatedStyles }) => generatedStyles};
`;

// prettier-ignore
const SpinnerElement = styled.span`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  border-radius: 100%;
  transform: translateZ(0);
  border-color: transparent;
  animation: spin 0.7s infinite linear;
  transition: border-color 0.3s ease;
  width: ${({ loadingSize }) => loadingSize}px;
  height: ${({ loadingSize }) => loadingSize}px;
  margin-top: -${({ loadingSize, offsetTop }) => (loadingSize / 2) - offsetTop}px;
  margin-left: -${({ loadingSize, offsetLeft }) => (loadingSize / 2) - offsetLeft}px;
  margin-right: 0;
  border: ${({ loadingThickness, loadingBaseColor, loadingSize }) =>
    `${loadingThickness || Math.floor(loadingSize / 13) || 1}px solid ${loadingBaseColor}`};
  border-left-color: ${({ loadingColor }) => loadingColor};
`;
