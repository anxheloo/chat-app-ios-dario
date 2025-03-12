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

type CallState = 'missed' | 'pending' | 'incoming' | 'active' | 'ended';

type WebRTCSlice = {
  calls: Call[];
  callsPagination: {page: number; hasMore: boolean; isLoading: boolean};
  setCallsPagination: (
    pagination: Partial<{page: number; hasMore: boolean; isLoading: boolean}>,
  ) => void;
  // currentCallId: string | null;
  currentCall: Call | null;
  localStream: MediaStream | null;
  localStream2: MediaStream | null;
  remoteStream: MediaStream | null;
  // peerConnection: RTCPeerConnection | null;
  peerConnection: any;
  candidates: any[];
  callState: CallState | null;
  callType: 'video' | 'audio' | null;
  caller: Contact | null;
  callTimer: number;

  isMuted: boolean;
  isVideoEnabled: boolean;
  isFrontCamera: boolean;
  offer: any;
  answer: any;

  // updateWebRTCState: (
  //   data: Partial<Omit<WebRTCSlice, 'updateWebRTCState'>>,
  // ) => void;

  updateWebRTCState: (data: Partial<WebRTCSlice>) => void;

  resetCallState: () => void;

  updateCalls: (updateFunction: (currentCalls: Call[]) => Call[]) => void;
  // updateCalls: (newData: Call) => void;

  updateCandidates: (
    updateFunction: (currentCandidates: any[]) => any[],
  ) => void;

  // sortCalls: () => void;
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
  localStream2: null,
  remoteStream: null,
  peerConnection: null,
  candidates: [],
  callState: null,
  callType: null,
  caller: null,
  callTimer: 0,

  isMuted: false,
  isVideoEnabled: true,
  isFrontCamera: true,
  offer: null,
  answer: null,
  // Update function
  // updateWebRTCState: data =>
  //   set(state => ({
  //     ...state,
  //     ...data,
  //   })),
  updateWebRTCState: set,

  resetCallState: () =>
    set({
      // currentCallId: null,
      currentCall: null,
      localStream: null,
      localStream2: null,
      remoteStream: null,
      peerConnection: null,
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

  // sortCalls: () => {
  //   const {calls} = get();

  //   const sortedCalls = calls.sort((a, b) => {
  //     const dateA = +Date.parse(a?.createdAt ?? '');
  //     const dateB = +Date.parse(b?.createdAt ?? '');

  //     // return dateA - dateB;
  //     return dateB - dateA;
  //   });

  //   set({calls: sortedCalls});
  // },
});

type CreateSlice = PersonaSlice &
  TokenSlice &
  StatusSlice &
  ChatSlice &
  SocketSlice &
  WebRTCSlice;

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

type StatusSlice = {
  loading: boolean;
  message: string | null;
  isUploading: boolean;
  fileUploadProgress: number;
  updateKeys: (data: Partial<StatusSlice>) => void;

  bottomSheetType: string | null;
  navigation: NavigationProps | null;
};
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
  ...createPersonaSlice(...args),
  ...createStatusSlice(...args),
  ...chatSlice(...args),
  ...socketSlice(...args),
  ...createTokenSlice(...args),
  // ...callSlice(...args),
  ...webRTCSlice(...args),
}));
