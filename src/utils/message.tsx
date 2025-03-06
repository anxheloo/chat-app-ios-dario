import {Alert} from 'react-native';
import {useAppStore} from '../store';
import {Contact, Conversation, Message} from './types';

export const handleReceiveMessage = (message: any) => {
  const {
    conversations,
    selectedChatData,
    sortConversations,
    updateFuncChat,
    updateSelectedChatMessages,
  } = useAppStore.getState();

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
};

export const handleMessageDeleted = ({messageId}: {messageId: string}) => {
  const {selectedChatMessages, selectedChatData, updateFuncChat} =
    useAppStore.getState();

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
};

export const handleConversationUpdated = (conversation: Conversation) => {
  const {conversations, updateFuncChat} = useAppStore.getState();
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
};

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
