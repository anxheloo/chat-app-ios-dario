import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {COLORS, FONTSIZE} from '../../../../theme/theme';

import moment from 'moment';

type Props = {
  createdAt: string;
  isSender: boolean;
  isDeleted?: boolean;
};

const MessageTime: React.FC<Props> = React.memo(
  ({createdAt, isSender, isDeleted}) => {
    return (
      <Text
        style={[
          styles.messageDate,
          // eslint-disable-next-line react-native/no-inline-styles
          {color: isDeleted || isSender ? 'white' : COLORS.Black},
        ]}>
        {moment(createdAt).format('H:mm')}
      </Text>
    );
  },
);

const styles = StyleSheet.create({
  messageDate: {
    fontWeight: 300,
    fontSize: FONTSIZE.xs,
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
});

export default MessageTime;
