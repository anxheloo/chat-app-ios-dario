import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Video from 'react-native-video';
import {BORDERRADIUS} from '../../../../theme/theme';
import {Message, NavigationProps} from '../../../../utils/types';
import {useNavigation} from '@react-navigation/native';

type VideoProps = {
  message: Message;
  uploading: boolean;
};

const VideoComponent: React.FC<VideoProps> = ({message, uploading}) => {
  const navigation = useNavigation<NavigationProps>();

  // add the play icon to the video, if play icon clicked, open video.

  const openVideo = useCallback(() => {
    if (!uploading) {
      navigation.navigate('FullScreenMedia', {
        fileUrl: message.fileUrl,
        type: 'video',
      });
    }
  }, [uploading, message.fileUrl]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={openVideo}
      activeOpacity={1}>
      {uploading ? (
        // <ActivityIndicator
        //   size="small"
        //   color="#fff"
        //   style={{
        //     position: 'absolute',
        //     inset: 0,
        //   }}
        // />
        <Image
          source={{uri: message.thumbnailUrl}}
          style={styles.thumbnail}
          resizeMode="cover"></Image>
      ) : (
        <Video
          fullscreenOrientation="all"
          source={{uri: message.fileUrl}}
          style={styles.video}
          // fullscreen={true}
          resizeMode="cover"
          paused={true}
          // onLoadStart={() => setIsLoading(true)}
          // onLoad={() => setIsLoading(false)}
          // onError={() => {
          //   setIsLoading(false);
          //   console.log('Error loading video');
          // }}
        ></Video>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 150,
    borderTopLeftRadius: BORDERRADIUS.radius_13,
    borderTopRightRadius: BORDERRADIUS.radius_13,
    // overflow: 'hidden',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default VideoComponent;
