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

import {MediaStream} from 'react-native-webrtc';

type ScrollSlice = {
  scrollControl: boolean;
  updateScrollControl: (scrollControl: boolean) => void;
};

const scrollSlice: StateCreator<ScrollSlice> = set => ({
  scrollControl: false,
  updateScrollControl: (scrollControl: boolean) => set({scrollControl}),
});

type CallState = 'pending' | 'incoming' | 'active' | 'busy';

type WebRTCSlice = {
  calls: Call[];
  callsPagination: {page: number; hasMore: boolean; isLoading: boolean};
  setCallsPagination: (
    pagination: Partial<{page: number; hasMore: boolean; isLoading: boolean}>,
  ) => void;

  currentCall: Call | null;
  localStream: MediaStream | null;
  switchVideoSources: boolean;
  remoteStream: MediaStream | null;
  peerConnection: any;
  candidates: any[];
  callState: CallState | null;
  callType: 'video' | 'audio' | null;
  caller: Contact | null;
  callTimer: number;
  disabledButtons: boolean;

  cameraSwitched: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isRemoteVideoEnabled: boolean;
  isFrontCamera: boolean;
  offer: any;
  answer: any;

  updateWebRTCState: (data: Partial<WebRTCSlice>) => void;

  resetCallState: () => void;

  updateCalls: (updateFunction: (currentCalls: Call[]) => Call[]) => void;

  updateCandidates: (
    updateFunction: (currentCandidates: any[]) => any[],
  ) => void;
};

const webRTCSlice: StateCreator<WebRTCSlice> = (set, get) => ({
  // Initial state
  calls: [],
  callsPagination: {page: 0, hasMore: true, isLoading: false},
  setCallsPagination: pagination =>
    set(state => ({
      callsPagination: {...state.callsPagination, ...pagination},
    })),
  currentCall: null,
  localStream: null,
  switchVideoSources: false,
  remoteStream: null,
  peerConnection: null,
  candidates: [],
  callState: null,
  callType: null,
  caller: null,
  callTimer: 0,
  disabledButtons: false,

  cameraSwitched: false,
  isMuted: false,
  isVideoEnabled: false,
  isRemoteVideoEnabled: false,
  isFrontCamera: true,
  offer: null,
  answer: null,
  updateWebRTCState: set,

  resetCallState: () =>
    set({
      currentCall: null,
      localStream: null,
      remoteStream: null,
      peerConnection: null,
      isVideoEnabled: false,
      isRemoteVideoEnabled: false,
      switchVideoSources: false,
      disabledButtons: false,
      candidates: [],
      callState: null,
      callType: null,
      caller: null,
      offer: null,
      answer: null,
    }),

  updateCalls: (updateFunction: (currentCalls: Call[]) => Call[]) => {
    const currentCalls = get().calls;
    const updatedCalls = updateFunction(currentCalls);
    set({calls: updatedCalls});
    // set({calls: updatedCalls.filter(Boolean)}); => to filter null values
  },

  // updateCalls: (newData: Call) =>
  //   set(state => ({
  //     calls: [...state.calls, newData],
  //   })),

  updateCandidates: (updateFunction: (currentCandidates: any[]) => any[]) => {
    const currentCandidates = get().candidates;
    const updatedCandidates = updateFunction(currentCandidates);
    // set({candidates: updatedCandidates});
    set({candidates: updatedCandidates.filter(Boolean)});
  },
});

type CreateSlice = PersonaSlice &
  ScrollSlice &
  TokenSlice &
  StatusSlice &
  ChatSlice &
  MicSlice &
  SocketSlice &
  WebRTCSlice;

type PersonaSlice = {
  username: string;
  avatar: number;
  pin: string;
  id: string;
  disappearingMessages: {text: string; value: number | null};
  publicKey: string | null;
  privateKey: string | null;
  isUserInfoFetched: boolean;
  setIsUserInfoFetched: (status: boolean) => void;
  setUserPersona: (data: Partial<PersonaSlice>) => void;
};

