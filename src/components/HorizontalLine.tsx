import React from 'react';
import {StyleSheet} from 'react-native';
import {COLORS} from '../theme/theme';
import {useAppStore} from '../store';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

const HorizontalLine = () => {
  const scrollControl = useAppStore(state => state.scrollControl);

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(scrollControl ? 1 : 0, {duration: 300}),
  }));

  return <Animated.View style={[styles.main, animatedStyle]} />;
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    backgroundColor: COLORS.border,
  },
});

export default HorizontalLine;
