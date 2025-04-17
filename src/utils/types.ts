import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  MediaStream,
  MediaStreamTrack,
  RTCIceCandidate,
} from 'react-native-webrtc';

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Messages: undefined;
  Calls: undefined;
  OutgoingCallScreen: undefined;
  IncomingCallScreen: undefined;
  JoinCallScreen: undefined;
  JoinScreen: undefined;
  Contacts: undefined;
  Login: undefined;
  BottomTabNavigation: {
    screen?: 'Messages' | 'Calls' | 'Contacts' | 'Profile';
    params?: undefined;
  };
  CreatePersona: undefined;
  CreatePin: undefined;
  Scanner: undefined;
  ScannedUser: {recipientId: string};
  FullScreenMedia: {fileUrl: string; type: string};
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const MessageFromServer = {};

export type LastMessage = {
  _id: string;
  content: string | null;
  messageType: string;
  fileUrl?: string | null;
  createdAt: string;
};

export type Message = {
  _id: string;
  conversationId: string;
  sender: string;
  recipient: string;
  content?: string;
  iv?: string;
  createdAt: string;
  expiresAt: number | null;
  messageType: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
  uploading: boolean;
  downloading?: boolean;
  isLocalUri?: boolean;
  duration?: number;
  showDate?: boolean;
  waveMetering?: number[] | null;
  seen?: boolean;
};

export type Contact = {
  conversationId?: string;
  _id: string;
  username: string;
  avatar: number;
  publicKey: string;
};

export type Conversation = {
  _id: string;
  participants: Contact[];
  lastMessageTime?: string | null;
  lastMessage?: LastMessage;
  lastMessageType?: string;
  lastMessageFileUrl?: string | null;
  recipientUnread: number;
  senderUnread?: number;
  lastSender: string;
};

export type Call = {
  _id: string;
  participants: Contact[];
  callType: 'audio' | 'video';
  callStatus: 'missed' | 'answered' | 'pending' | 'ended';
  createdAt: string;
};

export type SettingType = 'username' | 'qr-code' | 'pin' | 'clock' | 'logout';

declare module 'react-native-webrtc' {
  interface RTCPeerConnection {
    ontrack: (event: RTCTrackEvent) => void;
    onicecandidate:
      | ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any)
      | null;
    addIceCandidate(candidate: RTCIceCandidate): Promise<void>;
  }

  interface RTCTrackEvent {
    streams: MediaStream[];
    track: MediaStreamTrack;
  }

  interface RTCPeerConnectionIceEvent {
    candidate: RTCIceCandidate | null;
  }
}
