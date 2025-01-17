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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FullScreenLoader;
