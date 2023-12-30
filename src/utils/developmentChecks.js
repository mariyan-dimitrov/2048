import { isValidElement } from 'react';

import { allowedBorderRadiuses } from '../interfaces/designSystemInterfaces';
import log from './log';

const developmentChecks = ({ className, borderRadius, ...rest }) => {
  if (className) {
    log.error(
      `You passed a "className" prop which is forbidden for this component, the className value is "${className}".`
    );
  } else if (borderRadius) {
    let hasInvalidBorderRadius;

    if (typeof borderRadius === 'string') {
      const borders = borderRadius.split(' ');

      hasInvalidBorderRadius = borders.find(
        border => border !== '100%' && !allowedBorderRadiuses.includes(Number(border.replace('px', '')))
      );
    } else if (typeof borderRadius === 'number') {
      hasInvalidBorderRadius = !allowedBorderRadiuses.includes(borderRadius);
    }

    hasInvalidBorderRadius &&
      log.error(
        `Border "${borderRadius}" is not supported. Choose one of "${allowedBorderRadiuses.join(
          ', '
        )}". If those are not suitable for the case, it should be discussed with the team and eventually be added in the design system.`
      );
  } else if (rest && Object.keys(rest).length) {
    const badProps = { ...rest };

    for (let key in badProps) {
      if (typeof badProps[key] === 'undefined') {
        badProps[key] = 'undefined';
      }

      if (typeof badProps[key] === 'function') {
        badProps[key] = 'function';
      }

      if (typeof badProps[key] === 'object' && badProps[key] && isValidElement(badProps[key])) {
        badProps[key] = 'JSX Element';
      }
    }

    log.error(
      `You have passed some unsupported props: ${JSON.stringify(
        badProps
      )} If this is not a mistake and you need those props then it should be discussed with the team and eventually be added in the design system.`
    );
  }
};

export default developmentChecks;
