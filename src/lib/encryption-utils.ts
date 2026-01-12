import CryptoJS from 'crypto-js';
import { env } from '../config/env';

const SECRET_KEY = env.ENCRYPTION_KEY;

export const encrypt = (text: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

export const decrypt = (ciphertext: string | null): string | null => {
  if (!ciphertext) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
