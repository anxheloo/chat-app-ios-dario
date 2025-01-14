import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BORDERRADIUS, COLORS, FONTSIZE} from '../../../theme/theme';
import moment from 'moment';

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
  messageText: {
    fontWeight: 300,
    fontSize: FONTSIZE.sm,
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 8,
  },
});

export default TextMsg;
