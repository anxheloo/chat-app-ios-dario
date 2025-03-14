import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';

import AudioVideoTemplate from './components/AudioVideoTemplate';
import VideoCallHeader from './components/VideoCallHeader';
import BtnGroup from './components/BtnGroup';
import useWebRTC from '../../utils/hooks/useWebRTC';

const JoinScreen = () => {
  // Peer Connection Listeners
  useWebRTC();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Platform.OS === 'ios' ? 'transparent' : 'black'}
        barStyle={'light-content'}
      />
      <AudioVideoTemplate />
      <VideoCallHeader />
      <BtnGroup />
    </View>
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
