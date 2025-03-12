import React, {memo} from 'react';

import {View, StyleSheet} from 'react-native';

import {useAppStore} from '../../../store';

import AudioUserDetails from './AudioUserDetails';

import RemoteStream from './RemoteStream';
import LocalStream from './LocalStream';

const AudioVideoTemplate = memo(() => {
  const callType = useAppStore(state => state.callType);
  const callState = useAppStore(state => state.callState);

  return (
    <View style={styles.container}>
      {callType === 'video' && callState === 'active' ? (
        <>
          <RemoteStream />
          <LocalStream />
        </>
      ) : (
        <AudioUserDetails />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioVideoTemplate;
