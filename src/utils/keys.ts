// import {RSA} from 'react-native-rsa-native';
import * as Keychain from 'react-native-keychain';
import {useAppStore} from '../store';

// export const generateRSAKeyPair = async () => {
//   const keys = await RSA.generateKeys(2048);
//   return keys;
// };

export const storeGeneratedPrivateKey = async (
  privateKey: string,
  userId: string,
) => {
  await Keychain.setGenericPassword('private-key', privateKey, {
    service: `private-key-${userId}`,
  });
};

export const getPrivateKey = async () => {
  const {id: userId} = useAppStore.getState();

  const credentials = await Keychain.getGenericPassword({
    service: `private-key-${userId}`,
  });
  if (credentials) {
    return credentials.password;
  } else {
    console.log('No credentials stored');
  }
};

// export const encryptMessage = async (message: string, publicKey: string) => {
//   await RSA.encrypt(message, publicKey);
// };

// export const decyptMessage = async (message: string, privateKey: string) => {
//   await RSA.decrypt(message, privateKey);
// };
