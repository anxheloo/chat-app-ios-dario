import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const TOKEN_KEY = 'auth_token';

// Save the token
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    Alert.alert('Error', 'Failed to save token');
    console.error('Error saving token', error);
  }
};

// Get the token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};

// Remove the token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    Alert.alert('Error', 'Failed to remove token');
    console.error('Error removing token', error);
  }
};
