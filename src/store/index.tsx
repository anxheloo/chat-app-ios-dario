import {io} from 'socket.io-client';
import {create, StateCreator} from 'zustand';
import {HOST} from '../api/apis';
import {Contact, Message} from '../utils/types';

type PersonaSlice = {
  username: string;
  avatar: number;
  pin: string;
  id: string | null;
  setUserPersona: (data: Partial<PersonaSlice>) => void;
};

type StatusSlice = {
  loading: boolean;
  message: string | null;
  isUploading: boolean;
  fileUploadProgress: number;
  updateKeys: (data: Partial<StatusSlice>) => void;
};

type ChatSlice = {
  selectedChatData: Contact | null;
  selectedChatMessages: Message[];
  directMessagesContacts: Contact[];
  updateFuncChat: (data: Partial<ChatSlice>) => void;
  sortContactsByLastConversation: (message: Message) => void;
};

type SocketSlice = {
  socket: any | null;
  initializeSocket: () => any | null;
  disconnectSocket: () => void;
};

type CreateSlice = PersonaSlice & StatusSlice & ChatSlice & SocketSlice;

const createPersonaSlice: StateCreator<PersonaSlice> = set => ({
  username: '',
  avatar: 0,
  pin: '',
  id: null,
  setUserPersona: set,
});

const chatSlice: StateCreator<ChatSlice> = (set, get) => ({
  // selectedChatType: null,
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

  sortContactsByLastConversation: (message: any) => {
    const {id} = get() as CreateSlice;
    const fromId =
      message.sender._id === id ? message.recipient._id : message.sender._id;
    const fromData =
      message.sender._id === id ? message.recipient : message.sender;
    const contacts = [...get().directMessagesContacts];
    const data = contacts.find(contact => contact._id === fromId);
    const index = contacts.findIndex(contact => contact._id === fromId);
    if (index !== -1 && index !== undefined) {
      contacts.splice(index, 1);
      if (data) {
        contacts.unshift(data);
      }
    } else {
      contacts.unshift(fromData);
    }
    set({directMessagesContacts: contacts});
  },
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
}));
