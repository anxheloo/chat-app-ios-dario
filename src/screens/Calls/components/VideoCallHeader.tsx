import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {switchCamera} from '../../../utils/webrtc';
import AudioUserDetails from './AudioUserDetails';

import {useAppStore} from '../../../store';

import SwitchIcon from '../../../assets/icons/Calls/switch.svg';

const VideoCallHeader = () => {
  const insets = useSafeAreaInsets();
  const callState = useAppStore(state => state.callState);
  const callType = useAppStore(state => state.callType);

  if (callState === 'active' && callType === 'video') {
    return (
      <View style={[styles.header, {top: insets.top}]}>
        <Text style={styles.text}>Back</Text>
        <AudioUserDetails version="header" />
        <TouchableOpacity onPress={switchCamera}>
          <SwitchIcon />
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    position: 'absolute',
    height: 90,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  text: {
    opacity: 0,
  },
});

export default VideoCallHeader;
