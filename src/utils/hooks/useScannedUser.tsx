import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {apiClient} from '../../api/apiClient';
import {GET_SCANNED_USER} from '../../api/apis';

import {useAppStore} from '../../store';

const useScannedUser = (scannedUserId: string) => {
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

  useEffect(() => {
    getScannedUserDetails(scannedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {scannedUser};
};

export default useScannedUser;
