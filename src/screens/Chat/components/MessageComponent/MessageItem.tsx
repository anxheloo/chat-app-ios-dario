import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {Message} from '../../../../types/types';

import {useAppStore} from '../../../../store';

import {BORDERRADIUS, FONTSIZE} from '../../../../theme/theme';

import ImageComponent from './ImageComponent';
import VideoComponent from './VideoComponent';
import Voice from './Voice/Voice';
import TextMsg from './TextMsg';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import DeleteIcon from '../../../../assets/icons/Chat/DeleteIcon';
import DayDate from './DayDate';
import Animated, {FadeInRight, FadeOutDown} from 'react-native-reanimated';

type MessageItemProps = {
  message: Message;
};

const MessageItem: React.FC<MessageItemProps> = React.memo(({message}) => {
  const loggedInUserId = useAppStore(state => state.id);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const isSender = message?.sender === loggedInUserId;

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

  // Show modal on delete icon click
  const showDeleteModal = useCallback(() => {
    updateFuncChat({selectedMessageToDelete: message});
  }, [message, updateFuncChat]);

  // Render delete icon
  const renderRightActions = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={showDeleteModal}
        style={styles.renderRightActions}>
        <DeleteIcon width={17.5} height={21.5} color={'red'} />
      </TouchableOpacity>
    );
  }, [showDeleteModal]);

  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutDown}>
      <DayDate showDate={message.showDate} createdAt={message.createdAt} />
      {isSender && message.messageType !== 'deleted' ? (
        <Swipeable
          renderRightActions={renderRightActions}
          overshootRight={false}>
          {renderMessage(isSender)}
        </Swipeable>
      ) : (
        renderMessage(isSender)
      )}
      {/* {renderMessage(isSender)} */}
    </Animated.View>
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
});

export default MessageItem;
