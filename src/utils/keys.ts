// // import {RSA} from 'react-native-rsa-native';
// import * as Keychain from 'react-native-keychain';
// import {useAppStore} from '../store';

// export const storeGeneratedPrivateKey = async (
//   privateKey: string,
//   userId: string,
// ) => {
//   await Keychain.setGenericPassword('private-key', privateKey, {
//     accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
//     service: `private-key-${userId}`,
//   });
// };

// export const getPrivateKey = async () => {
//   const {id: userId} = useAppStore.getState();

//   const credentials = await Keychain.getGenericPassword({
//     service: `private-key-${userId}`,
//   });
//   if (credentials) {
//     return credentials.password;
//   } else {
//     console.log('No credentials stored');
//   }
// };
