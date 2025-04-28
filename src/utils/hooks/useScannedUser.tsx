import {useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {apiClient} from '../../api/apiClient';
import {GET_SCANNED_USER} from '../../api/apis';

import {useAppStore} from '../../store';
import {Contact} from '../types';

const useScannedUser = (scannedUserId: string) => {
  const updateKeys = useAppStore(state => state.updateKeys);
  const [scannedUser, setScannedUser] = useState<Contact | null>(null);

  console.log('This is the scannedUserId', scannedUserId);

  const getScannedUserDetails = async (recipientId: string) => {
    updateKeys({loading: true});

    try {
      const response = await apiClient.get(
        `${GET_SCANNED_USER}/${recipientId}`,
      );

      if (response.status === 200) {
        const {username, avatar, _id, publicKey} = response.data;
        setScannedUser({username, avatar, _id, publicKey});
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get user details');
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
