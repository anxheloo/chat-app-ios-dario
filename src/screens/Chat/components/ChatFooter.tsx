import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import ReusableInput from '../../../components/ReusableInput';
import MicrophoneIcon from '../../../assets/icons/Chat/MicrophoneIcon';
import CameraIcon from '../../../assets/icons/Chat/CameraIcon';
import {useAppStore} from '../../../store';
import {apiClient} from '../../../api/apiClient';
import {HOST, UPLOAD_FILE} from '../../../api/apis';
import * as ImagePicker from 'react-native-image-picker';
import {Message} from '../../../utils/types';
import {ObjectId} from 'bson';
import CameraOptions from './CameraOptions';
import {usePermission} from '../../../utils/usePermission';
import {createThumbnail} from 'react-native-create-thumbnail';

type ImagePickerType = 'capture' | 'library';

const ChatFooter = () => {
  const socket = useAppStore(state => state.socket);
  const token = useAppStore(state => state.token);
  const id = useAppStore(state => state.id);
  const updateKeys = useAppStore(state => state.updateKeys);
  const dissapearingTimeFrame = useAppStore(
    state => state.dissappearingMessages,
  );
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const [message, setMessage] = useState('');
  const [cameraOptions, setCameraOptions] = useState(false);
  const updateSelectedChatMessages = useAppStore(
    state => state.updateSelectedChatMessages,
  );

  const {requestCameraPermission, requestPhotoLibraryPermission} =
    usePermission();

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Emit the single text message wrapped in an array
    socket?.emit('sendMessage', {
      messages: [
        {
          sender: id,
          content: message,
          recipient: selectedChatData?._id,
          messageType: 'text',
          fileUrl: undefined,
          expiresAt: dissapearingTimeFrame,
        },
      ],
    });

    setMessage('');
  };

  const handleCameraUpload = async (res: any) => {
    if (res.assets?.length) {
      // 1.Check the total size of the selected images or videos
      let totalSize = res.assets.reduce(
        (acc: any, file: any) => acc + file.fileSize,
        0,
      );

      // 2.If total size is bigger than 50mb return
      if (totalSize > 60 * 1024 * 1024) {
        setCameraOptions(false);
        updateKeys({loading: false});
        return Alert.alert(
          'Total size excedeed',
          'Maximum upload capacity is 50mb',
        );
      }

      // 3.If more than 10 files are selected, return
      if (res.assets?.length > 6) {
        setCameraOptions(false);
        updateKeys({loading: false});
        return Alert.alert('Total size excedeed', 'Maximum upload items is 6');
      }

      // 4. Create Message objects from media selected
      const tempMsgs = await Promise.all(
        res.assets.map(async (media: any) => {
          const tempId = new ObjectId().toString();
          const isVideo = media.type.startsWith('video');

          let thumbnail = '';
          if (isVideo) {
            const thumbnailResponse = await createThumbnail({
              url: media.uri,
            });
            thumbnail = thumbnailResponse.path; // Thumbnail path
          }

          return {
            _id: tempId,
            conversationId: selectedChatData?.conversationId || '',
            sender: id,
            recipient: selectedChatData?._id || '',
            timestamp: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            messageType: 'file',
            fileUrl: media.uri,
            thumbnailUrl: thumbnail, // Save thumbnail
            expiresAt: dissapearingTimeFrame,
            uploading: true,
          };
        }),
      );

      updateSelectedChatMessages(current => [...current, ...tempMsgs]);
      // //5. Hide camera options
      // setCameraOptions(false);
      // updateKeys({loading: false});

      //6. Create a FormData object to send the compressed file
      const formData = new FormData();

      res.assets.forEach((file: any) => {
        formData.append('files', {
          uri: file.uri,
          name: file.fileName,
          type: file.type,
        });
      });

      try {
        //7. Post the compressed file to store on the server
        const uploadResponse = await apiClient.post(UPLOAD_FILE, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        //8. Emit the event when upload is successful
        if (uploadResponse.status === 200) {
          const uploadedFilePaths = uploadResponse.data.filePaths;

          //9. Construct the final message objects
          const uploadedMessages = tempMsgs.map(
            (tempMsg: Message, index: number) => ({
              ...tempMsg,
              uploading: false,
              fileUrl: `${HOST}/${uploadedFilePaths[index]}`,
            }),
          );

          //10. Update UI with final URLs
          updateSelectedChatMessages(current =>
            current.map(
              msg =>
                uploadedMessages.find(
                  (updated: Message) => updated._id === msg._id,
                ) || msg,
            ),
          );

          // 11. Set Loading to False
          updateKeys({loading: false});

          //11. Emit the message
          socket?.emit('sendMessage', {messages: uploadedMessages});
        } else {
          Alert.alert(
            uploadResponse.data?.message || 'Upload failed',
            'Error uploading media, try again!',
          );
          updateKeys({loading: false});
        }
      } catch (error: any) {
        updateSelectedChatMessages(currentMessages =>
          currentMessages.filter(
            msg =>
              !tempMsgs.some((tempMsg: Message) => tempMsg._id === msg._id),
          ),
        );
        setCameraOptions(false);
        updateKeys({loading: false});
        console.log('Error', 'Failed to upload media');
        Alert.alert('Error', 'Failed to upload media');
      }
    }
  };

  // Get permissions and open camera
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
          console.log('Camera permission not granted 1');
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
          console.log('Camera permission not granted 2');
        }
      }
    },
    [],
  );

  return (
    <View style={styles.footerContainer}>
      {/* SHOW OPTIONS TO SELECT OR TAKE IMAGE/VIDEO */}
      {cameraOptions && <CameraOptions onButtonPress={onButtonPress} />}

      <View style={{flex: 1}}>
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
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
});

export default ChatFooter;
