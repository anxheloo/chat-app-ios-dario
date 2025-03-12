import moment from 'moment';
import {Alert, Linking} from 'react-native';

import {useAppStore} from '../store';

import {Message} from './types';

import {request, check, RESULTS} from 'react-native-permissions';

import {removeToken} from './TokenStorage';

import {navigate, reset} from '../navigation/navigationRef';
import {permission} from './permissions';

// ====================================================================
// Helper functions related to MESSAGES
// ====================================================================

// Check if a message is image
export const checkIfImage = (fileUrl: string): boolean => {
  return (
    fileUrl.endsWith('.jpg') ||
    fileUrl.endsWith('.jpeg') ||
    fileUrl.endsWith('.png')
  );
};

// Check if a message is video
export const checkIfVideo = (fileUrl: string): boolean => {
  return (
    fileUrl.endsWith('.mp4') ||
    fileUrl.endsWith('.mov') ||
    fileUrl.endsWith('.avi')
  );
};

// Show the general date in chat for messages, like today, yesterday and so on
export const preprocessMessages = (messages: Message[]) => {
  let lastMessageDate: any = null;
  return messages.map(message => {
    const currentMessageDate = moment(message.createdAt).format('YYYY-MM-DD');
    const showDate = currentMessageDate !== lastMessageDate;
    lastMessageDate = currentMessageDate;
    return {...message, showDate};
  });
};

// Format the duration number of a message
export const formatDuration = (durationValue: number) => {
  if (durationValue) {
    let duration: any = Math.floor(durationValue ?? 0);
    let m: string | number = Math.floor(duration / 60);
    m = m >= 10 ? m : '0' + m;
    duration = Math.floor(duration % 60);
    duration = duration >= 10 ? duration : '0' + duration;
    return m + ':' + duration;
  }
};

export const timeCalendarFormat = (time: string) => {
  return moment(time).calendar(null, {
    sameDay: moment(time).format('HH:mm'),
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MMM Do, YYYY',
  });
};

// ====================================================================
// Helper functions related to PERMISSIONS
// ====================================================================

// Handle blocked permission
const handleBlockedPermission = () => {
  Alert.alert(
    'Permission Blocked',
    'You have blocked this permission. Please go to settings and enable it to use this feature.',
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Go to settings',
        onPress: () => {
          Linking.openSettings();
        },
      },
    ],
    {cancelable: false},
  );
};

//  Handle Check Permissions
export const checkPermissionStatus = async (permissionType: any) => {
  try {
    const status = await check(permissionType);

    if (status === RESULTS.GRANTED) {
      return true;
    } else {
      const newStatus = await request(permissionType);

      if (newStatus === RESULTS.GRANTED) {
        return true;
      } else {
        handleBlockedPermission();
        return false;
      }
    }
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// ====================================================================
// Helper function related to LOGOUT
// ====================================================================

export const logout = async () => {
  const {
    updateFuncChat,
    setUserInfoStatus,
    setToken,
    setUserPersona,
    updateCalls,
    setCallsPagination,
    disconnectSocket,
  } = useAppStore.getState();

  await removeToken();
  disconnectSocket();

  setToken(null);

  setUserPersona({
    username: '',
    pin: '',
    avatar: 0,
    id: '',
  });

  setUserInfoStatus(false);

  updateFuncChat({
    conversations: [],
    friends: [],
    conversationPagination: {page: 0, hasMore: true, isLoading: false},
    friendsPagination: {page: 0, hasMore: true, isLoading: false},
  });

  updateCalls(() => []);
  setCallsPagination({
    page: 0,
    hasMore: true,
    isLoading: false,
  });

  reset('Login');
};

// ====================================================================
// Helper functions related to SCANNER SCREEN
// ====================================================================

// Navigate to Scanner Screen
export const openScanner = async () => {
  const status = await checkPermissionStatus(permission.camera);
  if (status) {
    navigate('Scanner');
  }
};
