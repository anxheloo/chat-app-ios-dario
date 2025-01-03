import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

// Save the token
export const saveToken = async (token: string) => {
  try {
    console.log('this is token and typeof token:', token, typeof token);
    // const jsonValue = JSON.stringify(token);
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token', error);
  }
};

// Get the token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    // console.log('this is token:', token);
    return token;
    // return token != null ? JSON.parse(token) : null;
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
    console.error('Error removing token', error);
  }
};
