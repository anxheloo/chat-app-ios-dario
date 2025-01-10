import {io} from 'socket.io-client';
import {create, StateCreator} from 'zustand';
import {HOST} from '../api/apis';
import {Contact, Conversation, Message} from '../utils/types';

type PersonaSlice = {
  username: string;
  avatar: number;
  pin: string;
  id: string | null;
  dissappearingMessages: string;
  qr_code: string;
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
};

type ChatSlice = {
  // selectedChatData: Conversation | Contact | null;
  // directMessagesContacts: Conversation[];
  // selectedChatMessages: Message[];

  selectedChatData: Contact | null;
  // directMessagesContacts: Contact[];
  directMessagesContacts: Conversation[];
  selectedChatMessages: Message[];
  updateFuncChat: (data: Partial<ChatSlice>) => void;
  sortContactsByLastConversation: (message: Message) => void;
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
  id: null,
  dissappearingMessages: 'None',
  qr_code: '',
  setUserPersona: set,
});

const createTokenSlice: StateCreator<TokenSlice> = set => ({
  token: null,
  setToken: (token: string | null) => set({token}),
});

const chatSlice: StateCreator<ChatSlice> = (set, get) => ({
  selectedChatData: null,
  // existing messages
  selectedChatMessages: [],
  directMessagesContacts: [],
  // uploading state
  // isUploading: false,
  // isDownloading: false,
  // fileUploadProgress: 0,
  // fileDownloadProgress: 0,
  // channels
  // channels: [],
  // updateFuncChat: typeOrData => set(typeOrData),
  updateFuncChat: set,

  sortContactsByLastConversation: message => {
    const {directMessagesContacts} = get();
    const sortedContacts = [...directMessagesContacts].sort((a, b) => {
      if (a._id === message.conversationId) return -1;
      if (b._id === message.conversationId) return 1;
      return 0;
    });
    set({directMessagesContacts: sortedContacts});
  },

  // sortContactsByLastConversation: (message: any) => {
  //   const {id} = get() as CreateSlice;
  //   const fromId =
  //     message.sender._id === id ? message.recipient._id : message.sender._id;
  //   const fromData =
  //     message.sender._id === id ? message.recipient : message.sender;
  //   const contacts = [...get().directMessagesContacts];
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
  //   set({directMessagesContacts: contacts});
  // },

  // sortContactsByLastConversation: (message: any) => {
  //   const {id} = get() as CreateSlice;
  //   const contacts = [...get().directMessagesContacts];

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

  //   set({directMessagesContacts: contacts});
  // },
});

// Status Slice
const createStatusSlice: StateCreator<StatusSlice> = set => ({
  loading: false,
  message: null,
  isUploading: false,
  fileUploadProgress: 0,
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
