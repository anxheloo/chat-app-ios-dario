import {useEffect} from 'react';
import {getToken} from '../TokenStorage';
import {useAppStore} from '../../store';
import {NavigationProps} from '../types';

const useCheckToken = (navigation: NavigationProps) => {
  const {setToken} = useAppStore();

  const checkToken = async () => {
    const token = await getToken();
    console.log('This is token:', token);

    if (token) {
      setToken(token);
      navigation.replace('BottomTabNavigation', {screen: 'Messages'});
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
};

export default useCheckToken;
