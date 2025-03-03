import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet} from 'react-native';

import {useAppStore} from '../../../store';

import {RTCView} from 'react-native-webrtc';
import {switchSources} from '../../../utils/webrtc';

const LocalStream = () => {
  const localStream = useAppStore(state => state.localStream);
  const callType = useAppStore(state => state.callType);

  console.log('This is localStream: ', localStream?.toURL());

  return (
    <Pressable onPress={switchSources} style={styles.localStream}>
      {/* <View style={styles.localStream}> */}
      {callType === 'video' && localStream ? (
        <RTCView
          style={styles.rtcView}
          mirror={true}
          streamURL={localStream?.toURL()}
          objectFit="cover"
        />
      ) : (
        <ActivityIndicator size="small" color="#fff" />
      )}
      {/* </View> */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
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

  rtcView: {
    flex: 1,
    width: '100%',
  },
});

export default LocalStream;
