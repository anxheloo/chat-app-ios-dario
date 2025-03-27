import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, PanResponder} from 'react-native';
import {useAppStore} from '../../../../../store';
// import {getAudioPlayer, onPlayPause} from '../../../../../utils/voiceMessage';
// import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
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
  // const updateMicSlice = useAppStore(state => state.updateMicSlice);

  console.log('This is duration in AudioWave:', duration);
  console.log('This is recordSecs in AudioWave:', recordSecs);

  //   Animation for the audio wave slider
  // const progress = useRef(new Animated.Value(0)).current;
  const progress = useSharedValue(0);
  // const onLeft = useSharedValue(true);

  // const panGesture = Gesture.Pan()
  //   .onStart(() => {
  //     console.log('Pan Started');
  //   })
  //   .onUpdate(e => {
  //     progress.value = Math.max(
  //       0,
  //       Math.min(SLIDER_MAX_POSITION, e.translationX),
  //     );
  //   })
  //   .onEnd(async e => {
  //     // await onPlayPause(id, fileUrl);

  //     // const newRecordSecs = Math.round(
  //     //   (progress.value / SLIDER_MAX_POSITION) *
  //     //     Math.round((duration ?? 0) * 1000),
  //     // );

  //     // console.log('This is newREcordSecs:', newRecordSecs);

  //     // const audioRecorderPlayer = getAudioPlayer();

  //     try {
  //       // Seek audio to the new position
  //       // await audioRecorderPlayer.seekToPlayer(newRecordSecs * 1000);
  //       // await audioRecorderPlayer.seekToPlayer(2000.213023);
  //       // If audio was playing, continue playing from new position
  //       // if (isPlaying) {
  //       //   await audioRecorderPlayer.resumePlayer();
  //       // }
  //       // If paused, just update the position but don't play
  //       // updateMicSlice({recordSecs: newRecordSecs});
  //     } catch (error) {
  //       console.error('Error seeking audio:', error);
  //     }
  //   });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: progress.value}],
  }));

  useEffect(() => {
    if (id === playingAudioId) {
      console.log('Ready to play');

      const remainingTime =
        Math.round((duration ?? 0) * 1000) -
        Math.round(recordSecs * 1000) +
        200;

      if (isPlaying) {
        //   Animated.timing(progress, {
        //     toValue: SLIDER_MAX_POSITION,
        //     duration: remainingTime,
        //     easing: Easing.linear,
        //     useNativeDriver: true,
        //   }).start();
        // } else {
        //   progress.stopAnimation();
        // }
        progress.value = withTiming(SLIDER_MAX_POSITION, {
          duration: remainingTime,
          easing: Easing.linear,
        });
      } else {
        progress.value = progress.value;
      }
    } else {
      // progress.stopAnimation();
      // progress.setValue(0);
      progress.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, id, isPlaying, playingAudioId]);

  useEffect(() => {
    return () => {
      progress.value = 0; // Reset animation when unmounting
    };
  }, []);

  const positiveDecibels = waveMetering?.map(value => Math.max(3, 70 + value));
  const fillEmptySpace = new Array(TOTAL_BARS).fill(3);

  if (positiveDecibels) {
    const startIndex = Math.max(0, 33 - positiveDecibels.length);
    positiveDecibels?.forEach((height, index) => {
      fillEmptySpace[startIndex + index] = Math.floor(height);
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

      {/* <GestureDetector gesture={panGesture}> */}
      <Animated.View style={[styles.slider, animatedStyle]} />
      {/* </GestureDetector> */}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    // position: 'absolute',
    height: 100,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    // marginBottom: 30,
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
    backgroundColor: 'white',
    borderRadius: 50,
  },
});

export default AudioWave;

// const panResponder = useRef(
//   PanResponder.create({
//     onMoveShouldSetPanResponder: () => true,
//     onPanResponderTerminationRequest: () => false,
//     // onPanResponderMove: Animated.event([
//     //   event?.stopPropagation() ?? null,
//     //   {dx: progress},
//     // ]),
//     onPanResponderMove: (event, gestureEvent) => {
//       event?.stopPropagation();
//       progress.setValue(gestureEvent.dx);
//     },
//     onPanResponderRelease: () => {
//       progress.setValue(0);
//     },
//   }),
// ).current;
