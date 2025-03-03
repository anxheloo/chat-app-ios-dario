import React, {useEffect} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppStore} from '../../store';

import BtnGroup from './components/BtnGroup';

import {initializeCall} from '../../utils/webrtc';

import VideoCallHeader from './components/VideoCallHeader';
import LocalStream from './components/LocalStream';

import AudioVideoTemplate from './components/AudioVideoTemplate';

const JoinScreen = () => {
  const callState = useAppStore(state => state.callState);
  const callType = useAppStore(state => state.callType);
  const resetCallState = useAppStore(state => state.resetCallState);

  useEffect(() => {
    if (callState === 'outgoing') {
      initializeCall(callType === 'video');
    }

    return () => {
      resetCallState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'ios' ? 'transparent' : 'black'}
        barStyle={'light-content'}
      />
      <VideoCallHeader />

      <AudioVideoTemplate />

      <LocalStream />

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
});

export default JoinScreen;
