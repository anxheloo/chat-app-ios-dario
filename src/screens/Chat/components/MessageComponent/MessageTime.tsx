import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTSIZE} from '../../../../theme/theme';
import moment from 'moment';

type Props = {
  createdAt: string;
  isSender: boolean;
};

const MessageTime: React.FC<Props> = React.memo(({createdAt, isSender}) => {
  return (
    <Text
      style={[styles.messageDate, {color: isSender ? 'white' : COLORS.Black}]}>
      {moment(createdAt).format('H:mm')}
    </Text>
  );
});

const styles = StyleSheet.create({
  messageDate: {
    fontWeight: 300,
    fontSize: FONTSIZE.xs,
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

export default MessageTime;
