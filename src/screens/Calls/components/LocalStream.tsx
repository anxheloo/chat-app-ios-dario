import React, {memo, useEffect} from 'react';
import {Platform, Pressable, StyleSheet} from 'react-native';

import {useAppStore} from '../../../store';

import {RTCView} from 'react-native-webrtc';
import {switchSources} from '../../../utils/webrtc';

const LocalStream = memo(() => {
  const localStream = useAppStore(state => state.localStream);
  const callType = useAppStore(state => state.callType);
  const updateWebRTCState = useAppStore(state => state.updateWebRTCState);

  useEffect(() => {
    if (localStream) {
      updateWebRTCState({localStream2: localStream});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (localStream && callType === 'video') {
    return (
      <Pressable onPress={switchSources} style={styles.localStream}>
        <RTCView
          style={styles.rtcView}
          mirror={true}
          streamURL={localStream?.toURL()}
          objectFit="cover"
        />
      </Pressable>
    );
  } else {
    return null;
  }
});

const styles = StyleSheet.create({
  localStream: {
    position: 'absolute',
    top: 160,
    right: 20,
    width: 100,
    height: 140,
    backgroundColor: 'transparent',
    borderRadius: Platform.OS === 'ios' ? 14 : 0,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
  },

  rtcView: {
    width: '100%',
    minWidth: 100,
    height: '100%',
    minHeight: 140,
    borderRadius: 14,
    overflow: 'hidden',
  },
});

export default LocalStream;
