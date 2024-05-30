import CryptoJS from "crypto-js";

interface Token {}

// Decrypt a token with type safety
export const DecryptToken = (encryptedToken: string): Token | null => {
  if (!encryptedToken) return null;

  const secretPass = process.env.REACT_APP_SECRET_PASS as string;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretPass);
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

  const secretPass = process.env.REACT_APP_SECRET_PASS as string;

  try {
    const encryptedToken = CryptoJS.AES.encrypt(
      JSON.stringify(token),
      secretPass
    ).toString();
    return encryptedToken;
  } catch (error) {
    console.error("Error encrypting token:", error);
    return null;
  }
};
