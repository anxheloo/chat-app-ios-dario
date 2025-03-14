import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useAppStore} from '../../../store';

import ReusableText from '../../../components/ReusableText';
import Avatar from '../../../components/Persona/Avatar';

// Version  = 'header' is used in the VideoCallHeader.tsx
// If no version is passed, the default version is used (JoinScreen.tsx)

type Props = {
  version?: 'header' | 'default' | 'stream';
};

const AudioUserDetails: React.FC<Props> = ({version = 'default'}) => {
  const {caller, selectedChatData} = useAppStore.getState();
  const username = caller ? caller?.username : selectedChatData?.username;
  const avatarSrc = caller ? caller?.avatar : selectedChatData?.avatar;
  const isDefaultVersion = version === 'default';

  return (
    <View
      style={[
        isDefaultVersion || version === 'stream'
          ? styles.container
          : styles.versionStyles,
        {
          gap: isDefaultVersion ? 20 : 7,
        },
      ]}>
      <Avatar
        width={isDefaultVersion ? 70 : 26}
        height={isDefaultVersion ? 70 : 26}
        avatarWidth={isDefaultVersion ? 53 : 20}
        avatarHeight={isDefaultVersion ? 53 : 20}
        borderRadius={isDefaultVersion ? 14 : 100}
        backgroundColor="white"
        src={avatarSrc}
      />

      <ReusableText
        fontSize={isDefaultVersion ? 26 : 14}
        fontWeight={700}
        color="white">
        @{username}
      </ReusableText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  versionStyles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioUserDetails;
