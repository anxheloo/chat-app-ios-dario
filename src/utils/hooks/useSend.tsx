import {useCallback} from 'react';
import {useAppStore} from '../../store';
import {Alert} from 'react-native';
import {ObjectId} from 'bson';
// import {createThumbnail} from 'react-native-create-thumbnail';
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
    if (message.trim() === '') {
      return;
    }

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
  }, [
    message,
    socket,
    id,
    selectedChatData?._id,
    dissapearingTimeFrame,
    setMessage,
  ]);

  const handleCameraUpload = useCallback(
    async (res: any) => {
      if (res.assets?.length) {
        console.log('this is res from camera upload', res);
        console.log('this is base64 from camera upload', res.assets[0].base64);

        // 1.Check the total size of the selected images or videos
        let totalSize = res.assets.reduce(
          (acc: any, file: any) => acc + file.fileSize,
          0,
        );

        // 2.If total size is bigger than 500mb return
        if (totalSize > 500 * 1024 * 1024) {
          setCameraOptions(false);
          updateKeys({loading: false});
          return Alert.alert(
            'Total size excedeed',
            'Maximum upload capacity is 500mb',
          );
        }

        // 4. Create Message objects from media selected
        const tempMsgs = await Promise.all(
          res.assets.map(async (media: any) => {
            const tempId = new ObjectId().toString();
            const isVideo = media.type.startsWith('video');

            // let thumbnail = '';
            // if (isVideo) {
            //   const thumbnailResponse = await createThumbnail({
            //     url: media.uri,
            //   });
            //   thumbnail = thumbnailResponse.path; // Thumbnail path
            // }

            return {
              _id: tempId,
              conversationId: selectedChatData?.conversationId || '',
              sender: id,
              recipient: selectedChatData?._id || '',
              timestamp: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              messageType: 'file',
              fileUrl: media.uri,
              // fileUrl: media.base64,
              // thumbnailUrl: thumbnail, // Save thumbnail
              thumbnailUrl: null, // Save thumbnail
              expiresAt: dissapearingTimeFrame,
              uploading: true,
              duration: isVideo ? media.duration : null,
            };
          }),
        );

        updateSelectedChatMessages(current => [...current, ...tempMsgs]);

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

            socket?.emit('sendMessage', {messages: uploadedMessages});
          } else {
            Alert.alert(
              uploadResponse.data?.message || 'Upload failed',
              'Error uploading media, try again!',
            );
          }
        } catch (error: any) {
          updateSelectedChatMessages(currentMessages =>
            currentMessages.filter(
              msg =>
                !tempMsgs.some((tempMsg: Message) => tempMsg._id === msg._id),
            ),
          );
          Alert.alert('Error', 'Failed to upload media');
        } finally {
          setCameraOptions(false);
          updateKeys({loading: false});
        }
      }
    },
    [
      updateSelectedChatMessages,
      setCameraOptions,
      updateKeys,
      selectedChatData?.conversationId,
      selectedChatData?._id,
      id,
      dissapearingTimeFrame,
      token,
      socket,
    ],
  );

  return {sendMessage, handleCameraUpload};
};

export default useSend;
