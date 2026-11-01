<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$dbInstance = new Database();
$db = $dbInstance->getConnection();

$bookingId = intval($_GET['id'] ?? $_GET['booking_id'] ?? 0);
$userId = intval($_GET['user_id'] ?? $_GET['uid'] ?? 0);
$role = trim($_GET['role'] ?? '');

if (!$bookingId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Booking ID parameter is required.']);
    exit();
}

if ($userId <= 0) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required to view booking details.']);
    exit();
}

if ($db) {
    try {
        $stmt = $db->prepare("SELECT b.*, u.name AS user_name, u.email AS user_email, p.name AS influencer_name, p.user_id AS inf_user_id 
                              FROM bookings b 
                              LEFT JOIN users u ON b.user_id = u.id 
                              LEFT JOIN influencer_profiles p ON b.influencer_id = p.id 
                              WHERE b.id = :id LIMIT 1");
        $stmt->execute(['id' => $bookingId]);
        $booking = $stmt->fetch();

        if (!$booking) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Booking record not found.']);
            exit();
        }

        // Strict Ownership / IDOR Verification
        $isClientOwner = ($booking['user_id'] == $userId);
        $isInfluencerOwner = ($booking['influencer_id'] == $userId || $booking['inf_user_id'] == $userId);
        $isAdmin = ($role === 'admin');

        if (!$isClientOwner && !$isInfluencerOwner && !$isAdmin) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Forbidden: You are not authorized to view this booking resource.']);
            exit();
        }

        unset($booking['inf_user_id']);
        $booking['budget'] = floatval($booking['budget']);
        $booking['date'] = $booking['booking_date'];

        echo json_encode(['status' => 'success', 'data' => $booking]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database error occurred.']);
        exit();
    }
}

// Fallback JSON store mode
$dataFile = __DIR__ . '/../data_store.json';
if (file_exists($dataFile)) {
    $store = json_decode(file_get_contents($dataFile), true);
    foreach ($store['bookings'] ?? [] as $b) {
        if (($b['id'] ?? 0) == $bookingId) {
            $isClientOwner = (($b['user_id'] ?? 0) == $userId);
            $isInfluencerOwner = (($b['influencer_id'] ?? 0) == $userId || ($b['influencer_user_id'] ?? 0) == $userId);
            $isAdmin = ($role === 'admin');

            if (!$isClientOwner && !$isInfluencerOwner && !$isAdmin) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Forbidden: You are not authorized to view this booking resource.']);
                exit();
            }

            echo json_encode(['status' => 'success', 'data' => $b]);
            exit();
        }
    }
}

http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Booking not found.']);
