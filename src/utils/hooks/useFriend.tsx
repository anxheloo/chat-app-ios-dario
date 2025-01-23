import {useCallback} from 'react';
import {Alert} from 'react-native';
import {apiClient} from '../../api/apiClient';
import {GET_ALL_FRIENDS} from '../../api/apis';
import {useAppStore} from '../../store';

const useFriend = () => {
  const token = useAppStore(state => state.token);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const updateKeys = useAppStore(state => state.updateKeys);

  console.log('Inside useFriend hook step 1 ');

  const getFriends = useCallback(async () => {
    console.log('Inside getFriends function step 2');

    updateKeys({loading: true});
    // setLoading(true);
    try {
      const res = await apiClient.get(GET_ALL_FRIENDS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        updateFuncChat({friends: res.data.friends});
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get friends');
      console.error('Error fetching friends:', error);
    } finally {
      updateKeys({loading: false});
      // setLoading(false);
    }
  }, [token, updateFuncChat, updateKeys]);

  return getFriends;
};

export default useFriend;
