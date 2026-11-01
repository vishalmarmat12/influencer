# 📘 Collabefy — Full Technical Project Documentation & System Manual

> **Platform Version:** 2.0.0 (Production Ready)  
> **Platform Tagline:** *Connect • Collaborate • Grow*  
> **Document Date:** November 2026  
> **PDF Companion File:** [`COLLABEFY_PROJECT_DOCUMENTATION.pdf`](./COLLABEFY_PROJECT_DOCUMENTATION.pdf)

---

## 📑 Table of Contents
1. [Executive Summary & System Purpose](#1-executive-summary--system-purpose)
2. [Technology Stack Architecture](#2-technology-stack-architecture)
3. [Database Configuration & Environment Setup (.env)](#3-database-configuration--environment-setup-env)
4. [Complete Data Storage Inventory (Where All Data Lives)](#4-complete-data-storage-inventory-where-all-data-lives)
5. [User Roles, Workflows & Portals](#5-user-roles-workflows--portals)
6. [RESTful API Endpoints Specification](#6-restful-api-endpoints-specification)
7. [Installation, Deployment & Automated Testing](#7-installation-deployment--automated-testing)

---

## 1. Executive Summary & System Purpose

**Collabefy** is a modern, high-performance creator marketplace and influencer management platform designed to connect social media influencers (Instagram, YouTube, X) directly with brands, agencies, and businesses.

### Core Problems Solved
- **Elimination of Agency Markups**: Direct connection between brand clients and verified creators with transparent fixed rate cards.
- **Availability Conflicts Prevented**: Automated single-date and range availability calendar prevents double-bookings.
- **Real-Time Deliverable Negotiation**: Built-in 1-on-1 direct messaging for campaign briefs, asset sharing, and deadline alignment.
- **Verified Client Reviews**: Only clients with completed collaborations can submit reviews, preserving platform authenticity.
- **Automated Platform Ledger**: System tracks gross volume, 10% commission fees, and creator payouts dynamically.

---

## 2. Technology Stack Architecture

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND (SPA)                       │
│    React 18/19 • Vite 8.2 • React Router • Lucide      │
│     Glassmorphism CSS Design Tokens (Dark / Light)     │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP REST (JSON)
┌──────────────────────────▼─────────────────────────────┐
│                 BACKEND API (PHP 8.0+)                 │
│        REST Controllers • JSON Router • CORS           │
│     Lightweight .env Engine (api/config/env.php)       │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│     PRIMARY STORAGE     │ │   DUAL-MODE FALLBACK    │
│    MySQL / MariaDB      │ │   Local JSON Datastore  │
│ (influencer_connect DB) │ │  (api/data_store.json)  │
└─────────────────────────┘ └─────────────────────────┘
```

### Detailed Component Stack

| Layer | Technology | Version | Purpose & Implementation |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | **React.js** | 18 / 19 | Component hierarchy, state hooks (`useState`, `useEffect`, `useContext`). |
| **Build Tool** | **Vite** | 8.2.0 | Sub-second HMR, optimized tree-shaking, production chunking. |
| **Routing** | **React Router DOM** | 7.x | Declarative client-side routing, protected route boundaries. |
| **Icons** | **Lucide React** | 1.28.0 | Vector UI iconography across desktop and mobile navigation. |
| **Styling** | **Vanilla CSS3** | Modern | CSS custom properties, glassmorphism blur filters, responsive media queries. |
| **Backend API** | **PHP REST** | 8.0+ | Stateless JSON REST endpoints (`api/index.php`). |
| **Database** | **MySQL / MariaDB** | 10.4+ / InnoDB | Relational database storage with ACID guarantees. |
| **Environment** | **Native PHP .env** | Built-in | Lightweight environment parser reading `.env` with 0 external dependencies. |
| **Offline Cache**| **JSON Storage Engine** | Native | Automatic fallback (`api/data_store.json`) when MySQL is offline. |

---

## 3. Database Configuration & Environment Setup (.env)

Collabefy isolates all sensitive credentials in the root [`.env`](file:///c:/xampp/htdocs/influencer/.env) file.

### Environment File Location
`c:\xampp\htdocs\influencer\.env`

### Environment Keys

```env
# ------------------------------------------------------------------------------
# Database Credentials (MySQL / MariaDB / XAMPP)
# ------------------------------------------------------------------------------
DB_HOST=localhost
DB_PORT=3306
DB_NAME=influencer_connect
DB_USER=root
DB_PASS=

# ------------------------------------------------------------------------------
# Application Settings
# ------------------------------------------------------------------------------
APP_NAME=Collabefy
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost/influencer

# ------------------------------------------------------------------------------
# Cross-Origin Resource Sharing (CORS)
# ------------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# ------------------------------------------------------------------------------
# File Uploads
# ------------------------------------------------------------------------------
UPLOAD_MAX_FILESIZE_MB=10
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
```

### Database Connection Class (`api/config/database.php`)
```php
require_once __DIR__ . '/env.php';

class Database {
    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = env('DB_HOST', 'localhost');
        $this->port = env('DB_PORT', '3306');
        $this->db_name = env('DB_NAME', 'influencer_connect');
        $this->username = env('DB_USER', env('DB_USERNAME', 'root'));
        $this->password = env('DB_PASS', env('DB_PASSWORD', ''));
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 1
            ]);
        } catch(PDOException $exception) {
            // Auto initialize database if missing
            if ($exception->getCode() === 1049 && file_exists(__DIR__ . '/../init_db.php')) {
                require_once __DIR__ . '/../init_db.php';
                $this->conn = initDatabase();
            }
        }
        return $this->conn;
    }
}
```

---

## 4. Complete Data Storage Inventory (Where All Data Lives)

Collabefy stores data across **4 distinct storage tiers**:

| Storage Tier | Physical Path / Target | Data Category | Scope & Behavior |
| :--- | :--- | :--- | :--- |
| **Tier 1: Primary DB** | `MySQL (influencer_connect)` | Users, Profiles, Bookings, Messages, Reviews, Availability | Relational, ACID compliant, primary live storage. |
| **Tier 2: File Datastore** | `api/data_store.json` | Complete snapshot of all records & fallback catalog | Dual-mode persistence when MySQL is offline. |
| **Tier 3: Browser Cache** | Client `localStorage` | Active user session, theme, bookmarks, read notifications | Browser-level instant state persistence. |
| **Tier 4: File Uploads** | `uploads/` & `frontend/public/` | Profile avatars, portfolio photos, brand logos | Binary images and media assets. |

### MySQL Relational Tables Schema

1. **`users` Table**
   - `id`: INT (Primary Key, Auto Increment)
   - `name`: VARCHAR(150) — Full user or business name
   - `email`: VARCHAR(191) UNIQUE — Login credential
   - `password`: VARCHAR(255) — Hashed password
   - `role`: ENUM(`'admin'`, `'user'`, `'influencer'`) — RBAC role
   - `phone`: VARCHAR(50) — Contact number
   - `company`: VARCHAR(150) — Associated company or agency
   - `status`: VARCHAR(50) — `'active'` or `'suspended'`
   - `avatar`: VARCHAR(500) — Profile photo URL

2. **`influencer_profiles` Table**
   - `id`: INT (Primary Key)
   - `user_id`: INT (Foreign Key $\rightarrow$ `users.id`)
   - `name`, `username`: VARCHAR (Unique handle)
   - `bio`: TEXT — Creator bio & aesthetic summary
   - `city`, `state`, `country`: Location strings
   - `category`: VARCHAR(100) — Niche classification
   - `starting_price`: INT — Starting rate in INR (₹)
   - `followers`: INT — Total multi-channel audience
   - `rating`: DECIMAL(3,2) — Dynamic average star rating
   - `views_count`: INT — Profile engagement counter
   - `verified`: TINYINT(1) — 1 for blue verified badge, 0 unverified
   - `services`: JSON — Rate card packages (Reels, Story, Dedicated Video)
   - `portfolio`: JSON — Array of photo / collab URLs
   - `socials`: JSON — Instagram, YouTube, X follower stats & links

3. **`categories` Table**
   - `id`: INT (Primary Key)
   - `name`: VARCHAR(100) — Niche title (Fashion, Tech, Food, etc.)
   - `slug`: VARCHAR(100) UNIQUE — URL slug
   - `icon`: VARCHAR(50) — Lucide icon identifier
   - `description`: TEXT — Category description
   - `status`: VARCHAR(20) — `'active'`

4. **`bookings` Table**
   - `id`: INT (Primary Key)
   - `user_id`: INT — Booking client ID
   - `influencer_id`: INT — Target creator ID
   - `campaign_name`: VARCHAR(200) — Campaign proposal title
   - `promotion_type`: VARCHAR(100) — Deliverable type (Reel, Story, Video)
   - `budget`: INT — Campaign payment amount in INR (₹)
   - `date`: DATE — Scheduled delivery date
   - `status`: ENUM(`'pending'`, `'accepted'`, `'completed'`, `'cancelled'`)
   - `description`: TEXT — Campaign brief requirements

5. **`messages` Table**
   - `id`: INT (Primary Key)
   - `conversation_id`: INT — Thread grouping identifier
   - `sender_id`, `receiver_id`: INT — Participant user IDs
   - `message`: TEXT — Chat message content
   - `is_read`: TINYINT(1) — Read indicator (0 = unread, 1 = read)
   - `created_at`: TIMESTAMP — Delivery timestamp

6. **`reviews` Table**
   - `id`: INT (Primary Key)
   - `influencer_id`: INT — Reviewed creator ID
   - `user_id`: INT — Client user ID
   - `user_name`: VARCHAR(150) — Client display name
   - `rating`: TINYINT — Rating from 1 to 5 stars
   - `review_text`: TEXT — Campaign review comments
   - `created_at`: DATE — Submission date

7. **`availability` Table**
   - `id`: INT (Primary Key)
   - `influencer_id`: INT — Creator ID
   - `from_date`, `to_date`: DATE — Blackout date interval
   - `status`: VARCHAR(50) — `'busy'`, `'holiday'`, or `'not_available'`
   - `notes`: VARCHAR(255) — Optional reason (e.g. "Personal Shoot")

8. **`site_settings` Table**
   - `id`: INT (Primary Key)
   - `setting_key`: VARCHAR(100) UNIQUE
   - `setting_value`: LONGTEXT — Dynamic branding, commission fee, hero banner assets

---

## 5. User Roles, Workflows & Portals

### 🏢 1. Brand / Business User (`user@demo.com`)
- **Discover Creators**: Filter catalog by category, follower reach, city, and price.
- **Direct Campaign Proposal**: Request booking on creator profile (`/book-influencer/:id`).
- **Real-Time Chat**: Negotiate deliverables in 1-on-1 chat threads (`/user/messages`).
- **Campaign Tracking**: View status transitions (Pending $\rightarrow$ Accepted $\rightarrow$ Completed).
- **Verified Reviews**: Submit feedback and 5-star ratings on creator profiles.

### 🎨 2. Content Creator / Influencer (`influencer@demo.com`)
- **Proposal Review**: Accept or decline incoming brand campaign proposals (`/creator/requests`).
- **Availability Management**: Block dates on calendar to prevent conflict bookings (`/creator/availability`).
- **Rate Card Editor**: Configure starting prices and individual service package rates (`/creator/charges`).
- **Live Chat**: Discuss deliverables directly with brands (`/creator/messages`).
- **Portfolio & Socials**: Link Instagram, YouTube, and sample photoshoot assets.

### 🛡️ 3. Platform System Administrator (`admin@influencer.com`)
- **Financial Analytics**: View platform commission volume (10%), gross bookings, and net payouts.
- **Category CRUD**: Create, edit, or delete categories with custom icons (`/admin/categories`).
- **Creator Badge Audit**: Toggle blue verified creator badges (`/admin/influencers`).
- **Booking Management**: Audit campaign bookings across all users (`/admin/bookings`).
- **Site Settings**: Customize platform title, tagline, logo, hero banner, and commission rate in real time (`/admin/settings`).

---

## 6. RESTful API Endpoints Specification

| Method | Endpoint Route | Request Body / Params | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | `{ email, password }` | Authenticates credentials and returns user role. |
| `POST` | `/api/register` | `{ name, email, password, role }` | Registers a new brand account. |
| `GET` | `/api/influencers` | `?category=Tech&search=Kabir` | Fetches filtered creator list. |
| `GET` | `/api/influencer-detail` | `?id=1` | Retrieves full creator portfolio, rates & reviews. |
| `POST` | `/api/bookings` | `{ user_id, influencer_id, date, budget }`| Submits a new campaign booking request. |
| `PUT` | `/api/bookings` | `{ id: 101, status: 'accepted' }` | Transitions booking status. |
| `GET` | `/api/messages` | `?user_id=2&conversation_id=1` | Loads chat message thread. |
| `POST` | `/api/messages` | `{ sender_id, receiver_id, message }` | Sends a direct chat message. |
| `GET` | `/api/availability` | `?influencer_id=1` | Returns creator blocked blackout dates. |
| `POST` | `/api/availability` | `{ influencer_id, from_date, to_date }` | Saves blocked date range. |
| `POST` | `/api/reviews` | `{ influencer_id, rating: 5, comment }` | Submits verified client review. |
| `GET` | `/api/settings` | `None` | Retrieves dynamic site branding & commission. |
| `POST` | `/api/settings` | `{ site_name, commission_fee }` | Updates platform configuration. |

---

## 7. Installation, Deployment & Automated Testing

### Prerequisites
- **XAMPP** (Apache 2.4+ and MySQL / MariaDB 10.4+ with PHP 8.0+)
- **Node.js** (v18.x or v20.x+)

### Setup Commands

```bash
# 1. Start Apache & MySQL in XAMPP Control Panel

# 2. Configure .env file
# Edit c:\xampp\htdocs\influencer\.env with your database credentials

# 3. Initialize MySQL Schema & Seed Data
php api/init_db.php

# 4. Start Frontend Vite Development Server
cd frontend
npm run dev

# 5. Build for Production
npm run build
```

### Running Automated Test Suites

```bash
# Backend 22-Endpoint Automated Test Suite
php scratch/run_full_api_test.php

# Frontend 61-Scenario Automated Model & Form Suite
node frontend/scripts/automated_test_runner.js
```

---
*Collabefy Platform Documentation • Generated November 2026*

