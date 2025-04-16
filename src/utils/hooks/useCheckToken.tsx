import {useCallback, useEffect} from 'react';

import {getToken} from '../TokenStorage';

import {replace} from '../../navigation/navigationRef';

const useCheckToken = () => {
  const checkToken = useCallback(async () => {
    const token = await getToken();

    if (token) {
      replace('BottomTabNavigation');
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
};

export default useCheckToken;