const createPersonaSlice: StateCreator<PersonaSlice> = set => ({
  username: '',
  avatar: 0,
  pin: '',
  id: '',
  publicKey: null,
  privateKey: null,
  disappearingMessages: {text: 'None', value: null},
  isUserInfoFetched: false,
  setIsUserInfoFetched: (status: boolean) => set({isUserInfoFetched: status}),
  setUserPersona: set,
});

type TokenSlice = {
  token: string | null;
  setToken: (token: string | null) => void;
};
const createTokenSlice: StateCreator<TokenSlice> = set => ({
  token: null,
  setToken: (token: string | null) => set({token}),
});

type ChatSlice = {
  selectedChatData: Contact | null;
  conversations: Conversation[];
  conversationPagination: {page: number; hasMore: boolean; isLoading: boolean};
  setConversationPagination: (
    pagination: Partial<{page: number; hasMore: boolean; isLoading: boolean}>,
  ) => void;
  friends: Contact[];
  friendsPagination: {page: number; hasMore: boolean; isLoading: boolean};
  setFriendsPagination: (
    pagination: Partial<{page: number; hasMore: boolean; isLoading: boolean}>,
  ) => void;
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
const chatSlice: StateCreator<ChatSlice> = (set, get) => ({
  selectedChatData: null,
  selectedChatMessages: [],
  conversations: [],
  conversationPagination: {page: 0, hasMore: true, isLoading: false},
  setConversationPagination: pagination =>
    set(state => ({
      conversationPagination: {...state.conversationPagination, ...pagination},
    })),
  updateConversations: (
    updateFunction: (currentConversations: Conversation[]) => Conversation[],
  ) => {
    const currentConversations = get().conversations;
    const updatedConversations = updateFunction(currentConversations);
    set({conversations: updatedConversations});
  },
  friends: [],
  friendsPagination: {page: 0, hasMore: true, isLoading: false},
  setFriendsPagination: pagination =>
    set(state => ({
      friendsPagination: {...state.friendsPagination, ...pagination},
    })),
  selectedMessageToDelete: null,
  updateFuncChat: set,

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

type MicSlice = {
  playingAudioId: string | null;
  isPlaying: boolean;
  isRecording: boolean;
  recordSecs: number;
  waveMetering: number[] | null;

  updateMicSlice: (data: Partial<MicSlice>) => void;
  updateMetering: (newData: number) => void;
};

const micSlice: StateCreator<MicSlice> = set => ({
  playingAudioId: null,
  isPlaying: false,
  isRecording: false,
  recordSecs: 0,
  waveMetering: null,

  updateMicSlice: set,

  updateMetering: newData =>
    set(state => ({
      waveMetering: [...(state.waveMetering || []), newData],
    })),
});

type StatusSlice = {
  loading: boolean;
  message: string | null;
  isUploading: boolean;
  fileUploadProgress: number;
  pinModal: boolean;

  bottomSheetType: string | null;
  navigation: NavigationProps | null;

  askingPermission: boolean;
  updateKeys: (data: Partial<StatusSlice>) => void;
};
// Status Slice
const createStatusSlice: StateCreator<StatusSlice> = set => ({
  loading: false,
  message: null,
  isUploading: false,
  fileUploadProgress: 0,
  bottomSheetType: null,
  pinModal: false,
  navigation: null,

  askingPermission: false,
  updateKeys: set,
});

type SocketSlice = {
  socket: any | null;
  initializeSocket: () => any | null;
  disconnectSocket: () => void;
};
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
    console.log('Initializing new socket connection...');
    socketInstance = io(HOST, {
      query: {userId: id},
      reconnection: true,
      reconnectionAttempts: Infinity,
      transports: ['websocket'],
      autoConnect: true,
    });

    set({socket: socketInstance});

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
  ...scrollSlice(...args),
  ...createPersonaSlice(...args),
  ...createStatusSlice(...args),
  ...chatSlice(...args),
  ...micSlice(...args),
  ...socketSlice(...args),
  ...createTokenSlice(...args),
  ...webRTCSlice(...args),
}));
