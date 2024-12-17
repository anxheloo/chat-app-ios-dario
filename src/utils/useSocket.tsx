import {useEffect} from 'react';
import {useAppStore} from '../store';
import {Message} from './types';

export const useSocket = () => {
  console.log('Inside useSocket hook');

  const userId = useAppStore(state => state.id);
  const initializeSocket = useAppStore(state => state.initializeSocket);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);

  useEffect(() => {
    console.log('Inside useEffect of useSocket hook');

    if (userId) {
      const socketInstance = initializeSocket();

      if (socketInstance) {
        const handleReceiveMessage = (message: Message) => {
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
            console.log('message recived:', message);
            updateFuncChat({
              selectedChatMessages: [
                ...selectedChatMessages,
                {
                  ...message,
                  recipient: message.recipient,
                  sender: message.sender,
                },
              ],
            });
          }

          sortContactsByLastConversation(message);
        };

        socketInstance.on('receiveMessage', handleReceiveMessage);
      }
    }

    return () => disconnectSocket();
  }, [userId]);
};
