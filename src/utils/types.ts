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
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export type Message = {
  _id: string;
  // sender: Contact;
  // recipient: Contact;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  messageType: string;
  fileUrl: string;
};

export const MessageFromServer = {};

export type Contact = {
  _id: string;
  username: string;
  avatar: number;
  lastMessageTime: string;
  lastMessageContent?: string | undefined;
  lastMessageType: 'text' | 'file';
  lastMessageFileUrl?: string | undefined;
};
