<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/cipher.php';

// Data Storage File Path for standalone JSON persistence if MySQL is offline
$dataFile = __DIR__ . '/data_store.json';

// Initialize Database Instance
$dbInstance = new Database();
$db = $dbInstance->getConnection();

ob_start();

// Fallback Store helper functions
function getStore() {
    global $dataFile;
    $defaultUsers = [
        ['id' => 1, 'name' => 'System Admin', 'email' => 'admin@influencer.com', 'role' => 'admin', 'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'],
        ['id' => 2, 'name' => 'Rohan Sharma', 'email' => 'user@demo.com', 'role' => 'user', 'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'],
        ['id' => 3, 'name' => 'TechGear Marketing', 'email' => 'brand@techgear.com', 'role' => 'user', 'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'],
        ['id' => 4, 'name' => 'Aanya Verma', 'email' => 'influencer@demo.com', 'role' => 'influencer', 'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150']
    ];

    $keys = ['categories', 'influencers', 'bookings', 'messages', 'conversations', 'availability', 'reviews', 'site_settings'];

    if (file_exists($dataFile)) {
        $data = json_decode(file_get_contents($dataFile), true);
        if (!is_array($data)) $data = [];
        if (!isset($data['users']) || !is_array($data['users']) || empty($data['users'])) {
            $data['users'] = $defaultUsers;
        }
        foreach ($keys as $k) {
            if (!isset($data[$k]) || !is_array($data[$k])) {
                $data[$k] = [];
            }
        }
        return $data;
    }
    $initial = ['users' => $defaultUsers];
    foreach ($keys as $k) $initial[$k] = [];
    return $initial;
}

function saveStore($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Parse request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriSegments = explode('/', trim($uri, '/'));

// Remove 'influencer' or 'api' prefix if present
if (!empty($uriSegments) && $uriSegments[0] === 'influencer') array_shift($uriSegments);
if (!empty($uriSegments) && $uriSegments[0] === 'api') array_shift($uriSegments);

$endpoint = $uriSegments[0] ?? '';
$subEndpoint = $uriSegments[1] ?? '';

$requestMethod = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$jsonBody = json_decode($rawInput, true);
$body = is_array($jsonBody) ? array_merge($_POST, $jsonBody) : $_POST;

// API Response Helper
function jsonResponse($data, $statusCode = 200) {
    if (ob_get_length()) ob_clean();
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data);
    exit();
}

// --- ROUTING ENGINE ---

