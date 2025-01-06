import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Profile: undefined;
  Messages: undefined;
  Calls: undefined;
  Contacts: undefined;
  Login: undefined;
  BottomTabNavigation: undefined;
  CreatePersona: undefined;
  CreatePin: undefined;
  Scanner: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export const MessageFromServer = {};

// export type Contact = {
//   _id: string;
//   username: string;
//   avatar: number;
//   lastMessageTime?: string;
//   lastMessageContent?: string | undefined;
//   lastMessageType?: 'text' | 'file';
//   lastMessageFileUrl?: string | undefined;
//   // participants?: Contact[];
// };

export type LastMessage = {
  _id: string;
  content: string | null;
  messageType: 'text' | 'file';
  fileUrl?: string | null;
  createdAt: string;
};

export type Message = {
  _id: string;
  // sender: Contact;
  // recipient: Contact;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  createdAt: string;
  expiresAt: string;
  messageType: string;
  fileUrl: string;
};

export type Contact = {
  _id: string;
  username: string;
  avatar: number;
};

export type Conversation = {
  _id: string;
  participants: Contact[];
  lastMessageTime?: string | null;
  // lastMessage?: string | null;
  lastMessage?: LastMessage;
  lastMessageType?: 'text' | 'file' | null;
  lastMessageFileUrl?: string | null;
};
