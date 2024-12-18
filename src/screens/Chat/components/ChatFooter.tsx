import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import ReusableInput from '../../../components/ReusableInput';
import AddIcon from '../../../assets/icons/Chat/AddIcon';
import MicrophoneIcon from '../../../assets/icons/Chat/MicrophoneIcon';
import CameraIcon from '../../../assets/icons/Chat/CameraIcon';
import {useAppStore} from '../../../store';
import {apiClient} from '../../../api/apiClient';
import {UPLOAD_FILE} from '../../../api/apis';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getToken} from '../../../utils/TokenStorage';

const ChatFooter = () => {
  const socket = useAppStore(state => state.socket);
  const updateKeys = useAppStore(state => state.updateKeys);
  const id = useAppStore(state => state.id);
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    console.log('INside contact sendMessage');

    if (message.trim() === '') return;

    socket?.emit('sendMessage', {
      sender: id,
      content: message,
      recipient: selectedChatData?._id,
      messageType: 'text',
      fileUrl: undefined,
    });

    setMessage('');
  };

  const handleCameraUpload = async () => {
    console.log('Inside handleCameraUpload');

    try {
      const res = await launchImageLibrary({
        mediaType: 'mixed',
      });

      console.log('This is res: ', res);

      if (res.assets?.length) {
        const formData = new FormData();
        formData.append('file', {
          uri: res.assets[0].uri,
          name: res.assets[0].fileName,
          type: res.assets[0].type,
        });

        updateKeys({isUploading: true});

        const token = await getToken();

        const uploadResponse = await apiClient.post(UPLOAD_FILE, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: data =>
            updateKeys({
              fileUploadProgress:
                data.total !== undefined
                  ? Math.round((100 * data.loaded) / data.total)
                  : 0,
            }),
        });

        if (uploadResponse.status === 200) {
          updateKeys({isUploading: false});

          socket?.emit('sendMessage', {
            sender: id,
            content: undefined,
            recipient: selectedChatData?._id,
            messageType: 'file',
            fileUrl: uploadResponse.data.filePath,
          });
        }
      }
    } catch (err) {
      updateKeys({isUploading: false});
      console.error('Camera upload error:', err);
    }
  };

  return (
    <View style={styles.footerContainer}>
      <View style={{flex: 1}}>
        <ReusableInput
          placeholder="Write"
          value={message}
          onChange={setMessage}
          icon2={<AddIcon width={21.5} height={21.5} />}
          onSubmitEditing={sendMessage}
        />
      </View>

      <TouchableOpacity>
        <MicrophoneIcon width={24} height={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCameraUpload}>
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
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
});

export default ChatFooter;
