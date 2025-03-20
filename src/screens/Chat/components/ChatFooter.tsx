import React, {useState} from 'react';
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

const ChatFooter = () => {
  const [message, setMessage] = useState('');
  const [cameraOptions, setCameraOptions] = useState(false);
  const isRecording = useAppStore(state => state.isRecording);

  return (
    <View style={styles.footerContainer}>
      {/* SHOW OPTIONS TO SELECT OR TAKE IMAGE/VIDEO */}
      {cameraOptions && <CameraOptions setCameraOptions={setCameraOptions} />}
      <View style={styles.inputContainer}>
        {isRecording ? (
          <OnRecord />
        ) : (
          <ReusableInput
            placeholder="Write"
            value={message}
            onChange={setMessage}
          />
        )}
      </View>
      {message === '' ? (
        <>
          {!isRecording && (
            <TouchableOpacity onPress={() => setCameraOptions(prev => !prev)}>
              <CameraIcon width={24} height={24} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPressIn={() => onMicPress()}
            onPressOut={() => onMicRelease()}>
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
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    height: 66,
  },
  inputContainer: {flex: 1},

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
