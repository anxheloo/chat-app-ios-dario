import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {handleLogin} from '../profile';

const useLogin = () => {
  const [pin, setPin] = useState('');

  const validateInput = (): boolean => {
    if (!pin) {
      Alert.alert('Invalid Credentials', 'Please enter a valid PIN');
      return false;
    }

    if (pin.length !== 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4 digit PIN');
      return false;
    }

    return true;
  };

  const onPress = (): void => {
    if (validateInput()) {
      handleLogin(pin, setPin);
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      handleLogin(pin, setPin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin.length]);

  return {onPress, pin, setPin};
};

export default useLogin;
