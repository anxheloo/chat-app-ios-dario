import React, {memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAppStore} from '../../store';

import ScanIcon from '../../assets/icons/messages/ScanIcon';
import ReusableText from '../ReusableText';

import {NavigationProps} from '../../utils/types';
import useUserInfo from '../../utils/hooks/useUserInfo';
import {permission} from '../../utils/permissions';
import {checkPermissionStatus} from '../../utils/helpers';

const Header = memo(() => {
  const username = useAppStore(state => state.username);
  const navigation = useNavigation<NavigationProps>();

  // Get user info, user conversations, calls and friends
  useUserInfo();

  //Open Scanner
  const openScanner = useCallback(async () => {
    const status = await checkPermissionStatus(permission.camera);
    if (status) {
      navigation.navigate('Scanner');
    }
  }, [navigation]);

  const navigateToHomePage = useCallback(() => {
    navigation?.replace('BottomTabNavigation', {screen: 'Messages'});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToHomePage}>
        <ReusableText fontWeight={500}>@{username}</ReusableText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={openScanner}>
        <ScanIcon width={'100%'} height={'100%'} />
      </TouchableOpacity>
    </View>
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
    height: 60,
  },

  icon: {width: 24, height: 24},
});

export default Header;
