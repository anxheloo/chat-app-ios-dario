import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import Video from 'react-native-video';
import {BORDERRADIUS} from '../../../../theme/theme';
import {HOST} from '../../../../api/apis';

type VideoProps = {
  fileUrl: string;
};

const VideoComponent: React.FC<VideoProps> = ({fileUrl}) => {
  const [loading, setIsLoading] = useState(false);
  const [err, setErr] = useState<any | null>(null);

  console.log('This is fileUrl:', fileUrl);

  const controlsStyles = {
    hidePosition: false,
    hidePlayPause: false,
    hideForward: false,
    hideRewind: false,
    hideNext: false,
    hidePrevious: false,
    hideFullscreen: false,
    hideSeekBar: false,
    hideDuration: false,
    hideNavigationBarOnFullScreenMode: true,
    hideNotificationBarOnFullScreenMode: true,
    hideSettingButton: true,
    seekIncrementMS: 10000,
    liveLabel: 'LIVE',
  };

  return (
    <View style={styles.imageContainer}>
      {loading && (
        <ActivityIndicator
          size="small"
          color="#fff"
          style={{
            position: 'absolute',
            inset: 0,
          }}
        />
      )}
      <Video
        fullscreenOrientation="all"
        source={{uri: `${HOST}/${fileUrl}`}}
        style={{
          width: 220,
          height: 150,
          borderTopLeftRadius: BORDERRADIUS.radius_13,
          borderTopRightRadius: BORDERRADIUS.radius_13,
        }}
        repeat={true}
        controlsStyles={controlsStyles}
        playInBackground={false}
        paused={true}
        controls={true}
        fullscreen={true}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          console.log('Error loading image');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 220,
    height: 150,
    borderTopLeftRadius: BORDERRADIUS.radius_13,
    borderTopRightRadius: BORDERRADIUS.radius_13,
    overflow: 'hidden',
  },
});

export default VideoComponent;
