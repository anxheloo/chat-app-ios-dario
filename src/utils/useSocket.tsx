import {useEffect} from 'react';
import {useAppStore} from '../store';
import {Message} from './types';

export const useSocket = () => {
  console.log('Inside useSocket hook');

  const userId = useAppStore(state => state.id);
  const initializeSocket = useAppStore(state => state.initializeSocket);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);

  useEffect(() => {
    const socket = initializeSocket();

    if (socket) {
      socket.on('receiveMessage', (message: any) => {
        console.log('New message received:', message);

        const {
          selectedChatData,
          updateFuncChat,
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
      });
    }

    return () => disconnectSocket();
  }, [userId]);
};
