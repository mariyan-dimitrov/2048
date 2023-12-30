import { getStoreMe } from 'store-me';

import { showGeneralToast } from '../actions/toast';

const showErrorsToastMessages = (errors, messagePrefix = '', autoClose = true) => {
  const { i18n } = getStoreMe('i18n');

  return (
    Array.isArray(errors) &&
    errors.map(error =>
      showGeneralToast({
        type: 'error',
        headline: `${i18n(messagePrefix)}${messagePrefix ? ' - ' : ''}${i18n(error)}`,
        toastifyOptions: {
          autoClose,
        },
      })
    )
  );
};

export default showErrorsToastMessages;
