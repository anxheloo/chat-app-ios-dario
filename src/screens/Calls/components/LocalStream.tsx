import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';

import {useAppStore} from '../../../store';

import {RTCView} from 'react-native-webrtc';
import {switchSources} from '../../../utils/webrtc';

const LocalStream = () => {
  const localStream = useAppStore(state => state.localStream);
  const callType = useAppStore(state => state.callType);

  if (callType !== 'video') {
    return null;
  }
  return (
    <Pressable onPress={switchSources} style={styles.localStream}>
      {localStream ? (
        <RTCView
          style={styles.rtcView}
          mirror={true}
          streamURL={localStream?.toURL()}
          objectFit="cover"
        />
      ) : (
        <ActivityIndicator size="small" color="#fff" />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  localStream: {
    flex: 1,
    // position: 'absolute',
    // top: 160,
    // right: 20,
    // width: 100,
    // height: 140,
    backgroundColor: 'rgba( 0, 0, 0, 0.8)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rtcView: {
    width: '100%',
    height: '100%',
  },
});

export default LocalStream;
