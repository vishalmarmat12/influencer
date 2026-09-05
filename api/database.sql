-- Influencer Connect Database Schema & Seed Data (10 Dummy Influencers Full Dataset)
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS influencer_connect;
CREATE DATABASE influencer_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE influencer_connect;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'influencer', 'user') DEFAULT 'user',
    phone VARCHAR(20) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'suspended', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT 'Star',
    status ENUM('active', 'inactive') DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Influencer Profiles Table
CREATE TABLE influencer_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    bio TEXT,
    gender VARCHAR(20),
    dob DATE,
    experience_years INT DEFAULT 1,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    languages VARCHAR(255),
    avatar VARCHAR(255),
    cover_image VARCHAR(255),
    category VARCHAR(100),
    content_style VARCHAR(100),
    followers INT DEFAULT 0,
    starting_price DECIMAL(10,2) DEFAULT 5000.00,
    verified TINYINT(1) DEFAULT 0,
    views_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Social Links Table
CREATE TABLE social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    influencer_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(100),
    profile_url VARCHAR(255),
    followers_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    engagement_rate DECIMAL(4,2) DEFAULT 0.00,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE
);

-- 5. Services & Charges Table
CREATE TABLE services_charges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    influencer_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE
);

-- 6. Portfolio Items Table
CREATE TABLE portfolio_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    influencer_id INT NOT NULL,
    media_type ENUM('image', 'video') DEFAULT 'image',
    title VARCHAR(150),
    url VARCHAR(255),
    thumbnail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE
);

-- 7. Availability Table
CREATE TABLE availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    influencer_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('available', 'busy', 'holiday') DEFAULT 'available',
    time_slots TEXT,
    weekly_off VARCHAR(20),
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE
);

-- 8. Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    influencer_id INT NOT NULL,
    campaign_name VARCHAR(150) NOT NULL,
    business_name VARCHAR(150) NOT NULL,
    promotion_type VARCHAR(50) NOT NULL,
    description TEXT,
    booking_date DATE NOT NULL,
    booking_time VARCHAR(50),
    budget DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE
);

-- 9. Messages Table
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    booking_id INT DEFAULT NULL,
    message TEXT NOT NULL,
    attachment_url VARCHAR(255) DEFAULT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Reviews Table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT DEFAULT NULL,
    user_id INT NOT NULL,
    influencer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    status ENUM('published', 'hidden') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE
);

-- 11. Favorites Table
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    influencer_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_influencer (user_id, influencer_id)
);

-- 12. Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'system',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. Site Settings Table
CREATE TABLE site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(100) DEFAULT 'Influencer Connect',
    logo_url VARCHAR(255),
    contact_email VARCHAR(100) DEFAULT 'support@influencerconnect.com',
    contact_phone VARCHAR(50) DEFAULT '+91 9876543210',
    address TEXT,
    terms_content TEXT,
    privacy_content TEXT
);

-- ============================================================================
-- SEED DATA INSERTS
-- ============================================================================

-- Categories
INSERT INTO categories (id, name, slug, icon, description) VALUES
(1, 'Fashion', 'fashion', 'Shirt', 'Style, outfits, and fashion trends'),
(2, 'Food', 'food', 'Utensils', 'Culinary arts, food reviews, and recipes'),
(3, 'Tech', 'tech', 'Cpu', 'Gadgets, software, and tech reviews'),
(4, 'Fitness', 'fitness', 'Dumbbell', 'Workouts, nutrition, and wellness'),
(5, 'Travel', 'travel', 'Compass', 'Destinations, vlogs, and travel guides'),
(6, 'Beauty', 'beauty', 'Sparkles', 'Makeup, skincare, and cosmetics'),
(7, 'Gaming', 'gaming', 'Gamepad2', 'Esports, game reviews, and live streams'),
(8, 'Education', 'education', 'BookOpen', 'Tutorials, career guidance, and courses'),
(9, 'Lifestyle', 'lifestyle', 'Heart', 'Daily life, personal vlogs, and inspiration'),
(10, 'Automobile', 'automobile', 'Car', 'Cars, bikes, and automotive reviews');

