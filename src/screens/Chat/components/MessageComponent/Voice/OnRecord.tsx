import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useAppStore} from '../../../../../store';

import {COLORS} from '../../../../../theme/theme';

import {formatDuration} from '../../../../../utils/helpers';

import MicrophoneIcon from '../../../../../assets/icons/Chat/MicrophoneIcon';

const OnRecord = () => {
  const recordSecs = useAppStore(state => state.recordSecs);

  return (
    <View style={styles.recordingContainer}>
      <MicrophoneIcon width={27} height={27} color={'red'} />
      <Text style={styles.recordingSecs}>{formatDuration(recordSecs)}</Text>
      <Text style={styles.recordingText}>Recording...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  recordingSecs: {
    position: 'absolute',
    left: 40,
    paddingHorizontal: 10,
    color: COLORS.LightGray,
  },

  recordingText: {
    color: 'red',
    flex: 1,
    textAlign: 'center',
  },
});

export default OnRecord;
