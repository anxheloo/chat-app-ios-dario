import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

import SwitchIcon from '../../../assets/icons/Calls/switch.svg';
import {switchCamera} from '../../../utils/webrtc';
import AudioUserDetails from './AudioUserDetails';

const VideoCallHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, {top: insets.top}]}>
      <Text style={{opacity: 0}}>Back</Text>
      <AudioUserDetails version="header" />
      <SwitchIcon onPress={switchCamera} />
    </View>
  );
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
    zIndex: 4,
  },
});

export default VideoCallHeader;
