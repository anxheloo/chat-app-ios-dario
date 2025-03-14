import React from 'react';
import {Platform, Pressable, StyleSheet, View} from 'react-native';

import {useAppStore} from '../../../store';

import {RTCView} from 'react-native-webrtc';
import AudioUserDetails from './AudioUserDetails';
import {switchSources} from '../../../utils/webrtc';

const LocalStream = () => {
  const localStream = useAppStore(state => state.localStream);
  const switchVideoSources = useAppStore(state => state.switchVideoSources);
  const isVideoEnabled = useAppStore(state => state.isVideoEnabled);
  const isRemoteVideoEnabled = useAppStore(state => state.isRemoteVideoEnabled);

  return localStream ? (
    <Pressable onPress={switchSources} style={styles.localStream}>
      <>
        <RTCView
          style={styles.rtcView}
          mirror={true}
          streamURL={localStream?.toURL()}
          objectFit="cover"
        />

        {!switchVideoSources && !isVideoEnabled && (
          <View style={styles.cameraDisable}>
            <AudioUserDetails version="stream" />
          </View>
        )}
        {/* {!switchVideoSources && !isVideoEnabled && (
          <View style={styles.cameraDisable}>
            <AudioUserDetails version="stream" />
          </View>
        )} */}

        {/* {switchVideoSources && !isVideoEnabled && (
          <View style={styles.cameraDisable}>
            <AudioUserDetails />
          </View>
        )} */}

        {switchVideoSources && !isRemoteVideoEnabled && (
          <View style={styles.cameraDisable}>
            <AudioUserDetails version="stream" />
          </View>
        )}
      </>
    </Pressable>
  ) : (
    <View style={styles.localStream}>
      <AudioUserDetails version="stream" />
    </View>
  );
};

const styles = StyleSheet.create({
  localStream: {
    position: 'absolute',
    top: 160,
    right: 20,
    width: 100,
    height: 140,
    backgroundColor: 'black',
    borderRadius: Platform.OS === 'ios' ? 14 : 0,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtcView: {
    width: '100%',
    minWidth: 100,
    height: '100%',
    minHeight: 140,
    borderRadius: 14,
    overflow: 'hidden',
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

export default LocalStream;
