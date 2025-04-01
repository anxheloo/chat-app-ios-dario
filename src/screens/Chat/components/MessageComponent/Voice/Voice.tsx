import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAppStore} from '../../../../../store';

import {onPlayPause} from '../../../../../utils/voiceMessage';
import {Message} from '../../../../../utils/types';

import MessageHOC from '../MessageHOC';
import AudioWave from './AudioWave';

import Play from '../../../../../assets/icons/Chat/Play';
import Pause from '../../../../../assets/icons/Chat/Pause';

type Props = {
  message: Message;
  isSender: boolean;
  isDeleted?: boolean;
};

const Voice: React.FC<Props> = ({message, isSender}) => {
  const isPlaying = useAppStore(state => state.isPlaying);
  const playingAudioId = useAppStore(state => state.playingAudioId);

  const isCurrentlyPlaying = playingAudioId === message._id && isPlaying;

  return (
    <View style={styles.container}>
      {message.uploading ? (
        <ActivityIndicator
          size={'small'}
          color={isSender ? 'white' : 'black'}
        />
      ) : (
        <TouchableOpacity
          onPress={() => onPlayPause(message._id, message.fileUrl)}>
          {isCurrentlyPlaying ? (
            <Pause color={isSender ? 'white' : 'black'} />
          ) : (
            <Play color={isSender ? 'white' : 'black'} />
          )}
        </TouchableOpacity>
      )}
      <AudioWave
        waveMetering={message.waveMetering}
        isSender={isSender}
        duration={message.duration}
        id={message._id}
        fileUrl={message.fileUrl}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    width: 220,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  wave: {
    flex: 1,
  },
});

export default MessageHOC(Voice);
