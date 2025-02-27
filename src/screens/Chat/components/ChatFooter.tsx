import React, {useCallback, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import * as ImagePicker from 'react-native-image-picker';

import {useAppStore} from '../../../store';

import ReusableInput from '../../../components/ReusableInput';
import CameraOptions from './CameraOptions';

import useSend from '../../../utils/hooks/useSend';

import {permission} from '../../../utils/permissions';
import {checkPermissionStatus} from '../../../utils/helpers';

import MicrophoneIcon from '../../../assets/icons/Chat/MicrophoneIcon';
import CameraIcon from '../../../assets/icons/Chat/CameraIcon';

type ImagePickerType = 'capture' | 'library';

const ChatFooter = () => {
  const updateKeys = useAppStore(state => state.updateKeys);
  const [message, setMessage] = useState('');
  const [cameraOptions, setCameraOptions] = useState(false);

  const {sendMessage, handleCameraUpload} = useSend(
    message,
    setMessage,
    setCameraOptions,
  );

  const onButtonPress = useCallback(
    async (type: ImagePickerType, options: any) => {
      if (type === 'capture') {
        const status = await checkPermissionStatus(permission.camera);

        if (status) {
          updateKeys({loading: true});
          ImagePicker.launchCamera(options, async (res: any) => {
            if (!res.didCancel && !res.error) {
              await handleCameraUpload(res);
            } else {
              setCameraOptions(false);
              updateKeys({loading: false});
              console.error(
                'Camera error or cancelled:',
                res.error || 'Cancelled',
              );
            }
          });
        }
      } else {
        const status = await checkPermissionStatus(permission.photoLibrary);

        if (status) {
          updateKeys({loading: true});
          ImagePicker.launchImageLibrary(options, async (res: any) => {
            console.log('res', res);
            if (!res.didCancel && !res.error) {
              await handleCameraUpload(res);
            } else {
              setCameraOptions(false);
              updateKeys({loading: false});
              console.error(
                'Image library error or cancelled:',
                res.error || 'Cancelled',
              );
            }
          });
        }
      }
    },
    [handleCameraUpload, updateKeys],
  );

  const onMicPress = async () => {
    const status = await checkPermissionStatus(permission.microphone);
    if (status) {
      console.log('Microphone permission granted');
    }
  };

  return (
    <View style={styles.footerContainer}>
      {/* SHOW OPTIONS TO SELECT OR TAKE IMAGE/VIDEO */}
      {cameraOptions && <CameraOptions onButtonPress={onButtonPress} />}

      <View style={styles.inputContainer}>
        <ReusableInput
          placeholder="Write"
          value={message}
          onChange={setMessage}
          onSubmitEditing={sendMessage}
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
