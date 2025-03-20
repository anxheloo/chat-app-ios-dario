import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {Message} from '../../../../../utils/types';

import PlayIcon from '../../../../../assets/icons/Chat/PlayVoice.svg';
import PauseIcon from '../../../../../assets/icons/Chat/PauseVoice.svg';
import MessageHOC from '../MessageHOC';
import {useAppStore} from '../../../../../store';
import {onPlayPause} from '../../../../../utils/voiceMessage';

type Props = {
  message: Message;
  isSender: boolean;
};

const Voice: React.FC<Props> = ({message, isSender}) => {
  const {playingAudioId, isPlaying} = useAppStore(state => state);

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
          {isCurrentlyPlaying ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>
      )}
      <View style={styles.wave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    width: 220,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  wave: {
    flex: 1,
  },
});

export default MessageHOC(Voice);
