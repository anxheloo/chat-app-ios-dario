import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  SAFE_AREA_PADDING,
} from './Constants';
import {Contact, NavigationProps, RootStackParamList} from '../../utils/types';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import {BORDERRADIUS} from '../../theme/theme';
import ReusableText from '../../components/ReusableText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Avatar from '../../components/Persona/Avatar';
import {GET_SCANNED_USER} from '../../api/apis';
import axios from 'axios';
import {apiClient} from '../../api/apiClient';
import ReusableButton from '../../components/ReusableButton';
import {useAppStore} from '../../store';

type ScannedUserProps = NativeStackScreenProps<
  RootStackParamList,
  'ScannedUser'
>;

const ScannedUser: React.FC<ScannedUserProps> = ({route, navigation}) => {
  const {userId} = route.params;
  const token = useAppStore(state => state.token);

  const [scannedUser, setScannedUser] = useState({
    username: '',
    avatar: '',
    id: '',
  });

  useEffect(() => {
    const getScannerUserDetails = async () => {
      // Fetch user details from server
      try {
        const response = await apiClient.get(`${GET_SCANNED_USER}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const {username, avatar, id} = response.data;
          setScannedUser({username, avatar, id});
        }
      } catch (error) {
        console.log(error);
      }
    };

    getScannerUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.content}>
        <Avatar
          width={70}
          height={70}
          avatarWidth={52.5}
          avatarHeight={52.5}
          src={Number(scannedUser?.avatar)}
        />

        <ReusableText fontSize={20} fontWeight={700}>
          {scannedUser?.username}
        </ReusableText>

        <ReusableButton
          text="Send Request"
          onPress={() => {
            console.log('sending request');
          }}
        />
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <CloseIcon width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  backButton: {
    position: 'absolute',
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
});

export default ScannedUser;
