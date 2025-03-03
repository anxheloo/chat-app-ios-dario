import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';

import {useAppStore} from '../../../store';

import {RTCView} from 'react-native-webrtc';

const RemoteStream = () => {
  const remoteStream = useAppStore(state => state.remoteStream);

  if (remoteStream) {
    return (
      <RTCView
        mirror={true}
        streamURL={remoteStream?.toURL()}
        objectFit="cover"
        style={styles.remoteStream}
      />
    );
  }

  return <ActivityIndicator size="large" color="#fff" />;
};

const styles = StyleSheet.create({
  remoteStream: {
    flex: 1,
  },
});

export default RemoteStream;
