import {useCallback, useEffect} from 'react';
import {useAppStore} from '../store';
import {Message, Conversation, Contact} from './types';
import {Alert} from 'react-native';

export const useSocket = () => {
  const {
    updateFuncChat,
    id: userId,
    initializeSocket,
    disconnectSocket,
    updateSelectedChatMessages,
    updateFriends,
  } = useAppStore();

  const handleReceiveMessage = useCallback(
    (message: any) => {
      const {conversations, selectedChatData, sortConversations} =
        useAppStore.getState();

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
        };
      } else {
        // Add a new conversation if it doesn't exist
        tempConversations.unshift({
          _id: message.conversationId,
          participants: [message.sender, message.recipient],
          lastMessage: message,
          lastMessageTime: message.createdAt,
        });
      }

      // Update the conversations in the state
      updateFuncChat({
        conversations: tempConversations,
      });

      if (
        selectedChatData?._id === message.recipient._id ||
        selectedChatData?._id === message.sender._id
      ) {
        updateSelectedChatMessages(current => [
          ...current.filter(msg => msg._id !== message._id),
          {
            ...message,
            uploading: false,
            recipient: message.recipient._id,
            sender: message.sender._id,
          },
        ]);

        // updateKeys({loading: false});
      }

      sortConversations();
    },
    [updateFuncChat, updateSelectedChatMessages],
  );
  // const handleConversationUpdated = useCallback(
  //   ({conversationId, lastMessage, lastMessageTime}:{conversationId: string, lastMessage: any, lastMessageTime: string}) => {
  //     const {conversations} = useAppStore.getState();

  //     const updatedContacts = directMessagesContacts.map(conversation => {
  //       if (conversation._id === conversationId) {
  //         return {
  //           ...conversation,
  //           lastMessage,
  //           lastMessageTime,
  //         };
  //       }
  //       return conversation;
  //     });

  //     updateFuncChat({conversations: updatedContacts});
  //   },
  //   [],
  // );

  // Handle message deletion

  const handleMessageDeleted = useCallback(
    ({messageId}: {messageId: string}) => {
      const {selectedChatMessages, selectedChatData} = useAppStore.getState();

      // Find the message in the current chat
      const messageToDelete = selectedChatMessages.find(
        (message: Message) => message._id === messageId,
      );

      if (
        messageToDelete &&
        (messageToDelete.sender === selectedChatData?._id ||
          messageToDelete.recipient === selectedChatData?._id)
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
    },
    [updateFuncChat],
  );

  const handleConversationUpdated = useCallback(
    (conversation: Conversation) => {
      console.log('Conversation emited from backend:', conversation);

      const {conversations} = useAppStore.getState();
      const existingConversations = conversations.map(item => {
        if (item._id === conversation._id) {
          return {
            ...item,
            lastMessage: conversation?.lastMessage,
            lastMessageTime: conversation.lastMessageTime,
          };
        }

        return item;
      });

      updateFuncChat({conversations: existingConversations});
    },
    [updateFuncChat],
  );

  const notifyReceiver = useCallback(
    (friend: Contact) => {
      console.log('THis is friend inside notify receiver:', friend);

      Alert.alert(
        'Incoming Friend',
        `@${friend.username} was added as a friend.`,
      );

      updateFriends(current => [friend, ...current]);
    },
    [updateFriends],
  );

  const friendDeleted = useCallback(
    ({
      senderId,
      senderUsername,
    }: {
      senderId: string;
      senderUsername: string;
    }) => {
      console.log('THis is friendId inside friendDeleted:', senderId);

      Alert.alert('Friend removal', `${senderUsername} removed you.`);
      updateFriends(current =>
        current.filter(friend => friend._id !== senderId),
      );
    },
    [updateFriends],
  );

  // const loginalert = () => {
  //   Alert.alert('Login', 'You have been logged in.');
  // };

  useEffect(() => {
    if (!userId) {
      console.log('No user ID found, disconnecting socket.');
      disconnectSocket(); // Disconnect if user logs out
      return;
    }

    console.log('User ID detected, initializing socket:', userId);
    const socket = initializeSocket();

    if (socket) {
      // socket.off('receiveMessage', handleReceiveMessage);
      // socket.off('messageDeleted', handleMessageDeleted);
      // socket.off('conversationUpdated', handleConversationUpdated);
      // socket.off('friendCreated', notifyReceiver);
      // socket.off('friendDeleted', friendDeleted);

      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('messageDeleted', handleMessageDeleted);
      socket.on('conversationUpdated', handleConversationUpdated);
      socket.on('friendCreated', notifyReceiver);
      socket.on('friendDeleted', friendDeleted);
    }

    return () => {
      console.log('socket disconected from useSocket');
      disconnectSocket();
    };

    // return () => {
    //   console.log('Cleaning up socket listeners...');
    //   if (socket) {
    //     socket.off('receiveMessage', handleReceiveMessage);
    //     socket.off('messageDeleted', handleMessageDeleted);
    //     socket.off('conversationUpdated', handleConversationUpdated);
    //     socket.off('friendCreated', notifyReceiver);
    //     socket.off('friendDeleted', friendDeleted);
    //   }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
};
