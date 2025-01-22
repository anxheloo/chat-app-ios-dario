import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {apiClient} from '../../api/apiClient';
import {ADD_FRIEND, GET_SCANNED_USER} from '../../api/apis';
import {useAppStore} from '../../store';
import {NavigationProps} from '../types';

const useScannedUser = (scannedUserId: string, navigation: NavigationProps) => {
  const token = useAppStore(state => state.token);
  const socket = useAppStore(state => state.socket);
  const senderId = useAppStore(state => state.id);
  const [loading, setLoading] = useState(false);

  const [scannedUser, setScannedUser] = useState({
    username: '',
    avatar: '',
    id: '',
  });

  const getScannedUserDetails = async () => {
    setLoading(true);

    // Fetch user details from server
    try {
      const response = await apiClient.get(
        `${GET_SCANNED_USER}/${scannedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const {username, avatar, id} = response.data;
        setScannedUser({username, avatar, id});
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get user details');
      console.log(error);
      setLoading(false);
    }
  };

  const addFriend = useCallback(async () => {
    try {
      const res = await apiClient.post(
        ADD_FRIEND,
        {
          recipientId: scannedUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        socket?.emit('addFriend', {recipientId: scannedUserId, senderId});
        Alert.alert('Success', 'Friend successfully added!');
        navigation?.navigate('BottomTabNavigation', {screen: 'Contacts'});
      }
    } catch (error: any) {
      console.log('This is error in send friend:', error);
      Alert.alert('Error', 'Failed to send request');
    }
  }, [token, socket, senderId, scannedUserId, navigation]);

  useEffect(() => {
    getScannedUserDetails();
  }, []);

  return {loading, scannedUser, addFriend};
};

export default useScannedUser;
