import {io} from 'socket.io-client';
import {create, StateCreator} from 'zustand';
import {HOST} from '../api/apis';
import {Contact, Conversation, Message, NavigationProps} from '../utils/types';
import {MediaStream, RTCPeerConnection} from 'react-native-webrtc';
import {RTCSessionDescriptionInit} from 'react-native-webrtc/lib/typescript/RTCSessionDescription';

type PersonaSlice = {
  username: string;
  avatar: number;
  pin: string;
  id: string;
  disappearingMessages: string;
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

type CallState = 'idle' | 'outgoing' | 'incoming' | 'active';

type WebRTCSlice = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  callState: CallState;
  callType: 'video' | 'audio' | null;
  caller: Contact | null;
  updateWebRTCState: (
    data: Partial<Omit<WebRTCSlice, 'updateWebRTCState'>>,
  ) => void;

  resetCallState: () => void;

  isMuted: boolean;
  isVideoEnabled: boolean;
  isFrontCamera: boolean;
  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;
};

const webRTCSlice: StateCreator<WebRTCSlice> = set => ({
  // Initial state
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  callState: 'idle',
  callType: null,
  caller: null,

  isMuted: false,
  isVideoEnabled: true,
  isFrontCamera: true,
  offer: null,
  answer: null,
  // Update function
  updateWebRTCState: data =>
    set(state => ({
      ...state,
      ...data,
    })),

  resetCallState: () =>
    set({
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      callState: 'idle',
      callType: null,
      caller: null,
      offer: null,
      answer: null,
    }),
});

type SocketSlice = {
  socket: any | null;
  initializeSocket: () => any | null;
  disconnectSocket: () => void;
};

type CreateSlice = PersonaSlice &
  TokenSlice &
  StatusSlice &
  ChatSlice &
  SocketSlice &
  WebRTCSlice;

const createPersonaSlice: StateCreator<PersonaSlice> = set => ({
  username: '',
  avatar: 0,
  pin: '',
  id: '',
  disappearingMessages: 'None',
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

    const sortedContacts = conversations.sort((a, b) => {
      const dateA = +Date.parse(a?.lastMessage?.createdAt ?? '');
      const dateB = +Date.parse(b?.lastMessage?.createdAt ?? '');

      // return dateA - dateB;
      return dateB - dateA;
    });

    set({conversations: sortedContacts});
  },
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
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      set({socket: socketInstance});

      socketInstance.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketInstance.on('connect_error', error => {
        console.error('Socket connection error:', error);
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
  ...createPersonaSlice(...args),
  ...createStatusSlice(...args),
  ...chatSlice(...args),
  ...socketSlice(...args),
  ...createTokenSlice(...args),
  // ...callSlice(...args),
  ...webRTCSlice(...args),
}));
