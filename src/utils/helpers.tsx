import moment from 'moment';
import {Alert, Linking} from 'react-native';

import {useAppStore} from '../store';

import {Contact, Message} from '../types/types';

import {request, check, RESULTS} from 'react-native-permissions';

import {goBack, navigate, replace} from '../navigation/navigationRef';
import {permission} from './permissions';
import {apiClient} from '../api/apiClient';
import {ADD_FRIEND} from '../api/apis';

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

// Check if a message is audio
export const checkIfVoice = (fileUrl: string): boolean => {
  return (
    fileUrl.endsWith('.m4a') ||
    fileUrl.endsWith('.mp3') ||
    fileUrl.endsWith('.wav')
  );
};

// Show the general date in chat for messages, like today, yesterday and so on
export const preprocessMessages = (messages: Message[]) => {
  let day: any = null;
  return messages.map(message => {
    const currentMessageDate = moment(message.createdAt).format('YYYY-MM-DD');
    const showDate = currentMessageDate !== day;
    day = currentMessageDate;
    return {...message, showDate};
  });
};

// Format the duration number of a message | THis takes seconds as input
export const formatDuration = (durationValue: number) => {
  if (durationValue) {
    let duration: any = Math.floor(durationValue ?? 0);
    // get minutes
    let m: string | number = Math.floor(duration / 60);
    m = m >= 10 ? m : '0' + m;
    // get remaining seconds
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
  const {updateKeys} = useAppStore.getState();

  updateKeys({askingPermission: true});

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

export const deleteAccount = async () => {
  const {
    // updateFuncChat,
    // setIsUserInfoFetched,
    // setUserPersona,
    // updateCalls,
    // setCallsPagination,
    // disconnectSocket,
    updateKeys,
  } = useAppStore.getState();

  updateKeys({loading: true});

  try {
    // const response = await apiClient.post(LOGOUT_ROUTE);

    // if (response.status === 200) {
    //   console.log('Logout success');
    //   // remove token , disconnect socket
    //   await removeToken();
    //   disconnectSocket();

    //   // reset user persona for logout/login app state
    //   setUserPersona({
    //     username: '',
    //     pin: '',
    //     avatar: 0,
    //     id: '',
    //   });

    //   // user info needes to be fetched again by the new user if app state stays active during logout/login
    //   setIsUserInfoFetched(false);

    //   // conversations, friends, paginations
    //   updateFuncChat({
    //     conversations: [],
    //     friends: [],
    //     conversationPagination: {page: 0, hasMore: true, isLoading: false},
    //     friendsPagination: {page: 0, hasMore: true, isLoading: false},
    //   });

    //   // calls
    //   updateCalls(() => []);
    //   setCallsPagination({
    //     page: 0,
    //     hasMore: true,
    //     isLoading: false,
    //   });

    //   reset('Login');
    // }

    console.log('Ready to delete');
  } catch (error) {
    console.error('Error logout:', error);
    Alert.alert('Error', 'Failed to logout');
  } finally {
    updateKeys({loading: false});
  }
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

// Add Friend
export const addFriend = async (scannedUser: Contact | null) => {
  const {socket, id, updateFriends} = useAppStore.getState();

  try {
    const res = await apiClient.post(ADD_FRIEND, {
      recipientId: scannedUser?._id,
    });

    if (res.status === 200 && scannedUser) {
      updateFriends(current => [scannedUser, ...current]);

      await socket?.emit('addFriend', {
        recipientId: scannedUser?._id,
        senderId: id,
      });
      replace('BottomTabNavigation', {
        screen: 'Messages',
      });
      Alert.alert('Success', 'Friend successfully added!');
    } else {
      Alert.alert('Something went wrong, please try again!');
      goBack();
    }
  } catch (error: any) {
    Alert.alert('Error', error.response.data.message);
  }
};
