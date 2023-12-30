import { divideDependencies, formatDependencies, roundDependencies, create } from 'mathjs/lib/esm/number';
import { utils } from 'ethers';
import numeral from 'numeral';

import getErrorDataForLog from './getErrorDataForLog';
import memoize from './memoize';

// Only the used parts of mathjs will be bundled thanks to tree-shaking.
const {
  divide: mathJsDivide,
  round: mathJsRound,
  format: mathJSFormat,
} = create({
  divideDependencies,
  formatDependencies,
  roundDependencies,
});

export const divide = mathJsDivide;
export const round = mathJsRound;

export function plus() {
  let result = numeral(arguments[0] || 0);

  for (let i = 1; i < arguments.length; i++) {
    result = result.add(arguments[i] || 0);
  }

  return Number(result.value());
}

export function minus() {
  let result = numeral(arguments[0] || 0);

  for (let i = 1; i < arguments.length; i++) {
    result = result.subtract(arguments[i] || 0);
  }

  return Number(result.value());
}

export function times() {
  let result = numeral(arguments[0] || 0);

  for (let i = 1; i < arguments.length; i++) {
    result = result.multiply(arguments[i] || 0);
  }

  return Number(result.value());
}

export const isNumber = value => !isNaN(Number(value)) && !isNaN(parseFloat(value));

/* Converts scientific notations to decimal form (1.7463e+3 to 1746.3 | 8.3380647e-3 to 0.0083380647) */
export const toNonExponential = memoize((value, decimals, mathJSFormatConfig = {}) => {
  const config = { notation: 'fixed', ...mathJSFormatConfig };
  let parsedValue = value;

  if (typeof value === 'string') {
    parsedValue = parseFloat(value);
  }

  if (typeof decimals === 'number') {
    config.precision = decimals || 0;
  }

  return mathJSFormat(parsedValue, config);
});

export const toFixed = memoize((value, decimals) => (isNumber(value) ? round(value || 0, decimals || 0) : false));

export const format = memoize((value, type) => {
  const numeralResult = numeral(value || 0);

  numeralResult._value = toNonExponential(numeralResult._value);

  return numeralResult.format(type);
});

