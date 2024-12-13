import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Avatar from './Avatar';

type PersonaProps = {
  username: string;
};

const Persona: React.FC<PersonaProps> = ({username}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Avatar width={36} height={36} avatarWidth={27} avatarHeight={27} />
      <Text style={styles.username}>@{username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 6,
    gap: 15,
  },

  username: {
    fontWeight: '300',
  },
});

export default Persona;
