import {x25519} from '@noble/curves/ed25519';
import {sha256} from '@noble/hashes/sha256';
import {randomBytes} from '@noble/hashes/utils';
import CryptoJS from 'crypto-js';
import {Buffer} from 'buffer';
import {useAppStore} from '../store';
// import {getPrivateKey} from './keys';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {HOST} from '../api/apis';
import * as Keychain from 'react-native-keychain';

export const encryptMessage = async (
  plaintext: string,
): Promise<{encrypted: string; iv: string}> => {
  const {privateKey, selectedChatData} = useAppStore.getState();

  try {
    // 1️⃣ Load sender private key from Keychain
    // const senderBase64Pk = privateKey ?? (await getPrivateKey());
    const senderBase64Pk = privateKey;

    if (!senderBase64Pk) {
      throw new Error('Private key not found');
    }

    const senderPrivateKey = Uint8Array.from(
      Buffer.from(senderBase64Pk, 'base64'),
    );

    // 2️⃣ Convert recipient public key
    const recipientPublicKey = Uint8Array.from(
      Buffer.from(selectedChatData?.publicKey!, 'base64'),
    );

    // 3️⃣ Derive shared secret and hash to AES key
    const sharedSecret = x25519.getSharedSecret(
      senderPrivateKey,
      recipientPublicKey,
    );
    const aesKey = CryptoJS.enc.Hex.parse(
      Buffer.from(sha256(sharedSecret)).toString('hex'),
    );

    // 4️⃣ Generate IV and encrypt message
    const ivBytes = randomBytes(16);
    const iv = CryptoJS.lib.WordArray.create(ivBytes as any);

    const encrypted = CryptoJS.AES.encrypt(plaintext, aesKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      encrypted: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      iv: CryptoJS.enc.Base64.stringify(iv),
    };
  } catch (err) {
    throw console.error(err);
  }
};

export const decryptMessage = async (
  encryptedBase64: string,
  ivBase64: string,
  otherUserPublicKeyBase64: string,
): Promise<string> => {
  const {privateKey} = useAppStore.getState();

  try {
    // 1️⃣ Get private key from Keychain
    // const privateKeyBase64 = privateKey ?? (await getPrivateKey());
    const privateKeyBase64 = privateKey;

    if (!privateKeyBase64) {
      throw new Error('Private key not found');
    }
    const pk = Uint8Array.from(Buffer.from(privateKeyBase64, 'base64'));

    // 2️⃣ Decode the other user's public key
    const otherPublicKey = Uint8Array.from(
      Buffer.from(otherUserPublicKeyBase64, 'base64'),
    );

    //3️⃣ Derive shared secret and hash to AES key
    const sharedSecret = x25519.getSharedSecret(pk, otherPublicKey);
    const aesKey = CryptoJS.enc.Hex.parse(
      Buffer.from(sha256(sharedSecret)).toString('hex'),
    );

    //4️⃣ Decode IV and ciphertext from base64
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedBase64);

    //5️⃣ Decrypt
    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ciphertext}),
      aesKey,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('🧨 Failed to decrypt message:', err);
    return '[decryption failed]';
  }
};

