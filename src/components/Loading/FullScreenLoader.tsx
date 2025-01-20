import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const FullScreenLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="black" />
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
  },
});

export default FullScreenLoader;
