import {Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';

export const permission = {
  // Camera ( for taking pictures, recording videos, scan qr code)
  camera:
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,

  // Microphone ( for voice messages and calls)
  microphone:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO,

  // Photo & Video Library, Selecting media from library (Handles Android < 30 & API ≥ 30)
  photoLibrary:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : +Platform.Version < 30
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE // For API < 30
      : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, // For API 30+

  // Video Library (Handles Android < 30 & API ≥ 30)
  videoLibrary:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : +Platform.Version < 30
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE // API < 30
      : PERMISSIONS.ANDROID.READ_MEDIA_VIDEO, // API 30+

  // Audio Library (For Voice Messages & Recordings)
  audioLibrary:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY // iOS uses Photo Library permission for audio
      : +Platform.Version < 30
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE // API < 30
      : PERMISSIONS.ANDROID.READ_MEDIA_AUDIO, // API 30+

  // 📞 Call Permissions (For handling voice & video calls)
  callPermissions: [
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO,
  ],
};
