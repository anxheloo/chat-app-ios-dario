import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {COLORS} from '../theme/theme';
import {useAppStore} from '../store';

const HorizontalLine = () => {
  const scrollY = useAppStore(state => state.scrollY);
  // const animatedValue = useContext(AnimationContext);
  const height = scrollY?.interpolate({
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
