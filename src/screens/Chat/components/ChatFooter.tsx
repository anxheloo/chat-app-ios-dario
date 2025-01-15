import React, {useId, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import {HOST, UPLOAD_FILE} from '../../../api/apis';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
// import {Image, Video, Audio} from 'react-native-compressor';
import {Message} from '../../../utils/types';
import {ObjectId} from 'bson';
import CameraOptions from './CameraOptions';
import {DemoResponse} from './DemoResponse';

type ImagePickerType = 'capture' | 'library';

const ChatFooter = () => {
  const socket = useAppStore(state => state.socket);
  const updateKeys = useAppStore(state => state.updateKeys);
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const token = useAppStore(state => state.token);
  const id = useAppStore(state => state.id);
  const dissapearingTimeFrame = useAppStore(
    state => state.dissappearingMessages,
  );
  const selectedChatData = useAppStore(state => state.selectedChatData);
  // const selectedChatMessages = useAppStore(state => state.selectedChatMessages);
  const [message, setMessage] = useState('');
  const [cameraOptions, setCameraOptions] = useState(false);

  // const compressFile = async (uri: string, type: string) => {
  //   if (type?.startsWith('image')) {
  //     // Compress image
  //     return await Image.compress(uri, {
  //       compressionMethod: 'auto',
  //       quality: 0.8, // Adjust quality as needed
  //     });
  //   } else if (type.startsWith('video')) {
  //     // Compress video
  //     return await Video.compress(
  //       uri,
  //       {compressionMethod: 'auto'},
  //       progress => {
  //         console.log('Video compression progress:', progress);
  //       },
  //     );
  //   } else if (type.startsWith('audio')) {
  //     // Compress audio
  //     return await Audio.compress(uri, {
  //       quality: 'medium', // Options: 'low', 'medium', 'high'
  //     });
  //   }
  //   return uri; // For unsupported files, return the original URI
  // };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    socket?.emit('sendMessage', {
      sender: id,
      content: message,
      recipient: selectedChatData?._id,
      messageType: 'text',
      fileUrl: undefined,
      expiresAt: dissapearingTimeFrame,
    });

    setMessage('');
  };

  // const handleCameraUpload = async () => {
  //   console.log('Inside handleCameraUpload');

  //   try {
  //     const res = await launchImageLibrary({
  //       mediaType: 'mixed',
  //       // videoQuality: 'low',
  //       // quality: 0.5,
  //       // presentationStyle: 'currentContext',
  //       // formatAsMp4: true,
  //       // includeExtra: true,
  //     });

  //     console.log('This is res: ', res);

  //     if (res.assets?.length) {
  //       const file = res.assets[0];

  //       // Create a temporary message object
  //       // const tempMessage = {
  //       //   sender: id,
  //       //   content: undefined,
  //       //   recipient: selectedChatData?._id,
  //       //   messageType: 'file',
  //       //   fileUrl: null,
  //       //   expiresAt: dissapearingTimeFrame,
  //       //   uploading: true,
  //       // };

  //       // Emit the temporary message
  //       // socket?.emit('sendMessage', tempMessage);

  //       // Compress the file based on type
  //       // if (file.uri && file.type) {
  //       //   const compressedUri = await compressFile(file.uri, file.type);
  //       //   console.log('Compressed file URI:', compressedUri);
  //       //   console.log(' file URI:', file.uri);
  //       //   console.log(' file.type:', file.type);

  //       socket?.emit('sendMessage', {
  //         sender: id,
  //         content: undefined,
  //         recipient: selectedChatData?._id,
  //         messageType: 'file',
  //         fileUrl: '',
  //         expiresAt: dissapearingTimeFrame,
  //       });

  //       // const formData = new FormData();
  //       // formData.append('file', {
  //       //   uri: file.uri,
  //       //   name: file.fileName,
  //       //   type: file.type,
  //       // });
  //       // console.log('This is formData object:', formData);

  //       // const uploadResponse = await apiClient.post(UPLOAD_FILE, formData, {
  //       //   headers: {
  //       //     Authorization: `Bearer ${token}`,
  //       //     'Content-Type': 'multipart/form-data',
  //       //   },
  //       //   onUploadProgress: data =>
  //       //     updateKeys({
  //       //       fileUploadProgress:
  //       //         data.total !== undefined
  //       //           ? Math.round((100 * data.loaded) / data.total)
  //       //           : 0,
  //       //     }),
  //       // });

  //       // updateKeys({isUploading: true});

  //       // if (uploadResponse.status === 200) {
  //       //   // updateKeys({isUploading: false});

  //       //   socket?.emit('sendMessage', {
  //       //     sender: id,
  //       //     content: undefined,
  //       //     recipient: selectedChatData?._id,
  //       //     messageType: 'file',
  //       //     fileUrl: uploadResponse.data.filePath,
  //       //     expiresAt: dissapearingTimeFrame,
  //       //   });
  //       // } else {
  //       //   console.error('File upload failed:', uploadResponse);
  //       // }
  //     }
  //     // }
  //   } catch (err) {
  //     // updateKeys({isUploading: false});
  //     console.error('Camera upload error:', err);
  //   }
  // };

  // const handleCameraUpload = async () => {
  //   // 1.Create a unique message ID
  //   const tempId = new ObjectId().toString();

  //   try {
  //     // 2.Launch the image picker
  //     const res = await ImagePicker.launchImageLibrary({
  //       mediaType: 'mixed',
  //       formatAsMp4: true,
  //     });

  //     console.log('This is res: ', res);

  //     // // 3.If a file is selected
  //     if (res.assets?.length) {
  //       const file = res.assets[0];

  //       // 4.Create a temporary message object
  //       const tempMessage = {
  //         _id: tempId,
  //         conversationId: selectedChatData?.conversationId || '',
  //         sender: id,
  //         recipient: selectedChatData?._id || '',
  //         timestamp: new Date().toISOString(),
  //         createdAt: new Date().toISOString(),
  //         expiresAt: dissapearingTimeFrame,
  //         messageType: 'file',
  //         fileUrl: file.uri || '',
  //         uploading: true,
  //       };

  //       // 5.Update UI with the temporary message
  //       updateFuncChat({
  //         selectedChatMessages: [...selectedChatMessages, tempMessage],
  //       });

  //       // 6.If a file is selected with uri and type
  //       if (file.uri && file.type) {
  //         // const compressedUri = await compressFile(file.uri, file.type);
  //         // console.log('This is compressedUri:', compressedUri);

  //         // Compress the selected file
  //         const compressedUri = await compressFile(file.uri, file.type);

  //         //7. Create a FormData object to send the compressed file
  //         const formData = new FormData();
  //         formData.append('file', {
  //           // uri: file.uri,
  //           uri: compressedUri,
  //           name: file.fileName,
  //           type: file.type,
  //         });

  //         //8. Post the compressed file to store on the server
  //         const uploadResponse = await apiClient.post(UPLOAD_FILE, formData, {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             'Content-Type': 'multipart/form-data',
  //           },
  //           // onUploadProgress: data =>
  //           //   updateKeys({
  //           //     fileUploadProgress:
  //           //       data.total !== undefined
  //           //         ? Math.round((100 * data.loaded) / data.total)
  //           //         : 0,
  //           //   }),
  //         });

  //         //9. Update UI on success with the uploaded file URL and emit the message to the server
  //         if (uploadResponse.status === 200) {
  //           //10. Update the UI
  //           updateFuncChat({
  //             selectedChatMessages: [
  //               ...selectedChatMessages,
  //               {...tempMessage, fileUrl: uploadResponse.data.filePath},
  //             ],
  //           });

  //           //11. Emit the message
  //           // socket?.emit('sendMessage', {
  //           //   _id: tempId,
  //           //   sender: id,
  //           //   content: undefined,
  //           //   recipient: selectedChatData?._id,
  //           //   messageType: 'file',
  //           //   fileUrl: uploadResponse.data.filePath,
  //           //   expiresAt: dissapearingTimeFrame,
  //           // });
  //         } else {
  //           console.error('File upload failed:', uploadResponse);
  //         }
  //       }
  //     }
  //   } catch (err: any) {
  //     console.error('Camera upload error:', err);
  //     console.error('Camera upload error:', err.message);
  //   }
  // };

  const handleCameraUpload = async (res: any) => {
    if (res.assets?.length) {
      // 1.Check the total size of the selected images or videos
      let totalSize = res.assets.reduce(
        (acc: any, file: any) => acc + file.fileSize,
        0,
      );

      // 2.If total size is bigger than 50mb return
      if (totalSize > 50 * 1024 * 1024) {
        return Alert.alert(
          'Total size excedeed',
          'Maximum upload capacity is 50mb',
        );
      }

      // 3.If more than 10 files are selected, return
      if (res.assets?.length > 10) {
        return Alert.alert('Total size excedeed', 'Maximum upload items is 10');
      }

      // 1. Create Message objects from media selected
      const tempMsgs = res.assets.map((media: any) => {
        // 1.Create a unique message ID
        const tempId = new ObjectId().toString();

        return {
          _id: tempId,
          conversationId: selectedChatData?.conversationId || '',
          sender: id,
          recipient: selectedChatData?._id || '',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          messageType: 'file',
          // fileUrl: media.type,
          fileUrl: media.uri,
          expiresAt: dissapearingTimeFrame,
        };
      });

      //2. Add temporary messages to the UI
      useAppStore
        .getState()
        .updateSelectedChatMessages(currentMessages => [
          ...currentMessages,
          ...tempMsgs,
        ]);

      //3. Hide camera options
      setCameraOptions(false);

      //7. Create a FormData object to send the compressed file
      const formData = new FormData();

      res.assets.forEach((file: any) => {
        formData.append('files', {
          uri: file.uri,
          name: file.fileName,
          type: file.type,
        });
      });

      try {
        //8. Post the compressed file to store on the server
        const uploadResponse = await apiClient.post(UPLOAD_FILE, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        //9. Emit the event when upload is successful
        if (uploadResponse.status === 200) {
          const uploadedFilePaths = uploadResponse.data.filePaths;

          const tempMessages = tempMsgs.map(
            (tempMsg: Message, index: number) => ({
              ...tempMsg,
              fileUrl: `${HOST}/${uploadedFilePaths[index]}`,
            }),
          );

          //11. Emit the message
          socket?.emit('sendMessage', {messages: tempMessages});
        } else {
          Alert.alert(
            uploadResponse.data?.message || 'Upload failed',
            'Error uploading media, try again!',
          );
        }
      } catch (error: any) {
        // Clear temp messages on fail
        useAppStore
          .getState()
          .updateSelectedChatMessages(currentMessages =>
            currentMessages.filter(
              msg =>
                !tempMsgs.some((tempMsg: Message) => tempMsg._id === msg._id),
            ),
          );

        Alert.alert('Upload Failed', error.message || 'Something went wrong');
      }
    }
  };

  const onButtonPress = React.useCallback(
    (type: ImagePickerType, options: any) => {
      if (type === 'capture') {
        ImagePicker.launchCamera(options, (res: any) => {
          if (!res.didCancel && !res.error) {
            handleCameraUpload(res);
          } else {
            console.error(
              'Camera error or cancelled:',
              res.error || 'Cancelled',
            );
          }
        });
      } else {
        ImagePicker.launchImageLibrary(options, (res: any) => {
          if (!res.didCancel && !res.error) {
            handleCameraUpload(res);
          } else {
            console.error(
              'Image library error or cancelled:',
              res.error || 'Cancelled',
            );
          }
        });
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
          // icon2={<AddIcon width={21.5} height={21.5} />}
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
