import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import {useAppStore} from '../../../store';

import {RTCView} from 'react-native-webrtc';
import AudioUserDetails from './AudioUserDetails';

const RemoteStream = () => {
  const remoteStream = useAppStore(state => state.remoteStream);
  const switchVideoSources = useAppStore(state => state.switchVideoSources);
  const isVideoEnabled = useAppStore(state => state.isVideoEnabled);
  const isRemoteVideoEnabled = useAppStore(state => state.isRemoteVideoEnabled);
  const cameraSwitched = useAppStore(state => state.cameraSwitched);

  return remoteStream ? (
    <>
      <RTCView
        mirror={cameraSwitched ? false : true}
        streamURL={remoteStream?.toURL()}
        objectFit="cover"
        style={styles.remoteStream}
      />

      {!switchVideoSources && !isRemoteVideoEnabled && (
        <View style={styles.cameraDisable}>
          <AudioUserDetails />
        </View>
      )}

      {switchVideoSources && !isVideoEnabled && (
        <View style={styles.cameraDisable}>
          <AudioUserDetails />
        </View>
      )}
    </>
  ) : (
    <AudioUserDetails />
  );
};

const styles = StyleSheet.create({
  remoteStream: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    flex: 1,
    borderRadius: 14,
  },

  cameraDisable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RemoteStream;
