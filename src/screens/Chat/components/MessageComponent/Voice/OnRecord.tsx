import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useAppStore} from '../../../../../store';

import {COLORS} from '../../../../../theme/theme';

import {formatDuration} from '../../../../../utils/helpers';

import MicrophoneIcon from '../../../../../assets/icons/Chat/MicrophoneIcon';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import ShimmerText from './ShimmerText';

const OnRecord = () => {
  const recordSecs = useAppStore(state => state.recordSecs);
  const isRecording = useAppStore(state => state.isRecording);

  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (isRecording) {
      opacity.value = withRepeat(
        withTiming(0.1, {
          duration: 800,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true, // auto-reverse
      );
    } else {
      opacity.value = withTiming(1, {duration: 200});
    }
  }, [isRecording, opacity]);

  return (
    <View style={styles.recordingContainer}>
      <Animated.View style={animatedStyle}>
        <MicrophoneIcon width={25} height={25} color={'black'} />
      </Animated.View>
      <Text style={styles.recordingSecs}>
        {formatDuration(Math.round(recordSecs / 1000))}
      </Text>
      <ShimmerText>Recording...</ShimmerText>
    </View>
  );
};

const styles = StyleSheet.create({
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 295,
  },

  recordingSecs: {
    position: 'absolute',
    left: 40,
    color: COLORS.LightGray,
  },
});

export default OnRecord;
