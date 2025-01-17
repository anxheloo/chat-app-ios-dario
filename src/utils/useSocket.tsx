import {useCallback, useEffect} from 'react';
import {useAppStore} from '../store';
import {Message, Conversation} from './types';

export const useSocket = () => {
  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const userId = useAppStore(state => state.id);
  const initializeSocket = useAppStore(state => state.initializeSocket);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);

  const handleReceiveMessage = useCallback((message: any) => {
    const {
      directMessagesContacts,
      selectedChatMessages,
      selectedChatData,
      sortContactsByLastConversation,
    } = useAppStore.getState();

    const conversations = [...directMessagesContacts];

    // Check if the conversation already exists
    const existingConversationIndex = directMessagesContacts.findIndex(
      conversation => conversation._id === message.conversationId,
    );

    // Update the existing conversation
    if (existingConversationIndex !== -1) {
      conversations[existingConversationIndex] = {
        ...directMessagesContacts[existingConversationIndex],
        lastMessage: message,
        lastMessageTime: message.createdAt,
      };
    } else {
      // Add a new conversation if it doesn't exist
      conversations.unshift({
        _id: message.conversationId,
        participants: [message.sender, message.recipient],
        lastMessage: message,
        lastMessageTime: message.createdAt,
      });
    }

    // Update the conversations in the state
    updateFuncChat({
      directMessagesContacts: conversations,
    });

    if (
      selectedChatData?._id === message.recipient._id ||
      selectedChatData?._id === message.sender._id
    ) {
      // Try this
      useAppStore.getState().updateSelectedChatMessages(currentMessages => [
        ...currentMessages.filter(msg => msg._id !== message._id),
        {
          ...message,
          recipient: message.recipient._id,
          sender: message.sender._id,
        },
      ]);

      // If not work , use this

      // updateFuncChat({
      //   selectedChatMessages: [
      //     ...selectedChatMessages.filter(msg => msg._id !== message._id),
      //     {
      //       ...message,
      //       recipient: message.recipient._id,
      //       sender: message.sender._id,
      //     },
      //   ],
      // });
      // }
    }

    sortContactsByLastConversation(message);
  }, []);

  // const handleConversationUpdated = useCallback(
  //   ({conversationId, lastMessage, lastMessageTime}:{conversationId: string, lastMessage: any, lastMessageTime: string}) => {
  //     const {directMessagesContacts} = useAppStore.getState();

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

  //     updateFuncChat({directMessagesContacts: updatedContacts});
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
    [],
  );

  const handleConverationUpdated = useCallback((conversation: Conversation) => {
    console.log('Conversation emited from backend:', conversation);

    const {directMessagesContacts} = useAppStore.getState();
    const existingConversations = directMessagesContacts.map(item => {
      if (item._id === conversation._id) {
        return {
          ...item,
          lastMessage: conversation.lastMessage,
          lastMessageTime: conversation.lastMessageTime,
        };
      }

      return item;
    });

    updateFuncChat({directMessagesContacts: existingConversations});
  }, []);

  useEffect(() => {
    const socket = initializeSocket();

    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('messageDeleted', handleMessageDeleted);
      socket.on('conversationUpdated', handleConverationUpdated);
    }

    return () => disconnectSocket();
  }, [userId]);
};
