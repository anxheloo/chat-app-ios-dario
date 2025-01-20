import React, {useCallback, useEffect} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ScanIcon from '../../assets/icons/messages/ScanIcon';
import ReusableText from '../ReusableText';
import {useAppStore} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../utils/types';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {useSocket} from '../../utils/useSocket';
import {apiClient} from '../../api/apiClient';
import {GET_USER_INFO} from '../../api/apis';
import {usePermission} from '../../utils/usePermission';
// import {requestCameraPermission} from '../../utils/helpers';

const Header = () => {
  const username = useAppStore(state => state.username);
  const setUserPersona = useAppStore(state => state.setUserPersona);
  const updateKeys = useAppStore(state => state.updateKeys);
  const token = useAppStore(state => state.token);
  const navigation = useNavigation<NavigationProps>();
  useSocket();

  const {requestCameraPermission} = usePermission();

  // Get user info function
  const getUserInfo = useCallback(async () => {
    updateKeys({loading: true});

    try {
      const res = await apiClient.get(GET_USER_INFO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUserPersona(res.data);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to fetch user info.',
      );
    } finally {
      updateKeys({loading: false});
    }
  }, [token]);

  //Get user info
  useEffect(() => {
    getUserInfo();
  }, [token]);

  //Open Scanner
  const openScanner = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      navigation.navigate('Scanner'); // Navigate to the scanner screen
    }
  }, [navigation]);

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
