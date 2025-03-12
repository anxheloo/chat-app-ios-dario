import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import Avatar from './Avatar';
import {useAppStore} from '../../store';

import {DELETE_CONVERSATION} from '../../api/apis';
import {apiClient} from '../../api/apiClient';

import {Conversation, NavigationProps} from '../../utils/types';
import {checkIfImage, checkIfVideo} from '../../utils/helpers';
import {COLORS, FONTSIZE} from '../../theme/theme';

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import moment from 'moment';

import CameraIcon from '../../assets/icons/Chat/CameraIcon';
import VideoIcon from '../../assets/icons/Chat/VideoIcon';
import DeleteIcon from '../../assets/icons/Chat/DeleteIcon';

type ConversationsProps = {
  conversation: Conversation;
  navigation?: NavigationProps;
  backgroundColor?: string;
  cancel?: () => void;
};

const Conversations: React.FC<ConversationsProps> = React.memo(
  ({conversation, navigation, backgroundColor, cancel}) => {
    const {updateFuncChat, id: loggedInUserId} = useAppStore.getState();
    const conversations = useAppStore(state => state.conversations);
    const [loading, setLoading] = useState(false);

    const recipient = useMemo(() => {
      return conversation.participants.find(
        user => user._id !== loggedInUserId,
      );
    }, [conversation.participants, loggedInUserId]);

    // Select contact to update chat
    const selectContact = useCallback(() => {
      if (!recipient) {
        return;
      }

      updateFuncChat({
        selectedChatData: {
          ...recipient,
          conversationId: conversation._id,
        },
      });
      navigation?.navigate('Chat');
      cancel?.();
    }, [conversation._id, recipient, updateFuncChat, navigation, cancel]);

    const renderLastMessage = useMemo(() => {
      if (!conversation.lastMessage) {
        return null;
      }

      const {messageType, content, fileUrl} = conversation?.lastMessage;

      if (messageType === 'text') {
        return (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {content}
          </Text>
        );
      }

      if (messageType === 'file' && fileUrl) {
        if (checkIfImage(fileUrl)) {
          return (
            <View style={styles.lastMessage}>
              <CameraIcon width={12} height={12} />
              <Text style={styles.lastMessage}>Image</Text>
            </View>
          );
        } else if (checkIfVideo(fileUrl)) {
          return (
            <View style={styles.lastMessage}>
              <VideoIcon width={15} height={15} />
              <Text style={styles.lastMessage}>Video</Text>
            </View>
          );
        } else {
          return (
            <View style={styles.lastMessage}>
              <Text style={styles.lastMessage}>File</Text>
            </View>
          );
        }
      }

      return null;
    }, [conversation.lastMessage]);

    const deleteConversation = useCallback(async () => {
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
    }, [conversation._id, conversations, updateFuncChat]);

    const renderRightActions = useCallback(() => {
      return (
        <TouchableOpacity
          onPress={deleteConversation}
          style={[styles.renderRightActions]}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <DeleteIcon width={17.5} height={21.5} color={'#FFFFFF'} />
          )}
        </TouchableOpacity>
      );
    }, [deleteConversation, loading]);

    if (!recipient) {
      return null;
    }

    return (
      <ReanimatedSwipeable
        friction={2}
        renderRightActions={renderRightActions}
        overshootRight={false}
        key={conversation._id}>
        <TouchableHighlight
          underlayColor={'white'}
          activeOpacity={1}
          style={[
            styles.container,
            {backgroundColor: backgroundColor ?? 'transparent'},
          ]}
          onPress={selectContact}>
          <>
            <Avatar
              width={46}
              height={46}
              avatarWidth={34}
              avatarHeight={34}
              backgroundColor={COLORS.LightGray2}
              src={recipient?.avatar}
            />
            <View style={styles.secondContainer}>
              <Text style={styles.username}>@{recipient?.username}</Text>
              <View>{renderLastMessage}</View>
            </View>

            <Text style={[styles.messageDate]}>
              {moment(conversation?.lastMessageTime).format('H:mm')}
            </Text>
          </>
        </TouchableHighlight>
      </ReanimatedSwipeable>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LightGray2,
  },

  secondContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 6,
  },

  username: {
    fontWeight: '300',
    flex: 1,
  },

  lastMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    fontSize: FONTSIZE.sm,
    color: COLORS.LightGray,
    maxWidth: 200,
  },

  messageDate: {
    fontWeight: '300',
    fontSize: FONTSIZE.sm,
    color: 'black',
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },

  renderRightActions: {
    paddingHorizontal: 10,
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default Conversations;
