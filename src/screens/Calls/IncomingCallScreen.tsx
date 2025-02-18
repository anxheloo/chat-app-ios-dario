/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useAppStore} from '../../store';
import Avatar from '../../components/Persona/Avatar';
import {COLORS} from '../../theme/theme';
import {goBack} from '../../navigation/navigationRef';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReusableText from '../../components/ReusableText';
import CallIcon from '../../assets/icons/BottomTabIcons/Call-Icon';

const IncomingCallScreen = () => {
  const {caller, callType, socket, updateCallState} = useAppStore.getState();

  if (!caller) {
    return null;
  }

  const acceptCall = () => {
    console.log('call accepted');
    updateCallState({callAccepted: true, isCalling: false});
    // socket?.emit('callAccepted', {callerId: caller._id});
  };

  const rejectCall = () => {
    socket?.emit('callRejected', {callerId: caller._id});

    updateCallState({
      isCalling: false,
      callAccepted: false,
      callRejected: true,
    });

    goBack();

    console.log('call rejected');
  };

  return (
    <SafeAreaView style={styles.content}>
      <StatusBar hidden />

      <View style={styles.container}>
        <Avatar
          backgroundColor={COLORS.LightGray2}
          width={70}
          height={70}
          avatarWidth={52.5}
          avatarHeight={52.5}
          src={Number(caller?.avatar)}
        />
        <ReusableText fontSize={26} fontWeight={700} color="white">
          @{caller?.username}
        </ReusableText>
      </View>

      <View style={styles.container}>
        <ReusableText fontSize={14} fontWeight={400} color="white">
          Calling...
        </ReusableText>
        <View style={styles.btnContainer}>
          <View style={[styles.middleBtnContainer, {borderColor: '#00FF00'}]}>
            <TouchableOpacity
              style={[styles.middleBtn, {backgroundColor: '#00FF00'}]}
              onPress={acceptCall}>
              <CallIcon width={24} height={24} fill={'white'} />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.middleBtnContainer,
              {borderColor: '#FF675C', transform: [{rotate: '135deg'}]},
            ]}>
            <TouchableOpacity
              style={[styles.middleBtn, {backgroundColor: '#FF675C'}]}
              onPress={rejectCall}>
              <CallIcon width={24} height={24} fill={'white'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    // alignItems: 'center',
    gap: 20,
    padding: 20,
  },

  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 30,
  },

  btnContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    alignItems: 'center',
  },

  middleBtnContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  middleBtn: {
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IncomingCallScreen;
