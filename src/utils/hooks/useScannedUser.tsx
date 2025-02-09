import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {apiClient} from '../../api/apiClient';
import {ADD_FRIEND, GET_SCANNED_USER} from '../../api/apis';
import {useAppStore} from '../../store';
import {NavigationProps} from '../types';

const useScannedUser = (scannedUserId: string, navigation: NavigationProps) => {
  const {socket, id: senderId, updateFriends} = useAppStore();
  const [loading, setLoading] = useState(false);

  const [scannedUser, setScannedUser] = useState({
    username: '',
    avatar: 0,
    _id: '',
  });

  const getScannedUserDetails = async (recipientId: string) => {
    setLoading(true);

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
      setLoading(false);
    }
  };

  const addFriend = async () => {
    try {
      const res = await apiClient.post(ADD_FRIEND, {
        recipientId: scannedUserId,
      });

      if (res.status === 200) {
        updateFriends(current => [scannedUser, ...current]);
        socket?.emit('addFriend', {recipientId: scannedUserId, senderId});
        Alert.alert('Success', 'Friend successfully added!');
        navigation.navigate('BottomTabNavigation', {screen: 'Contacts'});
      }
    } catch (error: any) {
      Alert.alert('Error', error.response.data.message);
    }
  };

  useEffect(() => {
    getScannedUserDetails(scannedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {loading, scannedUser, addFriend};
};

export default useScannedUser;
