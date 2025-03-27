import {useState} from 'react';
import {Alert} from 'react-native';

import {useAppStore} from '../../store';
import {saveToken} from '../TokenStorage';

import {apiClient} from '../../api/apiClient';
import {LOGIN_ROUTE} from '../../api/apis';

import {replace} from '../../navigation/navigationRef';

const useLogin = () => {
  const updateKeys = useAppStore(state => state.updateKeys);
  const setToken = useAppStore(state => state.setToken);

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');

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
    console.log('Inside login');

    updateKeys({loading: true});
    try {
      const response = await apiClient.post(LOGIN_ROUTE, {username, pin});

      if (response.status === 200) {
        console.log('This is response.status:', response.status);

        await saveToken(response.data.token);
        setToken(response.data.token);

        replace('BottomTabNavigation');
      }
    } catch (error: any) {
      console.log('This is error inside Login:', error);
      console.log(
        'This is error.response.data inside Login:',
        error.response.data,
      );
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

  return {onPress, username, pin, setUsername, setPin};
};

export default useLogin;
