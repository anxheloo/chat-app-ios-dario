import React from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {RootStackParamList} from '../../types/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import CloseIcon from '../../assets/icons/messages/CloseIcon';
import ReusableText from '../../components/ReusableText';
import Avatar from '../../components/Persona/Avatar';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';

import useScannedUser from '../../utils/hooks/useScannedUser';

import {COLORS} from '../../theme/theme';
import {goBack} from '../../navigation/navigationRef';
import {addFriend} from '../../utils/helpers';

type ScannedUserProps = NativeStackScreenProps<
  RootStackParamList,
  'ScannedUser'
>;

const ScannedUser: React.FC<ScannedUserProps> = ({route}) => {
  const {recipientId} = route?.params;
  const {scannedUser} = useScannedUser(recipientId);

  return (
    <ImageBackground
      style={styles.imageBackground}
      source={require('../../assets/appBackground/app_background1.png')}>
      <SafeAreaView style={styles.content}>
        <Avatar
          backgroundColor={COLORS.LightGray2}
          width={70}
          height={70}
          avatarWidth={52.5}
          avatarHeight={52.5}
          // src={Number(scannedUser?.avatar)}
          src={scannedUser?.avatar}
        />
        <ReusableText fontSize={26} fontWeight={700} color="black">
          @{scannedUser?.username}
        </ReusableText>
        <ReusableText
          fontSize={14}
          fontWeight={300}
          color="black"
          textAlign="center">
          This persona will be notified if you choose to send a friend request
        </ReusableText>
        <ReusableText
          style={styles.addFriendText}
          fontSize={16}
          fontWeight={400}
          color="black"
          textDecorationLine="underline"
          onPress={() => addFriend(scannedUser)}>
          Add Friend
        </ReusableText>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <CloseIcon width={35} height={35} fill={'#000'} />
        </TouchableOpacity>
        <FullScreenLoader version={'absolute'} />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
  },

  addFriendText: {
    paddingTop: 20,
  },
});

export default ScannedUser;
