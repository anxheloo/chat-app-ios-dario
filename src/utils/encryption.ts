import {x25519} from '@noble/curves/ed25519';
import {sha256} from '@noble/hashes/sha256';
import {randomBytes} from '@noble/hashes/utils';
import CryptoJS from 'crypto-js';
import {Buffer} from 'buffer';
import {useAppStore} from '../store';
import {getPrivateKey} from './keys';

export const encryptMessage = async (
  plaintext: string,
): Promise<{encrypted: string; iv: string}> => {
  const {privateKey, selectedChatData} = useAppStore.getState();

  try {
    // 1️⃣ Load sender private key from Keychain
    const senderBase64Pk = privateKey ? privateKey : await getPrivateKey();

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
    const privateKeyBase64 = privateKey ? privateKey : await getPrivateKey();

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

export const encryptFileBuffer = async (
  buffer: ArrayBuffer,
): Promise<{encrypted: Uint8Array; iv: string}> => {
  const {privateKey, selectedChatData} = useAppStore.getState();

  const senderBase64Pk = privateKey ? privateKey : await getPrivateKey();

  const senderPrivateKey = Uint8Array.from(
    Buffer.from(senderBase64Pk!, 'base64'),
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

  const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(wordArray, aesKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const encryptedBytes = Uint8Array.from(
    Buffer.from(encrypted.ciphertext.toString(CryptoJS.enc.Base64), 'base64'),
  );

  return {
    encrypted: encryptedBytes,
    iv: CryptoJS.enc.Base64.stringify(iv),
  };
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
