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
  sender: Contact;
  recipient: Contact;
  content: string;
  timestamp: string;
  messageType: string;
  fileUrl: string;
};

export type Contact = {
  _id: string;
  username: string;
  avatar: number;
};
