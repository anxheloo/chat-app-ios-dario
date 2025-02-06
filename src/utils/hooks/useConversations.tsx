import {GET_CONVERSATIONS} from '../../api/apis';
import {apiClient} from '../../api/apiClient';
import {useAppStore} from '../../store';
import {Alert} from 'react-native';

const useConversations = () => {
  const {updateFuncChat} = useAppStore();
  const updateKeys = useAppStore(state => state.updateKeys);

  const getConversations = async () => {
    updateKeys({loading: true});
    try {
      const res = await apiClient.get(GET_CONVERSATIONS);

      if (res.status === 200) {
        updateFuncChat({conversations: res.data.conversations});
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get conversations');
      console.error('Error fetching conversations:', error);
    } finally {
      updateKeys({loading: false});
    }
  };

  return getConversations;
};

export default useConversations;
