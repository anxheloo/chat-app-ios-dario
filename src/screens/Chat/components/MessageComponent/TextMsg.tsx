import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS, BORDERRADIUS, FONTSIZE} from '../../../../theme/theme';

type TextMsgProps = {
  isSender: boolean;
  children: React.ReactNode;
};

const TextMsg: React.FC<TextMsgProps> = ({isSender, children}) => {
  return (
    <Text
      style={[
        styles.messageText,
        {
          color: isSender ? 'white' : COLORS.Black,
        },
      ]}>
      {children}
    </Text>
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

  messageText: {
    fontWeight: 300,
    fontSize: FONTSIZE.sm,
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 8,
  },
});

export default TextMsg;
