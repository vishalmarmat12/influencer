<?php
// Secure Bidirectional ID Encryption & Decryption Engine for Collabefy

if (!defined('ID_CIPHER_SECRET_HASH')) {
    define('ID_CIPHER_SECRET_HASH', '7ddb82959145e259228b8e5d5671244d83e826b47915af9fc4e223996a7c1fd7');
}

/**
 * Encrypt a numeric integer database ID into a secure, URL-safe encrypted token (e.g. "enc_0754545208020904")
 *
 * @param int|string $id
 * @param string $prefix
 * @return string
 */
function encryptId($id, $prefix = 'enc_') {
    if ($id === null || $id === '' || $id === false) return '';
    $padded = sprintf('%08d', (int)$id);
    $key = ID_CIPHER_SECRET_HASH;
    $keyLen = strlen($key);
    $hex = '';
    
    for ($i = 0; $i < strlen($padded); $i++) {
        $char = ord($padded[$i]) ^ ord($key[$i % $keyLen]);
        $hex .= str_pad(dechex($char), 2, '0', STR_PAD_LEFT);
    }
    return $prefix . $hex;
}

/**
 * Decrypt an encrypted ID token back to its original numeric integer database ID
 * Gracefully accepts both encrypted ("enc_...") and numeric IDs (1, 102, "102")
 *
 * @param string|int $encryptedVal
 * @param string $prefix
 * @return int
 */
function decryptId($encryptedVal, $prefix = 'enc_') {
    if ($encryptedVal === null || $encryptedVal === '' || $encryptedVal === false) return 0;
    
    // If it's already a clean numeric string or integer
    if (is_numeric($encryptedVal) && strpos((string)$encryptedVal, $prefix) !== 0) {
        return (int)$encryptedVal;
    }
    
    $str = (string)$encryptedVal;
    if (strpos($str, $prefix) === 0) {
        $str = substr($str, strlen($prefix));
    }
    
    if (!ctype_xdigit($str) || strlen($str) % 2 !== 0) {
        return is_numeric($encryptedVal) ? (int)$encryptedVal : 0;
    }
    
    $key = ID_CIPHER_SECRET_HASH;
    $keyLen = strlen($key);
    $res = '';
    $len = strlen($str);
    
    for ($i = 0; $i < $len; $i += 2) {
        $byte = hexdec(substr($str, $i, 2));
        $char = $byte ^ ord($key[($i / 2) % $keyLen]);
        $res .= chr($char);
    }
    
    $num = (int)$res;
    return $num;
}

/**
 * Attach encrypted IDs to an entity array or list of entities
 *
 * @param array $data
 * @return array
 */
function attachEncryptedIds($data) {
    if (!is_array($data)) return $data;

    // If it is a list of rows
    if (isset($data[0]) && is_array($data[0])) {
        foreach ($data as &$item) {
            $item = attachEncryptedIds($item);
        }
        return $data;
    }

    if (isset($data['id'])) {
        $data['encrypted_id'] = encryptId($data['id']);
    }
    if (isset($data['user_id'])) {
        $data['encrypted_user_id'] = encryptId($data['user_id']);
    }
    if (isset($data['influencer_id'])) {
        $data['encrypted_influencer_id'] = encryptId($data['influencer_id']);
    }

    return $data;
}
