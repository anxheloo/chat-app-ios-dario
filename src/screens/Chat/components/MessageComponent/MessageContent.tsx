import React, {memo} from 'react';
import MessageTime from './MessageTime';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {BORDERRADIUS, COLORS} from '../../../../theme/theme';

type Props = {
  isSender: boolean;
  children: React.ReactNode;
  createdAt: string;
};

const MessageContent: React.FC<Props> = memo(
  ({isSender, children, createdAt}) => {
    return (
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor: isSender ? COLORS.Black : COLORS.LightGray2,
            alignSelf: isSender ? 'flex-end' : 'flex-start',
          },
        ]}>
        {children}
        <MessageTime createdAt={createdAt} isSender={isSender} />
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
});

export default MessageContent;