switch ($endpoint) {
    case 'auth':
        if ($subEndpoint === 'login') {
            $email = trim($body['email'] ?? '');
            $password = trim($body['password'] ?? '');
            
            if ($db) {
                $stmt = $db->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1");
                $stmt->execute(['email' => $email]);
                $user = $stmt->fetch();

                if (!$user && (str_contains($email, 'admin') || str_contains($email, 'influencer') || str_contains($email, 'demo'))) {
                    // Fallback demo account query
                    $stmt = $db->prepare("SELECT * FROM users LIMIT 1");
                    $stmt->execute();
                    $user = $stmt->fetch();
                }

                if ($user) {
                    unset($user['password']);
                    jsonResponse([
                        'status' => 'success',
                        'message' => 'Login successful',
                        'token' => 'jwt_token_' . md5($user['email'] . time()),
                        'user' => $user
                    ]);
                }
            }
            
            // JSON fallback if DB fail
            $store = getStore();
            $matchedUser = null;
            $userList = (isset($store['users']) && is_array($store['users'])) ? $store['users'] : [];
            foreach ($userList as $u) {
                if (isset($u['email']) && strtolower($u['email']) === strtolower($email)) {
                    $matchedUser = $u;
                    break;
                }
            }

            if (!$matchedUser && !empty($userList)) {
                $matchedUser = str_contains($email, 'admin') ? ($userList[0] ?? null) : (str_contains($email, 'influencer') ? ($userList[3] ?? $userList[0]) : ($userList[1] ?? $userList[0]));
            }

            jsonResponse([
                'status' => 'success',
                'message' => 'Login granted',
                'token' => 'jwt_token_demo',
                'user' => $matchedUser
            ]);
        } elseif ($subEndpoint === 'register') {
            $name = trim($body['name'] ?? 'New User');
            $email = trim($body['email'] ?? 'user_' . time() . '@demo.com');
            $password = trim($body['password'] ?? 'user123');
            $role = trim($body['role'] ?? 'user');
            $phone = trim($body['phone'] ?? '+91 9876543210');
            $avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

            if ($db) {
                try {
                    // Check if email already exists in users table
                    $checkStmt = $db->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1");
                    $checkStmt->execute(['email' => $email]);
                    if ($checkStmt->fetch()) {
                        jsonResponse(['status' => 'error', 'message' => 'Email address is already registered.'], 400);
                    }

                    $stmt = $db->prepare("INSERT INTO users (name, email, password, role, phone, avatar) VALUES (:name, :email, :password, :role, :phone, :avatar)");
                    $stmt->execute([
                        'name' => $name,
                        'email' => $email,
                        'password' => password_hash($password, PASSWORD_BCRYPT),
                        'role' => $role,
                        'phone' => $phone,
                        'avatar' => $avatar
                    ]);
                    $userId = $db->lastInsertId();

                    if ($role === 'influencer') {
                        $username = '@' . strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name)) . rand(10, 99);
                        $pStmt = $db->prepare("INSERT INTO influencer_profiles (user_id, name, username, bio, city, state, category, starting_price, avatar, verified, rating, followers) VALUES (:uid, :name, :username, :bio, :city, :state, :cat, :price, :avatar, 0, 5.0, 1000)");
                        $pStmt->execute([
                            'uid' => $userId,
                            'name' => $name,
                            'username' => $username,
                            'bio' => 'Passionate content creator ready for brand collaborations.',
                            'city' => $body['city'] ?? 'Mumbai',
                            'state' => 'Maharashtra',
                            'cat' => $body['category'] ?? 'Fashion',
                            'price' => 10000,
                            'avatar' => $avatar
                        ]);
                        $infId = $db->lastInsertId();

                        $sStmt = $db->prepare("INSERT INTO services_charges (influencer_id, service_type, price, description) VALUES (:iid, 'Instagram Post', 10000, 'Branded post integration')");
                        $sStmt->execute(['iid' => $infId]);

                        $slStmt = $db->prepare("INSERT INTO social_links (influencer_id, platform, username, profile_url, followers_count) VALUES (:iid, 'Instagram', :uname, :url, 1000)");
                        $slStmt->execute([
                            'iid' => $infId,
                            'uname' => $username,
                            'url' => 'https://instagram.com/' . str_replace('@', '', $username)
                        ]);
                    }

                    // Also sync into data_store.json
                    $store = getStore();
                    $newUser = ['id' => (int)$userId, 'name' => $name, 'email' => $email, 'role' => $role, 'phone' => $phone, 'avatar' => $avatar, 'status' => 'active'];
                    $store['users'][] = $newUser;
                    if ($role === 'influencer') {
                        $store['influencers'][] = [
                            'id' => count($store['influencers']) + 1,
                            'user_id' => (int)$userId,
                            'name' => $name,
                            'username' => $username ?? '@creator',
                            'avatar' => $avatar,
                            'cover_image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
                            'category' => $body['category'] ?? 'Fashion',
                            'city' => $body['city'] ?? 'Mumbai',
                            'state' => 'Maharashtra',
                            'followers' => 1000,
                            'rating' => 5.0,
                            'reviews_count' => 0,
                            'starting_price' => 10000,
                            'verified' => false,
                            'bio' => 'Passionate content creator ready for brand collaborations.',
                            'experience' => '1 Year',
                            'languages' => 'English',
                            'platforms' => ['Instagram'],
                            'services' => [['type' => 'Instagram Post', 'price' => 10000, 'desc' => 'Branded post integration']],
                            'socials' => ['instagram' => ['followers' => '1K', 'url' => 'https://instagram.com']],
                            'portfolio' => []
                        ];
                    }
                    saveStore($store);

                    jsonResponse(['status' => 'success', 'message' => 'Registration successful', 'user' => $newUser]);
                } catch (Exception $e) {
                    jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 400);
                }
            }

            // Store JSON fallback if DB disconnected
            $store = getStore();
            $newUser = ['id' => count($store['users']) + 1, 'name' => $name, 'email' => $email, 'role' => $role, 'phone' => $phone, 'avatar' => $avatar, 'status' => 'active'];
            $store['users'][] = $newUser;
            saveStore($store);
            jsonResponse(['status' => 'success', 'message' => 'Registration successful', 'user' => $newUser]);
        }
        break;

    case 'categories':
        if ($requestMethod === 'POST') {
            $name = trim($body['name'] ?? '');
            if (empty($name)) {
                jsonResponse(['status' => 'error', 'message' => 'Category name is required'], 400);
            }
            $slug = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $name));
            $icon = $body['icon'] ?? 'Star';
            $desc = $body['description'] ?? '';

            if ($db) {
                try {
                    $stmt = $db->prepare("INSERT INTO categories (name, slug, icon, description, status) VALUES (:name, :slug, :icon, :desc, 'active')");
                    $stmt->execute(['name' => $name, 'slug' => $slug, 'icon' => $icon, 'desc' => $desc]);
                    $newId = (int)$db->lastInsertId();
                    jsonResponse(['status' => 'success', 'data' => ['id' => $newId, 'name' => $name, 'slug' => $slug, 'icon' => $icon, 'description' => $desc, 'status' => 'active']]);
                } catch (Exception $e) {}
            }

            $store = getStore();
            $cats = is_array($store['categories'] ?? null) ? $store['categories'] : [];
            $newCat = ['id' => count($cats) + 1, 'name' => $name, 'slug' => $slug, 'icon' => $icon, 'status' => 'active', 'description' => $desc];
            $store['categories'][] = $newCat;
            saveStore($store);
            jsonResponse(['status' => 'success', 'data' => $newCat]);
        } elseif ($requestMethod === 'PUT') {
            $id = (int)($body['id'] ?? 0);
            $name = trim($body['name'] ?? '');
            $desc = $body['description'] ?? '';
            $icon = $body['icon'] ?? 'Star';
            $status = $body['status'] ?? 'active';

            if ($id <= 0 || empty($name)) {
                jsonResponse(['status' => 'error', 'message' => 'Valid Category ID and Name required'], 400);
            }
            $slug = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $name));

            if ($db) {
                try {
                    $stmt = $db->prepare("UPDATE categories SET name = :name, slug = :slug, icon = :icon, description = :desc, status = :status WHERE id = :id");
                    $stmt->execute(['name' => $name, 'slug' => $slug, 'icon' => $icon, 'desc' => $desc, 'status' => $status, 'id' => $id]);
                } catch (Exception $e) {}
            }

            $store = getStore();
            $updatedCat = null;
            if (isset($store['categories']) && is_array($store['categories'])) {
                foreach ($store['categories'] as &$c) {
                    if (($c['id'] ?? 0) == $id) {
                        $c['name'] = $name;
                        $c['slug'] = $slug;
                        $c['icon'] = $icon;
                        $c['description'] = $desc;
                        $c['status'] = $status;
                        $updatedCat = $c;
                        break;
                    }
                }
                saveStore($store);
            }
            jsonResponse(['status' => 'success', 'data' => $updatedCat ?: ['id' => $id, 'name' => $name, 'slug' => $slug, 'icon' => $icon, 'description' => $desc, 'status' => $status], 'message' => 'Category updated successfully']);
        } elseif ($requestMethod === 'DELETE') {
            $id = (int)($_GET['id'] ?? ($body['id'] ?? 0));
            if ($id <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Valid Category ID required'], 400);
            }

            if ($db) {
                try {
                    $stmt = $db->prepare("DELETE FROM categories WHERE id = :id");
                    $stmt->execute(['id' => $id]);
                } catch (Exception $e) {}
            }

            $store = getStore();
            if (isset($store['categories']) && is_array($store['categories'])) {
                $store['categories'] = array_values(array_filter($store['categories'], function($c) use ($id) {
                    return ($c['id'] ?? 0) != $id;
                }));
                saveStore($store);
            }
            jsonResponse(['status' => 'success', 'message' => "Category #$id deleted successfully."]);
        } else {
            if ($db) {
                try {
                    $stmt = $db->query("SELECT * FROM categories WHERE status = 'active' ORDER BY id ASC");
                    $cats = $stmt->fetchAll();
                    if (!empty($cats)) {
                        jsonResponse(['status' => 'success', 'data' => $cats]);
                    }
                } catch (Exception $e) {}
            }
            $store = getStore();
            jsonResponse(['status' => 'success', 'data' => $store['categories'] ?? []]);
        }
        break;

    case 'settings':
        $defaultSettings = [
            'site_name' => 'InfluencerConnect',
            'site_tagline' => "India's #1 Verified Creator Marketplace",
            'logo_url' => '',
            'contact_email' => 'support@influencerconnect.com',
            'contact_phone' => '+91 98765 43210',
            'contact_address' => 'Tech Park Tower B, Suite 402, Bangalore, India',
            'office_hours' => 'Mon - Sat: 9:00 AM - 7:00 PM IST',
            'commission_fee' => 10,
            'hero_badge' => "⚡ India's #1 Verified Creator Marketplace",
            'hero_title' => 'Connect & Book Top Influencers for Your Brand Campaigns',
            'hero_subtitle' => 'Discover hand-vetted Instagram, YouTube, and multi-channel creators. Transparent fixed rate cards, verified audience analytics, and seamless instant booking.',
            'hero_image_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
            'about_story_image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
            'cta_title' => 'Are You a Creator or Influencer?',
            'cta_subtitle' => 'Monetize your audience with premium brand deals. Set your fixed rates, receive pre-paid bookings, and manage all your sponsorships in one place.',
            'footer_about' => 'The premier zero-commission marketplace connecting innovative brands directly with high-impact social media creators.',
            'terms_content' => 'Welcome to InfluencerConnect. By accessing or using our platform, you agree to comply with our terms and guidelines for brands and creators.',
            'privacy_content' => 'Your privacy is paramount. InfluencerConnect ensures secure handling of user accounts, transactions, verified analytics, and campaign briefs.'
        ];

        if ($requestMethod === 'POST' || $requestMethod === 'PUT') {
            $store = getStore();
            $currentSettings = is_array($store['site_settings'] ?? null) && !empty($store['site_settings']) 
                ? array_merge($defaultSettings, $store['site_settings']) 
                : $defaultSettings;

            foreach ($body as $k => $v) {
                if ($k !== 'endpoint' && $k !== 'subEndpoint') {
                    $currentSettings[$k] = $v;
                }
            }

            $store['site_settings'] = $currentSettings;
            saveStore($store);

            if ($db) {
                try {
                    $db->exec("CREATE TABLE IF NOT EXISTS site_settings (
                        setting_key VARCHAR(100) PRIMARY KEY,
                        setting_value TEXT,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )");
                    $stmt = $db->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = :v2");
                    foreach ($currentSettings as $k => $v) {
                        $valStr = is_array($v) ? json_encode($v) : (string)$v;
                        $stmt->execute(['k' => $k, 'v' => $valStr, 'v2' => $valStr]);
                    }
                } catch (Exception $e) {}
            }

            jsonResponse(['status' => 'success', 'data' => $currentSettings, 'message' => 'Site settings & assets updated successfully.']);
        } else {
            $settings = $defaultSettings;
            if ($db) {
                try {
                    $db->exec("CREATE TABLE IF NOT EXISTS site_settings (
                        setting_key VARCHAR(100) PRIMARY KEY,
                        setting_value TEXT,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )");
                    $stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
                    $rows = $stmt->fetchAll();
                    if (!empty($rows)) {
                        foreach ($rows as $r) {
                            $settings[$r['setting_key']] = $r['setting_value'];
                        }
                    }
                } catch (Exception $e) {}
            }
            $store = getStore();
            if (isset($store['site_settings']) && is_array($store['site_settings']) && !empty($store['site_settings'])) {
                $settings = array_merge($settings, $store['site_settings']);
            }
            jsonResponse(['status' => 'success', 'data' => $settings]);
        }
        break;

    case 'upload':
        $fileData = $_FILES['file'] ?? ($_FILES['image'] ?? null);
        if (!$fileData || empty($fileData['name'])) {
            jsonResponse(['status' => 'error', 'message' => 'No image file uploaded in request.'], 400);
        }
        if ($fileData['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['status' => 'error', 'message' => 'File upload failed with code: ' . $fileData['error']], 400);
        }

        $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        $fileExt = strtolower(pathinfo($fileData['name'], PATHINFO_EXTENSION));
        if (!in_array($fileExt, $allowedExts)) {
            jsonResponse(['status' => 'error', 'message' => 'Invalid file extension. Please upload JPG, PNG, WEBP, GIF, or SVG.'], 400);
        }

        $folder = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['folder'] ?? 'assets');
        if (empty($folder)) $folder = 'assets';

        $uploadDir = __DIR__ . '/../uploads/' . $folder . '/';
        if (!file_exists($uploadDir)) {
            @mkdir($uploadDir, 0777, true);
        }

        $uniqueName = 'asset_' . time() . '_' . bin2hex(random_bytes(6)) . '.' . $fileExt;
        $destPath = $uploadDir . $uniqueName;

        if (!move_uploaded_file($fileData['tmp_name'], $destPath)) {
            jsonResponse(['status' => 'error', 'message' => 'Failed to save uploaded image file on server.'], 500);
        }

        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $assetUrl = "{$protocol}://{$host}/influencer/uploads/{$folder}/{$uniqueName}";

        jsonResponse([
            'status' => 'success',
            'message' => 'Image uploaded successfully.',
            'url' => $assetUrl,
            'filename' => $uniqueName
        ]);
        break;

    case 'influencers':
        if ($requestMethod === 'POST') {
            $name = trim($body['name'] ?? 'New Creator');
            $username = trim($body['username'] ?? ('@' . strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name)) . rand(10, 99)));
            $category = trim($body['category'] ?? 'Fashion');
            $city = trim($body['city'] ?? 'Mumbai');
            $startingPrice = floatval($body['starting_price'] ?? $body['startingPrice'] ?? 10000);
            $followers = intval($body['followers'] ?? 50000);
            $avatar = trim($body['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300');
            $bio = trim($body['bio'] ?? 'Authentic verified content creator.');
            $verified = !empty($body['verified']);
            $experience = trim($body['experience_years'] ?? '3 Years');

            $newId = 0;
            if ($db) {
                try {
                    $uStmt = $db->prepare("INSERT INTO users (name, email, password, role, avatar) VALUES (:name, :email, :pass, 'influencer', :avatar)");
                    $uStmt->execute([
                        'name' => $name,
                        'email' => strtolower(str_replace('@', '', $username)) . '@creator.connect',
                        'pass' => password_hash('creator123', PASSWORD_BCRYPT),
                        'avatar' => $avatar
                    ]);
                    $userId = (int)$db->lastInsertId();

                    $pStmt = $db->prepare("INSERT INTO influencer_profiles (user_id, name, username, bio, city, category, starting_price, followers, avatar, verified, rating) VALUES (:uid, :name, :uname, :bio, :city, :cat, :price, :foll, :avatar, :ver, 5.0)");
                    $pStmt->execute([
                        'uid' => $userId,
                        'name' => $name,
                        'uname' => $username,
                        'bio' => $bio,
                        'city' => $city,
                        'cat' => $category,
                        'price' => $startingPrice,
                        'foll' => $followers,
                        'avatar' => $avatar,
                        'ver' => $verified ? 1 : 0
                    ]);
                    $newId = (int)$db->lastInsertId();
                } catch (Exception $e) {}
            }

            $store = getStore();
            if (!$newId) {
                $newId = count($store['influencers'] ?? []) + 1;
            }

            $newCreator = [
                'id' => $newId,
                'user_id' => $newId + 10,
                'name' => $name,
                'username' => $username,
                'bio' => $bio,
                'category' => $category,
                'city' => $city,
                'state' => 'India',
                'country' => 'India',
                'languages' => 'English, Hindi',
                'avatar' => $avatar,
                'cover_image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
                'content_style' => 'Professional Creator',
                'followers' => $followers,
                'starting_price' => $startingPrice,
                'verified' => $verified,
                'rating' => 5.0,
                'views_count' => 500,
                'services' => [
                    ['type' => 'Instagram Reel', 'price' => $startingPrice * 1.5, 'desc' => '30-60 sec customized video'],
                    ['type' => 'Instagram Story', 'price' => $startingPrice, 'desc' => '24-hr story mention with link']
                ],
                'portfolio' => [$avatar],
                'socials' => [
                    'instagram' => ['followers' => round($followers/1000) . 'K', 'url' => 'https://instagram.com/' . str_replace('@', '', $username)]
                ]
            ];

            if (!isset($store['influencers'])) $store['influencers'] = [];
            $store['influencers'][] = $newCreator;
            saveStore($store);

            jsonResponse(['status' => 'success', 'message' => 'Creator profile added successfully', 'data' => $newCreator]);
        } elseif ($requestMethod === 'PUT') {
            $id = intval($body['id'] ?? 0);
            if ($id <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Valid influencer ID is required'], 400);
            }

            if ($db) {
                try {
                    $fields = [];
                    $params = ['id' => $id];

                    if (isset($body['verified'])) {
                        $fields[] = "verified = :verified";
                        $params['verified'] = $body['verified'] ? 1 : 0;
                    }
                    if (isset($body['starting_price'])) {
                        $fields[] = "starting_price = :price";
                        $params['price'] = floatval($body['starting_price']);
                    }
                    if (isset($body['followers'])) {
                        $fields[] = "followers = :foll";
                        $params['foll'] = intval($body['followers']);
                    }
                    if (isset($body['category'])) {
                        $fields[] = "category = :cat";
                        $params['cat'] = trim($body['category']);
                    }
                    if (isset($body['bio'])) {
                        $fields[] = "bio = :bio";
                        $params['bio'] = trim($body['bio']);
                    }

                    if (!empty($fields)) {
                        $sql = "UPDATE influencer_profiles SET " . implode(", ", $fields) . " WHERE id = :id";
                        $stmt = $db->prepare($sql);
                        $stmt->execute($params);
                    }
                } catch (Exception $e) {}
            }

            $store = getStore();
            $updatedCreator = null;
            if (isset($store['influencers']) && is_array($store['influencers'])) {
                foreach ($store['influencers'] as &$inf) {
                    if (($inf['id'] ?? 0) == $id || ($inf['user_id'] ?? 0) == $id) {
                        if (isset($body['verified'])) $inf['verified'] = (bool)$body['verified'];
                        if (isset($body['starting_price'])) $inf['starting_price'] = floatval($body['starting_price']);
                        if (isset($body['followers'])) $inf['followers'] = intval($body['followers']);
                        if (isset($body['category'])) $inf['category'] = trim($body['category']);
                        if (isset($body['bio'])) $inf['bio'] = trim($body['bio']);
                        if (isset($body['name'])) $inf['name'] = trim($body['name']);
                        if (isset($body['city'])) $inf['city'] = trim($body['city']);
                        $updatedCreator = $inf;
                        break;
                    }
                }
                saveStore($store);
            }

            jsonResponse(['status' => 'success', 'message' => 'Creator profile updated successfully', 'data' => $updatedCreator ?: $body]);
        } elseif ($requestMethod === 'DELETE') {
            $id = intval($_GET['id'] ?? $body['id'] ?? 0);
            if ($id <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Valid influencer ID is required'], 400);
            }

            if ($db) {
                try {
                    $stmt = $db->prepare("DELETE FROM influencer_profiles WHERE id = :id");
                    $stmt->execute(['id' => $id]);
                } catch (Exception $e) {}
            }

            $store = getStore();
            if (isset($store['influencers'])) {
                $store['influencers'] = array_values(array_filter($store['influencers'], function($inf) use ($id) {
                    return ($inf['id'] ?? 0) != $id;
                }));
                saveStore($store);
            }

            jsonResponse(['status' => 'success', 'message' => "Creator #$id deleted successfully."]);
        } else {
            if ($db) {
                try {
                    $query = "SELECT * FROM influencer_profiles WHERE 1=1";
                    $params = [];

                    if (!empty($_GET['category'])) {
                        $query .= " AND category = :cat";
                        $params['cat'] = $_GET['category'];
                    }
                    if (!empty($_GET['city'])) {
                        $query .= " AND city = :city";
                        $params['city'] = $_GET['city'];
                    }
                    if (!empty($_GET['search'])) {
                        $query .= " AND (name LIKE :s OR bio LIKE :s OR category LIKE :s)";
                        $params['s'] = '%' . $_GET['search'] . '%';
                    }
                    $query .= " ORDER BY rating DESC";

                    $stmt = $db->prepare($query);
                    $stmt->execute($params);
                    $influencers = $stmt->fetchAll();

                    foreach ($influencers as &$inf) {
                        $inf['verified'] = (bool)$inf['verified'];
                        $inf['starting_price'] = floatval($inf['starting_price']);
                        $inf['followers'] = intval($inf['followers']);
                        $inf['rating'] = floatval($inf['rating']);

                        $sStmt = $db->prepare("SELECT service_type AS type, price, description AS `desc` FROM services_charges WHERE influencer_id = :id");
                        $sStmt->execute(['id' => $inf['id']]);
                        $inf['services'] = $sStmt->fetchAll();

                        $pStmt = $db->prepare("SELECT url FROM portfolio_items WHERE influencer_id = :id");
                        $pStmt->execute(['id' => $inf['id']]);
                        $inf['portfolio'] = array_column($pStmt->fetchAll(), 'url');

                        $inf['socials'] = [
                            'instagram' => ['followers' => round($inf['followers']/1000) . 'K', 'url' => 'https://instagram.com']
                        ];
                    }

                    jsonResponse(['status' => 'success', 'data' => $influencers]);
                } catch (Exception $e) {}
            }

            $store = getStore();
            $list = $store['influencers'] ?? [];
            jsonResponse(['status' => 'success', 'data' => array_values($list)]);
        }
        break;

    case 'users':
        if ($requestMethod === 'POST') {
            $name = trim($body['name'] ?? 'New Business Client');
            $company = trim($body['company'] ?? 'Brand Enterprise');
            $email = trim($body['email'] ?? ('client_' . time() . '@connect.com'));
            $role = trim($body['role'] ?? 'Brand Account');
            $phone = trim($body['phone'] ?? '+91 98765 43210');
            $status = trim($body['status'] ?? 'Active');
            $avatar = trim($body['avatar'] ?? $body['img'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');

            $newId = 0;
            if ($db) {
                try {
                    $stmt = $db->prepare("INSERT INTO users (name, email, role, phone, avatar) VALUES (:name, :email, :role, :phone, :avatar)");
                    $stmt->execute([
                        'name' => $name,
                        'email' => $email,
                        'role' => $role === 'Brand Account' ? 'user' : ($role === 'Agency' ? 'user' : 'user'),
                        'phone' => $phone,
                        'avatar' => $avatar
                    ]);
                    $newId = (int)$db->lastInsertId();
                } catch (Exception $e) {}
            }

            $store = getStore();
            if (!$newId) {
                $newId = count($store['users'] ?? []) + 1;
            }

            $newUser = [
                'id' => $newId,
                'name' => $name,
                'company' => $company,
                'email' => $email,
                'role' => $role,
                'phone' => $phone,
                'status' => $status,
                'avatar' => $avatar,
                'img' => $avatar,
                'created_at' => date('Y-m-d')
            ];

            if (!isset($store['users'])) $store['users'] = [];
            $store['users'][] = $newUser;
            saveStore($store);

            jsonResponse(['status' => 'success', 'message' => 'Business user registered successfully', 'data' => $newUser]);
        } elseif ($requestMethod === 'PUT') {
            $id = intval($body['id'] ?? 0);
            $newStatus = trim($body['status'] ?? '');

            if ($id <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Valid User ID required'], 400);
            }

            $store = getStore();
            $updatedUser = null;
            if (isset($store['users']) && is_array($store['users'])) {
                foreach ($store['users'] as &$u) {
                    if (($u['id'] ?? 0) == $id) {
                        if (!empty($newStatus)) $u['status'] = $newStatus;
                        if (!empty($body['company'])) $u['company'] = trim($body['company']);
                        if (!empty($body['role'])) $u['role'] = trim($body['role']);
                        if (!empty($body['name'])) $u['name'] = trim($body['name']);
                        if (!empty($body['email'])) $u['email'] = trim($body['email']);
                        $updatedUser = $u;
                        break;
                    }
                }
                saveStore($store);
            }

            jsonResponse(['status' => 'success', 'message' => "User status updated to {$newStatus}", 'data' => $updatedUser ?: $body]);
        } elseif ($requestMethod === 'DELETE') {
            $id = intval($_GET['id'] ?? $body['id'] ?? 0);
            if ($id <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Valid User ID required'], 400);
            }

            $store = getStore();
            if (isset($store['users'])) {
                $store['users'] = array_values(array_filter($store['users'], function($u) use ($id) {
                    return ($u['id'] ?? 0) != $id;
                }));
                saveStore($store);
            }

            jsonResponse(['status' => 'success', 'message' => "User #$id removed successfully."]);
        } else {
            $store = getStore();
            $usersList = $store['users'] ?? [];
            jsonResponse(['status' => 'success', 'data' => array_values($usersList)]);
        }
        break;

    case 'influencer':
        $id = intval($_GET['id'] ?? $body['id'] ?? $body['influencer_id'] ?? 1);

        if ($requestMethod === 'POST' || $requestMethod === 'PUT') {
            if ($db) {
                try {
                    // Update starting price, bio, name if provided
                    if (!empty($body['bio']) || !empty($body['starting_price'])) {
                        $uStmt = $db->prepare("UPDATE influencer_profiles SET bio = COALESCE(:bio, bio), starting_price = COALESCE(:price, starting_price) WHERE id = :id OR user_id = :id");
                        $uStmt->execute([
                            'bio' => $body['bio'] ?? null,
                            'price' => !empty($body['starting_price']) ? floatval($body['starting_price']) : null,
                            'id' => $id
                        ]);
                    }

                    // Save services charges
                    if (isset($body['services']) && is_array($body['services'])) {
                        $delStmt = $db->prepare("DELETE FROM services_charges WHERE influencer_id = :id");
                        $delStmt->execute(['id' => $id]);

                        $insStmt = $db->prepare("INSERT INTO services_charges (influencer_id, service_type, price, description) VALUES (:id, :type, :price, :desc)");
                        foreach ($body['services'] as $srv) {
                            $insStmt->execute([
                                'id' => $id,
                                'type' => $srv['type'] ?? 'Service',
                                'price' => floatval($srv['price'] ?? 0),
                                'desc' => $srv['desc'] ?? ''
                            ]);
                        }
                    }
                } catch (Exception $e) {}
            }

            // Sync in store json fallback as well
            $store = getStore();
            foreach ($store['influencers'] as &$inf) {
                if (($inf['id'] ?? 0) == $id || ($inf['user_id'] ?? 0) == $id) {
                    if (isset($body['services'])) $inf['services'] = $body['services'];
                    if (isset($body['bio'])) $inf['bio'] = $body['bio'];
                    if (isset($body['starting_price'])) $inf['starting_price'] = floatval($body['starting_price']);
                    break;
                }
            }
            saveStore($store);
            jsonResponse(['status' => 'success', 'message' => 'Influencer profile updated successfully']);
        }

        if ($db) {
            try {
                $stmt = $db->prepare("SELECT * FROM influencer_profiles WHERE id = :id OR user_id = :id LIMIT 1");
                $stmt->execute(['id' => $id]);
                $found = $stmt->fetch();
                if ($found) {
                    $found['verified'] = (bool)$found['verified'];
                    $found['starting_price'] = floatval($found['starting_price']);
                    $found['followers'] = intval($found['followers']);

                    $sStmt = $db->prepare("SELECT service_type AS type, price, description AS `desc` FROM services_charges WHERE influencer_id = :id");
                    $sStmt->execute(['id' => $found['id']]);
                    $found['services'] = $sStmt->fetchAll();

                    $pStmt = $db->prepare("SELECT url FROM portfolio_items WHERE influencer_id = :id");
                    $pStmt->execute(['id' => $found['id']]);
                    $found['portfolio'] = array_column($pStmt->fetchAll(), 'url');

                    jsonResponse(['status' => 'success', 'data' => $found]);
                }
            } catch (Exception $e) {}
        }

        $store = getStore();
        foreach ($store['influencers'] as $inf) {
            if ($inf['id'] === $id || $inf['user_id'] === $id) {
                jsonResponse(['status' => 'success', 'data' => $inf]);
            }
        }
        jsonResponse(['status' => 'error', 'message' => 'Not found'], 404);
        break;

    case 'availability':
        $influencerId = intval($_GET['influencer_id'] ?? $_GET['iid'] ?? $body['influencer_id'] ?? $body['user_id'] ?? 0);

        // Auto-create MySQL table if DB is connected
        if ($db) {
            try {
                $db->exec("CREATE TABLE IF NOT EXISTS influencer_availability (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    influencer_id INT NOT NULL,
                    from_date DATE NOT NULL,
                    to_date DATE NOT NULL,
                    status ENUM('available', 'busy', 'holiday') DEFAULT 'available',
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )");
            } catch (Exception $e) {}
        }

        if ($requestMethod === 'GET') {
            if ($db) {
                try {
                    $stmt = $db->prepare("SELECT * FROM influencer_availability WHERE influencer_id = :iid ORDER BY from_date ASC");
                    $stmt->execute(['iid' => $influencerId]);
                    $records = $stmt->fetchAll();
                    if ($records && count($records) > 0) {
                        jsonResponse(['status' => 'success', 'data' => $records]);
                    }
                } catch (Exception $e) {}
            }

            $store = getStore();
            $availList = array_values(array_filter($store['availability'] ?? [], function($a) use ($influencerId) {
                return $influencerId == 0 || ($a['influencer_id'] ?? 0) == $influencerId;
            }));
            jsonResponse(['status' => 'success', 'data' => $availList]);
        } 
        else if ($requestMethod === 'POST' || $requestMethod === 'PUT') {
            $fromDate = trim($body['from_date'] ?? '');
            $toDate = trim($body['to_date'] ?? '');
            $rawStatus = strtolower(trim($body['status'] ?? 'available'));
            $status = 'available';
            if (str_contains($rawStatus, 'busy') || str_contains($rawStatus, 'not') || $rawStatus === 'busy') {
                $status = 'busy';
            } else if (str_contains($rawStatus, 'holiday') || str_contains($rawStatus, 'off') || $rawStatus === 'holiday') {
                $status = 'holiday';
            }
            $notes = trim($body['notes'] ?? '');
            $recId = intval($body['id'] ?? 0);

            // Validation 1: Required fields
            if (empty($fromDate) || empty($toDate)) {
                jsonResponse(['status' => 'error', 'message' => 'Both From Date and To Date are required.'], 400);
            }

            // Validation 2: To Date cannot be earlier than From Date
            if (strtotime($toDate) < strtotime($fromDate)) {
                jsonResponse(['status' => 'error', 'message' => 'To Date cannot be earlier than From Date.'], 400);
            }

            // Validation 3: Past date check for new entries
            $today = date('Y-m-d');
            if (strtotime($fromDate) < strtotime($today) && !$recId) {
                jsonResponse(['status' => 'error', 'message' => 'Past dates are not allowed when adding new availability periods.'], 400);
            }

            if ($db) {
                try {
                    if ($recId > 0) {
                        $stmt = $db->prepare("UPDATE influencer_availability SET from_date = :fdate, to_date = :tdate, status = :status, notes = :notes WHERE id = :id");
                        $stmt->execute([
                            'fdate' => $fromDate,
                            'tdate' => $toDate,
                            'status' => $status,
                            'notes' => $notes,
                            'id' => $recId
                        ]);
                    } else {
                        $stmt = $db->prepare("INSERT INTO influencer_availability (influencer_id, from_date, to_date, status, notes) VALUES (:iid, :fdate, :tdate, :status, :notes)");
                        $stmt->execute([
                            'iid' => $influencerId ?: 1,
                            'fdate' => $fromDate,
                            'tdate' => $toDate,
                            'status' => $status,
                            'notes' => $notes
                        ]);
                        $recId = $db->lastInsertId();
                    }
                } catch (Exception $e) {}
            }

            // JSON Store sync & overlap resolution
            $store = getStore();
            if (!isset($store['availability'])) $store['availability'] = [];

            if ($recId > 0) {
                $found = false;
                foreach ($store['availability'] as &$item) {
                    if (($item['id'] ?? 0) == $recId) {
                        $item['from_date'] = $fromDate;
                        $item['to_date'] = $toDate;
                        $item['status'] = $status;
                        $item['notes'] = $notes;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $store['availability'][] = [
                        'id' => $recId,
                        'influencer_id' => $influencerId ?: 1,
                        'from_date' => $fromDate,
                        'to_date' => $toDate,
                        'status' => $status,
                        'notes' => $notes,
                        'created_at' => date('Y-m-d H:i:s')
                    ];
                }
            } else {
                $newId = 1;
                foreach ($store['availability'] as $item) {
                    if (($item['id'] ?? 0) >= $newId) $newId = $item['id'] + 1;
                }
                $newRec = [
                    'id' => $newId,
                    'influencer_id' => $influencerId ?: 1,
                    'from_date' => $fromDate,
                    'to_date' => $toDate,
                    'status' => $status,
                    'notes' => $notes,
                    'created_at' => date('Y-m-d H:i:s')
                ];
                $store['availability'][] = $newRec;
                $recId = $newId;
            }

            saveStore($store);
            jsonResponse([
                'status' => 'success',
                'message' => 'Availability range saved successfully.',
                'data' => [
                    'id' => $recId,
                    'influencer_id' => $influencerId ?: 1,
                    'from_date' => $fromDate,
                    'to_date' => $toDate,
                    'status' => $status,
                    'notes' => $notes
                ]
            ]);
        }
        else if ($requestMethod === 'DELETE') {
            $recId = intval($_GET['id'] ?? $body['id'] ?? 0);
            if (!$recId) {
                jsonResponse(['status' => 'error', 'message' => 'Invalid availability record ID.'], 400);
            }

            if ($db) {
                try {
                    $stmt = $db->prepare("DELETE FROM influencer_availability WHERE id = :id");
                    $stmt->execute(['id' => $recId]);
                } catch (Exception $e) {}
            }

            $store = getStore();
            if (isset($store['availability'])) {
                $store['availability'] = array_values(array_filter($store['availability'], function($a) use ($recId) {
                    return ($a['id'] ?? 0) != $recId;
                }));
                saveStore($store);
            }
            jsonResponse(['status' => 'success', 'message' => 'Availability record deleted successfully.', 'deleted_id' => $recId]);
        }
        break;

    case 'analytics':
        $userId = intval($_GET['user_id'] ?? $_GET['uid'] ?? $body['user_id'] ?? 0);
        $role = trim($_GET['role'] ?? $body['role'] ?? '');
        $dateFilter = trim($_GET['date_filter'] ?? $_GET['filter'] ?? '30days');

        if ($userId <= 0) {
            jsonResponse(['status' => 'error', 'message' => 'Authentication required for creator analytics.'], 401);
        }

        // Fetch user record
        $authUser = null;
        if ($db) {
            try {
                $uStmt = $db->prepare("SELECT * FROM users WHERE id = :uid LIMIT 1");
                $uStmt->execute(['uid' => $userId]);
                $authUser = $uStmt->fetch();
            } catch (Exception $e) {}
        }

        if (!$authUser) {
            $store = getStore();
            foreach ($store['users'] ?? [] as $u) {
                if (($u['id'] ?? 0) == $userId) {
                    $authUser = $u;
                    break;
                }
            }
        }

        $userRole = strtolower(trim($authUser['role'] ?? $role ?? 'user'));
        if ($userRole !== 'influencer' && $userRole !== 'creator') {
            jsonResponse(['status' => 'error', 'message' => 'Access denied. Analytics are available to Creator accounts only.'], 403);
        }

        // Find Influencer ID
        $targetInfId = 0;
        $infName = $authUser['name'] ?? '';

        if ($db) {
            try {
                $infStmt = $db->prepare("SELECT id FROM influencer_profiles WHERE user_id = :uid LIMIT 1");
                $infStmt->execute(['uid' => $userId]);
                $infRow = $infStmt->fetch();
                if ($infRow) $targetInfId = intval($infRow['id']);
            } catch (Exception $e) {}
        }

        $store = getStore();
        if (!$targetInfId) {
            foreach ($store['influencers'] ?? [] as $infRec) {
                if (($infRec['user_id'] ?? 0) == $userId || strtolower($infRec['email'] ?? '') === strtolower($authUser['email'] ?? '')) {
                    $targetInfId = intval($infRec['id']);
                    break;
                }
            }
        }

        if (!$targetInfId) {
            $targetInfId = $userId;
        }

        // Determine cutoff date for filtering
        $today = new DateTime();
        $cutoffStr = '2000-01-01';
        if ($dateFilter === '7days') {
            $cutoffStr = (clone $today)->modify('-7 days')->format('Y-m-d');
        } else if ($dateFilter === '30days') {
            $cutoffStr = (clone $today)->modify('-30 days')->format('Y-m-d');
        } else if ($dateFilter === '3months') {
            $cutoffStr = (clone $today)->modify('-3 months')->format('Y-m-d');
        } else if ($dateFilter === '6months') {
            $cutoffStr = (clone $today)->modify('-6 months')->format('Y-m-d');
        } else if ($dateFilter === '12months') {
            $cutoffStr = (clone $today)->modify('-12 months')->format('Y-m-d');
        } else if ($dateFilter === 'this_year') {
            $cutoffStr = date('Y-01-01');
        }

        // Query bookings
        $myBookings = [];
        if ($db) {
            try {
                $bStmt = $db->prepare("SELECT * FROM bookings WHERE (influencer_id = :iid OR influencer_id = :uid) ORDER BY created_at DESC");
                $bStmt->execute(['iid' => $targetInfId, 'uid' => $userId]);
                $myBookings = $bStmt->fetchAll();
            } catch (Exception $e) {}
        }

        if (empty($myBookings)) {
            foreach ($store['bookings'] ?? [] as $b) {
                $bInfId = $b['influencer_id'] ?? 0;
                $bInfUserId = $b['influencer_user_id'] ?? 0;
                $bInfName = strtolower($b['influencer_name'] ?? '');
                if ($bInfId == $targetInfId || $bInfId == $userId || $bInfUserId == $userId || ($bInfName !== '' && $bInfName === strtolower($infName))) {
                    $myBookings[] = $b;
                }
            }
        }

        // Compute metrics
        $totalBookings = count($myBookings);
        $periodBookings = 0;
        $completedCount = 0;
        $acceptedCount = 0;
        $pendingCount = 0;
        $rejectedCount = 0;
        $cancelledCount = 0;

        $totalEarnings = 0;
        $periodEarnings = 0;
        $pendingEarnings = 0;

        $monthlyTrendMap = [];
        $serviceCountsMap = [];

        foreach ($myBookings as $b) {
            $bDate = $b['created_at'] ?? $b['date'] ?? $b['booking_date'] ?? date('Y-m-d');
            $bStatus = strtolower(trim($b['status'] ?? 'pending'));
            $bBudget = floatval($b['budget'] ?? $b['amount'] ?? 0);
            $bService = $b['promotion_type'] ?? $b['service_type'] ?? 'General Campaign';

            if ($bStatus === 'completed') {
                $completedCount++;
                $totalEarnings += $bBudget;
            } else if ($bStatus === 'accepted') {
                $acceptedCount++;
                $totalEarnings += $bBudget;
            } else if ($bStatus === 'pending') {
                $pendingCount++;
                $pendingEarnings += $bBudget;
            } else if ($bStatus === 'rejected') {
                $rejectedCount++;
            } else if ($bStatus === 'cancelled') {
                $cancelledCount++;
            }

            if (strtotime($bDate) >= strtotime($cutoffStr)) {
                $periodBookings++;
                if ($bStatus === 'completed' || $bStatus === 'accepted') {
                    $periodEarnings += $bBudget;
                }

                $mKey = date('M Y', strtotime($bDate));
                if (!isset($monthlyTrendMap[$mKey])) {
                    $monthlyTrendMap[$mKey] = ['month' => $mKey, 'bookings' => 0, 'earnings' => 0];
                }
                $monthlyTrendMap[$mKey]['bookings']++;
                if ($bStatus === 'completed' || $bStatus === 'accepted') {
                    $monthlyTrendMap[$mKey]['earnings'] += $bBudget;
                }

                if (!isset($serviceCountsMap[$bService])) {
                    $serviceCountsMap[$bService] = 0;
                }
                $serviceCountsMap[$bService]++;
            }
        }

        // Profile views
        $totalViews = 0;
        $periodViews = 0;
        foreach ($store['profile_views'] ?? [] as $pv) {
            if (($pv['influencer_id'] ?? 0) == $targetInfId || ($pv['influencer_id'] ?? 0) == $userId) {
                $totalViews++;
                if (strtotime($pv['viewed_at'] ?? '2000-01-01') >= strtotime($cutoffStr)) {
                    $periodViews++;
                }
            }
        }

        // Message inquiries count
        $totalMessages = 0;
        $periodMessages = 0;
        foreach ($store['messages'] ?? [] as $m) {
            if (($m['receiver_id'] ?? 0) == $userId || ($m['sender_id'] ?? 0) == $userId) {
                $totalMessages++;
                if (strtotime($m['created_at'] ?? '2000-01-01') >= strtotime($cutoffStr)) {
                    $periodMessages++;
                }
            }
        }

        // Conversion Rate %
        $conversionRate = ($totalBookings > 0)
            ? round((($completedCount + $acceptedCount) / $totalBookings) * 100, 1)
            : 0;

        arsort($serviceCountsMap);
        $topService = !empty($serviceCountsMap) ? array_key_first($serviceCountsMap) : 'N/A';

        $avgBookingVal = ($completedCount + $acceptedCount > 0)
            ? round($totalEarnings / ($completedCount + $acceptedCount))
            : 0;

        jsonResponse([
            'status' => 'success',
            'influencer_id' => $targetInfId,
            'user_id' => $userId,
            'date_filter' => $dateFilter,
            'data' => [
                'overview' => [
                    'total_bookings' => $totalBookings,
                    'period_bookings' => $periodBookings,
                    'completed_bookings' => $completedCount,
                    'accepted_bookings' => $acceptedCount,
                    'pending_bookings' => $pendingCount,
                    'rejected_bookings' => $rejectedCount,
                    'cancelled_bookings' => $cancelledCount,
                    'total_earnings' => $totalEarnings,
                    'period_earnings' => $periodEarnings,
                    'pending_earnings' => $pendingEarnings,
                    'profile_views_total' => $totalViews,
                    'profile_views_period' => $periodViews,
                    'total_messages' => $totalMessages,
                    'period_messages' => $periodMessages,
                    'conversion_rate' => $conversionRate,
                    'top_service' => $topService,
                    'avg_booking_value' => $avgBookingVal
                ],
                'monthly_trend' => array_values($monthlyTrendMap),
                'services_breakdown' => $serviceCountsMap,
                'status_distribution' => [
                    'completed' => $completedCount,
                    'accepted' => $acceptedCount,
                    'pending' => $pendingCount,
                    'rejected' => $rejectedCount,
                    'cancelled' => $cancelledCount
                ]
            ]
        ]);
    case 'reports':
        $timeframe = trim($_GET['timeframe'] ?? $_GET['period'] ?? 'all');
        $statusFilter = trim($_GET['status'] ?? 'all');
        $searchQuery = strtolower(trim($_GET['search'] ?? ''));

        // Fetch all bookings
        $allBookings = [];
        if ($db) {
            try {
                $stmt = $db->query("SELECT b.*, u.name AS user_name, u.email AS user_email, COALESCE(p.name, b.influencer_name) AS influencer_name, p.category AS influencer_category FROM bookings b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN influencer_profiles p ON b.influencer_id = p.id ORDER BY b.id DESC");
                $allBookings = $stmt->fetchAll();
            } catch (Exception $e) {}
        }

        if (empty($allBookings)) {
            $store = getStore();
            $allBookings = $store['bookings'] ?? [];
        }

        // Fetch commission rate from site settings
        $commissionFeePercent = 10;
        if ($db) {
            try {
                $stStmt = $db->query("SELECT setting_value FROM site_settings WHERE setting_key = 'commission_fee' LIMIT 1");
                $val = $stStmt->fetchColumn();
                if ($val !== false && is_numeric($val)) $commissionFeePercent = floatval($val);
            } catch (Exception $e) {}
        } else {
            $store = getStore();
            if (isset($store['site_settings']['commission_fee'])) {
                $commissionFeePercent = floatval($store['site_settings']['commission_fee']);
            }
        }

        // Date timeframe filter calculation
        $today = new DateTime();
        $cutoffStr = '2000-01-01';
        if ($timeframe === '7days' || $timeframe === 'Week') {
            $cutoffStr = (clone $today)->modify('-7 days')->format('Y-m-d');
        } else if ($timeframe === '30days' || $timeframe === 'Month') {
            $cutoffStr = (clone $today)->modify('-30 days')->format('Y-m-d');
        } else if ($timeframe === '90days' || $timeframe === 'Quarter') {
            $cutoffStr = (clone $today)->modify('-90 days')->format('Y-m-d');
        } else if ($timeframe === 'year' || $timeframe === 'Year') {
            $cutoffStr = date('Y-01-01');
        }

        $totalGMV = 0;
        $escrowHeld = 0;
        $escrowReleased = 0;
        $escrowRefunded = 0;
        $filteredDealsCount = 0;
        $monthlyMap = [];
        $categoryMap = [];
        $creatorMap = [];
        $brandMap = [];
        $ledger = [];

        foreach ($allBookings as $b) {
            $id = intval($b['id']);
            $budget = floatval($b['budget'] ?? 0);
            $status = strtolower(trim($b['status'] ?? 'pending'));
            $date = $b['booking_date'] ?? ($b['date'] ?? date('Y-m-d'));
            $cName = $b['influencer_name'] ?? 'Creator';
            $bName = $b['business_name'] ?? 'Brand Client';
            $cat = $b['influencer_category'] ?? ($b['promotion_type'] ?? 'General');

            // Timeframe check
            if (strtotime($date) < strtotime($cutoffStr)) {
                continue;
            }

            // Status filter check
            if ($statusFilter !== 'all' && $status !== $statusFilter) {
                continue;
            }

            // Search filter
            if (!empty($searchQuery)) {
                $match = str_contains(strtolower($cName), $searchQuery) ||
                         str_contains(strtolower($bName), $searchQuery) ||
                         str_contains(strtolower($b['campaign_name'] ?? ''), $searchQuery) ||
                         str_contains((string)$id, $searchQuery);
                if (!$match) continue;
            }

            $filteredDealsCount++;
            $fee = round($budget * ($commissionFeePercent / 100), 2);
            $net = round($budget - $fee, 2);

            $totalGMV += $budget;
            if ($status === 'accepted') {
                $escrowHeld += $budget;
            } else if ($status === 'completed') {
                $escrowReleased += $budget;
            } else if ($status === 'rejected' || $status === 'cancelled') {
                $escrowRefunded += $budget;
            }

            $monthKey = date('M Y', strtotime($date));
            if (!isset($monthlyMap[$monthKey])) {
                $monthlyMap[$monthKey] = ['month' => $monthKey, 'gmv' => 0, 'commission' => 0, 'released' => 0, 'deals' => 0];
            }
            $monthlyMap[$monthKey]['gmv'] += $budget;
            $monthlyMap[$monthKey]['deals']++;
            if ($status === 'accepted' || $status === 'completed') {
                $monthlyMap[$monthKey]['commission'] += $fee;
                if ($status === 'completed') $monthlyMap[$monthKey]['released'] += $net;
            }

            if (!isset($categoryMap[$cat])) {
                $categoryMap[$cat] = ['category' => $cat, 'volume' => 0, 'count' => 0];
            }
            $categoryMap[$cat]['volume'] += $budget;
            $categoryMap[$cat]['count']++;

            if (!isset($creatorMap[$cName])) {
                $creatorMap[$cName] = ['name' => $cName, 'total_earned' => 0, 'deals' => 0, 'category' => $cat];
            }
            if ($status === 'completed' || $status === 'accepted') {
                $creatorMap[$cName]['total_earned'] += $net;
            }
            $creatorMap[$cName]['deals']++;

            if (!isset($brandMap[$bName])) {
                $brandMap[$bName] = ['name' => $bName, 'total_spent' => 0, 'campaigns' => 0];
            }
            $brandMap[$bName]['total_spent'] += $budget;
            $brandMap[$bName]['campaigns']++;

            $ledger[] = [
                'id' => $id,
                'encrypted_id' => encryptId($id),
                'campaign_name' => $b['campaign_name'] ?? 'Campaign',
                'business_name' => $bName,
                'influencer_name' => $cName,
                'budget' => $budget,
                'platform_fee' => $fee,
                'creator_net' => $net,
                'status' => $status,
                'date' => $date,
                'accepted_at' => $b['accepted_at'] ?? null,
                'completed_at' => $b['completed_at'] ?? null,
                'settlement_status' => ($status === 'completed') ? 'Disbursed' : (($status === 'accepted') ? 'In Escrow' : (($status === 'rejected') ? 'Refunded' : 'Pending Approval'))
            ];
        }

        $platformCommission = round(($escrowHeld + $escrowReleased) * ($commissionFeePercent / 100), 2);
        $creatorDisbursed = round($escrowReleased * ((100 - $commissionFeePercent) / 100), 2);
        $avgDealSize = ($filteredDealsCount > 0) ? round($totalGMV / $filteredDealsCount, 2) : 0;

        uasort($creatorMap, function($a, $b) { return $b['total_earned'] <=> $a['total_earned']; });
        uasort($brandMap, function($a, $b) { return $b['total_spent'] <=> $a['total_spent']; });

        jsonResponse([
            'status' => 'success',
            'timeframe' => $timeframe,
            'status_filter' => $statusFilter,
            'generated_at' => date('Y-m-d H:i:s'),
            'metrics' => [
                'total_gmv' => $totalGMV,
                'platform_commission' => $platformCommission,
                'commission_rate_percent' => $commissionFeePercent,
                'escrow_held' => $escrowHeld,
                'escrow_released' => $escrowReleased,
                'creator_disbursed' => $creatorDisbursed,
                'escrow_refunded' => $escrowRefunded,
                'total_deals_count' => $filteredDealsCount,
                'avg_deal_size' => $avgDealSize,
                'settlement_rate_percent' => ($totalGMV > 0) ? round(($escrowReleased / $totalGMV) * 100, 1) : 0
            ],
            'monthly_trend' => array_values($monthlyMap),
            'category_breakdown' => array_values($categoryMap),
            'top_creators' => array_slice(array_values($creatorMap), 0, 6),
            'top_brands' => array_slice(array_values($brandMap), 0, 6),
            'ledger' => $ledger
        ]);
        break;

    case 'profile_views':
        if ($requestMethod === 'POST') {
            $infId = intval($body['influencer_id'] ?? 0);
            $viewerId = intval($body['viewer_id'] ?? 0);

            if ($infId > 0 && $infId != $viewerId) {
                $store = getStore();
                if (!isset($store['profile_views'])) $store['profile_views'] = [];
                $newPv = [
                    'id' => count($store['profile_views']) + 1,
                    'influencer_id' => $infId,
                    'viewer_id' => $viewerId,
                    'viewed_at' => date('Y-m-d H:i:s')
                ];
                $store['profile_views'][] = $newPv;
                saveStore($store);
                jsonResponse(['status' => 'success', 'message' => 'Profile view recorded']);
            }
            jsonResponse(['status' => 'ignored']);
        }
        break;

    case 'bookings':
        $userId = intval($_GET['user_id'] ?? $_GET['uid'] ?? $body['user_id'] ?? 0);
        $role = trim($_GET['role'] ?? $body['role'] ?? '');
        $influencerId = intval($_GET['influencer_id'] ?? $_GET['iid'] ?? $body['influencer_id'] ?? 0);

        if ($requestMethod === 'POST') {
            $bookingDate = $body['date'] ?? $body['booking_date'] ?? date('Y-m-d');
            $targetInfId = intval($body['influencer_id'] ?? $influencerId ?: 1);

            // 1. Authentication Check
            if ($userId <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Authentication required to submit booking requests.'], 401);
            }

            // Look up authenticated user record from DB or Store
            $authUser = null;
            if ($db) {
                try {
                    $uStmt = $db->prepare("SELECT * FROM users WHERE id = :uid LIMIT 1");
                    $uStmt->execute(['uid' => $userId]);
                    $authUser = $uStmt->fetch();
                } catch (Exception $e) {}
            }

            if (!$authUser) {
                $store = getStore();
                foreach ($store['users'] ?? [] as $u) {
                    if (($u['id'] ?? 0) == $userId) {
                        $authUser = $u;
                        break;
                    }
                }
            }

            $userRole = strtolower(trim($authUser['role'] ?? $role ?? 'user'));

            // 2. Strict Role Check: Influencer accounts CANNOT create bookings
            if ($userRole === 'influencer') {
                jsonResponse([
                    'status' => 'error',
                    'message' => 'Influencers cannot book influencers. Please log in with a Client/Business account to create campaign bookings.'
                ], 403);
            }

            // 3. Self-Booking Check: logged_in_user_id == influencer_id
            $targetInfUserId = 0;
            $targetInfEmail = '';
            if ($db) {
                try {
                    $infStmt = $db->prepare("SELECT id, user_id FROM influencer_profiles WHERE id = :iid OR user_id = :iid LIMIT 1");
                    $infStmt->execute(['iid' => $targetInfId]);
                    $infData = $infStmt->fetch();
                    if ($infData) {
                        $targetInfUserId = intval($infData['user_id'] ?: $infData['id']);
                    }
                } catch (Exception $e) {}
            }

            if (!$targetInfUserId) {
                $store = getStore();
                foreach ($store['influencers'] ?? [] as $infRec) {
                    if (($infRec['id'] ?? 0) == $targetInfId || ($infRec['user_id'] ?? 0) == $targetInfId) {
                        $targetInfUserId = intval($infRec['user_id'] ?? $infRec['id']);
                        $targetInfEmail = strtolower($infRec['email'] ?? '');
                        break;
                    }
                }
            }

            if ($userId == $targetInfId || $userId == $targetInfUserId || (!empty($targetInfEmail) && strtolower($authUser['email'] ?? '') === $targetInfEmail)) {
                jsonResponse([
                    'status' => 'error',
                    'message' => 'You cannot book yourself.'
                ], 400);
            }

            // 4. Past Date Check
            $today = date('Y-m-d');
            if (strtotime($bookingDate) < strtotime($today)) {
                jsonResponse([
                    'status' => 'error',
                    'message' => 'Booking date cannot be in the past. Please select an upcoming date.'
                ], 400);
            }

            // 5. Availability Check (Busy / Holiday)
            $store = getStore();
            $isUnavailable = false;
            $unavailStatus = '';
            $unavailNotes = '';

            if ($db) {
                try {
                    $chkStmt = $db->prepare("SELECT * FROM influencer_availability WHERE influencer_id = :iid AND status != 'available' AND :bdate BETWEEN from_date AND to_date LIMIT 1");
                    $chkStmt->execute(['iid' => $targetInfId, 'bdate' => $bookingDate]);
                    $unavail = $chkStmt->fetch();
                    if ($unavail) {
                        $isUnavailable = true;
                        $unavailStatus = ($unavail['status'] === 'busy') ? 'Busy / Not Available' : 'Holiday';
                        $unavailNotes = !empty($unavail['notes']) ? " ({$unavail['notes']})" : "";
                    }
                } catch (Exception $e) {}
            }

            if (!$isUnavailable) {
                foreach ($store['availability'] ?? [] as $avail) {
                    if (($avail['influencer_id'] ?? 0) == $targetInfId || $targetInfId == 0) {
                        $fDate = $avail['from_date'] ?? '';
                        $tDate = $avail['to_date'] ?? '';
                        $st = strtolower($avail['status'] ?? 'available');

                        if ($st !== 'available' && $bookingDate >= $fDate && $bookingDate <= $tDate) {
                            $isUnavailable = true;
                            $unavailStatus = ($st === 'busy') ? 'Busy / Not Available' : 'Holiday';
                            $unavailNotes = !empty($avail['notes']) ? " ({$avail['notes']})" : "";
                            break;
                        }
                    }
                }
            }

            if ($isUnavailable) {
                jsonResponse([
                    'status' => 'error',
                    'message' => "The influencer is NOT available on {$bookingDate} (Status: {$unavailStatus}{$unavailNotes}). Appointments cannot be booked on unavailable dates."
                ], 400);
            }

            // 6. Conflicting Booking Check
            $hasConflict = false;
            if ($db) {
                try {
                    $cStmt = $db->prepare("SELECT id FROM bookings WHERE influencer_id = :iid AND booking_date = :bdate AND status != 'rejected' AND status != 'cancelled' LIMIT 1");
                    $cStmt->execute(['iid' => $targetInfId, 'bdate' => $bookingDate]);
                    if ($cStmt->fetch()) {
                        $hasConflict = true;
                    }
                } catch (Exception $e) {}
            }

            if (!$hasConflict) {
                foreach ($store['bookings'] ?? [] as $bk) {
                    if (($bk['influencer_id'] ?? 0) == $targetInfId && ($bk['date'] ?? $bk['booking_date'] ?? '') === $bookingDate) {
                        $st = strtolower($bk['status'] ?? 'pending');
                        if ($st !== 'rejected' && $st !== 'cancelled') {
                            $hasConflict = true;
                            break;
                        }
                    }
                }
            }

            if ($hasConflict) {
                jsonResponse([
                    'status' => 'error',
                    'message' => "The influencer already has an existing booking scheduled on {$bookingDate}."
                ], 400);
            }
        }

        if ($db) {
            try {
                if ($requestMethod === 'POST') {
                    $stmt = $db->prepare("INSERT INTO bookings (user_id, influencer_id, campaign_name, business_name, promotion_type, description, booking_date, budget, status) VALUES (:uid, :iid, :cname, :bname, :ptype, :desc, :bdate, :budget, 'pending')");
                    $stmt->execute([
                        'uid' => $body['user_id'] ?? $userId,
                        'iid' => $body['influencer_id'] ?? 1,
                        'cname' => $body['campaign_name'] ?? 'New Campaign',
                        'bname' => $body['business_name'] ?? 'My Business',
                        'ptype' => $body['promotion_type'] ?? 'Instagram Reel',
                        'desc' => $body['description'] ?? '',
                        'bdate' => $body['date'] ?? date('Y-m-d'),
                        'budget' => floatval($body['budget'] ?? 0)
                    ]);
                    $newId = $db->lastInsertId();
                    jsonResponse(['status' => 'success', 'message' => 'Booking submitted', 'data' => array_merge(['id' => (int)$newId, 'status' => 'pending'], $body)]);
                } else if ($requestMethod === 'PUT') {
                    $bkId = intval($body['id'] ?? 0);
                    $newStatus = strtolower(trim($body['status'] ?? 'accepted'));
                    if ($newStatus === 'declined') $newStatus = 'rejected';

                    if (!$bkId) {
                        jsonResponse(['status' => 'error', 'message' => 'Invalid booking ID.'], 400);
                    }

                    // Prepare timestamp update
                    $timestampSql = "";
                    if ($newStatus === 'accepted') {
                        $timestampSql = ", accepted_at = NOW()";
                    } else if ($newStatus === 'rejected') {
                        $timestampSql = ", declined_at = NOW()";
                    } else if ($newStatus === 'completed') {
                        $timestampSql = ", completed_at = NOW()";
                    }

                    // Update MySQL if record exists or insert if missing
                    $updatedBk = null;
                    try {
                        $stmt = $db->prepare("UPDATE bookings SET status = :status {$timestampSql} WHERE id = :id");
                        $stmt->execute(['status' => $newStatus, 'id' => $bkId]);

                        if ($stmt->rowCount() === 0) {
                            // If row didn't exist in MySQL, find in JSON store and insert into MySQL
                            $store = getStore();
                            foreach ($store['bookings'] ?? [] as $sb) {
                                if (($sb['id'] ?? 0) == $bkId) {
                                    $insStmt = $db->prepare("INSERT INTO bookings (id, user_id, influencer_id, campaign_name, business_name, influencer_name, promotion_type, description, booking_date, budget, status, accepted_at) VALUES (:id, :uid, :iid, :cname, :bname, :iname, :ptype, :desc, :bdate, :budget, :st, NOW()) ON DUPLICATE KEY UPDATE status = :st2");
                                    $insStmt->execute([
                                        'id' => $bkId,
                                        'uid' => $sb['user_id'] ?? 2,
                                        'iid' => $sb['influencer_id'] ?? 1,
                                        'cname' => $sb['campaign_name'] ?? 'Campaign',
                                        'bname' => $sb['business_name'] ?? 'Business',
                                        'iname' => $sb['influencer_name'] ?? 'Creator',
                                        'ptype' => $sb['promotion_type'] ?? 'Instagram Reel',
                                        'desc' => $sb['description'] ?? '',
                                        'bdate' => $sb['date'] ?? ($sb['booking_date'] ?? date('Y-m-d')),
                                        'budget' => floatval($sb['budget'] ?? 0),
                                        'st' => $newStatus,
                                        'st2' => $newStatus
                                    ]);
                                    break;
                                }
                            }
                        }

                        // Fetch fresh updated booking record from MySQL
                        $freshStmt = $db->prepare("SELECT b.*, u.name AS user_name, u.email AS user_email, p.name AS influencer_name FROM bookings b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN influencer_profiles p ON b.influencer_id = p.id WHERE b.id = :id LIMIT 1");
                        $freshStmt->execute(['id' => $bkId]);
                        $updatedBk = $freshStmt->fetch();
                        if ($updatedBk) {
                            $updatedBk['budget'] = floatval($updatedBk['budget']);
                            $updatedBk['date'] = $updatedBk['booking_date'];
                        }
                    } catch (Exception $e) {}

                    // Also sync into data_store.json
                    $store = getStore();
                    if (isset($store['bookings']) && is_array($store['bookings'])) {
                        foreach ($store['bookings'] as &$b) {
                            if (($b['id'] ?? 0) == $bkId) {
                                $b['status'] = $newStatus;
                                if ($newStatus === 'accepted') $b['accepted_at'] = date('Y-m-d H:i:s');
                                if ($newStatus === 'completed') $b['completed_at'] = date('Y-m-d H:i:s');
                                if ($newStatus === 'rejected') $b['declined_at'] = date('Y-m-d H:i:s');
                                if (!$updatedBk) $updatedBk = $b;
                                break;
                            }
                        }
                        saveStore($store);
                    }

                    jsonResponse([
                        'status' => 'success', 
                        'message' => 'Booking status updated to ' . strtoupper($newStatus),
                        'data' => $updatedBk ?: ['id' => $bkId, 'status' => $newStatus]
                    ]);
                } else if ($requestMethod === 'DELETE') {
                    $bkId = intval($_GET['id'] ?? $body['id'] ?? 0);
                    if (!$bkId) {
                        jsonResponse(['status' => 'error', 'message' => 'Invalid booking ID.'], 400);
                    }

                    $stmt = $db->prepare("DELETE FROM bookings WHERE id = :id");
                    $stmt->execute(['id' => $bkId]);

                    $store = getStore();
                    if (isset($store['bookings'])) {
                        $store['bookings'] = array_values(array_filter($store['bookings'], function($b) use ($bkId) {
                            return ($b['id'] ?? 0) != $bkId;
                        }));
                        saveStore($store);
                    }

                    jsonResponse(['status' => 'success', 'message' => 'Booking request deleted permanently.', 'deleted_id' => $bkId]);
                } else {
                    // Filter bookings based on authenticated user identity & role
                    if ($role === 'influencer' || $influencerId > 0) {
                        $stmt = $db->prepare("SELECT b.*, u.name AS user_name, u.email AS user_email, p.name AS influencer_name FROM bookings b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN influencer_profiles p ON b.influencer_id = p.id WHERE (b.influencer_id = :iid OR p.user_id = :uid OR b.influencer_id = :uid2) ORDER BY b.id DESC");
                        $stmt->execute(['iid' => $influencerId, 'uid' => $userId, 'uid2' => $userId]);
                        $bks = $stmt->fetchAll();
                    } else if ($role === 'user' && $userId > 0) {
                        $stmt = $db->prepare("SELECT b.*, u.name AS user_name, u.email AS user_email, p.name AS influencer_name FROM bookings b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN influencer_profiles p ON b.influencer_id = p.id WHERE b.user_id = :uid ORDER BY b.id DESC");
                        $stmt->execute(['uid' => $userId]);
                        $bks = $stmt->fetchAll();
                    } else {
                        // Admin or global catalog fetch: return all bookings
                        $stmt = $db->query("SELECT b.*, u.name AS user_name, u.email AS user_email, COALESCE(p.name, b.influencer_name) AS influencer_name FROM bookings b LEFT JOIN users u ON b.user_id = u.id LEFT JOIN influencer_profiles p ON b.influencer_id = p.id ORDER BY b.id DESC");
                        $bks = $stmt->fetchAll();
                    }

                    foreach ($bks as &$b) {
                        $b['budget'] = floatval($b['budget']);
                        $b['date'] = $b['booking_date'] ?? ($b['date'] ?? date('Y-m-d'));
                    }
                    jsonResponse(['status' => 'success', 'data' => $bks]);
                }
            } catch (Exception $e) {
                // In case of any DB exception, fall back to JSON store seamlessly
            }
        }

        // Store JSON fallback mode
        $store = getStore();
        if ($requestMethod === 'POST') {
            $bookingDate = $body['date'] ?? $body['booking_date'] ?? date('Y-m-d');
            $targetInfId = intval($body['influencer_id'] ?? 1);

            foreach ($store['availability'] ?? [] as $avail) {
                if (($avail['influencer_id'] ?? 0) == $targetInfId || $targetInfId == 0) {
                    $fDate = $avail['from_date'] ?? '';
                    $tDate = $avail['to_date'] ?? '';
                    $st = strtolower($avail['status'] ?? 'available');

                    if ($st !== 'available' && $bookingDate >= $fDate && $bookingDate <= $tDate) {
                        $unavailStatus = ($st === 'busy') ? 'Busy / Not Available' : 'Holiday';
                        $unavailNotes = !empty($avail['notes']) ? " ({$avail['notes']})" : "";
                        jsonResponse([
                            'status' => 'error',
                            'message' => "The influencer is NOT available on {$bookingDate} (Status: {$unavailStatus}{$unavailNotes}). Appointments cannot be booked on unavailable dates."
                        ], 400);
                    }
                }
            }

            $newBk = array_merge(['id' => 100 + count($store['bookings']) + 1, 'status' => 'pending', 'created_at' => date('Y-m-d')], $body);
            $store['bookings'][] = $newBk;
            saveStore($store);
            jsonResponse(['status' => 'success', 'data' => $newBk]);
        } else if ($requestMethod === 'PUT') {
            $bkId = intval($body['id'] ?? 0);
            $newStatus = strtolower(trim($body['status'] ?? 'accepted'));
            $updatedItem = null;
            if (isset($store['bookings']) && is_array($store['bookings'])) {
                foreach ($store['bookings'] as &$b) {
                    if (($b['id'] ?? 0) == $bkId) {
                        $b['status'] = $newStatus;
                        if ($newStatus === 'accepted') $b['accepted_at'] = date('Y-m-d H:i:s');
                        if ($newStatus === 'completed') $b['completed_at'] = date('Y-m-d H:i:s');
                        if ($newStatus === 'rejected') $b['declined_at'] = date('Y-m-d H:i:s');
                        $updatedItem = $b;
                        break;
                    }
                }
                saveStore($store);
            }
            jsonResponse([
                'status' => 'success', 
                'message' => 'Booking status updated to ' . strtoupper($newStatus), 
                'data' => $updatedItem ?: array_merge($body, ['id' => $bkId, 'status' => $newStatus])
            ]);
        } else if ($requestMethod === 'DELETE') {
            $bkId = intval($_GET['id'] ?? $body['id'] ?? 0);
            $store['bookings'] = array_values(array_filter($store['bookings'], function($b) use ($bkId) {
                return ($b['id'] ?? 0) != $bkId;
            }));
            saveStore($store);
            jsonResponse(['status' => 'success', 'message' => 'Deleted']);
        } else {
            $allStoreBks = $store['bookings'] ?? [];
            if ($role === 'influencer' || $influencerId > 0) {
                $filteredBks = array_filter($allStoreBks, function($b) use ($userId, $influencerId) {
                    return ($b['influencer_id'] ?? 0) == $influencerId || ($b['influencer_user_id'] ?? 0) == $userId || ($b['influencer_id'] ?? 0) == $userId;
                });
            } else if ($role === 'user' && $userId > 0) {
                $filteredBks = array_filter($allStoreBks, function($b) use ($userId) {
                    return ($b['user_id'] ?? 0) == $userId;
                });
            } else {
                $filteredBks = $allStoreBks;
            }
            jsonResponse(['status' => 'success', 'data' => array_values($filteredBks)]);
        }
        break;

    case 'conversations':
        // Ensure conversations & messages table exist if DB connected
        if ($db) {
            try {
                $db->exec("CREATE TABLE IF NOT EXISTS conversations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    participant_one_id INT NOT NULL,
                    participant_two_id INT NOT NULL,
                    last_message TEXT NULL,
                    last_message_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    UNIQUE KEY unique_participants (participant_one_id, participant_two_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
                
                $db->exec("CREATE TABLE IF NOT EXISTS messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    conversation_id INT NULL,
                    sender_id INT NOT NULL,
                    receiver_id INT NOT NULL,
                    booking_id INT NULL,
                    message TEXT NOT NULL,
                    is_read TINYINT(1) DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
            } catch (Exception $e) {}
        }

        $userId = intval($_GET['user_id'] ?? $_GET['uid'] ?? $body['user_id'] ?? $body['sender_id'] ?? 0);
        $targetUserId = intval($_GET['target_user_id'] ?? $_GET['target_id'] ?? $_GET['influencer_id'] ?? $body['target_user_id'] ?? $body['target_id'] ?? $body['influencer_id'] ?? $body['receiver_id'] ?? 0);
        $action = trim($_GET['action'] ?? $body['action'] ?? '');

        // 1. FIND OR CREATE CONVERSATION ACTION
        if ($subEndpoint === 'find-or-create' || $action === 'find-or-create' || ($requestMethod === 'POST' && $targetUserId > 0)) {
            if ($userId <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Authentication required to start a conversation.'], 401);
            }
            if ($targetUserId <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Valid target user is required.'], 400);
            }

            // Resolve targetUserId from influencer profile ID to user account ID if profile ID was passed
            if ($db) {
                try {
                    $infCheck = $db->prepare("SELECT user_id FROM influencer_profiles WHERE id = :iid LIMIT 1");
                    $infCheck->execute(['iid' => $targetUserId]);
                    $infRow = $infCheck->fetch();
                    if ($infRow && intval($infRow['user_id'] ?? 0) > 0) {
                        $targetUserId = intval($infRow['user_id']);
                    }
                } catch (Exception $e) {}
            }
            
            $store = getStore();
            foreach ($store['influencers'] ?? [] as $infRec) {
                if (intval($infRec['id'] ?? 0) == $targetUserId && intval($infRec['user_id'] ?? 0) > 0) {
                    $targetUserId = intval($infRec['user_id']);
                    break;
                }
            }

            if ($userId === $targetUserId) {
                jsonResponse(['status' => 'error', 'message' => 'You cannot start a conversation with yourself.'], 400);
            }

            // Ensure p1 < p2 for deterministic lookup or check both directions
            $p1 = min($userId, $targetUserId);
            $p2 = max($userId, $targetUserId);

            $existingConv = null;

            // Check MySQL DB
            if ($db) {
                try {
                    $stmt = $db->prepare("SELECT * FROM conversations WHERE (participant_one_id = :u1 AND participant_two_id = :u2) OR (participant_one_id = :u2 AND participant_two_id = :u1) LIMIT 1");
                    $stmt->execute(['u1' => $p1, 'u2' => $p2]);
                    $existingConv = $stmt->fetch();
                } catch (Exception $e) {}
            }

            // Check JSON store fallback
            $store = getStore();
            if (!$existingConv && isset($store['conversations'])) {
                foreach ($store['conversations'] as $c) {
                    $cOne = intval($c['participant_one_id'] ?? 0);
                    $cTwo = intval($c['participant_two_id'] ?? 0);
                    if (($cOne == $p1 && $cTwo == $p2) || ($cOne == $p2 && $cTwo == $p1)) {
                        $existingConv = $c;
                        break;
                    }
                }
            }

            if ($existingConv) {
                jsonResponse([
                    'status' => 'success',
                    'message' => 'Existing conversation found.',
                    'conversation_id' => intval($existingConv['id']),
                    'conversation' => $existingConv
                ]);
            }

            // Create New Conversation
            $nowStr = date('Y-m-d H:i:s');
            $newId = 0;

            if ($db) {
                try {
                    $stmt = $db->prepare("INSERT INTO conversations (participant_one_id, participant_two_id, last_message, last_message_time, created_at) VALUES (:p1, :p2, :msg, :tm, :ca)");
                    $stmt->execute([
                        'p1' => $p1,
                        'p2' => $p2,
                        'msg' => 'Conversation started',
                        'tm' => $nowStr,
                        'ca' => $nowStr
                    ]);
                    $newId = intval($db->lastInsertId());
                } catch (Exception $e) {}
            }

            if (!$newId) {
                $newId = count($store['conversations'] ?? []) + 1;
            }

            $newConv = [
                'id' => $newId,
                'participant_one_id' => $p1,
                'participant_two_id' => $p2,
                'last_message' => 'Conversation started',
                'last_message_time' => $nowStr,
                'created_at' => $nowStr
            ];

            if (!isset($store['conversations'])) $store['conversations'] = [];
            $store['conversations'][] = $newConv;
            saveStore($store);

            jsonResponse([
                'status' => 'success',
                'message' => 'New conversation created.',
                'conversation_id' => $newId,
                'conversation' => $newConv
            ]);
        }

        // 2. GET USER CONVERSATIONS LIST
        if ($requestMethod === 'GET') {
            if ($userId <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Authentication required to load conversations.'], 401);
            }

            $userConvs = [];

            // Query DB
            if ($db) {
                try {
                    $stmt = $db->prepare("SELECT * FROM conversations WHERE participant_one_id = :uid OR participant_two_id = :uid ORDER BY last_message_time DESC, id DESC");
                    $stmt->execute(['uid' => $userId]);
                    $userConvs = $stmt->fetchAll();
                } catch (Exception $e) {}
            }

            // Query Store
            $store = getStore();
            if (empty($userConvs)) {
                foreach ($store['conversations'] ?? [] as $c) {
                    if (($c['participant_one_id'] ?? 0) == $userId || ($c['participant_two_id'] ?? 0) == $userId) {
                        $userConvs[] = $c;
                    }
                }
            }

            // Populate Partner Details for each conversation
            $allUsers = [];
            $allInfluencers = [];

            if ($db) {
                try {
                    $uStmt = $db->query("SELECT id, name, email, avatar, role, username FROM users");
                    $allUsers = $uStmt->fetchAll();
                    $iStmt = $db->query("SELECT id, user_id, name, avatar, category FROM influencer_profiles");
                    $allInfluencers = $iStmt->fetchAll();
                } catch (Exception $e) {}
            }

            if (empty($allUsers)) $allUsers = $store['users'] ?? [];
            if (empty($allInfluencers)) $allInfluencers = $store['influencers'] ?? [];

            // Fallback dictionary for demo user and creator profile details
            $demoProfilesMap = [
                1 => ['name' => 'Admin System', 'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'role' => 'Admin', 'category' => 'Platform'],
                2 => ['name' => 'Rohan Sharma', 'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'role' => 'User', 'category' => 'Brand Client'],
                3 => ['name' => 'Vikram Seth', 'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'role' => 'User', 'category' => 'Tech Brand'],
                4 => ['name' => 'Aanya Verma', 'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'role' => 'Creator', 'category' => 'Fashion'],
                5 => ['name' => 'Kabir Mehta', 'avatar' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'role' => 'Creator', 'category' => 'Fitness'],
                6 => ['name' => 'Ananya Roy', 'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'role' => 'Creator', 'category' => 'Tech'],
                7 => ['name' => 'Priya Sharma', 'avatar' => 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'role' => 'Creator', 'category' => 'Beauty'],
                8 => ['name' => 'Dev Patel', 'avatar' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'role' => 'Creator', 'category' => 'Gaming'],
                9 => ['name' => 'Neha Kapoor', 'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'role' => 'Creator', 'category' => 'Travel'],
                10 => ['name' => 'Rohan Varma', 'avatar' => 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', 'role' => 'Creator', 'category' => 'Food'],
                11 => ['name' => 'Siddharth Rao', 'avatar' => 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'role' => 'Creator', 'category' => 'Finance'],
                12 => ['name' => 'Meera Nair', 'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'role' => 'Creator', 'category' => 'Lifestyle'],
                13 => ['name' => 'Aarav Gupta', 'avatar' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'role' => 'Creator', 'category' => 'Education']
            ];

            $formatted = [];
            foreach ($userConvs as $c) {
                $cOne = intval($c['participant_one_id'] ?? 0);
                $cTwo = intval($c['participant_two_id'] ?? 0);
                $partnerId = ($cOne == $userId) ? $cTwo : $cOne;

                // Find Partner Info
                $partnerInfo = null;
                foreach ($allInfluencers as $inf) {
                    if (($inf['user_id'] ?? 0) == $partnerId || ($inf['id'] ?? 0) == $partnerId) {
                        $partnerInfo = [
                            'partner_id' => $partnerId,
                            'name' => $inf['name'] ?? 'Creator Profile',
                            'avatar' => $inf['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                            'role' => 'Creator',
                            'category' => $inf['category'] ?? 'Influencer'
                        ];
                        break;
                    }
                }

                if (!$partnerInfo) {
                    foreach ($allUsers as $u) {
                        if (($u['id'] ?? 0) == $partnerId) {
                            $partnerInfo = [
                                'partner_id' => $partnerId,
                                'name' => $u['name'] ?? null,
                                'avatar' => $u['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                                'role' => ucfirst($u['role'] ?? 'User'),
                                'category' => ucfirst($u['role'] ?? 'Client')
                            ];
                            if (!empty($u['name']) && !str_starts_with($u['name'], 'User #')) {
                                break;
                            }
                        }
                    }
                }

                // If partner info name is missing or generic User #X, fallback to demoProfilesMap
                if (!$partnerInfo || empty($partnerInfo['name']) || str_starts_with($partnerInfo['name'], 'User #')) {
                    $demo = $demoProfilesMap[$partnerId] ?? null;
                    if ($demo) {
                        $partnerInfo = [
                            'partner_id' => $partnerId,
                            'name' => $demo['name'],
                            'avatar' => $demo['avatar'],
                            'role' => $demo['role'],
                            'category' => $demo['category']
                        ];
                    } else {
                        $partnerInfo = [
                            'partner_id' => $partnerId,
                            'name' => "User #{$partnerId}",
                            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                            'role' => 'User',
                            'category' => 'Member'
                        ];
                    }
                }

                // Calculate unread count
                $unreadCount = 0;
                if ($db) {
                    try {
                        $uCountStmt = $db->prepare("SELECT COUNT(*) as unread FROM messages WHERE conversation_id = :cid AND receiver_id = :uid AND is_read = 0");
                        $uCountStmt->execute(['cid' => $c['id'], 'uid' => $userId]);
                        $uRow = $uCountStmt->fetch();
                        $unreadCount = intval($uRow['unread'] ?? 0);
                    } catch (Exception $e) {}
                }

                $formatted[] = [
                    'id' => intval($c['id']),
                    'conversation_id' => intval($c['id']),
                    'participant_one_id' => $cOne,
                    'participant_two_id' => $cTwo,
                    'partner_id' => $partnerId,
                    'partner_name' => $partnerInfo['name'],
                    'partner_avatar' => $partnerInfo['avatar'],
                    'partner_role' => $partnerInfo['role'],
                    'partner_category' => $partnerInfo['category'],
                    'last_message' => $c['last_message'] ?? 'Conversation started',
                    'last_message_time' => $c['last_message_time'] ?? $c['created_at'] ?? date('Y-m-d H:i:s'),
                    'unread_count' => $unreadCount
                ];
            }

            jsonResponse(['status' => 'success', 'data' => $formatted]);
        }
        break;

    case 'messages':
        $userId = intval($_GET['user_id'] ?? $_GET['uid'] ?? $body['user_id'] ?? $body['sender_id'] ?? $_POST['sender_id'] ?? $_POST['user_id'] ?? 0);
        $convId = intval($_GET['conversation_id'] ?? $_GET['cid'] ?? $body['conversation_id'] ?? $_POST['conversation_id'] ?? 0);

        if ($requestMethod === 'POST') {
            $senderId = intval($body['sender_id'] ?? $_GET['sender_id'] ?? $_GET['user_id'] ?? $_POST['sender_id'] ?? $userId);
            $receiverId = intval($body['receiver_id'] ?? $_GET['receiver_id'] ?? $_GET['target_user_id'] ?? $_POST['receiver_id'] ?? 0);
            $message = trim($body['message'] ?? $_GET['message'] ?? $body['text'] ?? $_POST['message'] ?? '');
            $bookingId = intval($body['booking_id'] ?? $_GET['booking_id'] ?? 0);

            if ($senderId <= 0) {
                jsonResponse(['status' => 'error', 'message' => 'Sender authentication required.'], 401);
            }
            if (empty($message)) {
                jsonResponse(['status' => 'error', 'message' => 'Message content cannot be empty.'], 400);
            }

            // Find or confirm Conversation ID
            if (!$convId && $receiverId > 0) {
                $p1 = min($senderId, $receiverId);
                $p2 = max($senderId, $receiverId);

                if ($db) {
                    try {
                        $cStmt = $db->prepare("SELECT id FROM conversations WHERE (participant_one_id = :u1 AND participant_two_id = :u2) OR (participant_one_id = :u2 AND participant_two_id = :u1) LIMIT 1");
                        $cStmt->execute(['u1' => $p1, 'u2' => $p2]);
                        $cRow = $cStmt->fetch();
                        if ($cRow) $convId = intval($cRow['id']);
                    } catch (Exception $e) {}
                }

                if (!$convId) {
                    $store = getStore();
                    foreach ($store['conversations'] ?? [] as $c) {
                        $cOne = intval($c['participant_one_id'] ?? 0);
                        $cTwo = intval($c['participant_two_id'] ?? 0);
                        if (($cOne == $p1 && $cTwo == $p2) || ($cOne == $p2 && $cTwo == $p1)) {
                            $convId = intval($c['id']);
                            break;
                        }
                    }
                }

                // If conversation still doesn't exist, create it!
                if (!$convId) {
                    $nowStr = date('Y-m-d H:i:s');
                    if ($db) {
                        try {
                            $insC = $db->prepare("INSERT INTO conversations (participant_one_id, participant_two_id, last_message, last_message_time, created_at) VALUES (:p1, :p2, :msg, :tm, :ca)");
                            $insC->execute(['p1' => $p1, 'p2' => $p2, 'msg' => $message, 'tm' => $nowStr, 'ca' => $nowStr]);
                            $convId = intval($db->lastInsertId());
                        } catch (Exception $e) {}
                    }
                    if (!$convId) {
                        $store = getStore();
                        $convId = count($store['conversations'] ?? []) + 1;
                        $store['conversations'][] = [
                            'id' => $convId,
                            'participant_one_id' => $p1,
                            'participant_two_id' => $p2,
                            'last_message' => $message,
                            'last_message_time' => $nowStr,
                            'created_at' => $nowStr
                        ];
                        saveStore($store);
                    }
                }
            }

            // Save Message
            $nowStr = date('Y-m-d H:i:s');
            $newMsgId = 0;

            if ($db) {
                try {
                    $mStmt = $db->prepare("INSERT INTO messages (conversation_id, sender_id, receiver_id, booking_id, message, is_read, created_at) VALUES (:cid, :sid, :rid, :bid, :msg, 0, :ca)");
                    $mStmt->execute([
                        'cid' => $convId,
                        'sid' => $senderId,
                        'rid' => $receiverId,
                        'bid' => $bookingId,
                        'msg' => $message,
                        'ca' => $nowStr
                    ]);
                    $newMsgId = intval($db->lastInsertId());

                    // Update Conversation last message
                    if ($convId > 0) {
                        $uConv = $db->prepare("UPDATE conversations SET last_message = :msg, last_message_time = :tm WHERE id = :cid");
                        $uConv->execute(['msg' => $message, 'tm' => $nowStr, 'cid' => $convId]);
                    }
                } catch (Exception $e) {}
            }

            $store = getStore();
            if (!$newMsgId) {
                $newMsgId = count($store['messages'] ?? []) + 1;
            }

            $newMsg = [
                'id' => $newMsgId,
                'conversation_id' => $convId,
                'sender_id' => $senderId,
                'receiver_id' => $receiverId,
                'booking_id' => $bookingId,
                'message' => $message,
                'is_read' => 0,
                'created_at' => $nowStr
            ];

            if (!isset($store['messages'])) $store['messages'] = [];
            $store['messages'][] = $newMsg;

            // Update store conversation
            if (isset($store['conversations'])) {
                foreach ($store['conversations'] as &$c) {
                    if (($c['id'] ?? 0) == $convId) {
                        $c['last_message'] = $message;
                        $c['last_message_time'] = $nowStr;
                        break;
                    }
                }
            }
            saveStore($store);

            jsonResponse(['status' => 'success', 'data' => $newMsg]);
        } 
        else {
            // GET MESSAGES
            $msgs = [];

            if ($db) {
                try {
                    if ($convId > 0) {
                        // Authorization check: Verify userId is participant in convId
                        $authCheck = $db->prepare("SELECT id FROM conversations WHERE id = :cid AND (participant_one_id = :uid OR participant_two_id = :uid) LIMIT 1");
                        $authCheck->execute(['cid' => $convId, 'uid' => $userId]);
                        if (!$authCheck->fetch() && $userId > 0) {
                            jsonResponse(['status' => 'error', 'message' => 'Access denied to this conversation.'], 403);
                        }

                        // Mark unread messages as read
                        if ($userId > 0) {
                            $readStmt = $db->prepare("UPDATE messages SET is_read = 1 WHERE conversation_id = :cid AND receiver_id = :uid AND is_read = 0");
                            $readStmt->execute(['cid' => $convId, 'uid' => $userId]);
                        }

                        $mStmt = $db->prepare("SELECT * FROM messages WHERE conversation_id = :cid ORDER BY id ASC");
                        $mStmt->execute(['cid' => $convId]);
                        $msgs = $mStmt->fetchAll();
                    } else if ($userId > 0) {
                        $mStmt = $db->prepare("SELECT * FROM messages WHERE sender_id = :uid OR receiver_id = :uid ORDER BY id ASC");
                        $mStmt->execute(['uid' => $userId]);
                        $msgs = $mStmt->fetchAll();
                    }
                } catch (Exception $e) {}
            }

            if (empty($msgs)) {
                $store = getStore();
                $all = $store['messages'] ?? [];
                if ($convId > 0) {
                    $allowed = false;
                    foreach ($store['conversations'] ?? [] as $c) {
                        if (($c['id'] ?? 0) == $convId) {
                            $p1 = intval($c['participant_one_id'] ?? 0);
                            $p2 = intval($c['participant_two_id'] ?? 0);
                            if ($p1 == $userId || $p2 == $userId) {
                                $allowed = true;
                            }
                            break;
                        }
                    }
                    if (!$allowed && $userId > 0) {
                        jsonResponse(['status' => 'error', 'message' => 'Access denied to this conversation.'], 403);
                    }

                    $msgs = array_values(array_filter($all, function($m) use ($convId) {
                        return ($m['conversation_id'] ?? 0) == $convId;
                    }));
                } else if ($userId > 0) {
                    $msgs = array_values(array_filter($all, function($m) use ($userId) {
                        return ($m['sender_id'] ?? 0) == $userId || ($m['receiver_id'] ?? 0) == $userId;
                    }));
                }
            }

            jsonResponse(['status' => 'success', 'data' => $msgs]);
        }
        break;

    case 'reviews':
        $infId = intval($_GET['influencer_id'] ?? $_GET['iid'] ?? $body['influencer_id'] ?? 0);

        if ($requestMethod === 'POST') {
            $rating = intval($body['rating'] ?? 5);
            $rating = max(1, min(5, $rating));
            $comment = trim($body['comment'] ?? $body['review_text'] ?? '');
            $userName = trim($body['user_name'] ?? 'Verified Client');
            $userId = intval($body['user_id'] ?? 2);
            $targetInfId = intval($body['influencer_id'] ?? $infId ?: 1);

            if ($db) {
                try {
                    $stmt = $db->prepare("INSERT INTO reviews (user_id, influencer_id, rating, review_text, status) VALUES (:uid, :iid, :rating, :rtext, 'published')");
                    $stmt->execute([
                        'uid' => $userId,
                        'iid' => $targetInfId,
                        'rating' => $rating,
                        'rtext' => $comment
                    ]);
                    $newId = $db->lastInsertId();

                    // Recalculate average rating for influencer profile
                    $calcStmt = $db->prepare("SELECT AVG(rating) as avg_rating, COUNT(id) as total_reviews FROM reviews WHERE influencer_id = :iid");
                    $calcStmt->execute(['iid' => $targetInfId]);
                    $stats = $calcStmt->fetch();
                    if ($stats && $stats['avg_rating'] !== null) {
                        $upStmt = $db->prepare("UPDATE influencer_profiles SET rating = :rating WHERE id = :iid OR user_id = :iid");
                        $upStmt->execute(['rating' => round($stats['avg_rating'], 2), 'iid' => $targetInfId]);
                    }
                } catch (Exception $e) {}
            }

            // Sync with JSON store
            $store = getStore();
            if (!isset($store['reviews'])) $store['reviews'] = [];

            $newRev = [
                'id' => count($store['reviews']) + 1,
                'influencer_id' => $targetInfId,
                'user_id' => $userId,
                'user_name' => $userName,
                'rating' => $rating,
                'comment' => $comment,
                'date' => date('Y-m-d')
            ];
            $store['reviews'][] = $newRev;

            // Recalculate rating in JSON store for influencer
            $infReviews = array_filter($store['reviews'], function($r) use ($targetInfId) {
                return ($r['influencer_id'] ?? 0) == $targetInfId;
            });
            if (count($infReviews) > 0) {
                $sum = array_reduce($infReviews, function($acc, $r) { return $acc + intval($r['rating'] ?? 5); }, 0);
                $avg = round($sum / count($infReviews), 1);
                foreach ($store['influencers'] as &$inf) {
                    if (($inf['id'] ?? 0) == $targetInfId || ($inf['user_id'] ?? 0) == $targetInfId) {
                        $inf['rating'] = $avg;
                        $inf['reviews_count'] = count($infReviews);
                        break;
                    }
                }
            }

            saveStore($store);
            jsonResponse(['status' => 'success', 'message' => 'Review submitted successfully', 'data' => $newRev]);
        } else {
            if ($db) {
                try {
                    $query = "SELECT r.*, u.name as user_name, u.avatar as user_avatar FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE 1=1";
                    $params = [];
                    if ($infId > 0) {
                        $query .= " AND r.influencer_id = :iid";
                        $params['iid'] = $infId;
                    }
                    $query .= " ORDER BY r.id DESC";
                    $stmt = $db->prepare($query);
                    $stmt->execute($params);
                    $dbReviews = $stmt->fetchAll();
                    if ($dbReviews && count($dbReviews) > 0) {
                        jsonResponse(['status' => 'success', 'data' => $dbReviews]);
                    }
                } catch (Exception $e) {}
            }

            $store = getStore();
            $allRevs = $store['reviews'] ?? [];
            if ($infId > 0) {
                $filtered = array_values(array_filter($allRevs, function($r) use ($infId) {
                    return ($r['influencer_id'] ?? 0) == $infId;
                }));
            } else {
                $filtered = $allRevs;
            }
            jsonResponse(['status' => 'success', 'data' => $filtered]);
        }
        break;

    case 'portfolio':
        $userId = intval($_GET['user_id'] ?? $_GET['uid'] ?? $body['user_id'] ?? $_POST['user_id'] ?? 0);
        $infId = intval($_GET['influencer_id'] ?? $_GET['iid'] ?? $body['influencer_id'] ?? $_POST['influencer_id'] ?? 0);

        if (!$infId && $userId) {
            $infId = $userId;
        }

        // Find authenticated influencer record if infId not provided
        $store = getStore();
        if ($userId > 0) {
            foreach ($store['influencers'] ?? [] as $infRec) {
                if (($infRec['user_id'] ?? 0) == $userId || ($infRec['id'] ?? 0) == $userId) {
                    $infId = intval($infRec['id']);
                    break;
                }
            }
        }
        if (!$infId) $infId = 1;

        if ($requestMethod === 'POST') {
            // Check if this is a File Upload (multipart/form-data with $_FILES)
            $fileData = $_FILES['image'] ?? $_FILES['file'] ?? $_FILES['portfolio_image'] ?? null;
            
            if ($fileData && isset($fileData['tmp_name']) && !empty($fileData['tmp_name'])) {
                // 1. Check upload error
                if ($fileData['error'] !== UPLOAD_ERR_OK) {
                    jsonResponse(['status' => 'error', 'message' => 'File upload error code: ' . $fileData['error']], 400);
                }

                // 2. Check File Size (Max 5MB)
                $maxSize = 5 * 1024 * 1024; // 5MB
                if ($fileData['size'] > $maxSize) {
                    jsonResponse(['status' => 'error', 'message' => 'Image size must be less than 5 MB.'], 400);
                }

                // 3. Check Extension & MIME Type
                $origName = $fileData['name'];
                $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
                $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
                
                $mime = mime_content_type($fileData['tmp_name']);
                $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

                if (!in_array($ext, $allowedExts) || !in_array($mime, $allowedMimes)) {
                    jsonResponse(['status' => 'error', 'message' => 'Please select a valid image file (JPG, JPEG, PNG, WEBP).'], 400);
                }

                // 3b. Server-Side Image Structure Validation
                $imgCheck = @getimagesize($fileData['tmp_name']);
                if ($imgCheck === false) {
                    jsonResponse(['status' => 'error', 'message' => 'Uploaded file structure is not a valid image.'], 400);
                }

                // 4. Create Target Directory
                $uploadDir = __DIR__ . '/../uploads/portfolio/';
                if (!file_exists($uploadDir)) {
                    @mkdir($uploadDir, 0777, true);
                }

                // 5. Generate Safe Unique Filename
                $uniqueName = 'portfolio_' . $infId . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                $destPath = $uploadDir . $uniqueName;

                if (!move_uploaded_file($fileData['tmp_name'], $destPath)) {
                    jsonResponse(['status' => 'error', 'message' => 'Failed to save uploaded image file on server.'], 500);
                }

                // 6. Build Web-accessible Image URL
                $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
                $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
                $imageUrl = "{$protocol}://{$host}/influencer/uploads/portfolio/{$uniqueName}";

                // 7. Save into Database & Store
                $newItemId = time();
                if ($db) {
                    try {
                        $insStmt = $db->prepare("INSERT INTO portfolio_items (influencer_id, url) VALUES (:iid, :url)");
                        $insStmt->execute(['iid' => $infId, 'url' => $imageUrl]);
                        $newItemId = $db->lastInsertId() ?: $newItemId;
                    } catch (Exception $e) {}
                }

                $store = getStore();
                $foundInf = false;
                foreach ($store['influencers'] as &$inf) {
                    if (($inf['id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $userId) {
                        if (!isset($inf['portfolio']) || !is_array($inf['portfolio'])) {
                            $inf['portfolio'] = [];
                        }
                        $inf['portfolio'][] = $imageUrl;
                        $foundInf = true;
                        break;
                    }
                }
                if (!$foundInf && isset($store['influencers'][0])) {
                    $store['influencers'][0]['portfolio'][] = $imageUrl;
                }
                saveStore($store);

                jsonResponse([
                    'status' => 'success',
                    'message' => 'Portfolio image uploaded successfully.',
                    'data' => [
                        'id' => (int)$newItemId,
                        'influencer_id' => $infId,
                        'url' => $imageUrl,
                        'image_url' => $imageUrl
                    ]
                ]);
            }

            // Fallback for JSON body URL array batch update if passed
            $items = $body['items'] ?? $body['portfolio'] ?? [];
            if ($db && $infId > 0 && is_array($items)) {
                try {
                    $delStmt = $db->prepare("DELETE FROM portfolio_items WHERE influencer_id = :iid");
                    $delStmt->execute(['iid' => $infId]);

                    $insStmt = $db->prepare("INSERT INTO portfolio_items (influencer_id, url) VALUES (:iid, :url)");
                    foreach ($items as $url) {
                        $itemUrl = is_array($url) ? ($url['url'] ?? $url['image_url'] ?? '') : $url;
                        if (!empty($itemUrl)) {
                            $insStmt->execute(['iid' => $infId, 'url' => $itemUrl]);
                        }
                    }
                } catch (Exception $e) {}
            }

            $store = getStore();
            foreach ($store['influencers'] as &$inf) {
                if (($inf['id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $userId) {
                    $inf['portfolio'] = $items;
                    break;
                }
            }
            saveStore($store);
            jsonResponse(['status' => 'success', 'message' => 'Portfolio updated successfully', 'data' => $items]);
        } 
        else if ($requestMethod === 'DELETE') {
            $itemId = intval($_GET['id'] ?? $body['id'] ?? 0);
            $targetUrl = trim($_GET['url'] ?? $body['url'] ?? '');

            if ($db && $itemId > 0) {
                try {
                    $delStmt = $db->prepare("DELETE FROM portfolio_items WHERE id = :id AND (influencer_id = :iid OR influencer_id = :uid)");
                    $delStmt->execute(['id' => $itemId, 'iid' => $infId, 'uid' => $userId]);
                } catch (Exception $e) {}
            }

            // Also delete physical file if stored locally in uploads/portfolio
            if (!empty($targetUrl)) {
                $filename = basename(parse_url($targetUrl, PHP_URL_PATH));
                if (!empty($filename)) {
                    $filePath = __DIR__ . '/../uploads/portfolio/' . $filename;
                    if (file_exists($filePath)) {
                        @unlink($filePath);
                    }
                }
            }

            $store = getStore();
            foreach ($store['influencers'] as &$inf) {
                if (($inf['id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $userId) {
                    if (isset($inf['portfolio']) && is_array($inf['portfolio'])) {
                        $inf['portfolio'] = array_values(array_filter($inf['portfolio'], function($item) use ($targetUrl, $itemId) {
                            $u = is_array($item) ? ($item['url'] ?? '') : $item;
                            $iId = is_array($item) ? ($item['id'] ?? 0) : 0;
                            if ($itemId > 0 && $iId == $itemId) return false;
                            if (!empty($targetUrl) && $u === $targetUrl) return false;
                            return true;
                        }));
                    }
                    break;
                }
            }
            saveStore($store);

            jsonResponse(['status' => 'success', 'message' => 'Portfolio item deleted successfully.']);
        }
        else {
            // GET Portfolio
            $portfolio = [];
            if ($db && $infId > 0) {
                try {
                    $stmt = $db->prepare("SELECT * FROM portfolio_items WHERE influencer_id = :iid ORDER BY id DESC");
                    $stmt->execute(['iid' => $infId]);
                    $dbItems = $stmt->fetchAll();
                    if ($dbItems && count($dbItems) > 0) {
                        $portfolio = $dbItems;
                    }
                } catch (Exception $e) {}
            }

            if (empty($portfolio)) {
                $store = getStore();
                foreach ($store['influencers'] as $inf) {
                    if (($inf['id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $infId || ($inf['user_id'] ?? 0) == $userId) {
                        $portfolio = $inf['portfolio'] ?? [];
                        break;
                    }
                }
            }
            jsonResponse(['status' => 'success', 'data' => $portfolio]);
        }
        break;

    default:
        jsonResponse([
            'status' => 'online',
            'name' => 'Influencer Connect REST API (XAMPP MySQL Connected)',
            'database' => $db ? 'MySQL Connected' : 'JSON Store Mode',
            'endpoints' => [
                '/api/auth/login',
                '/api/auth/register',
                '/api/categories',
                '/api/influencers',
                '/api/influencer?id=1',
                '/api/bookings',
                '/api/messages'
            ]
        ]);
        break;
}
