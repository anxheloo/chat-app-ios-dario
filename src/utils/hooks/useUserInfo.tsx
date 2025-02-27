import {useEffect} from 'react';
import {Alert} from 'react-native';

import {useAppStore} from '../../store';

import {apiClient} from '../../api/apiClient';
import {
  GET_ALL_FRIENDS,
  GET_CONVERSATIONS,
  GET_USER_INFO,
} from '../../api/apis';

const useUserInfo = () => {
  const setUserInfoStatus = useAppStore(state => state.setUserInfoStatus);
  const updateKeys = useAppStore(state => state.updateKeys);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const isUserInfoFetched = useAppStore(state => state.isUserInfoFetched);
  const setUserPersona = useAppStore(state => state.setUserPersona);

  // Get user info function
  const getUserInfo = async () => {
    if (isUserInfoFetched) {
      return;
    }

    updateKeys({loading: true});

    try {
      const [userRes, conversationsRes, friendsRes] = await Promise.all([
        apiClient.get(GET_USER_INFO),
        apiClient.get(GET_CONVERSATIONS),
        apiClient.get(GET_ALL_FRIENDS),
      ]);

      if (
        userRes.status === 200 &&
        conversationsRes.status === 200 &&
        friendsRes.status === 200
      ) {
        setUserInfoStatus(true);
        setUserPersona(userRes.data);
        updateFuncChat({
          conversations: conversationsRes.data.conversations,
          friends: friendsRes.data.friends,
        });
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to get user datas.',
      );
    } finally {
      updateKeys({loading: false});
    }
  };

  //Get user info
  useEffect(() => {
    console.log('This is getUserInfo step 2');
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useUserInfo;
