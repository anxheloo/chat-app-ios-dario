import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import {Message} from '../../../../utils/types';

import {useAppStore} from '../../../../store';

import {BORDERRADIUS, FONTSIZE} from '../../../../theme/theme';

import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import Voice from './Voice/Voice';
import TextMsg from './TextMsg';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import moment from 'moment';

import DeleteIcon from '../../../../assets/icons/Chat/DeleteIcon';

type MessageItemProps = {
  message: Message;
};

const MessageItem: React.FC<MessageItemProps> = React.memo(({message}) => {
  const loggedInUserId = useAppStore(state => state.id);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const isSender = message?.sender === loggedInUserId;

  // Show modal on delete icon click
  const showDeleteModal = useCallback(() => {
    updateFuncChat({selectedMessageToDelete: message});
  }, [message, updateFuncChat]);

  // Render messages based on message type
  const renderMessage = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (isSender: boolean) => {
      switch (message.messageType) {
        case 'text':
          return (
            <TextMsg message={message} isSender={isSender}>
              {message.content}
            </TextMsg>
          );
        case 'image':
          return <ImageComponent message={message} isSender={isSender} />;
        case 'video':
          return <VideoComponent message={message} isSender={isSender} />;
        case 'audio':
          return <Voice message={message} isSender={isSender} />;
        case 'deleted':
          return (
            <TextMsg message={message} isSender={isSender}>
              Message deleted
            </TextMsg>
          );
        default:
          return null;
      }
    },
    [message],
  );

  // Render delete icon
  const renderRightActions = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={showDeleteModal}
        style={styles.renderRightActions}>
        <DeleteIcon width={17.5} height={21.5} color={'red'} />
      </TouchableOpacity>
    );
  }, [showDeleteModal]);

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
          renderRightActions={() => renderRightActions}
          overshootRight={false}>
          {renderMessage(isSender)}
        </Swipeable>
      ) : (
        renderMessage(isSender)
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
