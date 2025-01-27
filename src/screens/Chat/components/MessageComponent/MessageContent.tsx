import React from 'react';
import MessageTime from './MessageTime';
import {StyleSheet, View} from 'react-native';
import {BORDERRADIUS, COLORS} from '../../../../theme/theme';

type Props = {
  isSender: boolean;
  children: React.ReactNode;
  createdAt: string;
};

const MessageContent: React.FC<Props> = ({isSender, children, createdAt}) => {
  return (
    <View
      style={[
        styles.messageContainer,
        isSender ? styles.senderStyles : styles.recipientStyles,
      ]}>
      {children}
      <MessageTime createdAt={createdAt} isSender={isSender} />
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: BORDERRADIUS.radius_14,
    padding: 2,
    minWidth: 100,
    maxWidth: '70%',
    overflow: 'hidden',
  },

  senderStyles: {
    backgroundColor: COLORS.Black,
    alignSelf: 'flex-end',
  },
  recipientStyles: {
    backgroundColor: COLORS.LightGray2,
    alignSelf: 'flex-start',
  },
});

export default MessageContent;
