// import React, {useCallback} from 'react';
// import {Alert, Platform, StyleSheet, View} from 'react-native';
// import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

// const usePermission = () => {
//   const requestCameraPermission = useCallback(async (): Promise<boolean> => {
//     try {
//       const permission =
//         Platform.OS === 'android'
//           ? PERMISSIONS.ANDROID.CAMERA
//           : PERMISSIONS.IOS.CAMERA;

//       const result = await request(permission);

//       if (result === RESULTS.GRANTED) {
//         console.log('Camera permission granted');
//         return true;
//       } else if (result === RESULTS.DENIED) {
//         Alert.alert(
//           'Permission Denied',
//           'Camera access is required to scan QR codes.',
//         );
//       } else if (result === RESULTS.BLOCKED) {
//         Alert.alert(
//           'Permission Blocked',
//           'Please enable camera access from settings.',
//         );
//       }
//       return false;
//     } catch (error) {
//       console.error('Error requesting camera permission:', error);
//       Alert.alert('Permission Error', 'Error requesting camera permission');
//       return false;
//     }
//   }, []);

//   return {
//     requestCameraPermission,
//   };
// };

// export default usePermission;

import {Alert, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

export const usePermission = () => {
  const requestCameraPermission = async (): Promise<boolean> => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true; // Permission granted
    } else if (status === RESULTS.DENIED || Platform.OS === 'android') {
      const newStatus = await request(permission);
      return newStatus === RESULTS.GRANTED;
    } else if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Please enable camera access in settings.',
        [
          {text: 'Go to Settings', onPress: () => openSettings()},
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    }

    return false; // Permission not granted
  };

  const requestPhotoLibraryPermission = async (): Promise<boolean> => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.IOS.PHOTO_LIBRARY;

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      return true;
    } else if (status === RESULTS.LIMITED) {
      return true;
    } else if (status === RESULTS.DENIED || Platform.OS === 'android') {
      const newStatus = await request(permission);
      return newStatus === RESULTS.GRANTED;
    } else if (status === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Please enable photo library access in settings.',
        [
          {text: 'Go to Settings', onPress: () => openSettings()},
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    }

    return false;
  };

  return {requestCameraPermission, requestPhotoLibraryPermission};
};