export const toAbbreviatedNumber = memoize((value, locale) =>
  Intl.NumberFormat(locale.replace('_', '-'), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
);

export const toFixedCut = memoize((number, decimals) => {
  let parsedNumber = number;

  if (typeof parsedNumber === 'number') {
    parsedNumber = String(parsedNumber);
  }

  if (parsedNumber.includes('.')) {
    if (parsedNumber.includes('e')) {
      parsedNumber = toNonExponential(parsedNumber);
    }

    let result = '';
    let passedDecimalPoint = false;
    let numberOfDecimals = 0;

    for (let index in parsedNumber) {
      const currentNumberPart = parsedNumber[index];

      if (passedDecimalPoint) {
        numberOfDecimals++;
      }

      if (currentNumberPart === '.') {
        if (!decimals) {
          break;
        }

        passedDecimalPoint = true;
      }

      if (numberOfDecimals > decimals) {
        break;
      }

      result += currentNumberPart;
    }

    return result;
  } else {
    return parsedNumber;
  }
});

export const percentage = memoize((partialValue, totalValue) => divide(times(100, partialValue), totalValue));

export const percentageDiff = memoize((prevValue, newValue) => percentage(minus(newValue, prevValue), newValue));

export const percentOfNumber = memoize((number, percentage) => times(number, divide(percentage, 100)));

export const fromWeiToEther = memoize((value, decimals = 0) => {
  const isExponential = String(value).includes('e');
  const safeValue = isExponential ? toNonExponential(value) : String(value);

  try {
    const result = utils.formatUnits(safeValue, decimals).toString();
    const shouldRoundRegex = /[1-9]/;
    const shouldRound = !shouldRoundRegex.test(result.split('.')[1] || '');

    return String(shouldRound ? round(result) : result);
  } catch (error) {
    process.env.NODE_ENV !== 'development' &&
      getErrorDataForLog('fromWeiToEther', error, `value: ${value}, safeValue: ${safeValue} decimals: ${decimals}`);

    return divide(safeValue, 10 ** decimals);
  }
});

export const fromEtherToWei = memoize((value, decimals = 0) => {
  // TODO: Check if its a big of a hustle to move this check inside the toNonExponential function
  const isExponential = String(value).includes('e');
  const safeValue = isExponential ? toNonExponential(value) : String(value);

  try {
    const result = utils.parseUnits(safeValue, decimals).toString();

    return result === '0.0' ? '0' : result;
  } catch (error) {
    process.env.NODE_ENV !== 'development' &&
      getErrorDataForLog('fromEtherToWei', error, `value: ${value}, safeValue: ${safeValue} decimals: ${decimals}`);

    return toNonExponential(times(safeValue, 10 ** decimals));
  }
});

export const truncatePositiveDecimals = memoize((number, visiblePositiveDecimals = 1, minPrecision = 1) => {
  let parsedNumber = number;

  if (typeof parsedNumber === 'number') {
    parsedNumber = String(parsedNumber);
  }

  if (parsedNumber % 1 || parsedNumber.indexOf('.') !== -1) {
    const wholeNumbers = [];
    const decimals = [];
    let decimalPointFound = false;
    let wholeDecimalNumbersFound = 0;
    let joinCharacter = '';

    if (parsedNumber.includes('e')) {
      parsedNumber = toNonExponential(parsedNumber);
    }

    for (let index in parsedNumber) {
      if (decimalPointFound) {
        if (parsedNumber[index] !== '0') {
          wholeDecimalNumbersFound++;
        }

        if (wholeDecimalNumbersFound && parsedNumber[index] === '0') {
          break;
        }

        decimals.push(parsedNumber[index]);

        if (wholeDecimalNumbersFound >= visiblePositiveDecimals && decimals.length >= minPrecision) {
          break;
        }
      } else {
        if (parsedNumber[index] === '.') {
          decimalPointFound = true;
          joinCharacter = '.';
        } else {
          wholeNumbers.push(parsedNumber[index]);
        }
      }
    }

    return `${wholeNumbers.join('')}${joinCharacter}${decimals.join('')}`;
  } else {
    return parsedNumber;
  }
});

/*
  The function below is used to fill the missing parts of doughnut chart data to full 100%,
  as we are losing some parts when toFixedCut-ing.
  e.g. toFixedCut(78.76438975, 2) will return 78.76 and we lose 0.00438975
  It takes the percentages for the displayed assets and subtracts their sum from 100,
  then split the remaining value between displayed assets in even shares
*/

export const roundUpPercentages = memoize(percentages => {
  const roundUpRecursively = (correctionArray, slices, portion) => {
    let remainingSlices = [...slices];

    for (let i = 0; i < correctionArray.length; i++) {
      if (remainingSlices.length > 0) {
        correctionArray[i] = plus(correctionArray[i], portion);
        remainingSlices.pop();
      }

      if (i === minus(correctionArray.length, 1) && remainingSlices.length > 0) {
        roundUpRecursively(correctionArray, remainingSlices, portion);
      }
    }
  };

  const totalSum = percentages.reduce((a, b) => a + b, 0);
  let aggregatedPercentages = 0;
  let correctedPercentages = percentages;

  // In these scenarios we can't do anything so we just return the input value
  if (totalSum > 100 || totalSum < 95 || (percentages.length > 1 && percentages.includes(99.99))) {
    return percentages;
  }

  if (percentages.length === 1) {
    return [100];
  }

  percentages.forEach(percent => {
    let formattedPercent = percent;

    if (typeof formattedPercent === 'string') {
      formattedPercent = Number(formattedPercent);
    }

    aggregatedPercentages = plus(aggregatedPercentages, formattedPercent);
  });

  const remainingPercentages = minus(100, aggregatedPercentages);
  const portion = 0.01;
  const slicesToShare = Math.round(divide(remainingPercentages, portion));
  const remainingSlices = new Array(slicesToShare).fill(portion);

  roundUpRecursively(correctedPercentages, remainingSlices, portion);

  return correctedPercentages;
});
