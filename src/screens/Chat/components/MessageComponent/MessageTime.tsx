/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS, FONTSIZE} from '../../../../theme/theme';

import moment from 'moment';
import {formatDuration} from '../../../../utils/helpers';
import {useAppStore} from '../../../../store';

type Props = {
  createdAt: string;
  messageId: string;
  isSender: boolean;
  isDeleted?: boolean;
  isVoice?: boolean;
  duration: number | null | undefined;
};

const MessageTime: React.FC<Props> = React.memo(
  ({createdAt, isSender, isDeleted, duration, isVoice, messageId}) => {
    const recordSecs = useAppStore(state => state.recordSecs);
    const playingAudioId = useAppStore(state => state.playingAudioId);

    const isCurrentlyPlaying = playingAudioId === messageId;

    return (
      <View style={[styles.messageDate]}>
        {isVoice && (
          <Text
            style={[
              styles.text,
              {
                color: isDeleted || isSender ? 'white' : COLORS.Black,
                paddingLeft: 10,
              },
            ]}>
            {formatDuration(
              isCurrentlyPlaying ? recordSecs : Number(duration),
            ) ?? '00:00'}
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
  },
);

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
