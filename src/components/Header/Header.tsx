import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ScanIcon from '../../assets/icons/messages/ScanIcon';
import ReusableInput from '../ReusableInput';
import SearchIcon from '../../assets/icons/messages/SearchIcon';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import ReusableText from '../ReusableText';
import {useAppStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../utils/types';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const Header = () => {
  const username = useAppStore(state => state.username);
  const navigation = useNavigation<NavigationProps>();

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        console.log('Camera permission granted');
        return true;
      } else if (result === RESULTS.DENIED) {
        Alert.alert(
          'Permission Denied',
          'Camera access is required to scan QR codes.',
        );
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Please enable camera access from settings.',
        );
      }
      return false;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const openScanner = async () => {
    // const hasPermission = await requestCameraPermission();
    // if (hasPermission) {
    navigation.navigate('Scanner'); // Navigate to the scanner screen
    console.log('Navigate to the scanner screen');
    // }
  };

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
