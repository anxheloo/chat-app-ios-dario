import React, {useCallback, useState} from 'react';
import {GET_CONVERSATIONS} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';

const useConversations = () => {
  const token = useAppStore(state => state.token);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);

  const updateKeys = useAppStore(state => state.updateKeys);
  // const [loading, setLoading] = useState(false);

  const getConversations = useCallback(async () => {
    updateKeys({loading: true});
    // setLoading(true);
    try {
      const res = await apiClient.get(GET_CONVERSATIONS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        updateFuncChat({directMessagesContacts: res.data.conversations});
      }
    } catch (error) {
      // Alert.alert('Error', 'Failed to get conversations');
      console.error('Error fetching conversations:', error);
    } finally {
      updateKeys({loading: false});
      // setLoading(false);
    }
  }, [token]);

  // return {getConversations, loading};
  return getConversations;
};

export default useConversations;
