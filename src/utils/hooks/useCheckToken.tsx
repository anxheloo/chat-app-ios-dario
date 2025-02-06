import {useCallback, useEffect} from 'react';
import {getToken} from '../TokenStorage';
import {useAppStore} from '../../store';
import {NavigationProps} from '../types';

const useCheckToken = (navigation: NavigationProps) => {
  const {setToken} = useAppStore();

  const checkToken = useCallback(async () => {
    const token = await getToken();
    console.log('This is token:', token);

    if (token) {
      setToken(token);
      navigation.replace('BottomTabNavigation', {screen: 'Messages'});
    }
  }, [navigation, setToken]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
};

export default useCheckToken;
