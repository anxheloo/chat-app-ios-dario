import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {getToken} from '../TokenStorage';
import {useAppStore} from '../../store';
import {NavigationProps} from '../types';

const useCheckToken = (navigation: NavigationProps) => {
  const setToken = useAppStore(state => state.setToken);

  const checkToken = useCallback(async () => {
    const token = await getToken();
    console.log('This is token:', token);

    if (token) {
      setToken(token);
      navigation.replace('BottomTabNavigation');
    }
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
};

export default useCheckToken;