export const encryptFile = async (
  buffer: ArrayBuffer,
): Promise<{encrypted: string; iv: string}> => {
  const {privateKey, selectedChatData} = useAppStore.getState();

  try {
    // const senderBase64Pk = privateKey ?? (await getPrivateKey());
    // 1.Load sender private key from memory
    const senderBase64Pk = privateKey;

    const senderPrivateKey = Uint8Array.from(
      Buffer.from(senderBase64Pk!, 'base64'),
    );

    console.log('This is senderBase64Pk', senderBase64Pk);
    console.log('This is senderPrivateKey', senderPrivateKey);
    console.log(
      'This is  Buffer.from(selectedChatData?.publicKey!,),',
      Buffer.from(selectedChatData?.publicKey!, 'base64'),
    );

    const recipientPublicKey = Uint8Array.from(
      Buffer.from(selectedChatData?.publicKey!, 'base64'),
    );

    const sharedSecret = x25519.getSharedSecret(
      senderPrivateKey,
      recipientPublicKey,
    );
    const aesKey = CryptoJS.enc.Hex.parse(
      Buffer.from(sha256(sharedSecret)).toString('hex'),
    );

    const wordArray = CryptoJS.lib.WordArray.create(buffer);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(wordArray, aesKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return {
      encrypted: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      iv: CryptoJS.enc.Base64.stringify(iv),
    };
  } catch (err) {
    throw console.error('Encrypt files error:', err);
  }
};

export const decryptFile = async (
  fileUrl: string,
  ivBase64: string,
  otherUserPublicKeyBase64: string,
  messageId: string,
): Promise<string> => {
  const {privateKey} = useAppStore.getState();

  try {
    const fileName = `${messageId}.${fileUrl.split('.').pop()}`;
    const filePath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`;

    const exists = await ReactNativeBlobUtil.fs.exists(filePath);
    if (exists) {
      return `file://${filePath}`;
    }
    console.log('encryptMessage function called');
    console.log('decryptMessage function called');
    console.log('encryptFile function called');
    console.log('decryptFile function called');
    console.log('generateKeys function called');

    await ReactNativeBlobUtil.config({
      fileCache: true,
      path: filePath,
    }).fetch('GET', `${HOST}/${fileUrl}`);

    const encryptedBase64 = await ReactNativeBlobUtil.fs.readFile(
      filePath,
      'base64',
    );

    // const privateKeyBase64 = privateKey ?? (await getPrivateKey());
    const privateKeyBase64 = privateKey;
    if (!privateKeyBase64) {
      throw new Error('Private key not found');
    }

    const pk = Uint8Array.from(Buffer.from(privateKeyBase64, 'base64'));

    // 2️⃣ Decode the other user's public key
    const otherPublicKey = Uint8Array.from(
      Buffer.from(otherUserPublicKeyBase64, 'base64'),
    );

    const sharedSecret = x25519.getSharedSecret(pk, otherPublicKey);
    const aesKey = CryptoJS.enc.Hex.parse(
      Buffer.from(sha256(sharedSecret)).toString('hex'),
    );

    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedBase64);

    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ciphertext}),
      aesKey,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    const decryptedBase64 = decrypted.toString(CryptoJS.enc.Base64);
    await ReactNativeBlobUtil.fs.writeFile(filePath, decryptedBase64, 'base64');

    return `file://${filePath}`;
  } catch (err) {
    console.error('🧨 Failed to decrypt media:', err);
    throw err;
  }
};

export const generateKeys = async () => {
  try {
    const privateKey = randomBytes(32); // secure random 32-byte key
    const publicKey = x25519.getPublicKey(privateKey);

    const publicKeyBase64 = Buffer.from(publicKey).toString('base64');
    const privateKeyBase64 = Buffer.from(privateKey).toString('base64');

    return {
      publicKey: publicKeyBase64,
      privateKey: privateKeyBase64,
    };
  } catch (err) {
    console.error('🔑 generateKeys error:', err);
  }
};

export const encryptPrivateKey = (privateKey: string, pin: string): string => {
  const salt = CryptoJS.lib.WordArray.random(16);
  const key = deriveKeyFromPin(pin, salt);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(privateKey, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.stringify({
    salt: CryptoJS.enc.Base64.stringify(salt),
    iv: CryptoJS.enc.Base64.stringify(iv),
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
  });
};

export const decryptPrivateKey = async (
  pin: string,
  userId: string,
): Promise<string | null> => {
  try {
    // 1. Get the encrypted private key from Keychain using userId
    const credentials = await Keychain.getGenericPassword({
      service: `encrypted-private-key-${userId}`,
    });

    if (!credentials) {
      return null;
    }

    const {iv, salt, ciphertext} = JSON.parse(credentials.password);

    const key = deriveKeyFromPin(pin, CryptoJS.enc.Base64.parse(salt));

    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
      }),
      key,
      {
        iv: CryptoJS.enc.Base64.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

export const deriveKeyFromPin = (
  pin: string,
  salt: CryptoJS.lib.WordArray,
): CryptoJS.lib.WordArray => {
  return CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });
};

export const storeEncryptedPrivateKey = async (
  encryptedPrivateKey: string,
  userId: string,
) => {
  await Keychain.setGenericPassword(
    'encrypted-private-key',
    encryptedPrivateKey,
    {
      service: `encrypted-private-key-${userId}`,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  );
};

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
