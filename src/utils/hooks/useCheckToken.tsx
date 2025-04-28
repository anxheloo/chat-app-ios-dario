import {useCallback, useEffect} from 'react';

import {clearKeychainIfNoToken, getToken} from '../TokenStorage';

import {useAppStore} from '../../store';

const useCheckToken = () => {
  const {updateKeys} = useAppStore.getState();

  const checkToken = useCallback(async () => {
    const token = await getToken();

    if (token) {
      updateKeys({pinModal: true});
    } else {
      await clearKeychainIfNoToken();
    }
  }, [updateKeys]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
};

export default useCheckToken;
