# InfluencerConnect - Full-Stack Influencer Marketing Platform 🚀

A modern, high-performance creator marketplace and influencer booking platform with real-time campaign management, escrow tracking, analytics, and admin control.

---

## 🌟 Key Features

- **Creator Discovery & Directory**: Hand-vetted Instagram, YouTube, and multi-channel influencers with verified follower analytics, rate cards, and reviews.
- **Booking & Escrow Management**: Multi-step booking proposal workflow with direct escrow fund tracking, approvals, releases, and refund handlers.
- **Dynamic Admin Suite**:
  - Creator Management: Add, edit, verify, and manage creator profiles.
  - Business User Management: Monitor brand accounts, spend volume, and active campaigns.
  - Category Management: Dynamic category taxonomy with icons and slugs.
  - Real-Time Asset & Settings Manager: Drag-and-drop file upload for brand logo, hero banner, and site branding.
- **Creator Dashboard**: Manage incoming brand proposals, custom calendar availability (available, busy, holiday), revenue analytics, and performance charts.
- **Brand / Client Dashboard**: Track active campaigns, deliverable statuses, and budget allocations.
- **Direct Messaging System**: Real-time communication between brands and creators.
- **Dual Storage Engine**: Hybrid PHP REST API with MySQL (`influencer_connect`) auto-initialization and JSON store persistence.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router, Lucide Icons, Vanilla CSS with custom design tokens (Dark/Light mode).
- **Backend**: PHP 8.x REST API (`api/index.php`) with PDO MySQL integration and CORS support.
- **Database**: MySQL (`influencer_connect`) with automatic table migration and initial seeding (`api/init_db.php`).
- **File Storage**: Local filesystem upload engine (`uploads/`) with MIME validation.

---

## 🚀 Getting Started

### 1. Prerequisites
- **XAMPP** (or Apache + MySQL + PHP 8.0+)
- **Node.js** (v18+) & **npm**

### 2. Setup Database & API
1. Place the repository inside your XAMPP `htdocs` directory:
   ```bash
   c:/xampp/htdocs/influencer
   ```
2. Start Apache and MySQL in XAMPP Control Panel.
3. Run the database initialization and auto-migration script:
   ```bash
   php api/init_db.php
   ```

### 3. Setup & Launch Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at `http://localhost:5173` (or via Apache at `http://localhost/influencer/frontend/dist/`).

---

## 📁 Project Structure

```
influencer/
├── api/                   # PHP REST API Backend
│   ├── config/            # Database & CORS config
│   ├── index.php          # REST API Router & Controllers
│   ├── init_db.php        # MySQL Auto-Migration & Seeding
│   └── data_store.json    # Standalone JSON Store
├── frontend/              # React + Vite Frontend
│   ├── src/
│   │   ├── api/           # API Client Service
│   │   ├── components/    # Reusable UI & Layout Components
│   │   ├── context/       # Auth & Data Context Providers
│   │   ├── pages/         # Public, Admin, Creator & User Views
│   │   └── index.css      # Design System & Responsive Tokens
│   ├── package.json
│   └── vite.config.js
├── uploads/               # Uploaded Media & Brand Assets
└── README.md
```
