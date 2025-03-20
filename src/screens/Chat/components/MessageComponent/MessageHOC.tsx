import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Message} from '../../../../utils/types';

import {BORDERRADIUS, COLORS} from '../../../../theme/theme';

import MessageTime from './MessageTime';

type Props = {
  message: Message;
  isSender: boolean;
  children?: React.ReactNode;
};

const MessageHOC = (Component: React.FC<Props>) => {
  return ({message, children, isSender}: Props) => {
    const isDeleted = message?.messageType === 'deleted';

    return (
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor: isDeleted
              ? COLORS.IsDeleted
              : isSender
              ? COLORS.Black
              : COLORS.LightGray2,
          },
          isSender ? styles.senderStyles : styles.recipientStyles,
        ]}>
        <Component message={message} isSender={isSender}>
          {children}
        </Component>
        <MessageTime
          messageId={message._id}
          duration={message.duration}
          isVoice={message.messageType === 'audio'}
          createdAt={message.createdAt}
          isSender={isSender}
          isDeleted={isDeleted}
        />
      </View>
    );
  };
};

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: BORDERRADIUS.radius_14,
    padding: 2,
    minWidth: 120,
    maxWidth: '70%',
    overflow: 'hidden',
  },

  senderStyles: {
    alignSelf: 'flex-end',
  },
  recipientStyles: {
    alignSelf: 'flex-start',
  },
});

export default MessageHOC;
