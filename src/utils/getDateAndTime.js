import { getStoreMe } from 'store-me';
import PropTypes from 'prop-types';

import memoize from '../memoize';

const monthsTranslationKey = {
  1: 'JANUARY',
  2: 'FEBRUARY',
  3: 'MARCH',
  4: 'APRIL',
  5: 'MAY',
  6: 'JUNE',
  7: 'JULY',
  8: 'AUGUST',
  9: 'SEPTEMBER',
  10: 'OCTOBER',
  11: 'NOVEMBER',
  12: 'DECEMBER',
};

const generateDateAndTimePropTypes = {
  date: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  separator: PropTypes.string,
  dateFormat: PropTypes.string,
  isUsingWordForMonths: PropTypes.bool,
  isUsingLongWordsForMonths: PropTypes.bool,
};

const generateDateAndTime = ({
  date,
  separator = ' ',
  dateFormat = 'DD/MM/YYYY',
  isUsingWordForMonths = true,
  isUsingLongWordsForMonths,
}) => {
  PropTypes.checkPropTypes(
    generateDateAndTimePropTypes,
    { date, separator, dateFormat, isUsingWordForMonths, isUsingLongWordsForMonths },
    'prop',
    'generateDateAndTime'
  );

  let parsedDate = date ? new Date(date) : new Date();

  if (typeof parsedDate === 'string' && isNaN(parsedDate.getTime())) {
    const parts = parsedDate.split(/_|-|\./);

    parsedDate = new Date([parts[2], parts[1], parts[0]].join(separator));
  }

  if (isNaN(parsedDate.getTime())) {
    return false;
  } else {
    const { i18n } = getStoreMe('i18n');
    const year = parsedDate.getFullYear();
    const m = String(parsedDate.getMonth() + 1);
    const d = String(parsedDate.getDate()).padStart(2, 0);
    const h = parsedDate.getHours();
    const hour = h < 10 ? String(h).padStart(2, 0) : h;
    const minute = String(parsedDate.getMinutes()).padStart(2, 0);
    const second = String(parsedDate.getSeconds()).padStart(2, 0);
    const monthKeysPrefix = isUsingLongWordsForMonths ? 'MONTHS_LONG' : 'MONTHS_SHORT';
    const month = isUsingWordForMonths
      ? `${i18n(`${monthKeysPrefix}.${monthsTranslationKey[m]}`)}${separator === ' ' ? ',' : ''}`
      : m.padStart(2, 0);
    const formats = {
      'YYYY/MM/DD': [year, month, d],
      'YYYY/DD/MM': [year, d, month.replace(',', '')],
      'DD/MM/YYYY': [d, month, year],
      'MM/DD/YYYY': [month, d, year],
      'DD/MM': [d, month],
      'MM/DD': [month, d],
      DD: [d],
      MM: [month.replace(',', '')],
      YYYY: [year],
    };

    return {
      date: formats[dateFormat].join(separator),
      time: `${hour}:${minute}:${second}`,
    };
  }
};

const getDateAndTime = memoize(generateDateAndTime);

export default getDateAndTime;
