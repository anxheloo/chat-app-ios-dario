import React, {useContext} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {AnimationContext} from '../store/HeaderAnimationContext';
import {COLORS} from '../theme/theme';

const HorizontalLine = () => {
  const animatedValue = useContext(AnimationContext);
  const height = animatedValue?.interpolate({
    inputRange: [0, 20],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.main,
        {height: height, backgroundColor: COLORS.border},
      ]}></Animated.View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
  },
});

export default HorizontalLine;
