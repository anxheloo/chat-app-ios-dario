import React, {memo, useCallback, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import ReusableInput from '../../../components/ReusableInput';
import MicrophoneIcon from '../../../assets/icons/Chat/MicrophoneIcon';
import CameraIcon from '../../../assets/icons/Chat/CameraIcon';
import {useAppStore} from '../../../store';
import * as ImagePicker from 'react-native-image-picker';
import CameraOptions from './CameraOptions';
import {usePermission} from '../../../utils/usePermission';
import useSend from '../../../utils/hooks/useSend';

type ImagePickerType = 'capture' | 'library';

const ChatFooter = memo(() => {
  const updateKeys = useAppStore(state => state.updateKeys);
  const [message, setMessage] = useState('');
  const [cameraOptions, setCameraOptions] = useState(false);
  const {requestCameraPermission, requestPhotoLibraryPermission} =
    usePermission();

  const {sendMessage, handleCameraUpload} = useSend(
    message,
    setMessage,
    setCameraOptions,
  );

  const onButtonPress = useCallback(
    async (type: ImagePickerType, options: any) => {
      if (type === 'capture') {
        const hasPermission = await requestCameraPermission();
        if (hasPermission) {
          updateKeys({loading: true});
          ImagePicker.launchCamera(options, (res: any) => {
            if (!res.didCancel && !res.error) {
              handleCameraUpload(res);
            } else {
              setCameraOptions(false);
              console.error(
                'Camera error or cancelled:',
                res.error || 'Cancelled',
              );
            }
          });
        } else {
          Alert.alert('Error', 'Camera permission not granted');
        }
      } else {
        const hasPermission = await requestPhotoLibraryPermission();
        if (hasPermission) {
          updateKeys({loading: true});
          ImagePicker.launchImageLibrary(options, (res: any) => {
            console.log('res', res);
            if (!res.didCancel && !res.error) {
              handleCameraUpload(res);
            } else {
              setCameraOptions(false);
              console.error(
                'Image library error or cancelled:',
                res.error || 'Cancelled',
              );
            }
          });
        } else {
          Alert.alert('Error', 'Gallery permission not granted');
        }
      }
    },
    [requestCameraPermission, requestPhotoLibraryPermission],
  );

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
        <MicrophoneIcon width={24} height={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCameraOptions(prev => !prev)}>
        <CameraIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputContainer: {flex: 1},
});

export default ChatFooter;
