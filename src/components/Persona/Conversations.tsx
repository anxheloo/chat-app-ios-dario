import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from './Avatar';
import {useAppStore} from '../../store';
import {Conversation, NavigationProps} from '../../utils/types';
import {COLORS, FONTSIZE} from '../../theme/theme';
import moment from 'moment';
import {checkIfImage, checkIfVideo} from '../../utils/helpers';
import CameraIcon from '../../assets/icons/Chat/CameraIcon';
import VideoIcon from '../../assets/icons/Chat/VideoIcon';
import Swipeable, {
  SwipeableRef,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import DeleteIcon from '../../assets/icons/Chat/DeleteIcon';
import {DELETE_CONVERSATION} from '../../api/apis';
import {apiClient} from '../../api/apiClient';

type ConversationsProps = {
  conversation: Conversation;
  navigation?: NavigationProps;
  backgroundColor?: string;
  cancel?: () => void;
};

const Conversations: React.FC<ConversationsProps> = React.memo(
  ({conversation, navigation, backgroundColor, cancel}) => {
    const updateFuncChat = useAppStore(state => state.updateFuncChat);
    const loggedInUserId = useAppStore(state => state.id);
    const token = useAppStore(state => state.token);
    const directMessagesContacts = useAppStore(
      state => state.directMessagesContacts,
    );
    const [loading, setLoading] = useState(false);

    const participant = useMemo(() => {
      return conversation.participants.find(
        participant => participant._id !== loggedInUserId,
      );
    }, [conversation, loggedInUserId]);

    const username = participant?.username;
    const avatar = participant?.avatar;

    const lastMessageTime = conversation.lastMessageTime;

    const content = conversation?.lastMessage?.content;

    const messageType = conversation.lastMessage?.messageType;

    const fileUrl = conversation.lastMessage?.fileUrl;

    // Select contact to update chat
    const selectContact = useCallback(() => {
      if (!participant) return;

      updateFuncChat({
        selectedChatData: {
          ...participant,
          conversationId: conversation._id,
        },
      });
      navigation?.navigate('Chat');
      cancel?.();
    }, [conversation._id, participant, updateFuncChat, navigation, cancel]);

    const renderLastMessage = useMemo(() => {
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
    }, [messageType, fileUrl, content]);

    const deleteConversation = useCallback(async () => {
      setLoading(true);

      try {
        const res = await apiClient.post(
          DELETE_CONVERSATION,
          {conversationId: conversation._id},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.status === 200) {
          setLoading(false);

          // Update the UI
          updateFuncChat({
            directMessagesContacts: directMessagesContacts.filter(
              item => item._id !== conversation._id,
            ),
          });
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Could not delete the conversation. Please try again.');
      }
    }, [conversation._id, loading]);

    const renderRightActions = useCallback(() => {
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
    }, [loading, deleteConversation]);

    if (!participant) return null;

    return (
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.container,
            {backgroundColor: backgroundColor ?? 'transparent'},
          ]}
          onPress={selectContact}>
          <Avatar
            width={46}
            height={46}
            avatarWidth={34}
            avatarHeight={34}
            backgroundColor={COLORS.LightGray2}
            src={avatar}
          />
          <View style={styles.secondContainer}>
            <Text style={styles.username}>@{username}</Text>
            <View>{renderLastMessage}</View>
          </View>

          <Text style={[styles.messageDate]}>
            {moment(lastMessageTime).format('H:mm')}
          </Text>
        </TouchableOpacity>
      </Swipeable>
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
