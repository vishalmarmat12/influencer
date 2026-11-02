// Secure Bidirectional ID Encryption & Decryption Engine for Collabefy Frontend

export const ID_CIPHER_SECRET_HASH = '7ddb82959145e259228b8e5d5671244d83e826b47915af9fc4e223996a7c1fd7';

/**
 * Encrypt a numeric database ID into a secure, URL-safe token (e.g. "enc_0754545208020904")
 *
 * @param {number|string} id
 * @param {string} prefix
 * @returns {string}
 */
export function encryptId(id, prefix = 'enc_') {
  if (id === null || id === undefined || id === '') return '';
  const padded = String(id).padStart(8, '0');
  const key = ID_CIPHER_SECRET_HASH;
  let hex = '';
  for (let i = 0; i < padded.length; i++) {
    const code = padded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    hex += code.toString(16).padStart(2, '0');
  }
  return prefix + hex;
}

/**
 * Decrypt an encrypted ID token back to its original numeric integer database ID
 * Gracefully accepts both encrypted ("enc_...") and numeric IDs (1, 102, "102")
 *
 * @param {string|number} encryptedVal
 * @param {string} prefix
 * @returns {number}
 */
export function decryptId(encryptedVal, prefix = 'enc_') {
  if (encryptedVal === null || encryptedVal === undefined || encryptedVal === '') return 0;
  
  let str = String(encryptedVal).trim();
  if (!str.startsWith(prefix)) {
    const num = Number(str);
    return isNaN(num) ? 0 : num;
  }
  
  str = str.slice(prefix.length);
  if (str.length % 2 !== 0) {
    const num = Number(encryptedVal);
    return isNaN(num) ? 0 : num;
  }
  
  const key = ID_CIPHER_SECRET_HASH;
  let res = '';
  for (let i = 0; i < str.length; i += 2) {
    const byte = parseInt(str.substr(i, 2), 16);
    res += String.fromCharCode(byte ^ key.charCodeAt((i / 2) % key.length));
  }
  
  const num = parseInt(res, 10);
  return isNaN(num) ? 0 : num;
}
