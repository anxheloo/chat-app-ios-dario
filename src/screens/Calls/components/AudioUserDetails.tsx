import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useAppStore} from '../../../store';

import ReusableText from '../../../components/ReusableText';
import Avatar from '../../../components/Persona/Avatar';

const AudioUserDetails = () => {
  const {caller, selectedChatData} = useAppStore.getState();
  const username = caller ? caller?.username : selectedChatData?.username;
  const avatarSrc = caller ? caller?.avatar : selectedChatData?.avatar;

  return (
    <View style={styles.container}>
      <Avatar
        width={70}
        height={70}
        avatarWidth={53}
        avatarHeight={53}
        backgroundColor="white"
        src={avatarSrc}
      />

      <ReusableText fontSize={26} fontWeight={700} color="white">
        @{username}
      </ReusableText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    zIndex: 4,
  },
});

export default AudioUserDetails;
