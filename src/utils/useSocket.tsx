import {useCallback, useEffect} from 'react';
import {useAppStore} from '../store';
import {Message} from './types';

export const useSocket = () => {
  console.log('Inside useSocket hook');

  const updateFuncChat = useAppStore(state => state.updateFuncChat);
  const userId = useAppStore(state => state.id);
  const initializeSocket = useAppStore(state => state.initializeSocket);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);

  const handleReceiveMessage = useCallback((message: any) => {
    const {
      selectedChatData,
      // updateFuncChat,
      selectedChatMessages,
      sortContactsByLastConversation,
    } = useAppStore.getState();

    if (
      selectedChatData?._id === message.sender._id ||
      selectedChatData?._id === message.recipient._id
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
