/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS, FONTSIZE} from '../../../../theme/theme';

import moment from 'moment';
import {formatDuration} from '../../../../utils/helpers';
import {useAppStore} from '../../../../store';
import {Message} from '../../../../utils/types';

type Props = {
  isSender: boolean;
  message: Message;
};

const MessageTime: React.FC<Props> = React.memo(({isSender, message}) => {
  const {duration, createdAt, messageType, _id} = message;

  const recordSecs = useAppStore(state => state.recordSecs);
  const playingAudioId = useAppStore(state => state.playingAudioId);

  const isCurrentlyPlaying = playingAudioId === _id;
  const isDeleted = messageType === 'deleted';

  return (
    <View style={[styles.messageDate]}>
      {messageType === 'audio' && (
        <Text
          style={[
            styles.text,
            {
              color: isSender ? 'white' : COLORS.Black,
              paddingLeft: 10,
            },
          ]}>
          {formatDuration(isCurrentlyPlaying ? recordSecs : Number(duration)) ??
            '00:00'}
        </Text>
      )}
      <Text
        style={[
          styles.text,
          {
            color: isDeleted || isSender ? 'white' : COLORS.Black,
            flex: 1,
            textAlign: 'right',
          },
        ]}>
        {moment(createdAt).format('H:mm')}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  messageDate: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  text: {
    fontWeight: 300,
    fontSize: FONTSIZE.xs,
  },
});

export default MessageTime;
