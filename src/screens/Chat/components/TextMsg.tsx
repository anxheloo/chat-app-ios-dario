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
    <View
      style={[
        styles.messageContainer,
        {
          backgroundColor: isSender ? COLORS.LightGray2 : COLORS.Black,
        },
      ]}>
      <Text
        style={[
          styles.messageText,
          {
            color: isSender ? COLORS.Black : 'white',
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: BORDERRADIUS.radius_14,
    padding: 8,
    minWidth: 100,
    maxWidth: '70%',
  },

  messageText: {
    fontWeight: 300,
    fontSize: FONTSIZE.sm,
  },

  messageDate: {
    fontWeight: 300,
    fontSize: FONTSIZE.xs,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});

export default TextMsg;
