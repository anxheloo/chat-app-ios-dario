import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ScanIcon from '../../assets/icons/messages/ScanIcon';
import ReusableText from '../ReusableText';
import {useAppStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../utils/types';
import {useSocket} from '../../utils/useSocket';
import useUserInfo from '../../utils/hooks/useUserInfo';

const Header = () => {
  const username = useAppStore(state => state.username);
  const navigation = useNavigation<NavigationProps>();
  useSocket();
  useUserInfo();

  //Open Scanner
  const openScanner = useCallback(async () => {
    navigation.navigate('Scanner');
  }, []);

  console.log('This is header step 1');

  return (
    <View style={styles.container}>
      <ReusableText fontWeight={500} style={{marginTop: 10}}>
        @{username}
      </ReusableText>

      <TouchableOpacity style={styles.icon} onPress={openScanner}>
        <ScanIcon width={'100%'} height={'100%'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },

  icon: {width: 24, height: 24, alignSelf: 'flex-end'},
});

export default Header;
