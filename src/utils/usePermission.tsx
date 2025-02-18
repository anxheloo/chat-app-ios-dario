import {Alert, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export const usePermission = () => {
  // Request Camera Permission (For Video Calls & Taking Pictures)
  const requestCameraPermission = async (): Promise<boolean> => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    return checkAndRequestPermission(
      permission,
      'Camera access is required for video calls.',
    );
  };

  // Request Microphone Permission (For Voice & Video Calls)
  const requestMicrophonePermission = async (): Promise<boolean> => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;
    return checkAndRequestPermission(
      permission,
      'Microphone access is required for voice calls.',
    );
  };

  // Request Photo & Video Library Permission (For Sending Media)
  const requestPhotoLibraryPermission = async (): Promise<boolean> => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.IOS.PHOTO_LIBRARY;
    return checkAndRequestPermission(
      permission,
      'Photo library access is required to send media.',
    );
  };

  // Generic Permission Handling Function
  const checkAndRequestPermission = async (
    permission: any,
    message: string,
  ): Promise<boolean> => {
    const status = await check(permission);
    if (status === RESULTS.GRANTED) {
      return true;
    }

    if (status === RESULTS.DENIED) {
      const newStatus = await request(permission);
      return newStatus === RESULTS.GRANTED;
    } else if (status === RESULTS.BLOCKED) {
      Alert.alert('Permission Blocked', message, [
        {text: 'Go to Settings', onPress: () => openSettings()},
        {text: 'Cancel', style: 'cancel'},
      ]);
    }
    return false;
  };

  return {
    requestCameraPermission,
    requestMicrophonePermission,
    requestPhotoLibraryPermission,
  };
};

// AVOID THIS - WE ARE USING THE FUNCTION INSIDE UTILS;
