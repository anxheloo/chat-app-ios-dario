import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {apiClient} from '../../api/apiClient';
import {ADD_FRIEND, GET_SCANNED_USER} from '../../api/apis';

import {useAppStore} from '../../store';

import {NavigationProps} from '../types';

const useScannedUser = (scannedUserId: string, navigation: NavigationProps) => {
  const updateFriends = useAppStore(state => state.updateFriends);
  const updateKeys = useAppStore(state => state.updateKeys);

  const [scannedUser, setScannedUser] = useState({
    username: '',
    avatar: 0,
    _id: '',
  });

  const getScannedUserDetails = async (recipientId: string) => {
    updateKeys({loading: true});
    // Fetch user details from server
    try {
      const response = await apiClient.get(
        `${GET_SCANNED_USER}/${recipientId}`,
      );

      if (response.status === 200) {
        const {username, avatar, _id} = response.data;
        setScannedUser({username, avatar, _id});
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get user details');
      console.log(error);
    } finally {
      updateKeys({loading: false});
    }
  };

  const addFriend = async () => {
    const {socket, id} = useAppStore.getState();

    try {
      const res = await apiClient.post(ADD_FRIEND, {
        recipientId: scannedUserId,
      });

      if (res.status === 200) {
        updateFriends(current => [scannedUser, ...current]);
        await socket?.emit('addFriend', {
          recipientId: scannedUserId,
          senderId: id,
        });
        Alert.alert('Success', 'Friend successfully added!');
        // navigation?.navigate('BottomTabNavigation', {screen: 'Contacts'});
        navigation?.reset({
          index: 0,
          routes: [{name: 'BottomTabNavigation', params: {screen: 'Contacts'}}],
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.response.data.message);
    }
  };

  useEffect(() => {
    getScannedUserDetails(scannedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {scannedUser, addFriend};
};

export default useScannedUser;
