import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import MessageTime from './MessageTime';

import {BORDERRADIUS, COLORS} from '../../../../theme/theme';

type Props = {
  isSender: boolean;
  children: React.ReactNode;
  createdAt: string;
  isDeleted?: boolean;
};

const MessageContent: React.FC<Props> = memo(
  ({isSender, children, createdAt, isDeleted}) => {
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
        {children}
        <MessageTime
          createdAt={createdAt}
          isSender={isSender}
          isDeleted={isDeleted}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: BORDERRADIUS.radius_14,
    padding: 2,
    minWidth: 100,
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

export default MessageContent;
