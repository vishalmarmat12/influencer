// Bidirectional ID Encryption & Decryption Utility for InfluencerConnect
// Converts database IDs (e.g., 1, 102) into encrypted tokens (e.g., "enc_4654") and back

const CIPHER_KEY = '7ddb82959145e259228b8e5d5671244d83e826b47915af9fc4e223996a7c1fd7';

/**
 * Encrypt a numeric integer ID into a URL-safe encrypted ID token.
 * E.g., encryptId(1) -> "enc_06" or encryptId(102) -> "enc_4654"
 * @param {number|string} id - The raw ID to encrypt
 * @param {string} prefix - Optional prefix, default 'enc_'
 * @returns {string} The encrypted ID string
 */
export function encryptId(id, prefix = 'enc_') {
  if (id === null || id === undefined || id === '') return '';
  const str = String(id);
  const keyLen = CIPHER_KEY.length;
  let hex = '';

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) ^ CIPHER_KEY.charCodeAt(i % keyLen);
    hex += code.toString(16).padStart(2, '0');
  }

  return prefix + hex;
}

/**
 * Decrypt an encrypted ID token back to its original integer ID.
 * Gracefully handles both encrypted tokens ("enc_4654") and plain numeric IDs (102, "102").
 * @param {string|number} encryptedVal - The encrypted token or raw ID
 * @param {string} prefix - Optional prefix, default 'enc_'
 * @returns {number} The decrypted integer ID, or 0 if invalid
 */
export function decryptId(encryptedVal, prefix = 'enc_') {
  if (encryptedVal === null || encryptedVal === undefined || encryptedVal === '') return 0;
  if (typeof encryptedVal === 'number') return encryptedVal;

  const rawStr = String(encryptedVal).trim();

  // If plain integer string without prefix
  if (/^\d+$/.test(rawStr) && !rawStr.startsWith(prefix)) {
    return parseInt(rawStr, 10);
  }

  let hexStr = rawStr;
  if (hexStr.startsWith(prefix)) {
    hexStr = hexStr.substring(prefix.length);
  }

  // If not valid even-length hex, fallback to number or 0
  if (!/^[0-9a-fA-F]+$/.test(hexStr) || hexStr.length % 2 !== 0) {
    const parsed = parseInt(rawStr, 10);
    return !isNaN(parsed) ? parsed : 0;
  }

  const keyLen = CIPHER_KEY.length;
  let result = '';

  for (let i = 0; i < hexStr.length; i += 2) {
    const byte = parseInt(hexStr.substring(i, i + 2), 16);
    const charCode = byte ^ CIPHER_KEY.charCodeAt((i / 2) % keyLen);
    result += String.fromCharCode(charCode);
  }

  const numericResult = parseInt(result, 10);
  if (!isNaN(numericResult)) {
    return numericResult;
  }

  const fallback = parseInt(rawStr, 10);
  return !isNaN(fallback) ? fallback : 0;
}

/**
 * Helper to check if an entity matches an ID (whether raw ID or encrypted ID)
 * @param {object} item - Object containing an id property
 * @param {string|number} searchIdOrEncrypted - The ID to test
 * @returns {boolean}
 */
export function matchesEntityId(item, searchIdOrEncrypted) {
  if (!item || !searchIdOrEncrypted) return false;
  const targetNumeric = decryptId(searchIdOrEncrypted);
  const itemNumeric = Number(item.id || item.user_id || 0);
  const targetEncrypted = encryptId(targetNumeric);
  const itemEncrypted = encryptId(itemNumeric);

  return (
    itemNumeric === targetNumeric ||
    String(item.id) === String(searchIdOrEncrypted) ||
    itemEncrypted === String(searchIdOrEncrypted) ||
    String(item.encrypted_id) === String(searchIdOrEncrypted)
  );
}
