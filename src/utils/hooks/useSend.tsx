import React, {useCallback} from 'react';
import {useAppStore} from '../../store';
import {Alert} from 'react-native';
import {ObjectId} from 'bson';
import {createThumbnail} from 'react-native-create-thumbnail';
import {apiClient} from '../../api/apiClient';
import {HOST, UPLOAD_FILE} from '../../api/apis';
import {Message} from '../types';

const useSend = (
  message: string,
  setMessage: (text: string) => void,
  setCameraOptions: (data: boolean) => void,
) => {
  const socket = useAppStore(state => state.socket);
  const token = useAppStore(state => state.token);
  const id = useAppStore(state => state.id);
  const selectedChatData = useAppStore(state => state.selectedChatData);
  const dissapearingTimeFrame = useAppStore(
    state => state.dissappearingMessages,
  );
  const updateKeys = useAppStore(state => state.updateKeys);
  const updateSelectedChatMessages = useAppStore(
    state => state.updateSelectedChatMessages,
  );

  const sendMessage = useCallback(async () => {
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
  }, [message, socket, id, selectedChatData, dissapearingTimeFrame]);

  const handleCameraUpload = useCallback(
    async (res: any) => {
      if (res.assets?.length) {
        // 1.Check the total size of the selected images or videos
        let totalSize = res.assets.reduce(
          (acc: any, file: any) => acc + file.fileSize,
          0,
        );

        // 2.If total size is bigger than 100mb return
        if (totalSize > 100 * 1024 * 1024) {
          setCameraOptions(false);
          updateKeys({loading: false});
          return Alert.alert(
            'Total size excedeed',
            'Maximum upload capacity is 100mb',
          );
        }

        // 3.If more than 10 files are selected, return
        if (res.assets?.length > 6) {
          setCameraOptions(false);
          updateKeys({loading: false});
          return Alert.alert(
            'Total size excedeed',
            'Maximum upload items is 6',
          );
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
    },
    [selectedChatData, dissapearingTimeFrame, id, token, socket],
  );

  return {sendMessage, handleCameraUpload};
};

export default useSend;
