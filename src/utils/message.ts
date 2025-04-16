import {Alert} from 'react-native';

import {Image, Video} from 'react-native-compressor';

import {useAppStore} from '../store';

import {Contact, Conversation, Message} from './types';
import {ObjectId} from 'bson';

import {DELETE_CONVERSATION, DELETE_MESSAGE, UPLOAD_FILE} from '../api/apis';
import {apiClient} from '../api/apiClient';
import {checkPermissionStatus} from './helpers';
import {permission} from './permissions';

import * as ImagePicker from 'react-native-image-picker';
type ImagePickerType = 'capture' | 'library';

// ====================================================
// Message Socket handlers
// ====================================================
export const handleReceiveMessage = ({message, version}: any) => {
  const {
    conversations,
    selectedChatData,
    sortConversations,
    updateFuncChat,
    updateConversations,
    updateSelectedChatMessages,
    socket,
    id,
  } = useAppStore.getState();

  const isRecipient = message.sender?._id !== id;
  const isText = version === 'text';

  const tempConversations = [...conversations];

  // Check if the conversation already exists
  const existingConversationIndex = conversations.findIndex(
    conversation => conversation._id === message.conversationId,
  );

  // Update the existing conversation
  if (existingConversationIndex !== -1) {
    tempConversations[existingConversationIndex] = {
      ...conversations[existingConversationIndex],
      lastMessage: message,
      lastMessageTime: message.createdAt,
      recipientUnread: isRecipient
        ? conversations[existingConversationIndex].recipientUnread + 1
        : 0,
      lastSender: message.sender._id,
    };
  } else {
    // Add a new conversation if it doesn't exist
    tempConversations.unshift({
      _id: message.conversationId,
      participants: [message.sender, message.recipient],
      lastMessage: message,
      lastMessageTime: message.createdAt,
      recipientUnread: 1,
      lastSender: message.sender._id,
    });
  }

  // Update the conversations in the state
  updateFuncChat({
    conversations: tempConversations,
  });

  if (
    (selectedChatData?._id === message.recipient._id ||
      selectedChatData?._id === message.sender._id ||
      selectedChatData?.conversationId === message.conversationId) &&
    (isRecipient || isText)
  ) {
    console.log('Inside condition ');

    updateSelectedChatMessages(current => [
      ...current.filter(msg => msg._id !== message._id),
      {
        ...message,
        seen: true,
        uploading: false,
        recipient: message.recipient._id,
        sender: message.sender._id,
      },
    ]);

    // Update the conversation where we are currently in
    updateConversations(prev =>
      prev.map(item => {
        if (item._id === message.conversationId) {
          return {
            ...item,
            recipientUnread: 0,
          };
        }
        return item;
      }),
    );

    if (isRecipient) {
      socket?.emit('readMessage', {
        id: message._id,
        version: 1,
      });
    }
  }

  sortConversations();
};

export const handleMessageDeleted = ({messageId}: {messageId: string}) => {
  const {selectedChatMessages, selectedChatData, updateFuncChat} =
    useAppStore.getState();

  console.log('This is message id:', messageId);

  // Find the message in the current chat
  const messageToDelete = selectedChatMessages.find(
    (message: Message) => message._id === messageId,
  );

  if (
    messageToDelete &&
    (messageToDelete.sender === selectedChatData?._id ||
      messageToDelete.recipient === selectedChatData?._id ||
      selectedChatData?.conversationId === messageToDelete.conversationId)
  ) {
    updateFuncChat({
      selectedChatMessages: selectedChatMessages.map(msg => {
        if (msg._id === messageId) {
          return {
            ...msg,
            messageType: 'deleted',
            content: 'Message deleted',
          };
        }
        return msg;
      }),
    });
  }
};

// ====================================================
// Update conversation
// ====================================================

export const handleConversationUpdated = (conversation: Conversation) => {
  const {updateConversations} = useAppStore.getState();

  updateConversations(prev =>
    prev.map(item => {
      if (item._id === conversation._id) {
        return {
          ...item,
          lastMessage: conversation?.lastMessage,
          lastMessageTime: conversation.lastMessageTime,
        };
      }
      return item;
    }),
  );
};

