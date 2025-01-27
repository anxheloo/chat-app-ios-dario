import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, {memo, useCallback, useMemo, useState} from 'react';
import Video from 'react-native-video';
import {BORDERRADIUS} from '../../../../theme/theme';
import {Message, NavigationProps} from '../../../../utils/types';
import {useNavigation} from '@react-navigation/native';
import PlayIcon from '../../../../assets/icons/messages/PlayIcon';

type VideoProps = {
  message: Message;
  uploading: boolean;
  isSender: boolean;
};

const VideoComponent: React.FC<VideoProps> = memo(
  ({message, uploading, isSender}) => {
    const navigation = useNavigation<NavigationProps>();

    const openVideo = useCallback(() => {
      if (!uploading) {
        navigation.navigate('FullScreenMedia', {
          fileUrl: message.fileUrl,
          type: 'video',
        });
      }
    }, [uploading, navigation, message]);

    const formatDuration = useMemo(() => {
      let duration: any = Math.floor(message?.duration ?? 0);
      let m: string | number = Math.floor(duration / 60);
      m = m >= 10 ? m : '0' + m;
      duration = Math.floor(duration % 60);
      duration = duration >= 10 ? duration : '0' + duration;
      return m + ':' + duration;
    }, [message?.duration]);

    return (
      <View style={styles.container}>
        {uploading ? (
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
          />
        )}

        <View style={styles.videoDuration}>
          <Text style={styles.durationText}>{formatDuration}</Text>
        </View>

        {!uploading && (
          <TouchableOpacity style={styles.playButton} onPress={openVideo}>
            <PlayIcon width={24} height={24} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

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

  // thumbnail: {
  //   width: '100%',
  //   height: '100%',
  // },

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
    // textAlignVertical: 'center',
    overflow: 'hidden',
  },
  durationText: {
    fontWeight: 300,
    fontSize: 10,
  },
});

export default VideoComponent;
