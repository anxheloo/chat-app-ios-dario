import React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SAFE_AREA_PADDING} from './Constants';
import {RootStackParamList} from '../../utils/types';
import CloseIcon from '../../assets/icons/messages/CloseIcon';
import ReusableText from '../../components/ReusableText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Avatar from '../../components/Persona/Avatar';
import useScannedUser from '../../utils/hooks/useScannedUser';
import FullScreenLoader from '../../components/Loading/FullScreenLoader';
import {BlurView} from '@react-native-community/blur';

type ScannedUserProps = NativeStackScreenProps<
  RootStackParamList,
  'ScannedUser'
>;

const ScannedUser: React.FC<ScannedUserProps> = ({route, navigation}) => {
  const {recipientId} = route.params;
  const {loading, scannedUser, addFriend} = useScannedUser(
    recipientId,
    navigation,
  );

  if (loading) return <FullScreenLoader />;

  return (
    <View style={styles.content}>
      <StatusBar hidden />

      <View style={StyleSheet.absoluteFill}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="black"
        />
      </View>
      <Avatar
        width={70}
        height={70}
        avatarWidth={52.5}
        avatarHeight={52.5}
        src={Number(scannedUser?.avatar)}
      />

      <ReusableText fontSize={26} fontWeight={700} color="white">
        @{scannedUser?.username}
      </ReusableText>

      <ReusableText
        fontSize={14}
        fontWeight={300}
        color="white"
        textAlign="center">
        This persona will be notified if you choose to send a friend request
      </ReusableText>

      <ReusableText
        style={{paddingTop: 20}}
        fontSize={16}
        fontWeight={400}
        color="white"
        textDecorationLine="underline"
        onPress={addFriend}>
        Send Request
      </ReusableText>

      <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <CloseIcon width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
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
