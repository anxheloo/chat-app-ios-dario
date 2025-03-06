import React, {useEffect} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppStore} from '../../store';
import {startCall} from '../../utils/webrtc';

import LocalStream from './components/LocalStream';
import VideoCallHeader from './components/VideoCallHeader';
import BtnGroup from './components/BtnGroup';
import AudioVideoTemplate from './components/AudioVideoTemplate';

import {goBack} from '../../navigation/navigationRef';

// import InCallManager from 'react-native-incall-manager';

const JoinScreen = () => {
  const callState = useAppStore(state => state.callState);
  const callType = useAppStore(state => state.callType);
  // const resetCallState = useAppStore(state => state.resetCallState);
  const isVideoEnabled = useAppStore(state => state.isVideoEnabled);

  useEffect(() => {
    if (callState === 'outgoing') {
      startCall(callType === 'video');
    } else if (callState === 'idle') {
      goBack();
    } else if (callState === 'active') {
      // InCallManager.setKeepScreenOn(true);
    }

    // return () => {
    //   resetCallState();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'ios' ? 'transparent' : 'black'}
        barStyle={'light-content'}
      />
      <AudioVideoTemplate />
      <LocalStream />
      <VideoCallHeader />
      <BtnGroup />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },

  localStream: {
    position: 'absolute',
    top: 160,
    right: 20,
    width: 100,
    height: 140,
    backgroundColor: 'rgba( 0, 0, 0, 0.5)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default JoinScreen;
