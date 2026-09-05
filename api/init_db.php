<?php
// Database Auto-Initialization & Schema Synchronization Engine
require_once __DIR__ . '/config/cors.php';

function initDatabase() {
    $host = "localhost";
    $db_name = "influencer_connect";
    $username = "root";
    $password = "";

    try {
        // 1. Connect to MySQL server without database specified
        $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);

        // 2. Create Database if not exists
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo->exec("USE `$db_name`");

        // 3. Create Tables
        $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(150) NOT NULL,
            `email` VARCHAR(191) NOT NULL UNIQUE,
            `password` VARCHAR(255) NULL,
            `role` ENUM('admin', 'user', 'influencer') NOT NULL DEFAULT 'user',
            `phone` VARCHAR(50) NULL,
            `company` VARCHAR(150) NULL,
            `status` VARCHAR(50) DEFAULT 'active',
            `avatar` VARCHAR(500) NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `influencer_profiles` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `name` VARCHAR(150) NOT NULL,
            `username` VARCHAR(100) NOT NULL UNIQUE,
            `bio` TEXT NULL,
            `city` VARCHAR(100) DEFAULT 'Mumbai',
            `state` VARCHAR(100) DEFAULT 'Maharashtra',
            `country` VARCHAR(100) DEFAULT 'India',
            `category` VARCHAR(100) DEFAULT 'Fashion',
            `starting_price` DECIMAL(12,2) DEFAULT 10000.00,
            `followers` INT DEFAULT 50000,
            `rating` DECIMAL(3,2) DEFAULT 5.00,
            `reviews_count` INT DEFAULT 0,
            `verified` TINYINT(1) DEFAULT 0,
            `avatar` VARCHAR(500) NULL,
            `cover_image` VARCHAR(500) NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `categories` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL UNIQUE,
            `slug` VARCHAR(100) NOT NULL UNIQUE,
            `icon` VARCHAR(50) DEFAULT 'Star',
            `description` TEXT NULL,
            `status` VARCHAR(50) DEFAULT 'active',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `bookings` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `influencer_id` INT NOT NULL,
            `campaign_name` VARCHAR(255) NOT NULL,
            `business_name` VARCHAR(255) NOT NULL,
            `influencer_name` VARCHAR(255) NULL,
            `promotion_type` VARCHAR(100) DEFAULT 'Instagram Reel',
            `description` TEXT NULL,
            `booking_date` DATE NOT NULL,
            `budget` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            `status` ENUM('pending', 'accepted', 'completed', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
            `accepted_at` DATETIME NULL,
            `completed_at` DATETIME NULL,
            `declined_at` DATETIME NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `services_charges` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `influencer_id` INT NOT NULL,
            `service_type` VARCHAR(150) NOT NULL,
            `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            `description` TEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `social_links` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `influencer_id` INT NOT NULL,
            `platform` VARCHAR(50) NOT NULL,
            `username` VARCHAR(100) NOT NULL,
            `profile_url` VARCHAR(500) NOT NULL,
            `followers_count` INT DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `portfolio_items` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `influencer_id` INT NOT NULL,
            `url` VARCHAR(500) NOT NULL,
            `title` VARCHAR(255) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `influencer_availability` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `influencer_id` INT NOT NULL,
            `from_date` DATE NOT NULL,
            `to_date` DATE NOT NULL,
            `status` ENUM('available', 'busy', 'holiday') DEFAULT 'available',
            `notes` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `reviews` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NOT NULL,
            `influencer_id` INT NOT NULL,
            `user_name` VARCHAR(150) NOT NULL,
            `rating` INT DEFAULT 5,
            `comment` TEXT NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `site_settings` (
            `setting_key` VARCHAR(100) PRIMARY KEY,
            `setting_value` TEXT,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS `conversations` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `participant_one_id` INT NOT NULL,
            `participant_two_id` INT NOT NULL,
            `last_message` TEXT NULL,
            `last_message_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_participants (`participant_one_id`, `participant_two_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // 4. Migrate any missing columns in existing tables
        $tablesCols = [
            'bookings' => [
                'user_id' => 'INT NOT NULL DEFAULT 2',
                'influencer_id' => 'INT NOT NULL DEFAULT 1',
                'campaign_name' => 'VARCHAR(255) NOT NULL DEFAULT "Campaign"',
                'business_name' => 'VARCHAR(255) NOT NULL DEFAULT "Brand Enterprise"',
                'influencer_name' => 'VARCHAR(255) NULL',
                'promotion_type' => 'VARCHAR(100) DEFAULT "Instagram Reel"',
                'description' => 'TEXT NULL',
                'booking_date' => 'DATE NULL',
                'budget' => 'DECIMAL(12,2) NOT NULL DEFAULT 0.00',
                'status' => 'VARCHAR(50) NOT NULL DEFAULT "pending"',
                'accepted_at' => 'DATETIME NULL',
                'completed_at' => 'DATETIME NULL',
                'declined_at' => 'DATETIME NULL'
            ],
            'influencer_profiles' => [
                'city' => 'VARCHAR(100) DEFAULT "Mumbai"',
                'state' => 'VARCHAR(100) DEFAULT "Maharashtra"',
                'country' => 'VARCHAR(100) DEFAULT "India"',
                'category' => 'VARCHAR(100) DEFAULT "Fashion"',
                'starting_price' => 'DECIMAL(12,2) DEFAULT 10000.00',
                'followers' => 'INT DEFAULT 50000',
                'rating' => 'DECIMAL(3,2) DEFAULT 5.00',
                'reviews_count' => 'INT DEFAULT 0',
                'verified' => 'TINYINT(1) DEFAULT 0',
                'avatar' => 'VARCHAR(500) NULL',
                'cover_image' => 'VARCHAR(500) NULL'
            ],
            'users' => [
                'company' => 'VARCHAR(150) NULL',
                'status' => 'VARCHAR(50) DEFAULT "active"',
                'avatar' => 'VARCHAR(500) NULL',
                'phone' => 'VARCHAR(50) NULL'
            ]
        ];

        foreach ($tablesCols as $tbl => $cols) {
            try {
                $curCols = $pdo->query("SHOW COLUMNS FROM `$tbl`")->fetchAll(PDO::FETCH_COLUMN);
                foreach ($cols as $col => $def) {
                    if (!in_array($col, $curCols)) {
                        $pdo->exec("ALTER TABLE `$tbl` ADD COLUMN `$col` $def");
                    }
                }
            } catch (Exception $e) {}
        }

        // 4. Seed Data from data_store.json if tables are empty
        $jsonFile = __DIR__ . '/data_store.json';
        if (file_exists($jsonFile)) {
            $store = json_decode(file_get_contents($jsonFile), true);

            // Seed Users
            $uCount = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
            if ($uCount == 0 && isset($store['users']) && is_array($store['users'])) {
                $uStmt = $pdo->prepare("INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `company`, `status`, `avatar`) VALUES (:id, :name, :email, :pass, :role, :phone, :comp, :status, :avatar) ON DUPLICATE KEY UPDATE `name`=:name2");
                foreach ($store['users'] as $u) {
                    $uStmt->execute([
                        'id' => $u['id'] ?? null,
                        'name' => $u['name'] ?? 'User',
                        'email' => $u['email'] ?? ('user_' . rand(100,999) . '@demo.com'),
                        'pass' => password_hash('password123', PASSWORD_BCRYPT),
                        'role' => $u['role'] ?? 'user',
                        'phone' => $u['phone'] ?? '+91 98765 43210',
                        'comp' => $u['company'] ?? 'Brand Enterprise',
                        'status' => $u['status'] ?? 'active',
                        'avatar' => $u['avatar'] ?? ($u['img'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
                        'name2' => $u['name'] ?? 'User'
                    ]);
                }
            }

            // Seed Categories
            $catCount = $pdo->query("SELECT COUNT(*) FROM `categories`")->fetchColumn();
            if ($catCount == 0 && isset($store['categories']) && is_array($store['categories'])) {
                $cStmt = $pdo->prepare("INSERT INTO `categories` (`id`, `name`, `slug`, `icon`, `description`, `status`) VALUES (:id, :name, :slug, :icon, :desc, :status) ON DUPLICATE KEY UPDATE `name`=:name2");
                foreach ($store['categories'] as $c) {
                    $cStmt->execute([
                        'id' => $c['id'] ?? null,
                        'name' => $c['name'] ?? 'General',
                        'slug' => $c['slug'] ?? 'general',
                        'icon' => $c['icon'] ?? 'Star',
                        'desc' => $c['description'] ?? '',
                        'status' => $c['status'] ?? 'active',
                        'name2' => $c['name'] ?? 'General'
                    ]);
                }
            }

            // Seed Influencers
            $infCount = $pdo->query("SELECT COUNT(*) FROM `influencer_profiles`")->fetchColumn();
            if ($infCount == 0 && isset($store['influencers']) && is_array($store['influencers'])) {
                $infStmt = $pdo->prepare("INSERT INTO `influencer_profiles` (`id`, `user_id`, `name`, `username`, `bio`, `city`, `state`, `country`, `category`, `starting_price`, `followers`, `rating`, `reviews_count`, `verified`, `avatar`, `cover_image`) VALUES (:id, :uid, :name, :uname, :bio, :city, :state, :country, :cat, :price, :foll, :rating, :revc, :ver, :avatar, :cover) ON DUPLICATE KEY UPDATE `name`=:name2");
                foreach ($store['influencers'] as $inf) {
                    $infStmt->execute([
                        'id' => $inf['id'] ?? null,
                        'uid' => $inf['user_id'] ?? ($inf['id'] ?? 1),
                        'name' => $inf['name'] ?? 'Creator',
                        'uname' => $inf['username'] ?? ('@' . rand(100,999)),
                        'bio' => $inf['bio'] ?? '',
                        'city' => $inf['city'] ?? 'Mumbai',
                        'state' => $inf['state'] ?? 'Maharashtra',
                        'country' => $inf['country'] ?? 'India',
                        'cat' => $inf['category'] ?? 'Fashion',
                        'price' => floatval($inf['starting_price'] ?? 10000),
                        'foll' => intval($inf['followers'] ?? 50000),
                        'rating' => floatval($inf['rating'] ?? 5.0),
                        'revc' => intval($inf['reviews_count'] ?? 10),
                        'ver' => !empty($inf['verified']) ? 1 : 0,
                        'avatar' => $inf['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                        'cover' => $inf['cover_image'] ?? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
                        'name2' => $inf['name'] ?? 'Creator'
                    ]);
                }
            }

            // Seed Bookings
            $bCount = $pdo->query("SELECT COUNT(*) FROM `bookings`")->fetchColumn();
            if ($bCount == 0 && isset($store['bookings']) && is_array($store['bookings'])) {
                $bStmt = $pdo->prepare("INSERT INTO `bookings` (`id`, `user_id`, `influencer_id`, `campaign_name`, `business_name`, `influencer_name`, `promotion_type`, `description`, `booking_date`, `budget`, `status`) VALUES (:id, :uid, :iid, :cname, :bname, :iname, :ptype, :desc, :bdate, :budget, :st) ON DUPLICATE KEY UPDATE `status`=:st2");
                foreach ($store['bookings'] as $b) {
                    $bStmt->execute([
                        'id' => $b['id'] ?? null,
                        'uid' => $b['user_id'] ?? 2,
                        'iid' => $b['influencer_id'] ?? 1,
                        'cname' => $b['campaign_name'] ?? 'Campaign',
                        'bname' => $b['business_name'] ?? 'Business',
                        'iname' => $b['influencer_name'] ?? 'Creator',
                        'ptype' => $b['promotion_type'] ?? 'Instagram Reel',
                        'desc' => $b['description'] ?? '',
                        'bdate' => $b['date'] ?? ($b['booking_date'] ?? date('Y-m-d')),
                        'budget' => floatval($b['budget'] ?? 0),
                        'st' => $b['status'] ?? 'pending',
                        'st2' => $b['status'] ?? 'pending'
                    ]);
                }
            }
        }

        return $pdo;
    } catch (Exception $e) {
        error_log("Database initialization error: " . $e->getMessage());
        return null;
    }
}

// If invoked directly from CLI or URL
if (php_sapi_name() === 'cli' || (isset($_GET['init']) && $_GET['init'] === '1')) {
    $res = initDatabase();
    if ($res) {
        echo json_encode(['status' => 'success', 'message' => 'MySQL Database & tables initialized and seeded successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'MySQL connection failed. Please ensure XAMPP MySQL is running.']);
    }
}
