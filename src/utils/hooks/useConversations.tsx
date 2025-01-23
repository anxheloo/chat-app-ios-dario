import {useCallback} from 'react';
import {GET_CONVERSATIONS} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';
import {Alert} from 'react-native';

const useConversations = () => {
  const token = useAppStore(state => state.token);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const updateKeys = useAppStore(state => state.updateKeys);

  const getConversations = useCallback(async () => {
    updateKeys({loading: true});
    try {
      const res = await apiClient.get(GET_CONVERSATIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        updateFuncChat({conversations: res.data.conversations});
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get conversations');
      console.error('Error fetching conversations:', error);
    } finally {
      updateKeys({loading: false});
    }
  }, [token, updateFuncChat, updateKeys]);

  // return {getConversations, loading};
  return getConversations;
};

export default useConversations;
