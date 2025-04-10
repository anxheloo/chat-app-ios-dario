import React, {useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import MaskedView from '@react-native-masked-view/masked-view';

import LinearGradient from 'react-native-linear-gradient';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {FONTSIZE} from '../../../../../theme/theme';

const ShimmerText = ({children}: {children: string}) => {
  const translateX = useSharedValue(130); // start right to left

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-100, {duration: 1500}),
      -1,
      false,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <MaskedView
      style={styles.parentContainer}
      maskElement={
        <View style={styles.parentContainer}>
          <Text style={styles.shimmerText}>{children}</Text>
        </View>
      }>
      <View style={styles.backgroundFill}>
        <Text style={styles.shimmerText}>{children}</Text>

        <Animated.View style={[styles.gradientWrapper, animatedStyle]}>
          <LinearGradient
            colors={['transparent', 'white', 'transparent']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  shimmerText: {
    fontSize: FONTSIZE.md,
    fontWeight: '300',
    color: 'black',
    textAlign: 'center',
  },
  backgroundFill: {
    position: 'relative',
  },
  gradientWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    width: 80,
    height: '100%',
  },
});

export default ShimmerText;
