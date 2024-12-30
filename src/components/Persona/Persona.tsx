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

type PersonaProps = {
  // contact: Contact;
  contact: Contact | Conversation;
  navigation?: NavigationProps;
  cancel?: () => void;
  version: number;
};

const Persona: React.FC<PersonaProps> = ({
  contact,
  navigation,
  cancel,
  version,
}) => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const selectedChatData = useAppStore(state => state.selectedChatData);

  const isConversation = (
    contact: Contact | Conversation,
  ): contact is Conversation => 'participants' in contact;

  // Extract data based on type
  const username = isConversation(contact)
    ? contact.participants[1].username
    : contact.username;

  const avatar = isConversation(contact)
    ? contact.participants[1].avatar
    : contact.avatar;

  const lastMessageTime = isConversation(contact)
    ? contact.lastMessageTime
    : undefined;

  const content = isConversation(contact)
    ? contact?.lastMessage?.content
    : undefined;

  const messageType = isConversation(contact)
    ? contact.lastMessage?.messageType
    : undefined;

  const fileUrl = isConversation(contact)
    ? contact.lastMessage?.fileUrl
    : undefined;

  // Select contact to update chat
  const selectContact = () => {
    const selectedContact = isConversation(contact)
      ? contact.participants[1]
      : contact;

    // updateFuncChat({selectedChatData: contact});
    updateFuncChat({selectedChatData: selectedContact});
    // console.log('Selected contact:', contact);
    if (cancel) {
      cancel();
    }
    if (selectedChatData && selectedChatData._id !== contact._id) {
      updateFuncChat({selectedChatMessages: []});
    }
    navigation?.navigate('Chat');
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
    <TouchableOpacity style={styles.container} onPress={selectContact}>
      <Avatar
        width={version === 2 ? 46 : 36}
        height={version === 2 ? 46 : 36}
        avatarWidth={version === 2 ? 34 : 27}
        avatarHeight={version === 2 ? 34 : 27}
        backgroundColor={COLORS.LightGray2}
        // src={contact.avatar}
        src={avatar}
      />
      <View style={styles.secondContainer}>
        {/* <Text style={styles.username}>@{contact.username}</Text> */}
        <Text style={styles.username}>@{username}</Text>
        <View>{version === 2 && renderLastMessage()}</View>
      </View>

      {version === 2 && (
        <Text style={[styles.messageDate]}>
          {moment(lastMessageTime).format('H:mm')}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 6,
    gap: 15,
  },

  secondContainer: {
    flex: 1,
    gap: 5,
    justifyContent: 'space-between',
  },

  username: {
    fontWeight: '300',
    flex: 1,
    paddingVertical: 6,
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

export default Persona;
