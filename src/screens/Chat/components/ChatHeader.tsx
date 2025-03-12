import React, {memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useAppStore} from '../../../store';

import ReusableText from '../../../components/ReusableText';
import Avatar from '../../../components/Persona/Avatar';

import {COLORS} from '../../../theme/theme';

import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';
import VideoIcon from '../../../assets/icons/Chat/VideoIcon';

import {NavigationProps} from '../../../utils/types';

import {handleCall} from '../../../utils/webrtc';

const ChatHeader = memo(() => {
  const navigation = useNavigation<NavigationProps>();
  const {selectedChatData} = useAppStore.getState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goBack = useCallback(() => navigation.goBack(), []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack}>
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

      <TouchableOpacity style={styles.icon} onPress={() => handleCall('video')}>
        <VideoIcon width={'100%'} height={'100%'} fill={'#212121'} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon} onPress={() => handleCall('audio')}>
        <CallIcon width={'100%'} height={'100%'} fill={'#212121'} />
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
