/**
 * Client-side encryption utilities using Web Crypto API
 * Provides AES-GCM encryption with PBKDF2 key derivation
 */

const SALT = "whisperlink-salt";
const ITERATIONS = 100000;
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

/**
 * Derive an AES-GCM key from a password using PBKDF2
 */
async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(SALT),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt text using AES-GCM
 * @param text - Plain text to encrypt
 * @param password - Password for encryption
 * @returns Hex-encoded encrypted data (IV + ciphertext)
 */
export async function encryptText(text: string, password: string): Promise<string> {
  const key = await deriveKey(password);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return Array.from(combined)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Decrypt hex-encoded AES-GCM encrypted data
 * @param encryptedHex - Hex-encoded encrypted data (with or without 0x prefix)
 * @param password - Password for decryption
 * @returns Decrypted plain text
 */
export async function decryptText(encryptedHex: string, password: string): Promise<string> {
  // Remove 0x prefix if present
  const cleanHex = encryptedHex.startsWith("0x") ? encryptedHex.slice(2) : encryptedHex;
  
  if (!cleanHex || cleanHex.length < 24) {
    throw new Error("Invalid encrypted content: data too short");
  }
  
  // Validate hex format
  if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
    throw new Error("Invalid encrypted content: not valid hex format");
  }
  
  const key = await deriveKey(password);
  const combined = new Uint8Array(
    cleanHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const iv = combined.slice(0, IV_LENGTH);
  const encryptedData = combined.slice(IV_LENGTH);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );
    return new TextDecoder().decode(decrypted);
  } catch (cryptoErr) {
    // AES-GCM decryption fails when password is wrong (authentication tag mismatch)
    throw new Error("Decryption failed: incorrect password or corrupted data");
  }
}

/**
 * Validate if a string is valid hex format
 */
export function isValidHex(str: string): boolean {
  const cleanHex = str.startsWith("0x") ? str.slice(2) : str;
  return /^[0-9a-fA-F]+$/.test(cleanHex);
}
