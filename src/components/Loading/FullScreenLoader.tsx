import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const FullScreenLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="white" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default FullScreenLoader;
