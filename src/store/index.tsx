import {io} from 'socket.io-client';
import {create, StateCreator} from 'zustand';
import {HOST} from '../api/apis';
import {
  Call,
  Contact,
  Conversation,
  Message,
  NavigationProps,
} from '../utils/types';
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

  // sortConversations: (message: Message) => void;
  sortConversations: () => void;
};

type CallState = 'idle' | 'outgoing' | 'incoming' | 'active';

type WebRTCSlice = {
  calls: Call[];
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  candidates: RTCIceCandidate[];
  callState: CallState;
  callType: 'video' | 'audio' | null;
  caller: Contact | null;
  callTimer: number;

  isMuted: boolean;
  isVideoEnabled: boolean;
  isFrontCamera: boolean;
  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;

  updateWebRTCState: (
    data: Partial<Omit<WebRTCSlice, 'updateWebRTCState'>>,
  ) => void;

  resetCallState: () => void;
  updateCalls: (updateFunction: (currentCalls: Call[]) => Call[]) => void;

  updateCandidates: (
    updateFunction: (currentCandidates: RTCIceCandidate[]) => RTCIceCandidate[],
  ) => void;

  sortCalls: () => void;
};

const webRTCSlice: StateCreator<WebRTCSlice> = (set, get) => ({
  // Initial state
  calls: [],
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  candidates: [],
  callState: 'idle',
  callType: null,
  caller: null,
  callTimer: 0,

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
      candidates: [],
      callState: 'idle',
      callType: null,
      caller: null,
      offer: null,
      answer: null,
    }),

  updateCalls: (updateFunction: (currentCalls: Call[]) => Call[]) => {
    const currentCalls = get().calls;
    const updatedCalls = updateFunction(currentCalls);
    set({calls: updatedCalls});
  },

  updateCandidates: (
    updateFunction: (currentCandidates: RTCIceCandidate[]) => RTCIceCandidate[],
  ) => {
    const currentCandidates = get().candidates;
    const updatedCandidates = updateFunction(currentCandidates);
    set({candidates: updatedCandidates});
  },

  sortCalls: () => {
    const {calls} = get();

    const sortedCalls = calls.sort((a, b) => {
      const dateA = +Date.parse(a?.startTime ?? '');
      const dateB = +Date.parse(b?.startTime ?? '');

      // return dateA - dateB;
      return dateB - dateA;
    });

    set({calls: sortedCalls});
  },
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

    if (!id) {
      return null;
    }

    let socketInstance = get().socket;

    if (socketInstance && socketInstance.connected) {
      console.log('Socket already connected, skipping initialization.');
      return socketInstance;
    }
    //  else {
    console.log('Initializing new socket connection...');
    socketInstance = io(HOST, {
      query: {userId: id},
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 3000,
      transports: ['websocket'],
      forceNew: true,
      timeout: 20000,
      autoConnect: true,
    });

    set({socket: socketInstance});
    // }

    socketInstance.on('connect', () => {
      console.log('Connected to socket server.');
    });

    socketInstance.on('disconnect', (reason: string) => {
      console.warn(`Socket disconnected: ${reason}`);
    });

    socketInstance.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    return socketInstance;
  },

  disconnectSocket: () => {
    const {socket} = get();
    if (socket) {
      console.log('Disconnecting and removing listeners...');

      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('connect_error');
      socket?.disconnect();
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
