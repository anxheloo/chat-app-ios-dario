import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const DeleteOrWipe = ({text}: {text: string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  username: {
    fontWeight: '300',
    color: 'red',
  },
});

export default DeleteOrWipe;
