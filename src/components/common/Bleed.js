import styled from 'styled-components';
import PropTypes from 'prop-types';

import generateDevFileNameClassName from '../../utils/generateDevFileNameClassName';
import { spacingPropTypes } from '../../interfaces/designSystemInterfaces';
import developmentChecks from '../../utils/developmentChecks';
import generateStyles from '../../utils/generateStyles';
import memoize from '../../utils/memoize';

const convertToNegativeValue = val =>
  isFinite(val) ? -val : Object.keys(val).reduce((res, keyName) => ({ ...res, [keyName]: -val[keyName] }), {});

const marginGenerator = {
  horizontal: val => ({
    marginLeft: convertToNegativeValue(val),
    marginRight: convertToNegativeValue(val),
  }),
  vertical: val => ({
    marginTop: convertToNegativeValue(val),
    marginBottom: convertToNegativeValue(val),
  }),
  top: val => ({ marginTop: convertToNegativeValue(val) }),
  bottom: val => ({ marginBottom: convertToNegativeValue(val) }),
  left: val => ({ marginLeft: convertToNegativeValue(val) }),
  right: val => ({ marginRight: convertToNegativeValue(val) }),
};

const createStylesToGenerate = bleedProps => {
  let result = {};

  for (let propName in bleedProps) {
    if (bleedProps[propName]) {
      result = { ...result, ...marginGenerator[propName](bleedProps[propName]) };
    }
  }

  return result;
};

const memoizedCreateStylesToGenerate = memoize(createStylesToGenerate, key => key);

const Bleed = ({ children, component = 'div', horizontal, vertical, top, bottom, left, right, id, ...rest }) => {
  const stylesToGenerate = memoizedCreateStylesToGenerate({
    horizontal,
    vertical,
    top,
    bottom,
    left,
    right,
  });

  process.env.NODE_ENV === 'development' && developmentChecks(rest);

  return (
    <Wrap
      className={process.env.NODE_ENV === 'development' && generateDevFileNameClassName(children)}
      as={component}
      id={id}
      generatedStyles={generateStyles({ ...stylesToGenerate })}
    >
      {children}
    </Wrap>
  );
};

export default Bleed;

Bleed.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node.isRequired,
  component: PropTypes.oneOf(['div', 'span']),
  horizontal: spacingPropTypes,
  vertical: spacingPropTypes,
  top: spacingPropTypes,
  bottom: spacingPropTypes,
  left: spacingPropTypes,
  right: spacingPropTypes,
};

const Wrap = styled.div`
  ${({ generatedStyles }) => generatedStyles};
`;
