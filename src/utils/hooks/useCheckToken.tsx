import {useCallback, useEffect} from 'react';

import {getToken} from '../TokenStorage';

import {useAppStore} from '../../store';

import {replace} from '../../navigation/navigationRef';

const useCheckToken = () => {
  const setToken = useAppStore(state => state.setToken);

  const checkToken = useCallback(async () => {
    const token = await getToken();
    console.log('This is token:', token);

    if (token) {
      setToken(token);
      // navigation.replace('BottomTabNavigation', {screen: 'Messages'});
      // reset('BottomTabNavigation');
      replace('BottomTabNavigation');
    }
  }, [setToken]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
};

export default useCheckToken;
