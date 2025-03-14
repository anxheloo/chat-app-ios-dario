import React, {memo} from 'react';

import {View, StyleSheet, Dimensions} from 'react-native';

import {useAppStore} from '../../../store';

import AudioUserDetails from './AudioUserDetails';

import RemoteStream from './RemoteStream';
import LocalStream from './LocalStream';

const AudioVideoTemplate = memo(() => {
  const callType = useAppStore(state => state.callType);
  const callState = useAppStore(state => state.callState);

  if (callType === 'video' && callState === 'active') {
    return (
      <View style={styles.container}>
        <RemoteStream />
        <LocalStream />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AudioUserDetails />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioVideoTemplate;
