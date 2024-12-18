import {useEffect} from 'react';
import {useAppStore} from '../store';
import {Message} from './types';

export const useSocket = () => {
  console.log('Inside useSocket hook');

  const userId = useAppStore(state => state.id);
  const initializeSocket = useAppStore(state => state.initializeSocket);
  const disconnectSocket = useAppStore(state => state.disconnectSocket);

  // useEffect(() => {
  //   console.log('Inside useEffect of useSocket hook');

  //   if (userId) {
  //     const socketInstance = initializeSocket();

  //     if (socketInstance) {
  //       const handleReceiveMessage = (message: Message) => {
  //         console.log('message inside receiveMessage:', message);

  //         const {
  //           selectedChatData,
  //           updateFuncChat,
  //           selectedChatMessages,
  //           sortContactsByLastConversation,
  //         } = useAppStore.getState();

  //         if (
  //           selectedChatData?._id === message.sender._id ||
  //           selectedChatData?._id === message.recipient._id
  //         ) {
  //           console.log('message recived:', message);
  //           updateFuncChat({
  //             selectedChatMessages: [
  //               ...selectedChatMessages,
  //               {
  //                 ...message,
  //                 recipient: message.recipient,
  //                 sender: message.sender,
  //               },
  //             ],
  //           });
  //         }

  //         sortContactsByLastConversation(message);
  //       };

  //       socketInstance.on('receiveMessage', handleReceiveMessage);
  //     }
  //   }

  //   return () => disconnectSocket();
  // }, [userId]);

  // const handleReceiveMessage = (message: Message) => {
  //   console.log('message inside receiveMessage:', message);

  //   const {
  //     selectedChatData,
  //     updateFuncChat,
  //     selectedChatMessages,
  //     sortContactsByLastConversation,
  //   } = useAppStore.getState();

  //   if (
  //     selectedChatData?._id === message.sender._id ||
  //     selectedChatData?._id === message.recipient._id
  //   ) {
  //     console.log('message recived:', message);
  //     updateFuncChat({
  //       selectedChatMessages: [
  //         ...selectedChatMessages,
  //         {
  //           ...message,
  //           recipient: message.recipient,
  //           sender: message.sender,
  //         },
  //       ],
  //     });
  //   }

  //   sortContactsByLastConversation(message);
  // };

  // const handleReceiveMessage = (message: Message) => {
  //   console.log('message inside receiveMessage:', message);

  //   const {
  //     updateFuncChat,
  //     selectedChatMessages,
  //     sortContactsByLastConversation,
  //   } = useAppStore.getState();

  //   updateFuncChat({
  //     selectedChatMessages: [
  //       ...selectedChatMessages,
  //       {
  //         ...message,
  //         recipient: message.recipient,
  //         sender: message.sender,
  //       },
  //     ],
  //   });

  //   sortContactsByLastConversation(message);
  // };

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

      // socket.on('receiveMessage', handleReceiveMessage);
    }

    return () => disconnectSocket();
  }, [userId]);
};
