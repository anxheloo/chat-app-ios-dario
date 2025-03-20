import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {COLORS, FONTSIZE} from '../../../../theme/theme';
import MessageHOC from './MessageHOC';

type TextMsgProps = {
  isSender: boolean;
  children?: React.ReactNode;
  isDeleted?: boolean;
};

const TextMsg: React.FC<TextMsgProps> = ({isSender, children, isDeleted}) => {
  return (
    <Text
      style={[
        styles.messageText,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          color: isDeleted || isSender ? 'white' : COLORS.Black,
        },
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  messageText: {
    fontWeight: 300,
    fontSize: FONTSIZE.sm,
    paddingTop: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default MessageHOC(TextMsg);
// export default TextMsg;
