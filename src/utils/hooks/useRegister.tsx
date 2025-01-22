import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {apiClient} from '../../api/apiClient';
import {SIGNUP_ROUTES} from '../../api/apis';
import {useAppStore} from '../../store';
import {saveToken} from '../TokenStorage';
import {NavigationProps} from '../types';

const useRegister = (navigation: NavigationProps) => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const updateKeys = useAppStore(state => state.updateKeys);
  const username = useAppStore(state => state.username);
  const pin = useAppStore(state => state.pin);
  const avatar = useAppStore(state => state.avatar);
  const setToken = useAppStore(state => state.setToken);

  const handleRegister = async () => {
    console.log('Inside Handle Register');

    updateKeys({loading: true});
    try {
      const response = await apiClient.post(SIGNUP_ROUTES, {
        username,
        pin,
        avatar,
      });

      if (response.status === 201) {
        console.log('This is response success');

        updateKeys({loading: false, message: 'Registered Successful'});

        await saveToken(response.data.token);
        setToken(response.data.token);

        navigation.replace('BottomTabNavigation');
      }
    } catch (error: any) {
      updateKeys({loading: false, message: 'Register Failed'});
      setUserPersona({username: '', pin: '', avatar: 0});
      Alert.alert('Register Error', error?.response.data.message);
    } finally {
      updateKeys({loading: false});
    }
  };

  return handleRegister;
};

const styles = StyleSheet.create({});

export default useRegister;
