import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Avatar from './Avatar';
import {useAppStore} from '../../store';
import {Contact, Conversation, NavigationProps} from '../../utils/types';
import {COLORS, FONTSIZE} from '../../theme/theme';
import moment from 'moment';
import {checkIfImage, checkIfVideo} from '../../utils/helpers';
import CameraIcon from '../../assets/icons/Chat/CameraIcon';
import VideoIcon from '../../assets/icons/Chat/VideoIcon';

type ConversationsProps = {
  conversation: Conversation;
  navigation?: NavigationProps;
  backgroundColor?: string;
  cancel?: () => void;
};

const Conversations: React.FC<ConversationsProps> = ({
  conversation,
  navigation,
  backgroundColor,
  cancel,
}) => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const loggedInUserId = useAppStore(state => state.id);

  const username = conversation.participants.filter(
    participant => participant._id !== loggedInUserId,
  )[0]?.username;

  const avatar = conversation.participants.filter(
    participant => participant._id !== loggedInUserId,
  )[0]?.avatar;

  const lastMessageTime = conversation.lastMessageTime;

  const content = conversation?.lastMessage?.content;

  const messageType = conversation.lastMessage?.messageType;

  const fileUrl = conversation.lastMessage?.fileUrl;

  console.log('THIS IS content', content);

  // Select contact to update chat
  const selectContact = () => {
    const selectedContact = conversation.participants.filter(
      participant => participant._id !== loggedInUserId,
    )[0];

    updateFuncChat({selectedChatData: selectedContact});

    navigation?.navigate('Chat');

    if (cancel) {
      cancel();
    }
  };

  const renderLastMessage = () => {
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
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
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
        <View>{renderLastMessage()}</View>
      </View>

      <Text style={[styles.messageDate]}>
        {moment(lastMessageTime).format('H:mm')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 15,
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
});

export default Conversations;
