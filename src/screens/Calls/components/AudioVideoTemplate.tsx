import React from 'react';

import {View, StyleSheet} from 'react-native';

import {useAppStore} from '../../../store';

import AudioUserDetails from './AudioUserDetails';

import RemoteStream from './RemoteStream';

const AudioVideoTemplate = () => {
  const callType = useAppStore(state => state.callType);
  const callState = useAppStore(state => state.callState);
  const isVideoEnabled = useAppStore(state => state.isVideoEnabled);

  if (callType === 'video' && callState === 'active') {
    return <RemoteStream />;
  }

  return (
    <View style={styles.container}>
      <AudioUserDetails />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioVideoTemplate;