-- Users Seed (1 Admin, 2 Brand Users, 10 Influencer Users)
INSERT INTO users (id, name, email, password, role, phone, avatar, status) VALUES
(1, 'System Admin', 'admin@influencer.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'admin', '+1 555-0001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'active'),
(2, 'Rohan Sharma', 'user@demo.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'user', '+91 9876543210', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'active'),
(3, 'TechGear Marketing', 'brand@techgear.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'user', '+91 9811223344', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150', 'active'),
(4, 'Aanya Verma', 'influencer@demo.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9898989898', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'active'),
(5, 'Kabir Mehta', 'kabir@tech.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9797979797', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'active'),
(6, 'Siddharth Rao', 'siddharth@fitness.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9696969696', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'active'),
(7, 'Priya Nair', 'priya@foodie.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9595959595', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'active'),
(8, 'Rohan Das', 'rohan@travels.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9494949494', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'active'),
(9, 'Ananya Kapoor', 'ananya@beauty.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9393939393', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'active'),
(10, 'Vikramaditya Singh', 'vikram@gaming.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9292929292', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'active'),
(11, 'Neha Sharma', 'neha@educates.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9191919191', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'active'),
(12, 'Arjun Kapoor', 'arjun@drives.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 9090909090', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'active'),
(13, 'Ishita Roy', 'ishita@vlogs.com', '$2y$10$wN1.e10t3x4N38bKqjHkDe4eR6G/U2tM2W/uHk9YkK5K6L7M8N9O0', 'influencer', '+91 8989898989', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'active');

-- 10 Influencers Profiles Seed
INSERT INTO influencer_profiles (id, user_id, name, username, bio, gender, experience_years, city, state, country, languages, avatar, cover_image, category, content_style, followers, starting_price, verified, views_count, rating) VALUES
(1, 4, 'Aanya Verma', '@aanya_styles', 'Fashion & Lifestyle Content Creator. Passionate about sustainable chic trends, high-fashion shoots, and streetwear aesthetics.', 'Female', 4, 'Mumbai', 'Maharashtra', 'India', 'English, Hindi', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Fashion', 'Aesthetic & Chic', 450000, 8000.00, 1, 14500, 4.90),
(2, 5, 'Kabir Mehta', '@kabir_tech', 'Gadget reviewer, software developer & tech enthusiast. Unboxing latest smartphones, AI laptops, and hardware setup guides.', 'Male', 5, 'Bengaluru', 'Karnataka', 'India', 'English, Kannada, Hindi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 'Tech', 'In-Depth Hardware Reviews', 620000, 20000.00, 1, 28900, 4.85),
(3, 6, 'Siddharth Rao', '@siddharth_fit', 'Certified Strength & Conditioning Coach. Promoting natural body transformation, supplement breakdowns, and high-energy workout routines.', 'Male', 6, 'Delhi', 'Delhi', 'India', 'English, Hindi, Punjabi', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', 'Fitness', 'Energetic Bodybuilding', 310000, 15000.00, 1, 19200, 4.95),
(4, 7, 'Priya Nair', '@priya_bites', 'Culinary vlogger & restaurant reviewer. Discovering hidden street food gems, luxury dining, and artisanal cafe recipes.', 'Female', 3, 'Jaipur', 'Rajasthan', 'India', 'English, Hindi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'Food', 'Cinematic Culinary Vlogs', 220000, 12000.00, 0, 12100, 4.75),
(5, 8, 'Rohan Das', '@rohan_travels', 'Full-time travel photographer & luxury resort reviewer. Exploring tropical beaches, mountain treks, and heritage stays.', 'Male', 5, 'Goa', 'Goa', 'India', 'English, Hindi, Konkani', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', 'Travel', 'Cinematic Drone & Vlogs', 540000, 25000.00, 1, 31000, 4.92),
(6, 9, 'Ananya Kapoor', '@ananya_beauty', 'Skincare chemist & bridal makeup artist. Honest product teardowns, glow routines, and beauty transformation tutorials.', 'Female', 4, 'Mumbai', 'Maharashtra', 'India', 'English, Hindi, Marathi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', 'Beauty', 'Glam & Dermat Reviews', 380000, 18000.00, 1, 24100, 4.88),
(7, 10, 'Vikramaditya Singh', '@vikram_gaming', 'Pro Esports streamer & AAA game reviewer. Live streaming Valorant, GTA V mods, and PC setup benchmarks.', 'Male', 6, 'Hyderabad', 'Telangana', 'India', 'English, Telugu, Hindi', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', 'Gaming', 'Esports & Live Streams', 790000, 30000.00, 1, 48000, 4.90),
(8, 11, 'Neha Sharma', '@neha_educates', 'Tech career mentor & coding instructor. Simplifying web development, AI engineering, and tech interview prep.', 'Female', 4, 'Pune', 'Maharashtra', 'India', 'English, Hindi', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', 'Education', 'Step-by-step Tech Guides', 190000, 10000.00, 1, 16800, 4.96),
(9, 12, 'Arjun Kapoor', '@arjun_drives', 'Automobile journalist & track racer. Testing supercar performance, EV innovations, and long-distance road trips.', 'Male', 7, 'Chennai', 'Tamil Nadu', 'India', 'English, Tamil, Hindi', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'Automobile', 'High-Octane Track Reviews', 410000, 28000.00, 1, 29500, 4.87),
(10, 13, 'Ishita Roy', '@ishita_vlogs', 'Daily routine vlogger, home decor stylist, and indie lifestyle creator sharing warm aesthetic living.', 'Female', 3, 'Kolkata', 'West Bengal', 'India', 'English, Bengali, Hindi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', 'Lifestyle', 'Warm & Cozy Minimalist', 290000, 14000.00, 0, 18200, 4.80);

-- Social Links Seed
INSERT INTO social_links (influencer_id, platform, username, profile_url, followers_count, posts_count, engagement_rate) VALUES
(1, 'Instagram', '@aanya_styles', 'https://instagram.com/aanya_styles', 450000, 840, 4.85),
(1, 'YouTube', 'AanyaVlogs', 'https://youtube.com/aanyavlogs', 180000, 120, 5.20),
(2, 'YouTube', 'KabirTechZone', 'https://youtube.com/kabirtechzone', 620000, 310, 6.10),
(2, 'Twitter', '@kabir_tech', 'https://twitter.com/kabir_tech', 95000, 1500, 3.90),
(3, 'Instagram', '@siddharth_fit', 'https://instagram.com/siddharth_fit', 310000, 490, 5.80),
(4, 'Instagram', '@priya_bites', 'https://instagram.com/priya_bites', 220000, 610, 4.20),
(5, 'Instagram', '@rohan_travels', 'https://instagram.com/rohan_travels', 540000, 920, 5.10),
(6, 'Instagram', '@ananya_beauty', 'https://instagram.com/ananya_beauty', 380000, 710, 4.90),
(7, 'YouTube', 'VikramGamingLive', 'https://youtube.com/vikramgaminglive', 790000, 450, 7.20),
(8, 'Instagram', '@neha_educates', 'https://instagram.com/neha_educates', 190000, 340, 6.40),
(9, 'YouTube', 'ArjunDrivesOfficial', 'https://youtube.com/arjundrives', 410000, 280, 5.50),
(10, 'Instagram', '@ishita_vlogs', 'https://instagram.com/ishita_vlogs', 290000, 520, 4.60);

-- Services & Charges Seed
INSERT INTO services_charges (influencer_id, service_type, price, description) VALUES
(1, 'Instagram Reel', 25000, '30-60 second branded reel with customized hashtag & link'),
(1, 'Instagram Story', 8000, '24-hr story post with swipe-up link'),
(2, 'Dedicated Video', 65000, '8-10 min in-depth review on YouTube'),
(2, 'YouTube Shorts', 20000, '60-sec unboxing highlight'),
(3, 'Instagram Reel', 30000, 'Workout routine featuring activewear or supplement placement'),
(4, 'Restaurant Visit Reel', 15000, 'On-site video review of menu highlights'),
(5, 'Resort Vlog & Reel', 45000, 'Dedicated travel vlog + 2x Instagram reels'),
(6, 'Skincare Tutorial Reel', 22000, 'Step-by-step skincare routine featuring brand product'),
(7, 'Livestream Brand Collab', 50000, '2-hour livestream dedicated brand integration'),
(8, 'Course Spotlight Reel', 18000, '60-sec educational breakdown post'),
(9, 'Track Test Drive Video', 40000, 'High-octane car/bike test drive review video'),
(10, 'Room Decor Story Series', 16000, '3x Instagram stories highlighting home decor');

-- Portfolio Seed
INSERT INTO portfolio_items (influencer_id, media_type, title, url) VALUES
(1, 'image', 'Winter Outfit Lookbook', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500'),
(2, 'image', 'AI Laptop Unboxing', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500'),
(3, 'image', 'Transformation Challenge', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'),
(4, 'image', 'Gourmet Pasta Review', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'),
(5, 'image', 'Maldives Beach Resort Vlogs', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500'),
(6, 'image', 'Bridal Glow Routine', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'),
(7, 'image', 'Esports Championship Stream', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'),
(8, 'image', 'Full Stack Coding Bootcamp', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'),
(9, 'image', 'Superbike Track Race', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'),
(10, 'image', 'Aesthetic Room Tour', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500');

-- Bookings Seed
INSERT INTO bookings (id, user_id, influencer_id, campaign_name, business_name, promotion_type, description, booking_date, budget, status) VALUES
(101, 2, 1, 'Summer Fashion Launch 2026', 'Luxe Fashion Co.', 'Instagram Reel', 'Promote new summer streetwear line', '2026-08-15', 25000.00, 'accepted'),
(102, 2, 2, 'AI Laptop Launch Review', 'TechGear Inc', 'Dedicated Video', 'Unboxing and benchmark of new AI ultrabook', '2026-08-20', 65000.00, 'pending'),
(103, 3, 3, 'Whey Protein Transformation', 'FitLife Supplements', 'Instagram Reel', 'Showcase protein shake integration into daily workout', '2026-08-22', 30000.00, 'accepted'),
(104, 3, 5, 'Luxury Villa Review', 'TravelWise Agency', 'Resort Vlog & Reel', 'High resolution drone vlog of beach villa', '2026-08-10', 45000.00, 'completed');

-- Reviews Seed
INSERT INTO reviews (id, user_id, influencer_id, rating, review_text) VALUES
(1, 2, 1, 5, 'Aanya delivered an unbelievable reel! Sales for our summer collection spiked 40% in 48 hours.'),
(2, 3, 2, 5, 'Kabir tech video was super detailed and driving massive high-intent traffic to our store.'),
(3, 2, 3, 5, 'Siddharth high energy routine resonated deeply with our fitness audience!');

-- Site Settings Seed
INSERT INTO site_settings (id, site_name, contact_email, contact_phone, address) VALUES
(1, 'InfluencerConnect', 'support@influencerconnect.com', '+91 9876543210', 'Tech Park Tower B, Suite 402, Silicon Hub');

SET FOREIGN_KEY_CHECKS = 1;
