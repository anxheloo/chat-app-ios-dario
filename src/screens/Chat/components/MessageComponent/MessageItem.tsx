import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Message} from '../../../../utils/types';
import {useAppStore} from '../../../../store';
import {BORDERRADIUS, FONTSIZE} from '../../../../theme/theme';
import {checkIfImage, checkIfVideo} from '../../../../utils/helpers';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import DeleteIcon from '../../../../assets/icons/Chat/DeleteIcon';
import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import moment from 'moment';
import MessageContent from './MessageContent';
import TextMsg from './TextMsg';

type MessageItemProps = {
  message: Message;
};

const MessageItem: React.FC<MessageItemProps> = React.memo(({message}) => {
  const loggedInUserId = useAppStore(state => state.id);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const isSender = message?.sender === loggedInUserId;

  // Show modal on delete icon click
  const handleShowModal = useCallback(() => {
    updateFuncChat({selectedMessageToDelete: message});
  }, [message, updateFuncChat]);

  // Render messages based on message type
  const renderMessageContent = useMemo(() => {
    switch (message.messageType) {
      case 'text':
        return <TextMsg isSender={isSender}>{message.content}</TextMsg>;
      case 'file':
        if (checkIfImage(message.fileUrl)) {
          return (
            <ImageComponent
              message={message}
              uploading={message?.uploading}
              isSender={isSender}
            />
          );
        }
        if (checkIfVideo(message.fileUrl)) {
          return (
            <VideoComponent
              message={message}
              uploading={message?.uploading}
              isSender={isSender}
            />
          );
        }
        return (
          <TouchableOpacity
            onPress={() => {
              console.log('File pressed');
            }}>
            <Text style={styles.fileName}>
              {message.fileUrl.split('/').pop()}
            </Text>
          </TouchableOpacity>
        );
      case 'deleted':
        return <TextMsg isSender={isSender}>Message deleted</TextMsg>;
      default:
        return null;
    }
  }, [message, isSender]);

  // Render delete icon
  const renderRightActions = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={handleShowModal}
        style={styles.renderRightActions}>
        <DeleteIcon width={17.5} height={21.5} color={'red'} />
      </TouchableOpacity>
    );
  }, [handleShowModal]);

  return (
    <>
      {message.showDate && (
        <Text style={styles.dateLabel}>
          {moment(message.timestamp).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'MMM Do, YYYY',
          })}
        </Text>
      )}

      {isSender && message.messageType !== 'deleted' ? (
        <Swipeable
          renderRightActions={renderRightActions}
          overshootRight={false}>
          <MessageContent isSender={isSender} createdAt={message.createdAt}>
            {renderMessageContent}
          </MessageContent>
        </Swipeable>
      ) : (
        <MessageContent isSender={isSender} createdAt={message.createdAt}>
          {renderMessageContent}
        </MessageContent>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  dateContainer: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
  },

  messageContainer: {
    borderRadius: BORDERRADIUS.radius_14,
    padding: 2,
    minWidth: 100,
    maxWidth: '70%',
    overflow: 'hidden',
  },

  messageText: {
    fontWeight: 300,
    fontSize: FONTSIZE.sm,
  },

  fileName: {
    fontSize: FONTSIZE.sm,
    fontWeight: '500',
  },

  renderRightActions: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateLabel: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
    fontSize: 12,
  },
});

export default MessageItem;
