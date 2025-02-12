import {io} from 'socket.io-client';
import {create, StateCreator} from 'zustand';
import {HOST} from '../api/apis';
import {Contact, Conversation, Message, NavigationProps} from '../utils/types';

type PersonaSlice = {
  username: string;
  avatar: number;
  pin: string;
  id: string;
  dissappearingMessages: string;
  // qr_code: string;
  isUserInfoFetched: boolean;
  setUserInfoStatus: (status: boolean) => void;
  setUserPersona: (data: Partial<PersonaSlice>) => void;
};

type TokenSlice = {
  token: string | null;
  setToken: (token: string | null) => void;
};

type StatusSlice = {
  loading: boolean;
  message: string | null;
  isUploading: boolean;
  fileUploadProgress: number;
  updateKeys: (data: Partial<StatusSlice>) => void;

  bottomSheetType: string | null;
  navigation: NavigationProps | null;
};

type ChatSlice = {
  selectedChatData: Contact | null;
  conversations: Conversation[];
  friends: Contact[];
  calls: Contact[];
  selectedChatMessages: Message[];
  selectedMessageToDelete: Message | null;
  updateFuncChat: (data: Partial<ChatSlice>) => void;

  updateConversations: (
    updateFunction: (currentConversations: Conversation[]) => Conversation[],
  ) => void;

  updateSelectedChatMessages: (
    updateFunction: (currentMessages: Message[]) => Message[],
  ) => void;

  updateFriends: (
    updateFunction: (currentFriends: Contact[]) => Contact[],
  ) => void;

  updateCalls: (updateFunction: (currentCalls: Contact[]) => Contact[]) => void;

  // sortConversations: (message: Message) => void;
  sortConversations: () => void;
};

type SocketSlice = {
  socket: any | null;
  initializeSocket: () => any | null;
  disconnectSocket: () => void;
};

type CreateSlice = PersonaSlice &
  TokenSlice &
  StatusSlice &
  ChatSlice &
  SocketSlice;

const createPersonaSlice: StateCreator<PersonaSlice> = set => ({
  username: '',
  avatar: 0,
  pin: '',
  id: '',
  dissappearingMessages: 'None',
  // qr_code: '',
  isUserInfoFetched: false,
  setUserInfoStatus: (status: boolean) => set({isUserInfoFetched: status}),
  setUserPersona: set,
});

const createTokenSlice: StateCreator<TokenSlice> = set => ({
  token: null,
  setToken: (token: string | null) => set({token}),
});

const chatSlice: StateCreator<ChatSlice> = (set, get) => ({
  selectedChatData: null,
  selectedChatMessages: [],
  conversations: [],
  friends: [],
  calls: [],
  selectedMessageToDelete: null,
  updateFuncChat: set,

  updateConversations: (
    updateFunction: (currentConversations: Conversation[]) => Conversation[],
  ) => {
    const currentConversations = get().conversations;
    const updatedConversations = updateFunction(currentConversations);
    set({conversations: updatedConversations});
  },
  updateSelectedChatMessages: (
    updateFunction: (currentMessages: Message[]) => Message[],
  ) => {
    const currentMessages = get().selectedChatMessages;
    const updatedMessages = updateFunction(currentMessages);
    set({selectedChatMessages: updatedMessages});
  },
  updateFriends: (updateFunction: (currentFriends: Contact[]) => Contact[]) => {
    const currentFriends = get().friends;
    const updatedFriends = updateFunction(currentFriends);
    set({friends: updatedFriends});
  },

  updateCalls: (updateFunction: (currentCalls: Contact[]) => Contact[]) => {
    const currentCalls = get().calls;
    const updatedCalls = updateFunction(currentCalls);
    set({calls: updatedCalls});
  },

  sortConversations: () => {
    const {conversations} = get();
    // const sortedContacts = [...conversations].sort((a, b) => {
    //   if (a._id === message.conversationId) return -1;
    //   if (b._id === message.conversationId) return 1;
    //   return 0;
    // });

    const sortedContacts = conversations.sort((a, b) => {
      const dateA = +Date.parse(a?.lastMessage?.createdAt ?? '');
      const dateB = +Date.parse(b?.lastMessage?.createdAt ?? '');

      // return dateA - dateB;
      return dateB - dateA;
    });

    set({conversations: sortedContacts});
  },

  // sortContactsByLastConversation: (message: any) => {
  //   const {id} = get() as CreateSlice;
  //   const fromId =
  //     message.sender._id === id ? message.recipient._id : message.sender._id;
  //   const fromData =
  //     message.sender._id === id ? message.recipient : message.sender;
  //   const contacts = [...get().conversations];
  //   const data = contacts.find(contact => contact._id === fromId);
  //   const index = contacts.findIndex(contact => contact._id === fromId);
  //   if (index !== -1 && index !== undefined) {
  //     contacts.splice(index, 1);
  //     if (data) {
  //       contacts.unshift(data);
  //     }
  //   } else {
  //     contacts.unshift(fromData);
  //   }
  //   set({conversations: contacts});
  // },

  // sortContactsByLastConversation: (message: any) => {
  //   const {id} = get() as CreateSlice;
  //   const contacts = [...get().conversations];

  //   // Find the conversation involving this message
  //   const conversationIndex = contacts.findIndex(contact =>
  //     contact.participants.some(participant => participant._id === id),
  //   );

  //   if (conversationIndex !== -1) {
  //     const [updatedConversation] = contacts.splice(conversationIndex, 1);

  //     // Update lastMessage details
  //     updatedConversation.lastMessageType = message._id;
  //     updatedConversation.lastMessageTime = message.createdAt;

  //     // Move the updated conversation to the top
  //     contacts.unshift(updatedConversation);
  //   }

  //   set({conversations: contacts});
  // },
});

// Status Slice
const createStatusSlice: StateCreator<StatusSlice> = set => ({
  loading: false,
  message: null,
  isUploading: false,
  fileUploadProgress: 0,
  bottomSheetType: null,

  navigation: null,
  updateKeys: set,
});

// Socket Slice
const socketSlice: StateCreator<SocketSlice> = (set, get) => ({
  socket: null,
  initializeSocket: () => {
    const {id} = get() as CreateSlice;
    if (id && !get().socket) {
      const socketInstance = io(HOST, {
        query: {userId: id},
      });

      set({socket: socketInstance});

      socketInstance.on('connect', () => {
        console.log('Connected to socket server');
      });

      return socketInstance;
    }
  },

  disconnectSocket: () => {
    const {socket} = get();
    if (socket) {
      socket.disconnect();
      set({socket: null});
    }
  },
});

export const useAppStore = create<CreateSlice>()((...args) => ({
  // ...createAuthSlice(...args),
  ...createPersonaSlice(...args),
  ...createStatusSlice(...args),
  ...chatSlice(...args),
  ...socketSlice(...args),
  ...createTokenSlice(...args),
}));
