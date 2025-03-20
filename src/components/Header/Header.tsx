import React, {memo, useCallback, useContext} from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppStore} from '../../store';

import ScanIcon from '../../assets/icons/messages/ScanIcon';
import ReusableText from '../ReusableText';

import {NavigationProps} from '../../utils/types';
import useUserInfo from '../../utils/hooks/useUserInfo';

import {openScanner} from '../../utils/helpers';
import {AnimationContext} from '../../store/HeaderAnimationContext';

const Header = memo(() => {
  const username = useAppStore(state => state.username);
  const navigation = useNavigation<NavigationProps>();

  // Get user info, user conversations, calls and friends
  useUserInfo();

  const animatedValue = useContext(AnimationContext);
  const headerHeight = animatedValue?.interpolate({
    inputRange: [0, 20],
    outputRange: [60, 0],
    extrapolate: 'clamp',
  });

  const navigateToHomePage = useCallback(() => {
    navigation?.replace('BottomTabNavigation', {screen: 'Messages'});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View style={[styles.container, {height: headerHeight}]}>
      <TouchableOpacity onPress={navigateToHomePage}>
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