export const updateCurrentConversation = async () => {
  const {
    selectedChatData,
    updateConversations,
    socket,
    conversations,
    id: loggedInUser,
  } = useAppStore.getState();

  const existingConversationIndex = conversations.find(
    conversation => conversation._id === selectedChatData?.conversationId,
  );

  // Update conversation recipientUnRead property to 0 if we have a new message.
  if (
    existingConversationIndex &&
    existingConversationIndex.recipientUnread > 0 &&
    existingConversationIndex.lastSender !== loggedInUser
  ) {
    await socket?.emit('readMessage', {
      id: selectedChatData?.conversationId,
      version: 2,
    });

    updateConversations(prev =>
      prev.map(item => {
        if (item._id === selectedChatData?.conversationId) {
          return {
            ...item,
            recipientUnread: 0,
          };
        }
        return item;
      }),
    );
  }
};

// ====================================================

export const notifyReceiver = (friend: Contact) => {
  const {updateFriends} = useAppStore.getState();

  Alert.alert('Incoming Friend', `@${friend.username} was added as a friend.`);

  updateFriends(current => [friend, ...current]);
};

export const friendDeleted = ({
  senderId,
  senderUsername,
}: {
  senderId: string;
  senderUsername: string;
}) => {
  const {updateFriends} = useAppStore.getState();

  Alert.alert('Friend removal', `${senderUsername} removed you.`);
  updateFriends(current => current.filter(friend => friend?._id !== senderId));
};

// ====================================================
// Media picker
// ====================================================

