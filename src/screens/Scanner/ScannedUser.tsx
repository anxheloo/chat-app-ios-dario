import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {RootStackParamList} from '../../utils/types';
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
    <SafeAreaView style={styles.content}>
      <Avatar
        backgroundColor={COLORS.LightGray2}
        width={70}
        height={70}
        avatarWidth={52.5}
        avatarHeight={52.5}
        src={Number(scannedUser?.avatar)}
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
        style={{paddingTop: 20}}
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
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
});

export default ScannedUser;
