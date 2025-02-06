import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DeleteIcon from '../../assets/icons/Chat/DeleteIcon';
import {DELETE_CONVERSATION} from '../../api/apis';
import {useAppStore} from '../../store';
import {apiClient} from '../../api/apiClient';
import {Conversation} from '../../utils/types';

const DeleteComponent = () => {
  const {updateFuncChat, conversations} = useAppStore();

  const [loading, setLoading] = useState(false);

  const deleteConversation = useCallback(
    async (conversation: Conversation) => {
      setLoading(true);

      try {
        const res = await apiClient.post(DELETE_CONVERSATION, {
          conversationId: conversation._id,
        });

        if (res.status === 200) {
          // Update the UI
          updateFuncChat({
            conversations: conversations.filter(
              item => item._id !== conversation._id,
            ),
          });
        }
      } catch (error) {
        Alert.alert('Could not delete the conversation. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [conversation._id, conversations, updateFuncChat],
  );

  return (
    <TouchableOpacity
      onPress={deleteConversation}
      style={styles.renderRightActions}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <DeleteIcon width={17.5} height={21.5} color={'#FFFFFF'} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  renderRightActions: {
    paddingHorizontal: 10,
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default DeleteComponent;
