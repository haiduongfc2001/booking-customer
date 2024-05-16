import CryptoJS from "crypto-js";

interface Token {}

declare const REACT_APP_SECRET_PASS: string;

// Decrypt a token with type safety
export const DecryptToken = (encryptedToken: string): Token | null => {
  if (!encryptedToken) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, REACT_APP_SECRET_PASS);
    const decryptedToken = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedToken as Token;
  } catch (error) {
    console.error("Error decrypting token:", error);
    return null;
  }
};

// Encrypt a token with type safety
export const EncryptToken = (token: Token): string | null => {
  if (!token) return null;

  try {
    const encryptedToken = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      REACT_APP_SECRET_PASS
    ).toString();
    return encryptedToken;
  } catch (error) {
    console.error("Error encrypting token:", error);
    return null;
  }
};