export const onButtonPress = async (
  type: ImagePickerType,
  options: any,
  setCameraOptions: (data: boolean) => void,
) => {
  const {updateKeys} = useAppStore.getState();

  if (type === 'capture') {
    const status = await checkPermissionStatus(permission.camera);

    if (status) {
      updateKeys({loading: true});
      ImagePicker.launchCamera(options, async (res: any) => {
        if (!res.didCancel && !res.error) {
          updateKeys({loading: false});
          await handleCameraUpload(res, setCameraOptions);
        } else {
          updateKeys({loading: false});
          setCameraOptions(false);
          Alert.alert('Camera error or cancelled:', res.error || 'Cancelled');
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
          updateKeys({loading: false});
          // await handleCameraUpload(res);
          await handleCameraUpload(res, setCameraOptions);
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
};

// ====================================================
// Message send functions
// ====================================================

export const compressImage = async (uri: string) => {
  try {
    const compressedUri = await Image.compress(uri, {
      compressionMethod: 'auto',
      maxWidth: 1000,
      quality: 0.5,
      returnableOutputType: 'uri',
    });
    return compressedUri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri;
  }
};

export const compressVideo = async (uri: string) => {
  try {
    const compressedUri = await Video.compress(uri, {
      compressionMethod: 'auto',
      maxSize: 720,
    });

    console.log('Compressed Video Path:', compressedUri);
    return compressedUri;
  } catch (error) {
    console.error('Video compression failed:', error);
    return uri; // Return original URI if compression fails
  }
};

export const sendMessage = async (
  message: string,
  setMessage: (text: string) => void,
) => {
  const {socket, id, selectedChatData, disappearingMessages} =
    useAppStore.getState();

  if (message.trim() === '') {
    return;
  }

  // Emit the single text message wrapped in an array
  await socket?.emit('sendMessage', {
    messages: [
      {
        sender: id,
        content: message.trim(),
        recipient: selectedChatData?._id,
        messageType: 'text',
        fileUrl: undefined,
        expiresAt: disappearingMessages.value,
        conversationId: selectedChatData?.conversationId || '',
      },
    ],
    version: 'text',
  });

  setMessage('');
};

export const handleCameraUpload = async (
  res: any,
  setCameraOptions: (data: boolean) => void,
) => {
  const {
    updateKeys,
    updateSelectedChatMessages,
    selectedChatData,
    disappearingMessages,
    id,
  } = useAppStore.getState();

  if (res.assets?.length) {
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

    // 3. Create Message objects from media selected
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

        console.log('This is media.duration', media.duration);

        return {
          _id: tempId,
          conversationId: selectedChatData?.conversationId,
          sender: id,
          recipient: selectedChatData?._id || '',
          createdAt: new Date().toISOString(),
          messageType: isVideo ? 'video' : 'image',
          fileUrl: media.uri,
          // fileUrl: compressedUri,
          // thumbnailUrl: thumbnail, // Save thumbnail
          thumbnailUrl: null, // Save thumbnail
          expiresAt: disappearingMessages.value,
          uploading: true,
          duration: isVideo ? media.duration : null,
          seen: false,
        };
      }),
    );

    // 4.Update created messages in UI
    updateSelectedChatMessages(current => [...current, ...tempMsgs]);

    //5. Create a FormData object and compress files
    const formData = new FormData();

    await Promise.all(
      res.assets.map(async (file: any) => {
        const isVideo = file.type.startsWith('video');

        const compressedUri = isVideo
          ? await compressVideo(file.uri)
          : await compressImage(file.uri);

        formData.append('files', {
          uri: compressedUri,
          name: file.fileName,
          type: file.type,
        });
      }),
    );

    // 6. Send the compressed file
    await postMediaMessages(formData, tempMsgs, setCameraOptions);
  }
};

// ====================================================
// Message post requests
// ====================================================
export const postMediaMessages = async (
  formData: FormData,
  tempMsgs: Message[],
  setCameraOptions: (data: boolean) => void,
) => {
  const {updateSelectedChatMessages, socket} = useAppStore.getState();

  try {
    //1. Post the compressed file to store on the server
    const uploadResponse = await apiClient.post(UPLOAD_FILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    //2. Emit the event when upload is successful
    if (uploadResponse.status === 200) {
      const uploadedFilePaths = uploadResponse.data.filePaths;

      const temporaryUiMessages = tempMsgs.map((tempMsg: Message) => ({
        ...tempMsg,
        isLocalUri: true,
        uploading: false,
      }));

      updateSelectedChatMessages(current =>
        current.map(
          msg =>
            temporaryUiMessages.find(
              (updated: Message) => updated._id === msg._id,
            ) || msg,
        ),
      );

      // 3. Construct the final message objects
      const uploadedMessages = tempMsgs.map(
        (tempMsg: Message, index: number) => ({
          ...tempMsg,
          uploading: false,
          isLocalUri: false,
          fileUrl: uploadedFilePaths[index],
        }),
      );

      await socket?.emit('sendMessage', {messages: uploadedMessages});
    }
  } catch (error: any) {
    updateSelectedChatMessages(currentMessages =>
      currentMessages.filter(
        msg => !tempMsgs.some((tempMsg: Message) => tempMsg._id === msg._id),
      ),
    );
    Alert.alert('Error', 'Failed to upload media');
  } finally {
    setCameraOptions(false);
  }
};

// ====================================================
// Delete Conversation
// ====================================================
export const deleteConversation = async (
  setLoading: (loading: boolean) => void,
  conversationId: string,
) => {
  const {updateFuncChat, conversations} = useAppStore.getState();

  setLoading(true);

  try {
    const res = await apiClient.post(DELETE_CONVERSATION, {
      conversationId: conversationId,
    });

    if (res.status === 200) {
      // Update the UI
      updateFuncChat({
        conversations: conversations.filter(
          item => item._id !== conversationId,
        ),
      });
    }
  } catch (error) {
    Alert.alert('Could not delete the conversation. Please try again.');
  } finally {
    setLoading(false);
  }
};

// ====================================================
// Delete Message
// ====================================================
export const handleDelete = async () => {
  // await onPlayPause(msgId);

  const {
    selectedMessageToDelete,
    updateSelectedChatMessages,
    socket,
    id,
    updateFuncChat,
    updateConversations,
  } = useAppStore.getState();

  try {
    const res = await apiClient.post(DELETE_MESSAGE, {
      msgId: selectedMessageToDelete?._id,
    });

    if (res.status === 200) {
      console.log('This is the new conversation:', res.data.conversation);

      updateSelectedChatMessages(current =>
        current.map(msg => {
          if (msg._id === selectedMessageToDelete?._id) {
            return {
              ...msg,
              messageType: 'deleted',
              content: 'Message deleted',
            };
          }
          return msg;
        }),
      );

      updateConversations(current =>
        current.map(conversation => {
          if (conversation._id === res.data.conversation._id) {
            return {
              ...conversation,
              lastMessage: res.data.conversation.lastMessage,
              lastMessageTime: res.data.conversation.lastMessageTime,
            };
          }
          return conversation;
        }),
      );

      await socket?.emit('deleteSpecificMessage', {
        messageId: selectedMessageToDelete?._id,
        senderId: id,
        recipientId: res.data.recipientId,
        conversation: res.data.conversation,
      });
    }
  } catch (error) {
    Alert.alert('Error', 'Unable to delete the message. Please try again.');
  } finally {
    updateFuncChat({selectedMessageToDelete: null});
  }
};

export const closeModal = () => {
  const {updateFuncChat} = useAppStore.getState();
  updateFuncChat({selectedMessageToDelete: null});
};
