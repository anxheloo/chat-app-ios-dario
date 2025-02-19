import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ReusableText from '../../../components/ReusableText';
import {useNavigation} from '@react-navigation/native';
import {useAppStore} from '../../../store';
import Avatar from '../../../components/Persona/Avatar';
import {COLORS} from '../../../theme/theme';
import CallIcon from '../../../assets/icons/BottomTabIcons/Call-Icon';
import VideoIcon from '../../../assets/icons/Chat/VideoIcon';
import {NavigationProps} from '../../../utils/types';
import {checkPermissionStatus} from '../../../utils/helpers';
import {permission} from '../../../utils/permissions';

const ChatHeader = memo(() => {
  const navigation = useNavigation<NavigationProps>();
  const {selectedChatData, id, avatar, username, updateWebRTCState} =
    useAppStore.getState();

  const goBack = () => navigation.goBack();

  const handleCall = async (callType: 'audio' | 'video') => {
    let status;

    if (callType === 'audio') {
      await checkPermissionStatus(permission.microphone).then(micStatus => {
        status = micStatus;
      });
    } else if (callType === 'video') {
      const micStatus = await checkPermissionStatus(permission.microphone);
      const cameraStatus = await checkPermissionStatus(permission.camera);

      status = micStatus && cameraStatus;
    }

    if (selectedChatData && status) {
      updateWebRTCState({
        callState: 'outgoing',
        callType,
        caller: {
          _id: id,
          username,
          avatar,
        },
      });
      navigation.navigate('JoinScreen');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
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
    paddingBottom: 10,
    alignItems: 'center',
    paddingTop: 10,
    maxHeight: 60,
  },

  middleContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },

  icon: {width: 24, height: 24, marginHorizontal: 10},

  backBtn: {
    padding: 10,
    borderRadius: 8,
  },
});

export default ChatHeader;
