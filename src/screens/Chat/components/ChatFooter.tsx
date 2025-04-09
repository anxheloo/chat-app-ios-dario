import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import ReusableInput from '../../../components/ReusableInput';
import CameraOptions from './CameraOptions';

import {onMicPress, onMicRelease} from '../../../utils/voiceMessage';
import {sendMessage} from '../../../utils/message';

import MicrophoneIcon from '../../../assets/icons/Chat/MicrophoneIcon';
import CameraIcon from '../../../assets/icons/Chat/CameraIcon';

import {COLORS} from '../../../theme/theme';

import {useAppStore} from '../../../store';

import OnRecord from './MessageComponent/Voice/OnRecord';
import {checkPermissionStatus} from '../../../utils/helpers';
import {permission} from '../../../utils/permissions';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ChatFooter = () => {
  const [message, setMessage] = useState('');
  const [cameraOptions, setCameraOptions] = useState(false);
  const isRecording = useAppStore(state => state.isRecording);

  useEffect(() => {
    checkPermissionStatus(permission.microphone);
  }, []);

  const translateValue = useSharedValue(0);
  const translateX = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateValue.value, {duration: 200}),
      },
    ],
  }));

  useEffect(() => {
    console.log('This is translateValue: ', translateValue);
    translateValue.value = isRecording ? -295 : 0; // adjust value as needed
  }, [isRecording, translateValue]);

  return (
    <View style={styles.footerContainer}>
      {/* SHOW OPTIONS TO SELECT OR TAKE IMAGE/VIDEO */}
      {cameraOptions && <CameraOptions setCameraOptions={setCameraOptions} />}

      <View style={styles.inputContainerParent}>
        <Animated.View style={[styles.inputContainer, translateX]}>
          <ReusableInput
            placeholder="Write"
            value={message}
            onChange={setMessage}
            minWidth={295}
            otherStyles={{flex: 1}}
          />
          {message === '' && <OnRecord />}
        </Animated.View>
      </View>
      {message === '' ? (
        <>
          {!isRecording && (
            <TouchableOpacity onPress={() => setCameraOptions(prev => !prev)}>
              <CameraIcon width={24} height={24} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onLongPress={onMicPress} onPressOut={onMicRelease}>
            <MicrophoneIcon width={24} height={24} />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => sendMessage(message, setMessage)}
          style={styles.sendIconContainer}>
          <Image
            source={require('../../../assets/icons/Chat/sendIcon.png')}
            style={styles.image}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: 66,
  },

  inputContainerParent: {
    flex: 1,
    overflow: 'hidden',
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },

  sendIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: COLORS.Black,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },

  image: {
    flex: 1,
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});

export default ChatFooter;
