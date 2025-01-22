import React, {useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {useAppStore} from '../../store';
import {apiClient} from '../../api/apiClient';
import {GET_USER_INFO} from '../../api/apis';

const useUserInfo = () => {
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const isUserInfoFetched = useAppStore(state => state.isUserInfoFetched);
  const setUserInfoStatus = useAppStore(state => state.setUserInfoStatus);
  const updateKeys = useAppStore(state => state.updateKeys);
  const token = useAppStore(state => state.token);

  // Get user info function
  const getUserInfo = useCallback(async () => {
    if (isUserInfoFetched) return;

    updateKeys({loading: true});

    try {
      const res = await apiClient.get(GET_USER_INFO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUserInfoStatus(true);
        setUserPersona(res.data);
        console.log('This is user info', res.data);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to get user info.',
      );
    } finally {
      updateKeys({loading: false});
    }
  }, [token, isUserInfoFetched]);

  //Get user info
  useEffect(() => {
    console.log('This is getUserInfo step 2');
    getUserInfo();
  }, [token]);
};

export default useUserInfo;
