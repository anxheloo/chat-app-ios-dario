import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

type Props = {
  version: 'absolute' | 'flex';
};

const FullScreenLoader: React.FC<Props> = ({version}) => {
  const color = version === 'absolute' ? 'white' : 'black';

  return (
    <View
      style={
        version === 'absolute'
          ? styles.loadingContainer
          : styles.loadingContainer2
      }>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // backgroundColor: 'transparent',
  },

  loadingContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default FullScreenLoader;
