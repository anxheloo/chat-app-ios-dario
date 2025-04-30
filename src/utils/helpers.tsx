import moment from 'moment';
import {Alert, Linking} from 'react-native';

import {useAppStore} from '../store';

import {Message} from '../types/types';

import {request, check, RESULTS} from 'react-native-permissions';

import {navigate} from '../navigation/navigationRef';
import {permission} from './permissions';

import ReactNativeBlobUtil from 'react-native-blob-util';

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

// Navigate to Scanner Screen
export const openScanner = async () => {
  const status = await checkPermissionStatus(permission.camera);
  if (status) {
    navigate('Scanner');
  }
};

// Clean up resources
export const cleanupResources = async (filePath: string): Promise<void> => {
  try {
    await ReactNativeBlobUtil.fs.unlink(filePath);
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
};
