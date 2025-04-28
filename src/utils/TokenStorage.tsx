import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

import {Alert} from 'react-native';

import {useAppStore} from '../store';

const TOKEN_KEY = 'auth_token';

// Save the token
export const saveToken = async (token: string) => {
  const {setToken} = useAppStore.getState();

  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setToken(token);
  } catch (error) {
    Alert.alert('Error', 'Failed to save token');
    console.error('Error saving token', error);
  }
};

// Get the token1
export const getToken = async () => {
  const {setToken, token: userToken} = useAppStore.getState();

  if (userToken) {
    return userToken;
  }

  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      setToken(token);
    }
    return token;
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};

// Remove the token
export const removeToken = async () => {
  const {setToken} = useAppStore.getState();
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    await clearKeychainIfNoToken();
  } catch (error) {
    Alert.alert('Error', 'Failed to remove token');
    console.error('Error removing token', error);
  }
};

export const clearKeychainIfNoToken = async () => {
  const keys = await Keychain.getAllGenericPasswordServices?.();
  if (keys) {
    await Promise.all(
      keys.map(service => Keychain.resetGenericPassword({service})),
    );
  }
};
