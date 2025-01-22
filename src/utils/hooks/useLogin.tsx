import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useAppStore} from '../../store';
import {apiClient} from '../../api/apiClient';
import {LOGIN_ROUTE} from '../../api/apis';
import {saveToken} from '../TokenStorage';
import {NavigationProps} from '../types';

const useLogin = (
  username: string,
  pin: string,
  setUsername: (text: string) => void,
  setPin: (text: string) => void,
  navigation: NavigationProps,
) => {
  const updateKeys = useAppStore(state => state.updateKeys);
  const setToken = useAppStore(state => state.setToken);

  const validateInput = (): boolean => {
    if (!username || !pin) {
      Alert.alert(
        'Invalid Credentials',
        'Please enter a valid username and PIN',
      );
      return false;
    }

    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4 digit PIN');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    updateKeys({loading: true});
    try {
      const response = await apiClient.post(LOGIN_ROUTE, {username, pin});

      if (response.status === 200) {
        updateKeys({loading: false});

        await saveToken(response.data.token);
        setToken(response.data.token);

        navigation.replace('BottomTabNavigation');
      }
    } catch (error: any) {
      updateKeys({loading: false});
      Alert.alert('Login Error', error?.response.data.message);
      setUsername('');
      setPin('');
    } finally {
      updateKeys({loading: false});
    }
  };

  const onPress = (): void => {
    if (validateInput()) {
      handleLogin();
    }
  };

  return onPress;
};

export default useLogin;
