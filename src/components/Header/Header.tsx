import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {useAppStore} from '../../store';

import ScanIcon from '../../assets/icons/messages/ScanIcon';
import ReusableText from '../ReusableText';

import useUserInfo from '../../utils/hooks/useUserInfo';

import {openScanner} from '../../utils/helpers';
import {navigate} from '../../navigation/navigationRef';

import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

const Header = memo(() => {
  // Get user info, user conversations, calls and friends
  useUserInfo();

  const username = useAppStore(state => state.username);
  const scrollControl = useAppStore(state => state.scrollControl);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(scrollControl ? 0 : 60, {duration: 150}),
      opacity: withTiming(scrollControl ? 0 : 1, {duration: 150}),
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={() => navigate('Messages')}>
        <ReusableText fontWeight={500}>@{username}</ReusableText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={openScanner}>
        <ScanIcon width={'100%'} height={'100%'} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 20,
  },

  icon: {width: 24, height: 24},
});

export default Header;
