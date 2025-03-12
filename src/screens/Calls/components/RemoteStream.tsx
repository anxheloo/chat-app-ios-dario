import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

import {useAppStore} from '../../../store';

import {RTCView} from 'react-native-webrtc';

const RemoteStream = memo(() => {
  const remoteStream = useAppStore(state => state.remoteStream);

  console.log('This is the remote stream', remoteStream);

  return remoteStream ? (
    <RTCView
      mirror={true}
      streamURL={remoteStream?.toURL()}
      objectFit="cover"
      style={styles.remoteStream}
    />
  ) : (
    <ActivityIndicator size="large" color="#fff" />
  );
});

const styles = StyleSheet.create({
  remoteStream: {
    width: '100%',
    height: '100%',
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
});

export default RemoteStream;
