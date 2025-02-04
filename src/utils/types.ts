import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Messages: undefined;
  Calls: undefined;
  Contacts: undefined;
  Login: undefined;
  // BottomTabNavigation: undefined;
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
  messageType: 'text' | 'file';
  fileUrl?: string | null;
  createdAt: string;
};

export type Message = {
  _id: string;
  conversationId: string;
  sender: string;
  recipient: string;
  content?: string;
  timestamp: string;
  createdAt: string;
  expiresAt: string;
  messageType: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  uploading: boolean;
  duration?: number | null;
  showDate?: boolean;
};

export type Contact = {
  conversationId?: string;
  _id: string;
  username: string;
  avatar: number;
};

export type Conversation = {
  _id: string;
  participants: Contact[];
  lastMessageTime?: string | null;
  lastMessage?: LastMessage;
  lastMessageType?: 'text' | 'file' | null;
  lastMessageFileUrl?: string | null;
};

export type SettingType = 'username' | 'qr-code' | 'pin' | 'clock' | 'logout';
