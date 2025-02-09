import React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import {SAFE_AREA_PADDING} from './Constants';
import {RootStackParamList} from '../../utils/types';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import ReusableText from '../../components/ReusableText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Avatar from '../../components/Persona/Avatar';
import useScannedUser from '../../utils/hooks/useScannedUser';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../theme/theme';

type ScannedUserProps = NativeStackScreenProps<
  RootStackParamList,
  'ScannedUser'
>;

const ScannedUser: React.FC<ScannedUserProps> = ({route, navigation}) => {
  const {recipientId} = route?.params;
  const {loading, scannedUser, addFriend} = useScannedUser(
    recipientId,
    navigation,
  );

  console.log('This is recipiendId:', recipientId);

  if (loading) {
    return <FullScreenLoader version={'absolute'} />;
  }

  return (
    <SafeAreaView style={styles.content}>
      <StatusBar hidden />

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
        onPress={addFriend}>
        Send Request
      </ReusableText>

      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <CloseIcon width={35} height={35} />
      </TouchableOpacity>
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
    left: SAFE_AREA_PADDING.paddingLeft,
    top: SAFE_AREA_PADDING.paddingTop,
  },
});

export default ScannedUser;
