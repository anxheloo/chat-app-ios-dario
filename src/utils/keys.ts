import {RSA} from 'react-native-rsa-native';

export const generateRSAKeyPair = async () => {
  const keys = await RSA.generateKeys(4096);
  // keys = { public: string, private: string }
  return keys;
};

//   generateRSAKeyPair().then(keys => {
//     const {public: publicKey, private: privateKey} = keys;
//     console.log('These are the keys:', privateKey, publicKey);
//   });

//  1. Store the Private Key on Device (Securely)
// export const savePrivateKey = async (privateKey: string) => {
//   await Keychain.setGenericPassword('user', privateKey, {
//     service: 'secure-private-key',
//   });
// };

// export const loadPrivateKey = async (): Promise<string | null> => {
//   const result = await Keychain.getGenericPassword({
//     service: 'secure-private-key',
//   });
//   return result ? result.password : null;
// };

//  3. Encrypt a Message
// const encryptedForRecipient = await RSA.encrypt(
//   'hello world',
//   recipientPublicKey,
// );

// const encryptedForSelf = await RSA.encrypt('hello world', yourPublicKey);

//  4. Decrypt a Message
// const privateKey = await loadPrivateKey();
// const decrypted = await RSA.decrypt(encryptedMessage, privateKey);
