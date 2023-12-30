/* eslint-disable no-param-reassign */
import { useStoreMe } from 'store-me';
import { useEffect } from 'react';

import apiServices from '../services/apiServices';

const alertUser = e => {
  (e || window.event).preventDefault();
  (e || window.event).returnValue = '';
};

const usePromptWhenUserLeaves = () => {
  const { transactionToRejectIfUserLeavesApp } = useStoreMe('transactionToRejectIfUserLeavesApp');

  useEffect(
    function warnUserLeavingDuringSwap() {
      if (transactionToRejectIfUserLeavesApp) {
        const handleTransactionReject = () => apiServices.rejectTransaction(transactionToRejectIfUserLeavesApp);

        window.addEventListener('beforeunload', alertUser);
        window.addEventListener('unload', handleTransactionReject);

        return () => {
          window.removeEventListener('beforeunload', alertUser);
          window.removeEventListener('unload', handleTransactionReject);
        };
      }
    },
    [transactionToRejectIfUserLeavesApp]
  );
};

export default usePromptWhenUserLeaves;
