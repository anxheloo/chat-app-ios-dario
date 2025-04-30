import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useAppStore} from '../../../store';

import ReusableText from '../../../components/ReusableText';
import Avatar from '../../../components/Persona/Avatar';

import {COLORS} from '../../../theme/theme';

import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';
import VideoIcon from '../../../assets/icons/Chat/VideoIcon';

import {handleCall} from '../../../utils/webrtc';

import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../../types/types';

const ChatHeader = memo(() => {
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ReusableText fontWeight={500}>Back</ReusableText>
      </TouchableOpacity>

      <View style={styles.middleContent}>
        <Avatar
          width={26}
          height={26}
          avatarWidth={19.5}
          avatarHeight={19.5}
          backgroundColor={COLORS.LightGray2}
          src={selectedChatData?.avatar}
        />

        <ReusableText fontWeight={500}>
          @{selectedChatData?.username}
        </ReusableText>
      </View>

      <TouchableOpacity
        style={styles.icon}
        onPress={() => handleCall('video')}
        disabled={!selectedChatData?.isActive}>
        <VideoIcon
          width={'100%'}
          height={'100%'}
          fill={!selectedChatData?.isActive ? COLORS.IsDeleted : '#212121'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.icon}
        onPress={() => handleCall('audio')}
        disabled={!selectedChatData?.isActive}>
        <CallIcon
          width={'100%'}
          height={'100%'}
          fill={!selectedChatData?.isActive ? COLORS.IsDeleted : '#212121'}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 10,
    height: 60,
  },

  middleContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },

  icon: {width: 24, height: 24, marginHorizontal: 10},
});

export default ChatHeader;
