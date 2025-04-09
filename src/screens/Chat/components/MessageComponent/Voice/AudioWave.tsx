import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useAppStore} from '../../../../../store';
// import {getAudioPlayer, onPlayPause} from '../../../../../utils/voiceMessage';
// import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  cancelAnimation,
} from 'react-native-reanimated';
// import 'react-native-reanimated';

type Props = {
  waveMetering: number[] | null | undefined;
  isSender: boolean;
  duration: number | undefined;
  id: string;
  fileUrl: string;
};

const TOTAL_BARS = 34;
const SLIDER_MAX_POSITION = 160;

const AudioWave: React.FC<Props> = ({
  waveMetering,
  isSender,
  duration,
  id,
  // fileUrl,
}) => {
  const playingAudioId = useAppStore(state => state.playingAudioId);
  const isPlaying = useAppStore(state => state.isPlaying);
  const recordSecs = useAppStore(state => state.recordSecs);

  // console.log('This is duration in AudioWave:', duration);
  // console.log('This is recordSecs in AudioWave:', recordSecs);

  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: progress.value}],
  }));

  useEffect(() => {
    if (id === playingAudioId) {
      console.log('Ready to play');

      if (isPlaying) {
        progress.value = withTiming(SLIDER_MAX_POSITION, {
          duration: Math.round(Number(duration)) - Math.round(recordSecs),
          easing: Easing.linear,
        });
      } else {
        cancelAnimation(progress);
      }
    } else {
      cancelAnimation(progress);
      progress.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isPlaying, playingAudioId]);

  const positiveDecibels = waveMetering?.map(value => Math.max(3, 70 + value));
  const fillEmptySpace = new Array(TOTAL_BARS).fill(3);

  if (positiveDecibels) {
    const startIndex = Math.max(0, 32 - positiveDecibels.length);
    positiveDecibels?.forEach((height, index) => {
      fillEmptySpace[startIndex + index] = Math.round(height);
    });
  }

  return (
    <View style={styles.container}>
      {fillEmptySpace?.map((height, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              height: `${height / 1.2}%`,
              backgroundColor: isSender ? 'white' : 'black',
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.slider,
          // eslint-disable-next-line react-native/no-inline-styles
          {backgroundColor: isSender ? 'white' : 'black'},
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 100,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  bar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 50,
    minHeight: 3,
  },

  slider: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 50,
  },
});

export default AudioWave;
