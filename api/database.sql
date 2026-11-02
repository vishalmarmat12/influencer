-- Influencer Connect / Collabefy Database Schema & Seed Data
SET FOREIGN_KEY_CHECKS = 0;

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
    instagram_url VARCHAR(500) NULL,
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

-- Users Seed (1 Admin, 1 Brand User, 1 Creator User)
INSERT INTO users (id, name, email, password, role, phone, avatar, status) VALUES
(1, 'System Admin', 'admin@influencer.com', '$2y$10$f/b0LHWhpY76iI30L80pC.5SgObZUsKxjfGCBCgxFoTDNmXl0X9jm', 'admin', '+1 555-0001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'active'),
(2, 'Rohan Sharma', 'user@demo.com', '$2y$12$KV5LROxRt9XJ/urE0gTLt.tTvMbgkrii8CPcMqGk7ooGqduX0Wm7.', 'user', '+91 9876543210', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'active'),
(3, 'Aanya Verma', 'creator@demo.com', '$2y$12$0NNNiS3nLXTWPWNSCUhbCeOvbO0Ia.22XHBSRUuWNyivrFHDtvL/K', 'influencer', '+91 9898989898', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'active');

-- 1 Influencer Profile Seed
INSERT INTO influencer_profiles (id, user_id, name, username, bio, gender, experience_years, city, state, country, languages, avatar, cover_image, instagram_url, category, content_style, followers, starting_price, verified, views_count, rating) VALUES
(1, 3, 'Aanya Verma', '@aanya_styles', 'Fashion & Lifestyle Content Creator. Passionate about sustainable chic trends, high-fashion styling, and aesthetic streetwear.', 'Female', 4, 'Mumbai', 'Maharashtra', 'India', 'English, Hindi', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'https://www.instagram.com/aanya_styles', 'Fashion', 'Chic Streetwear & Editorial', 450000, 8000.00, 1, 14500, 4.90);

-- Social Links Seed
INSERT INTO social_links (influencer_id, platform, username, profile_url, followers_count, engagement_rate) VALUES
(1, 'Instagram', '@aanya_styles', 'https://www.instagram.com/aanya_styles', 450000, 4.85),
(1, 'YouTube', 'AanyaVlogs', 'https://youtube.com', 180000, 5.20);

-- Services & Charges Seed
INSERT INTO services_charges (influencer_id, service_type, price, description) VALUES
(1, 'Instagram Reel', 25000, '30-60 second branded reel with link tag and custom hashtags'),
(1, 'Instagram Story', 8000, '24-hour story post with direct swipe-up link'),
(1, 'Instagram Post', 18000, 'Feed carousel post with dedicated styling showcase');

-- Portfolio Seed
INSERT INTO portfolio_items (influencer_id, media_type, title, url) VALUES
(1, 'image', 'Winter Editorial Lookbook', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500'),
(1, 'image', 'Streetwear Summer Capsule', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500');

-- Site Settings Seed
INSERT INTO site_settings (id, site_name, contact_email, contact_phone, address) VALUES
(1, 'Collabefy', 'support@collabefy.com', '+91 9876543210', 'Tech Park Tower B, Suite 402, Bangalore, India');

SET FOREIGN_KEY_CHECKS = 1;
