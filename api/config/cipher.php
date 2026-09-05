<?php
// Secure Bidirectional ID Encryption & Decryption Module for InfluencerConnect

if (!defined('ID_CIPHER_SECRET_HASH')) {
    define('ID_CIPHER_SECRET_HASH', '7ddb82959145e259228b8e5d5671244d83e826b47915af9fc4e223996a7c1fd7');
}

/**
 * Encrypt an integer/numeric ID into a secure URL-safe encrypted ID token (e.g. "enc_4654")
 *
 * @param int|string $id
 * @param string $prefix
 * @return string
 */
function encryptId($id, $prefix = 'enc_') {
    if ($id === null || $id === '' || $id === false) return '';
    $str = (string)$id;
    $key = ID_CIPHER_SECRET_HASH;
    $keyLen = strlen($key);
    $hex = '';
    
    for ($i = 0; $i < strlen($str); $i++) {
        $char = ord($str[$i]) ^ ord($key[$i % $keyLen]);
        $hex .= str_pad(dechex($char), 2, '0', STR_PAD_LEFT);
    }
    return $prefix . $hex;
}

/**
 * Decrypt an encrypted ID token back to original numeric integer ID
 * Gracefully accepts both encrypted ("enc_...") and numeric IDs (102, "102")
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
    
    return is_numeric($res) ? (int)$res : (is_numeric($encryptedVal) ? (int)$encryptedVal : 0);
}
