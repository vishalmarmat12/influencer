<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$dbInstance = new Database();
$db = $dbInstance->getConnection();

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit();
}

$userId = intval($_POST['user_id'] ?? $_GET['user_id'] ?? 0);
$fileData = $_FILES['avatar'] ?? $_FILES['image'] ?? $_FILES['file'] ?? null;

if (!$fileData || !isset($fileData['tmp_name']) || empty($fileData['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No image file uploaded.']);
    exit();
}

// 1. Check upload error
if ($fileData['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'File upload error code: ' . $fileData['error']]);
    exit();
}

// 2. Max File Size (5MB)
$maxSize = 5 * 1024 * 1024;
if ($fileData['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Avatar image size must be less than 5 MB.']);
    exit();
}

// 3. Extension & MIME Type Check
$origName = basename($fileData['name']);
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
$allowedExts = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file extension. Only JPG, JPEG, PNG, and WEBP images are allowed.']);
    exit();
}

$mime = mime_content_type($fileData['tmp_name']);
$allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

if (!in_array($mime, $allowedMimes)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid file MIME type.']);
    exit();
}

// 4. Server-Side Image Structure Validation using getimagesize()
$imageInfo = @getimagesize($fileData['tmp_name']);
if ($imageInfo === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Uploaded file is not a valid image.']);
    exit();
}

// 5. Create Target Directory
$uploadDir = __DIR__ . '/../../uploads/avatars/';
if (!file_exists($uploadDir)) {
    @mkdir($uploadDir, 0775, true);
}

// 6. Generate Secure Random Filename
$uniqueName = 'avatar_' . ($userId ?: 'user') . '_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
$destPath = $uploadDir . $uniqueName;

if (!move_uploaded_file($fileData['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to store avatar image file on server.']);
    exit();
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$avatarUrl = "{$protocol}://{$host}/influencer/uploads/avatars/{$uniqueName}";

// 7. Update User Record in Database if connected
if ($db && $userId > 0) {
    try {
        $uStmt = $db->prepare("UPDATE users SET avatar = :avatar WHERE id = :uid");
        $uStmt->execute(['avatar' => $avatarUrl, 'uid' => $userId]);

        $pStmt = $db->prepare("UPDATE influencer_profiles SET avatar = :avatar WHERE user_id = :uid");
        $pStmt->execute(['avatar' => $avatarUrl, 'uid' => $userId]);
    } catch (Exception $e) {}
}

echo json_encode([
    'status' => 'success',
    'message' => 'Avatar image uploaded successfully.',
    'data' => [
        'user_id' => $userId,
        'avatar_url' => $avatarUrl,
        'url' => $avatarUrl
    ]
]);
