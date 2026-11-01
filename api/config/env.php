<?php
/**
 * Collabefy Environment Variables Loader (.env)
 * 
 * Automatically scans for and loads configuration from .env in:
 * 1. Project root directory (c:\xampp\htdocs\influencer\.env)
 * 2. API directory (c:\xampp\htdocs\influencer\api\.env)
 * 3. Config directory (c:\xampp\htdocs\influencer\api\config\.env)
 */

if (!isset($GLOBALS['__APP_ENV'])) {
    $GLOBALS['__APP_ENV'] = [];
}

if (!function_exists('loadEnv')) {
    function loadEnv($filePaths = []) {
        if (empty($filePaths)) {
            $filePaths = [
                __DIR__ . '/../../.env',       // Project root
                __DIR__ . '/../.env',          // API directory
                __DIR__ . '/.env'              // Config directory
            ];
        }

        foreach ($filePaths as $path) {
            if (file_exists($path)) {
                $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                if ($lines === false || empty($lines)) {
                    continue;
                }

                foreach ($lines as $line) {
                    $line = trim($line);

                    // Skip empty lines and comment lines
                    if ($line === '' || substr($line, 0, 1) === '#') {
                        continue;
                    }

                    // Parse KEY=VALUE
                    if (strpos($line, '=') !== false) {
                        list($key, $val) = explode('=', $line, 2);
                        $key = trim($key);
                        $val = trim($val);

                        // Strip inline comments if not quoted
                        if (substr($val, 0, 1) !== '"' && substr($val, 0, 1) !== "'" && strpos($val, '#') !== false) {
                            $parts = explode('#', $val, 2);
                            $val = trim($parts[0]);
                        }

                        // Remove surrounding quotes
                        $len = strlen($val);
                        if ($len >= 2) {
                            $first = substr($val, 0, 1);
                            $last = substr($val, -1);
                            if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
                                $val = substr($val, 1, -1);
                            }
                        }

                        // Store in internal store, $_ENV, $_SERVER, and system environment
                        $GLOBALS['__APP_ENV'][$key] = $val;
                        $_ENV[$key] = $val;
                        $_SERVER[$key] = $val;
                        @putenv("{$key}={$val}");
                    }
                }
                break; // Stop after first matched .env file
            }
        }
    }
}

if (!function_exists('env')) {
    function env($key, $default = null) {
        if (isset($GLOBALS['__APP_ENV'][$key])) {
            $val = $GLOBALS['__APP_ENV'][$key];
        } else {
            $val = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
        }

        if ($val === false || $val === null) {
            return $default;
        }

        $lower = strtolower((string)$val);
        if ($lower === 'true' || $lower === '(true)') return true;
        if ($lower === 'false' || $lower === '(false)') return false;
        if ($lower === 'null' || $lower === '(null)') return null;
        if ($lower === 'empty' || $lower === '(empty)') return '';

        return $val;
    }
}

// Auto-run environment loading on include
loadEnv();
