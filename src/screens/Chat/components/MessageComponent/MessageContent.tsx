import React, {memo} from 'react';
import MessageTime from './MessageTime';
import {StyleSheet, View} from 'react-native';
import {BORDERRADIUS, COLORS} from '../../../../theme/theme';

type Props = {
  isSender: boolean;
  renderMessageContent: React.JSX.Element | null;
  createdAt: string;
};

const MessageContent: React.FC<Props> = memo(
  ({isSender, renderMessageContent, createdAt}) => (
    <View
      style={[
        styles.messageContainer,
        {
          backgroundColor: isSender ? COLORS.Black : COLORS.LightGray2,
          alignSelf: isSender ? 'flex-end' : 'flex-start',
        },
      ]}>
      {renderMessageContent}
      <MessageTime createdAt={createdAt} isSender={isSender} />
    </View>
  ),
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
