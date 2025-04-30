import {Buffer} from 'buffer';
import {Alert, Platform} from 'react-native';

import {useAppStore} from '../store';

import {Contact, Conversation, Message} from '../types/types';

import {DELETE_CONVERSATION, DELETE_MESSAGE, UPLOAD_FILE} from '../api/apis';
import {apiClient} from '../api/apiClient';
import {checkPermissionStatus} from './helpers';

import {permission} from './permissions';

import {Image, Video} from 'react-native-compressor';
import {ObjectId} from 'bson';
import * as ImagePicker from 'react-native-image-picker';

import {
  decryptFile,
  decryptMessage,
  encryptFile,
  encryptMessage,
} from './encryption';

import ReactNativeBlobUtil from 'react-native-blob-util';

type ImagePickerType = 'capture' | 'library';

// ====================================================
// Message Socket handlers
// ====================================================
export const handleReceiveMessage = async ({message}: any) => {
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

  if (message.messageType === 'text') {
    const decrypted = await decryptMessage(
      message.content,
      message.iv,
      isRecipient ? message.sender.publicKey : message.recipient.publicKey,
    );
    message.content = decrypted;
  }

  const tempConversations = [...conversations];

  // Check if the conversation already exists
  const existingConversationIndex = conversations.findIndex(
    conversation => conversation._id === message.conversationId,
  );

  // Update the existing conversation
  if (existingConversationIndex !== -1) {
    tempConversations[existingConversationIndex] = {
      ...tempConversations[existingConversationIndex],
      lastMessage: message,
      lastMessageTime: message.createdAt,
      recipientUnread: isRecipient
        ? tempConversations[existingConversationIndex].recipientUnread + 1
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
      recipientUnread: isRecipient ? 1 : 0,
      lastSender: message.sender._id,
      isActive: true,
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
    (isRecipient || message.messageType === 'text')
  ) {
    const mediaTypes = ['image', 'video', 'audio'];
    const isMedia = mediaTypes.includes(message.messageType);

    if (isMedia) {
      try {
        decryptFile(
          message.fileUrl,
          message.iv,
          message.sender.publicKey, // public key of the other user
          message._id, // for cache filename
        ).then(res => {
          updateSelectedChatMessages(messages => {
            return messages.map(msg => {
              if (msg._id === message._id) {
                return {...msg, fileUrl: res, downloading: false};
              } else {
                return msg;
              }
            });
          });
        });
      } catch (e) {
        console.log(e);
      }
    }

    updateSelectedChatMessages(current => [
      ...current.filter(msg => msg._id !== message._id),
      {
        ...message,
        seen: true,
        downloading: true,
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
        expiresAt: message.expiresAt,
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

// WHen a user deletes their account, we need
export const deletedUser = async ({user}: {user: Contact}) => {
  console.log('This is the user', user);

  const {
    updateFriends,
    updateWebRTCState,
    updateFuncChat,
    selectedChatData,
    conversations,
    calls,
  } = useAppStore.getState();

  // If I am inside chat, update selectedChatData with new deleted user datas
  if (selectedChatData?._id === user._id) {
    updateFuncChat({
      selectedChatData: {
        ...selectedChatData,
        ...user,
      },
    });
  }

  // Update conversations to mark the user as inactive
  const updatedConversations = conversations.map(conversation => {
    const updatedParticipants = conversation.participants.map(participant =>
      participant._id === user._id ? {...participant, ...user} : participant,
    );
    return {
      ...conversation,
      participants: updatedParticipants,
    };
  });

  // Update conversations with deleted user so the isActive field is present
  updateFuncChat({
    conversations: updatedConversations,
  });

  // Update friends with deleted user so the isActive field is present
  updateFriends(current => {
    return current.map(item => (item._id === user._id ? user : item));
  });

  // Update calls with deleted user so the isActive field is present
  const updatedCalls = calls.map(call => {
    const updatedParticipants = call.participants.map(p =>
      p._id === user._id ? {...p, ...user} : p,
    );
    return {
      ...call,
      participants: updatedParticipants,
    };
  });

  updateWebRTCState({
    calls: updatedCalls,
  });
};

// ====================================================
// Update conversation
// ====================================================

// When we receive a new message, we need to update the conversation list
export const handleConversationUpdated = async (conversation: Conversation) => {
  const {updateConversations, id: loggedInUserId} = useAppStore.getState();

  const lastMessage = conversation.lastMessage;
  const otherParticipant =
    lastMessage?.sender?._id === loggedInUserId
      ? lastMessage?.recipient
      : lastMessage?.sender;

  if (lastMessage && lastMessage?.messageType === 'text') {
    const decrypted = await decryptMessage(
      lastMessage.content!,
      lastMessage.iv!,
      otherParticipant?.publicKey!,
    );
    lastMessage.content = decrypted;
  }

  updateConversations(prev =>
    prev.map(item => {
      if (item._id === conversation._id) {
        return {
          ...item,
          lastMessage: conversation.lastMessage,
          lastMessageTime: conversation.lastMessageTime,
        };
      }
      return item;
    }),
  );
};

// When we click to enter a conversation, we need to update the unread messages
export const updateCurrentConversation = async () => {
  const {
    selectedChatData,
    updateConversations,
    socket,
    conversations,
    id: loggedInUser,
  } = useAppStore.getState();

  if (!selectedChatData) {
    return;
  }

  let existingConversation;

  // IF conversation id exists means we have clicked on the conversation list
  // else we have clicked on the contact list
  if (selectedChatData.conversationId) {
    existingConversation = conversations.find(
      conversation => conversation._id === selectedChatData.conversationId,
    );
  } else {
    existingConversation = conversations.find(conversation =>
      conversation.participants.some(
        participant => participant._id === selectedChatData._id,
      ),
    );
  }

  // Update conversation recipientUnRead property to 0 if we have a new message.
  if (
    existingConversation &&
    existingConversation.lastSender !== loggedInUser
  ) {
    await socket?.emit('readMessage', {
      id: existingConversation?._id,
      version: 2,
    });

    updateConversations(prev =>
      prev.map(item => {
        console.log(
          'Inside updateCurrentConversation',
          item._id,
          selectedChatData?.conversationId,
        );

        if (item._id === existingConversation?._id) {
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
  const {updateKeys, selectedChatData} = useAppStore.getState();

  if (!selectedChatData?.isActive) {
    return Alert.alert('User is not active');
  }

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
      maxWidth: 800,
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

  if (!selectedChatData?.isActive) {
    return Alert.alert('User is not active');
  }

  if (message.trim() === '') {
    return;
  }

  const {encrypted, iv} = await encryptMessage(message.trim());

  const messagePayload = {
    sender: id,
    recipient: selectedChatData?._id,
    messageType: 'text',
    conversationId: selectedChatData?.conversationId || '',
    expiresAt: disappearingMessages.value,
    content: encrypted,
    iv,
  };

  socket?.emit('sendMessage', {
    messages: [messagePayload],
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

  if (!res.assets?.length) {
    return;
  }

  const formData = new FormData();

  try {
    // 1.Check the total size of the selected images or videos
    let totalSize = res.assets.reduce(
      (acc: number, file: any) => acc + file.fileSize,
      0,
    );

    // 2.If total size is bigger than 250mb return
    if (totalSize > 250 * 1024 * 1024) {
      setCameraOptions(false);
      updateKeys({loading: false});
      return Alert.alert(
        'Total size excedeed',
        'Maximum upload capacity is 500mb',
      );
    }

    const tempMsgs = await Promise.all(
      res.assets.map(async (media: any) => {
        const tempId = new ObjectId().toString();
        const isVideo = media.type.startsWith('video');
        const fileName =
          Platform.OS === 'ios'
            ? media.fileName
            : media.fileName.split('_').pop();

        return {
          _id: tempId,
          conversationId: selectedChatData?.conversationId,
          sender: id,
          recipient: selectedChatData?._id || '',
          createdAt: new Date().toISOString(),
          messageType: isVideo ? 'video' : 'image',
          fileUrl: media.uri,
          thumbnailUrl: null,
          expiresAt: disappearingMessages.value,
          uploading: true,
          duration: isVideo ? media.duration : null,
          seen: false,
          fileName: fileName,
        };
      }),
    );

    // 4.Update created messages in UI
    updateSelectedChatMessages(current => [...current, ...tempMsgs]);

    await Promise.all(
      tempMsgs.map(async (msg: any) => {
        const compressedUri =
          msg.messageType === 'video'
            ? await compressVideo(msg.fileUrl)
            : await compressImage(msg.fileUrl);

        const filePath = compressedUri.replace('file://', '');

        let base64File = await ReactNativeBlobUtil.fs.readFile(
          filePath,
          'base64',
        );

        let binary: ArrayBuffer | null = Buffer.from(
          base64File,
          'base64',
        ).buffer;
        base64File = null;

        const {encrypted, iv} = await encryptFile(binary);
        let encryptedFilePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/encrypted/${msg._id}.enc`;

        await ReactNativeBlobUtil.fs.writeFile(
          encryptedFilePath,
          encrypted,
          'base64',
        );

        binary = null;

        formData.append('files', {
          uri: 'file://' + encryptedFilePath,
          name: msg.fileName,
          type: msg.messageType === 'video' ? 'video/mp4' : 'image/jpeg',
        } as any);

        msg.encryptedFilePath = encryptedFilePath;
        msg.iv = iv;
      }),
    );

    // 6. Send the compressed file
    await postMediaMessages(formData, tempMsgs, setCameraOptions);
  } catch (error) {
    console.error('THis is camera upload error:', error);
    throw error;
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

    // //2. Emit the event when upload is successful
    if (uploadResponse.status === 200) {
      console.log('This is response 200');

      // Get the correct file paths from backend
      const uploadedFilePaths = uploadResponse.data.filePaths;

      //3. Update UI of the sender when upload is successful
      const temporaryUiMessages = tempMsgs.map((tempMsg: Message) => ({
        ...tempMsg,
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

      // 4. Construct the final message objects
      const uploadedMessages = tempMsgs.map(
        (tempMsg: Message, index: number) => ({
          ...tempMsg,
          fileUrl: uploadedFilePaths[index],
          iv: tempMsg.iv,
        }),
      );

      await socket?.emit('sendMessage', {messages: uploadedMessages});

      // Remove the encrypted message from cache after successfully posting it. Temporary we are using its path from Image Picker stored in cache.
      await Promise.all(
        tempMsgs.map(async tempMsg => {
          try {
            await ReactNativeBlobUtil.fs.unlink(tempMsg.encryptedFilePath!);
          } catch (error) {
            console.log('Error deleting file:', error);
          }
        }),
      );
    }
  } catch (error: any) {
    updateSelectedChatMessages(currentMessages =>
      currentMessages.filter(
        msg => !tempMsgs.some((tempMsg: Message) => tempMsg._id === msg._id),
      ),
    );
    console.error('Error uploading file:', error);
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

  console.log('This is conversationId:', conversationId);

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

  console.log('selectedMessageToDelete', selectedMessageToDelete);

  try {
    const res = await apiClient.post(DELETE_MESSAGE, {
      msgId: selectedMessageToDelete?._id,
    });

    const msgType = ['image', 'video', 'audio', 'file'];

    if (res.status === 200) {
      if (
        selectedMessageToDelete?._id &&
        msgType.includes(selectedMessageToDelete?.messageType!)
      ) {
        try {
          const path = selectedMessageToDelete?.fileUrl.startsWith('file://')
            ? selectedMessageToDelete.fileUrl.replace('file://', '')
            : selectedMessageToDelete?.fileUrl;

          const exists = await ReactNativeBlobUtil.fs.exists(path!);
          if (exists) {
            await ReactNativeBlobUtil.fs
              .unlink(path!)
              .catch(error =>
                console.log('Error deleting file inside DeleteMsg:', error),
              );
          }
        } catch (error) {
          console.log('Error deleting file:', error);
        }
      }

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

// ====================================================
// Clear Cache on Unmount
// ====================================================

export const clearCacheAndChatData = async () => {
  const {updateFuncChat, selectedChatMessages} = useAppStore.getState();

  const msgType = ['image', 'video', 'audio', 'file'];

  await Promise.allSettled(
    selectedChatMessages?.map(async msg => {
      // fileUrl is a local path that starts with 'file://'
      // We need to remove 'file://' from the path before deleting otherwise it will not work
      const isFileFromPicker = msg.fileUrl.startsWith('file://');

      if (msgType.includes(msg.messageType) && msg.fileUrl) {
        try {
          const path = isFileFromPicker
            ? msg.fileUrl.replace('file://', '')
            : msg.fileUrl;
          await ReactNativeBlobUtil.fs.unlink(path);
        } catch (error) {
          console.log('Error deleting file:', error);
        }
      }
    }),
  );

  updateFuncChat({selectedChatMessages: [], selectedChatData: null});
};

export const closeModal = () => {
  const {updateFuncChat} = useAppStore.getState();
  updateFuncChat({selectedMessageToDelete: null});
};
