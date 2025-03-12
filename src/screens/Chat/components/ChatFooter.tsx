import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import ReusableInput from '../../../components/ReusableInput';
import CameraOptions from './CameraOptions';

import {permission} from '../../../utils/permissions';
import {checkPermissionStatus} from '../../../utils/helpers';
import {sendMessage} from '../../../utils/message';

import MicrophoneIcon from '../../../assets/icons/Chat/MicrophoneIcon';
import CameraIcon from '../../../assets/icons/Chat/CameraIcon';

const ChatFooter = () => {
  const [message, setMessage] = useState('');
  const [cameraOptions, setCameraOptions] = useState(false);

  const onMicPress = async () => {
    const status = await checkPermissionStatus(permission.microphone);
    if (status) {
      console.log('Microphone permission granted');
    }
  };

  return (
    <View style={styles.footerContainer}>
      {/* SHOW OPTIONS TO SELECT OR TAKE IMAGE/VIDEO */}
      {cameraOptions && <CameraOptions setCameraOptions={setCameraOptions} />}

      <View style={styles.inputContainer}>
        <ReusableInput
          placeholder="Write"
          value={message}
          onChange={setMessage}
          onSubmitEditing={() => sendMessage(message, setMessage)}
        />
      </View>

      <TouchableOpacity>
        <MicrophoneIcon width={24} height={24} onPress={onMicPress} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCameraOptions(prev => !prev)}>
        <CameraIcon width={24} height={24} />
      </TouchableOpacity>
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
  },
  inputContainer: {flex: 1},
});

export default ChatFooter;
