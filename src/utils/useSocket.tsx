import {useCallback, useEffect} from 'react';
import {useAppStore} from '../store';
import {Message} from './types';

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

    if (existingConversationIndex !== -1) {
      // Update the existing conversation
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
      updateFuncChat({
        selectedChatMessages: [
          ...selectedChatMessages,
          {
            ...message,
            recipient: message.recipient._id,
            sender: message.sender._id,
          },
        ],
      });
    }

    // -----------------------------------------------------
    // Update the last message in conversations
    // const updatedConversations = directMessagesContacts.map(conversation => {
    //   console.log('THIS IS CONVERSATION AND MESSAGE', conversation, message);

    //   if (conversation._id === message.conversationId) {
    //     return {
    //       ...conversation,
    //       lastMessage: message,
    //       lastMessageTime: message.createdAt,
    //     };
    //   }
    //   return conversation;
    // });

    // Add the conversation if it's not already in the list
    // if (!directMessagesContacts.some(c => c._id === updatedConversations._id)) {
    //   updatedContacts.unshift(updatedConversation);
    // }

    // updateFuncChat({
    //   directMessagesContacts: updatedConversations,
    // });

    // -----------------------------------------------------

    sortContactsByLastConversation(message);
  }, []);

  const handleMessageDeleted = useCallback(
    ({messageId}: {messageId: string}) => {
      const {selectedChatMessages} = useAppStore.getState();
      updateFuncChat({
        selectedChatMessages: selectedChatMessages.filter(
          (message: Message) => message._id !== messageId,
        ),
      });
    },
    [],
  );

  useEffect(() => {
    const socket = initializeSocket();

    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('messageDeleted', handleMessageDeleted);
    }

    return () => disconnectSocket();
  }, [userId]);
};
