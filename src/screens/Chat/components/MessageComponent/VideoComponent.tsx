import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, {memo, useCallback} from 'react';

import {useNavigation} from '@react-navigation/native';

import Video from 'react-native-video';

import {formatDuration} from '../../../../utils/helpers';
import {Message, NavigationProps} from '../../../../utils/types';

import {BORDERRADIUS} from '../../../../theme/theme';

import PlayIcon from '../../../../assets/icons/messages/PlayIcon';
import MessageHOC from './MessageHOC';

type VideoProps = {
  message: Message;
  isSender: boolean;
};

const VideoComponent: React.FC<VideoProps> = memo(({message, isSender}) => {
  const navigation = useNavigation<NavigationProps>();

  const openVideo = useCallback(() => {
    if (!message.uploading) {
      navigation.navigate('FullScreenMedia', {
        fileUrl: message.fileUrl,
        type: 'video',
      });
    }
  }, [navigation, message]);

  const format = formatDuration(Number(message.duration) ?? 0);

  return (
    <View style={styles.container}>
      {message.uploading ? (
        <ActivityIndicator
          size="small"
          color={isSender ? '#fff' : '#000'}
          style={styles.activityIndicator}
        />
      ) : (
        <Video
          fullscreenOrientation="all"
          source={{uri: message.fileUrl}}
          style={styles.video}
          resizeMode="cover"
          paused={true}
          useTextureView={false}
          // onLoad={() => setUpload(false)}
          onError={error =>
            console.log('This is error inside video component:', error)
          }
        />
      )}

      <View style={styles.videoDuration}>
        <Text style={styles.durationText}>{format}</Text>
      </View>

      {!message.uploading && (
        <TouchableOpacity style={styles.playButton} onPress={openVideo}>
          <PlayIcon width={24} height={24} />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 150,
    borderTopLeftRadius: BORDERRADIUS.radius_13,
    borderTopRightRadius: BORDERRADIUS.radius_13,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
  },

  video: {
    width: 220,
    height: 150,
  },

  activityIndicator: {
    position: 'absolute',
    inset: 0,
  },

  playButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    margin: 'auto',
  },

  videoDuration: {
    width: 38,
    height: 17,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 14,
    position: 'absolute',
    top: 7,
    right: 7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  durationText: {
    fontWeight: 300,
    fontSize: 10,
  },
});

export default MessageHOC(VideoComponent);
