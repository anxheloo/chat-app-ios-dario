import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const UnRead = ({numberOfUnreadMessages}: {numberOfUnreadMessages: number}) => {
  if (numberOfUnreadMessages === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{numberOfUnreadMessages}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 25,
    height: 25,
    backgroundColor: 'black',
    borderRadius: 100,
    right: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'white',
  },
});

export default UnRead;
