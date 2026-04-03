/**
 * Security Utilities
 * 
 * This module provides various security-related functions for the application,
 * including encryption, hashing, token generation, and input validation.
 */
import { createHash, randomBytes, pbkdf2Sync } from 'crypto';

/**
 * Generates a random salt value for password hashing
 * @param length - Length of the salt in bytes
 * @returns Random salt as hex string
 */
export const generateSalt = (length: number = 16): string => {
  return randomBytes(length).toString('hex');
};

/**
 * Hashes a password with the provided salt using PBKDF2
 * @param password - Password to hash
 * @param salt - Salt to use for hashing
 * @returns Hashed password as hex string
 */
export const hashPassword = (password: string, salt: string): string => {
  return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

/**
 * Generates a random token for authentication or verification purposes
 * @param length - Length of the token in bytes
 * @returns Random token as hex string
 */
export const generateToken = (length: number = 32): string => {
  return randomBytes(length).toString('hex');
};

/**
 * Encrypts data using a simple XOR cipher with a hashed key
 * Note: This is a simple implementation for demonstration purposes
 * For production use, consider a more secure encryption algorithm
 * @param data - Data to encrypt
 * @param key - Encryption key
 * @returns Encrypted data as base64 string
 */
export const encryptData = (data: string, key: string): string => {
  const hash = createHash('sha256').update(key).digest('hex');
  let result = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ hash.charCodeAt(i % hash.length);
    result += String.fromCharCode(charCode);
  }
  return Buffer.from(result).toString('base64');
};

/**
 * Decrypts data encrypted with the encryptData function
 * @param encryptedData - Encrypted data as base64 string
 * @param key - Decryption key
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string, key: string): string => {
  const hash = createHash('sha256').update(key).digest('hex');
  const decoded = Buffer.from(encryptedData, 'base64').toString();
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    const charCode = decoded.charCodeAt(i) ^ hash.charCodeAt(i % hash.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

/**
 * Verifies data integrity by comparing the provided signature with a generated one
 * @param data - Data to verify
 * @param signature - Provided signature
 * @param key - Key used to generate signature
 * @returns True if data integrity is verified, false otherwise
 */
export const verifyDataIntegrity = (data: string, signature: string, key: string): boolean => {
  const expectedSignature = createHash('sha256').update(data + key).digest('hex');
  return expectedSignature === signature;
};

/**
 * Generates a signature for data using the provided key
 * @param data - Data to sign
 * @param key - Key used to generate signature
 * @returns Data signature as hex string
 */
export const generateDataSignature = (data: string, key: string): string => {
  return createHash('sha256').update(data + key).digest('hex');
};

/**
 * Logs security events for auditing purposes
 * @param eventType - Type of security event
 * @param userId - User ID associated with the event
 * @param details - Additional details about the event
 */
export const logSecurityEvent = (eventType: string, userId: string, details: string): void => {
  // In production, these logs should be stored in a secure logging system
  console.log(`[SECURITY] ${new Date().toISOString()} - ${eventType} - User: ${userId} - Details: ${details}`);
};

/**
 * Validates input based on the specified type
 * @param input - Input to validate
 * @param type - Type of validation to perform
 * @returns True if input is valid, false otherwise
 */
export const validateInput = (input: string, type: 'email' | 'password' | 'text'): boolean => {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'password':
      return input.length >= 8 && /[A-Z]/.test(input) && /[0-9]/.test(input);
    case 'text':
      return input.length > 0 && input.length < 1000;
    default:
      return false;
  }
};

/**
 * Sanitizes input to prevent XSS attacks
 * @param input - Input to sanitize
 * @returns Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Generates a secure random ID using SHA-256
 * @returns Secure random ID as hex string
 */
export const generateSecureId = (): string => {
  return createHash('sha256').update(Date.now().toString() + randomBytes(32).toString('hex')).digest('hex');
};