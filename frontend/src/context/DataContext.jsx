import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiService';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const AUTHENTIC_CATEGORIES = [
  { id: 1, name: 'Fashion', slug: 'fashion', icon: 'Shirt', description: 'Style, outfits, and fashion trends', status: 'active' },
  { id: 2, name: 'Food', slug: 'food', icon: 'Utensils', description: 'Culinary arts, food reviews, and recipes', status: 'active' },
  { id: 3, name: 'Tech', slug: 'tech', icon: 'Cpu', description: 'Gadgets, software, and tech reviews', status: 'active' },
  { id: 4, name: 'Fitness', slug: 'fitness', icon: 'Dumbbell', description: 'Workouts, nutrition, and wellness', status: 'active' },
  { id: 5, name: 'Travel', slug: 'travel', icon: 'Compass', description: 'Destinations, vlogs, and travel guides', status: 'active' },
  { id: 6, name: 'Beauty', slug: 'beauty', icon: 'Sparkles', description: 'Makeup, skincare, and cosmetics', status: 'active' },
  { id: 7, name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', description: 'Esports, game reviews, and live streams', status: 'active' },
  { id: 8, name: 'Education', slug: 'education', icon: 'BookOpen', description: 'Tutorials, career guidance, and courses', status: 'active' },
  { id: 9, name: 'Lifestyle', slug: 'lifestyle', icon: 'Heart', description: 'Daily life, personal vlogs, and inspiration', status: 'active' },
  { id: 10, name: 'Automobile', slug: 'automobile', icon: 'Car', description: 'Cars, bikes, and automotive reviews', status: 'active' }
];

const AUTHENTIC_INFLUENCERS = [
  {
    id: 1,
    user_id: 4,
    name: 'Aanya Verma',
    username: '@aanya_styles',
    bio: 'Fashion & Lifestyle Content Creator. Passionate about sustainable chic trends, high-fashion shoots, and streetwear aesthetics.',
    gender: 'Female',
    experience_years: 4,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    languages: 'English, Hindi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    cover_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    category: 'Fashion',
    content_style: 'Aesthetic & Chic',
    followers: 450000,
    followerCount: 450000,
    starting_price: 8000,
    startingPrice: 8000,
    verified: true,
    rating: 4.90,
    views_count: 14500,
    services: [
      { type: 'Instagram Reel', price: 25000, desc: '30-60 second branded reel with customized hashtag & link' },
      { type: 'Instagram Story', price: 8000, desc: '24-hr story post with swipe-up link' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500'
    ],
    socials: {
      instagram: { followers: '450K', url: 'https://instagram.com/aanya_styles' },
      youtube: { subscribers: '180K', url: 'https://youtube.com/aanyavlogs' }
    }
  },
  {
    id: 2,
    user_id: 5,
    name: 'Kabir Mehta',
    username: '@kabir_tech',
    bio: 'Gadget reviewer, software developer & tech enthusiast. Unboxing latest smartphones, AI laptops, and hardware setup guides.',
    gender: 'Male',
    experience_years: 5,
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    languages: 'English, Kannada, Hindi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    category: 'Tech',
    content_style: 'In-Depth Hardware Reviews',
    followers: 620000,
    followerCount: 620000,
    starting_price: 20000,
    startingPrice: 20000,
    verified: true,
    rating: 4.85,
    views_count: 28900,
    services: [
      { type: 'Dedicated Video', price: 65000, desc: '8-10 min in-depth review on YouTube' },
      { type: 'YouTube Shorts', price: 20000, desc: '60-sec unboxing highlight' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500'
    ],
    socials: {
      youtube: { subscribers: '620K', url: 'https://youtube.com/kabirtechzone' },
      twitter: { followers: '95K', url: 'https://twitter.com/kabir_tech' }
    }
  },
  {
    id: 3,
    user_id: 6,
    name: 'Siddharth Rao',
    username: '@siddharth_fit',
    bio: 'Certified Strength & Conditioning Coach. Promoting natural body transformation, supplement breakdowns, and high-energy workout routines.',
    gender: 'Male',
    experience_years: 6,
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    languages: 'English, Hindi, Punjabi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
    cover_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    category: 'Fitness',
    content_style: 'Energetic Bodybuilding',
    followers: 310000,
    followerCount: 310000,
    starting_price: 15000,
    startingPrice: 15000,
    verified: true,
    rating: 4.95,
    views_count: 19200,
    services: [
      { type: 'Instagram Reel', price: 30000, desc: 'Workout routine featuring activewear or supplement placement' },
      { type: 'Transformation Post', price: 15000, desc: 'Feed post with nutrition tip' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'
    ],
    socials: {
      instagram: { followers: '310K', url: 'https://instagram.com/siddharth_fit' }
    }
  },
  {
    id: 4,
    user_id: 7,
    name: 'Priya Nair',
    username: '@priya_bites',
    bio: 'Culinary vlogger & restaurant reviewer. Discovering hidden street food gems, luxury dining, and artisanal cafe recipes.',
    gender: 'Female',
    experience_years: 3,
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    languages: 'English, Hindi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    cover_image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    category: 'Food',
    content_style: 'Cinematic Culinary Vlogs',
    followers: 220000,
    followerCount: 220000,
    starting_price: 12000,
    startingPrice: 12000,
    verified: false,
    rating: 4.75,
    views_count: 12100,
    services: [
      { type: 'Restaurant Visit Reel', price: 15000, desc: 'On-site video review of menu highlights' },
      { type: 'Food Story', price: 6000, desc: '2x story coverage' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500'
    ],
    socials: {
      instagram: { followers: '220K', url: 'https://instagram.com/priya_bites' }
    }
  },
  {
    id: 5,
    user_id: 8,
    name: 'Rohan Das',
    username: '@rohan_travels',
    bio: 'Full-time travel photographer & luxury resort reviewer. Exploring tropical beaches, mountain treks, and heritage stays.',
    gender: 'Male',
    experience_years: 5,
    city: 'Goa',
    state: 'Goa',
    country: 'India',
    languages: 'English, Hindi, Konkani',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
    cover_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    category: 'Travel',
    content_style: 'Cinematic Drone & Vlogs',
    followers: 540000,
    followerCount: 540000,
    starting_price: 25000,
    startingPrice: 25000,
    verified: true,
    rating: 4.92,
    views_count: 31000,
    services: [
      { type: 'Resort Vlog & Reel', price: 45000, desc: 'Dedicated travel vlog + 2x Instagram reels' },
      { type: 'Travel Story', price: 10000, desc: 'Location tag story' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500'
    ],
    socials: {
      instagram: { followers: '540K', url: 'https://instagram.com/rohan_travels' }
    }
  },
  {
    id: 6,
    user_id: 9,
    name: 'Ananya Kapoor',
    username: '@ananya_beauty',
    bio: 'Skincare chemist & bridal makeup artist. Honest product teardowns, glow routines, and beauty transformation tutorials.',
    gender: 'Female',
    experience_years: 4,
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    languages: 'English, Hindi, Marathi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    cover_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    category: 'Beauty',
    content_style: 'Glam & Dermat Reviews',
    followers: 380000,
    followerCount: 380000,
    starting_price: 18000,
    startingPrice: 18000,
    verified: true,
    rating: 4.88,
    views_count: 24100,
    services: [
      { type: 'Skincare Tutorial Reel', price: 22000, desc: 'Step-by-step skincare routine featuring brand product' },
      { type: 'Product Review', price: 12000, desc: 'Detailed swipeable post' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'
    ],
    socials: {
      instagram: { followers: '380K', url: 'https://instagram.com/ananya_beauty' }
    }
  },
  {
    id: 7,
    user_id: 10,
    name: 'Vikramaditya Singh',
    username: '@vikram_gaming',
    bio: 'Pro Esports streamer & AAA game reviewer. Live streaming Valorant, GTA V mods, and PC setup benchmarks.',
    gender: 'Male',
    experience_years: 6,
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    languages: 'English, Telugu, Hindi',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
    cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    category: 'Gaming',
    content_style: 'Esports & Live Streams',
    followers: 790000,
    followerCount: 790000,
    starting_price: 30000,
    startingPrice: 30000,
    verified: true,
    rating: 4.90,
    views_count: 48000,
    services: [
      { type: 'Livestream Brand Collab', price: 50000, desc: '2-hour livestream dedicated brand integration' },
      { type: 'Gaming Highlight Reel', price: 25000, desc: 'Sponsored gameplay clip' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'
    ],
    socials: {
      youtube: { subscribers: '790K', url: 'https://youtube.com/vikramgaminglive' }
    }
  },
  {
    id: 8,
    user_id: 11,
    name: 'Neha Sharma',
    username: '@neha_educates',
    bio: 'Tech career mentor & coding instructor. Simplifying web development, AI engineering, and tech interview prep.',
    gender: 'Female',
    experience_years: 4,
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    languages: 'English, Hindi',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    category: 'Education',
    content_style: 'Step-by-step Tech Guides',
    followers: 190000,
    followerCount: 190000,
    starting_price: 10000,
    startingPrice: 10000,
    verified: true,
    rating: 4.96,
    views_count: 16800,
    services: [
      { type: 'Course Spotlight Reel', price: 18000, desc: '60-sec educational breakdown post' },
      { type: 'Carousel Guide', price: 10000, desc: '5-slide resource summary' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'
    ],
    socials: {
      instagram: { followers: '190K', url: 'https://instagram.com/neha_educates' }
    }
  },
  {
    id: 9,
    user_id: 12,
    name: 'Arjun Kapoor',
    username: '@arjun_drives',
    bio: 'Automobile journalist & track racer. Testing supercar performance, EV innovations, and long-distance road trips.',
    gender: 'Male',
    experience_years: 7,
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    languages: 'English, Tamil, Hindi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300',
    cover_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    category: 'Automobile',
    content_style: 'High-Octane Track Reviews',
    followers: 410000,
    followerCount: 410000,
    starting_price: 28000,
    startingPrice: 28000,
    verified: true,
    rating: 4.87,
    views_count: 29500,
    services: [
      { type: 'Track Test Drive Video', price: 40000, desc: 'High-octane car/bike test drive review video' },
      { type: 'Automotive Feature Post', price: 18000, desc: 'Studio photo integration' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500'
    ],
    socials: {
      youtube: { subscribers: '410K', url: 'https://youtube.com/arjundrives' }
    }
  },
  {
    id: 10,
    user_id: 13,
    name: 'Ishita Roy',
    username: '@ishita_vlogs',
    bio: 'Daily routine vlogger, home decor stylist, and indie lifestyle creator sharing warm aesthetic living.',
    gender: 'Female',
    experience_years: 3,
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    languages: 'English, Bengali, Hindi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    cover_image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
    category: 'Lifestyle',
    content_style: 'Warm & Cozy Minimalist',
    followers: 290000,
    followerCount: 290000,
    starting_price: 14000,
    startingPrice: 14000,
    verified: false,
    rating: 4.80,
    views_count: 18200,
    services: [
      { type: 'Room Decor Story Series', price: 16000, desc: '3x Instagram stories highlighting home decor' },
      { type: 'Lifestyle Vlog Integration', price: 20000, desc: 'Organic placement in weekly vlog' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500'
    ],
    socials: {
      instagram: { followers: '290K', url: 'https://instagram.com/ishita_vlogs' }
    }
  }
];

const AUTHENTIC_BOOKINGS = [
  {
    id: 101,
    user_id: 2,
    influencer_id: 1,
    influencer_name: 'Aanya Verma',
    campaign_name: 'Summer Fashion Launch 2026',
    business_name: 'Luxe Fashion Co.',
    promotion_type: 'Instagram Reel',
    description: 'Promote new summer streetwear line',
    date: '2026-08-15',
    budget: 25000,
    status: 'accepted',
    created_at: '2026-08-01'
  },
  {
    id: 102,
    user_id: 2,
    influencer_id: 2,
    influencer_name: 'Kabir Mehta',
    campaign_name: 'AI Laptop Launch Review',
    business_name: 'TechGear Inc',
    promotion_type: 'Dedicated Video',
    description: 'Unboxing and benchmark of new AI ultrabook',
    date: '2026-08-20',
    budget: 65000,
    status: 'pending',
    created_at: '2026-08-05'
  },
  {
    id: 103,
    user_id: 3,
    influencer_id: 3,
    influencer_name: 'Siddharth Rao',
    campaign_name: 'Whey Protein Transformation',
    business_name: 'FitLife Supplements',
    promotion_type: 'Instagram Reel',
    description: 'Showcase protein shake integration into daily workout',
    date: '2026-08-22',
    budget: 30000,
    status: 'accepted',
    created_at: '2026-08-06'
  },
  {
    id: 104,
    user_id: 3,
    influencer_id: 5,
    influencer_name: 'Rohan Das',
    campaign_name: 'Luxury Villa Review',
    business_name: 'TravelWise Agency',
    promotion_type: 'Resort Vlog & Reel',
    description: 'High resolution drone vlog of beach villa',
    date: '2026-08-10',
    budget: 45000,
    status: 'completed',
    created_at: '2026-07-28'
  }
];

const AUTHENTIC_REVIEWS = [
  {
    id: 1,
    user_id: 2,
    influencer_id: 1,
    user_name: 'Rohan Sharma',
    rating: 5,
    review_text: 'Aanya delivered an unbelievable reel! Sales for our summer collection spiked 40% in 48 hours.',
    created_at: '2026-08-16'
  },
  {
    id: 2,
    user_id: 3,
    influencer_id: 2,
    user_name: 'TechGear Marketing',
    rating: 5,
    review_text: 'Kabir tech video was super detailed and driving massive high-intent traffic to our store.',
    created_at: '2026-08-21'
  },
  {
    id: 3,
    user_id: 2,
    influencer_id: 3,
    user_name: 'Rohan Sharma',
    rating: 5,
    review_text: 'Siddharth high energy routine resonated deeply with our fitness audience!',
    created_at: '2026-08-23'
  }
];

const AUTHENTIC_USERS = [
  { id: 1, name: 'System Admin', company: 'Collabefy HQ', email: 'admin@influencer.com', role: 'Administrator', phone: '+91 98765 00001', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', created_at: '2026-01-01' },
  { id: 2, name: 'Rohan Sharma', company: 'TechGear Inc', email: 'user@demo.com', role: 'Brand Account', phone: '+91 98765 43210', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', created_at: '2026-02-10' },
  { id: 3, name: 'Ananya Roy', company: 'Luxe Fashion Co.', email: 'ananya@luxefashion.com', role: 'Agency', phone: '+91 98765 11223', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', created_at: '2026-03-15' },
  { id: 4, name: 'Vikram Seth', company: 'FitLife Supplements', email: 'vikram@fitlife.com', role: 'Brand Account', phone: '+91 98765 33445', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', created_at: '2026-04-02' },
  { id: 5, name: 'Pooja Malhotra', company: 'TravelWise Agency', email: 'pooja@travelwise.com', role: 'Agency', phone: '+91 98765 55667', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', created_at: '2026-05-18' },
  { id: 6, name: 'Karan Singhania', company: 'Gourmet Bites Cafe', email: 'contact@gourmetbites.com', role: 'Business', phone: '+91 98765 77889', status: 'Active', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', created_at: '2026-06-20' }
];

export const DEFAULT_SITE_SETTINGS = {
  site_name: 'Collabefy',
  site_tagline: "Connect • Collaborate • Grow",
  logo_url: '/collabefy-logo.png',
  contact_email: 'support@collabefy.com',
  contact_phone: '+91 98765 43210',
  contact_address: 'Tech Park Tower B, Suite 402, Bangalore, India',
  office_hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
  commission_fee: 10,
  hero_badge: "⚡ India's #1 Verified Creator Marketplace",
  hero_title: 'Connect & Book Top Influencers for Your Brand Campaigns',
  hero_subtitle: 'Discover hand-vetted Instagram, YouTube, and multi-channel creators. Transparent fixed rate cards, verified audience analytics, and seamless instant booking.',
  hero_image_url: '/images/collabefy-hero.jpg',
  about_story_image: '/images/collabefy-about-story.jpg',
  cta_title: 'Are You a Creator or Influencer?',
  cta_subtitle: 'Monetize your audience with premium brand deals. Set your fixed rates, receive pre-paid bookings, and manage all your sponsorships in one place.',
  footer_about: 'The premier zero-commission marketplace connecting innovative brands directly with high-impact social media creators.',
  terms_content: 'Welcome to Collabefy. By accessing or using our platform, power users and brands agree to comply with our verified guidelines.',
  privacy_content: 'Your privacy is paramount. Collabefy ensures secure handling of user accounts, transactions, verified analytics, and campaign briefs.'
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_connect_categories');
      return saved ? JSON.parse(saved) : AUTHENTIC_CATEGORIES;
    } catch (e) {
      return AUTHENTIC_CATEGORIES;
    }
  });

  const [influencers, setInfluencers] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_connect_influencers');
      return saved ? JSON.parse(saved) : AUTHENTIC_INFLUENCERS;
    } catch (e) {
      return AUTHENTIC_INFLUENCERS;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_connect_users');
      return saved ? JSON.parse(saved) : AUTHENTIC_USERS;
    } catch (e) {
      return AUTHENTIC_USERS;
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_connect_bookings');
      return saved ? JSON.parse(saved) : AUTHENTIC_BOOKINGS;
    } catch (e) {
      return AUTHENTIC_BOOKINGS;
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_connect_messages');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        let changed = false;
        if (parsed.site_name === 'InfluencerConnect' || !parsed.site_name) {
          parsed.site_name = 'Collabefy';
          parsed.site_tagline = 'Connect • Collaborate • Grow';
          parsed.logo_url = '/collabefy-logo.png';
          parsed.contact_email = 'support@collabefy.com';
          changed = true;
        }
        if (!parsed.hero_image_url || parsed.hero_image_url.includes('unsplash.com')) {
          parsed.hero_image_url = '/images/collabefy-hero.jpg';
          changed = true;
        }
        if (!parsed.about_story_image || parsed.about_story_image.includes('unsplash.com')) {
          parsed.about_story_image = '/images/collabefy-about-story.jpg';
          changed = true;
        }
        if (changed) {
          try {
            localStorage.setItem('influencer_site_settings', JSON.stringify({ ...DEFAULT_SITE_SETTINGS, ...parsed }));
          } catch (e) {}
        }
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
      return DEFAULT_SITE_SETTINGS;
    } catch (e) {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('influencer_connect_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [availabilityList, setAvailabilityList] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_connect_availability');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_connect_reviews');
      return saved ? JSON.parse(saved) : AUTHENTIC_REVIEWS;
    } catch (e) {
      return AUTHENTIC_REVIEWS;
    }
  });

  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem('influencer_read_notif_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state into localStorage for seamless instant persistence
  useEffect(() => {
    try {
      localStorage.setItem('influencer_connect_bookings', JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('influencer_connect_categories', JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('influencer_connect_influencers', JSON.stringify(influencers));
    } catch (e) {}
  }, [influencers]);

  useEffect(() => {
    try {
      localStorage.setItem('influencer_connect_users', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('influencer_connect_availability', JSON.stringify(availabilityList));
    } catch (e) {}
  }, [availabilityList]);

  useEffect(() => {
    try {
      localStorage.setItem('influencer_connect_reviews', JSON.stringify(reviewsList));
    } catch (e) {}
  }, [reviewsList]);

  useEffect(() => {
    try {
      localStorage.setItem('influencer_connect_messages', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('influencer_connect_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Dynamically compute user notifications based on real data & role
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const dynamicNotifs = [];

    // 1. Unread chat messages notifications for all logged-in roles
    const unreadMsgs = (messages || []).filter(m => 
      Number(m.receiver_id) === Number(user.id) && !m.is_read
    );

    unreadMsgs.forEach(m => {
      const id = `msg_${m.id}`;
      const senderInf = (influencers || []).find(i => Number(i.user_id) === Number(m.sender_id) || Number(i.id) === Number(m.sender_id));
      const senderName = senderInf ? senderInf.name : (m.sender_name || `User #${m.sender_id}`);
      const chatLink = user.role === 'influencer' 
        ? `/creator/messages?conversationId=${m.conversation_id}`
        : `/user/messages?conversationId=${m.conversation_id}`;

      dynamicNotifs.push({
        id,
        type: 'message',
        title: `New Message from ${senderName}`,
        message: m.message || 'Sent you a campaign negotiation message.',
        time: m.created_at ? new Date(m.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent',
        link: chatLink,
        read: readNotifIds.includes(id)
      });
    });

    // 2. Role-specific Dynamic Notifications
    if (user.role === 'admin') {
      const pendingBookings = (bookings || []).filter(b => b.status === 'pending');
      pendingBookings.forEach(b => {
        const id = `admin_bk_${b.id}`;
        dynamicNotifs.push({
          id,
          type: 'booking',
          title: `Pending Campaign Approval`,
          message: `${b.business_name || 'Client'} requested "${b.campaign_name || 'Campaign'}" with ${b.influencer_name || 'Creator'}.`,
          time: b.date || 'Recent',
          link: '/admin/bookings',
          read: readNotifIds.includes(id)
        });
      });

      const unverifiedCreators = (influencers || []).filter(i => !i.verified);
      if (unverifiedCreators.length > 0) {
        const id = `admin_unverified_creators`;
        dynamicNotifs.push({
          id,
          type: 'system',
          title: `Creator Verification Audit`,
          message: `${unverifiedCreators.length} creator accounts are pending badge audit.`,
          time: 'Action Required',
          link: '/admin/influencers',
          read: readNotifIds.includes(id)
        });
      }
    } else if (user.role === 'influencer') {
      const myBookings = (bookings || []).filter(b => b.influencer_id == user.id || b.influencer_user_id == user.id || b.influencer_name === user.name);
      
      const pendingReqs = myBookings.filter(b => b.status === 'pending');
      pendingReqs.forEach(b => {
        const id = `creator_req_${b.id}`;
        dynamicNotifs.push({
          id,
          type: 'booking',
          title: `New Campaign Proposal!`,
          message: `${b.business_name || 'Brand'} offered ₹${(b.budget || 0).toLocaleString()} for "${b.campaign_name}".`,
          time: b.date || 'Recent',
          link: '/creator/requests',
          read: readNotifIds.includes(id)
        });
      });

      const acceptedReqs = myBookings.filter(b => b.status === 'accepted');
      acceptedReqs.forEach(b => {
        const id = `creator_acc_${b.id}`;
        dynamicNotifs.push({
          id,
          type: 'booking',
          title: `Active Campaign Collaboration`,
          message: `Deliverable for "${b.campaign_name}" is in progress.`,
          time: b.date || 'Recent',
          link: '/creator/requests',
          read: readNotifIds.includes(id)
        });
      });
    } else if (user.role === 'user') {
      const myBookings = (bookings || []).filter(b => b.user_id == user.id || b.user_email === user.email);
      
      const acceptedBookings = myBookings.filter(b => b.status === 'accepted');
      acceptedBookings.forEach(b => {
        const id = `user_accepted_${b.id}`;
        dynamicNotifs.push({
          id,
          type: 'booking',
          title: `Campaign Proposal Accepted!`,
          message: `${b.influencer_name} accepted "${b.campaign_name}".`,
          time: b.date || 'Recent',
          link: '/user/bookings',
          read: readNotifIds.includes(id)
        });
      });

      const pendingBookings = myBookings.filter(b => b.status === 'pending');
      pendingBookings.forEach(b => {
        const id = `user_pending_${b.id}`;
        dynamicNotifs.push({
          id,
          type: 'booking',
          title: `Proposal Sent to Creator`,
          message: `Your booking for "${b.campaign_name}" is awaiting creator review.`,
          time: b.date || 'Recent',
          link: '/user/bookings',
          read: readNotifIds.includes(id)
        });
      });

      const completedBookings = myBookings.filter(b => b.status === 'completed');
      completedBookings.forEach(b => {
        const id = `user_completed_${b.id}`;
        dynamicNotifs.push({
          id,
          type: 'system',
          title: `Campaign Completed!`,
          message: `Deliverables for "${b.campaign_name}" are delivered. Leave a review!`,
          time: b.date || 'Recent',
          link: '/user/bookings',
          read: readNotifIds.includes(id)
        });
      });
    }

    setNotifications(dynamicNotifs);
  }, [user, bookings, influencers, messages, readNotifIds]);

  const markNotificationRead = (id) => {
    if (!id) return;
    const updated = Array.from(new Set([...readNotifIds, id]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem('influencer_read_notif_ids', JSON.stringify(updated));
    } catch (e) {}
  };

  const markAllNotificationsRead = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem('influencer_read_notif_ids', JSON.stringify(updated));
    } catch (e) {}
  };

  // Load user specific data from PHP API
  const loadData = async (activeUser = user) => {
    setLoading(true);
    try {
      const [catRes, infRes, availRes, revRes, setRes, usersRes] = await Promise.all([
        api.getCategories().catch(() => null),
        api.getInfluencers().catch(() => null),
        api.getAvailability().catch(() => null),
        api.getReviews().catch(() => null),
        api.getSettings().catch(() => null),
        api.getUsers().catch(() => null)
      ]);

      if (catRes && catRes.data) setCategories(catRes.data);
      if (infRes && infRes.data) setInfluencers(infRes.data);
      if (usersRes && usersRes.data && usersRes.data.length > 0) setUsers(usersRes.data);
      if (availRes && availRes.data) setAvailabilityList(availRes.data);
      if (revRes && revRes.data) setReviewsList(revRes.data);
      if (setRes && setRes.data) {
        setSiteSettings(prev => {
          const merged = { ...prev, ...setRes.data };
          try {
            localStorage.setItem('influencer_site_settings', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }

      const queryParams = activeUser ? { user_id: activeUser.id, role: activeUser.role } : {};
      const bkRes = await api.getBookings(queryParams).catch(() => null);
      if (bkRes && bkRes.data && Array.isArray(bkRes.data) && bkRes.data.length > 0) {
        setBookings(bkRes.data);
      }

      if (activeUser) {
        const msgRes = await api.getMessages({
          user_id: activeUser.id,
          role: activeUser.role
        }).catch(() => null);
        if (msgRes && msgRes.data && Array.isArray(msgRes.data) && msgRes.data.length > 0) {
          setMessages(msgRes.data);
        }
      }
    } catch (e) {
      console.error('Data loading error:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSettings = async (newSettings) => {
    try {
      const merged = { ...siteSettings, ...newSettings };
      setSiteSettings(merged);
      try {
        localStorage.setItem('influencer_site_settings', JSON.stringify(merged));
      } catch (e) {}

      const res = await api.updateSettings(newSettings);
      if (res && res.data) {
        const finalMerged = { ...merged, ...res.data };
        setSiteSettings(finalMerged);
        try {
          localStorage.setItem('influencer_site_settings', JSON.stringify(finalMerged));
        } catch (e) {}
        return { success: true, data: finalMerged, message: res.message || 'Settings updated successfully!' };
      }
      return { success: true, data: merged, message: 'Settings saved locally!' };
    } catch (err) {
      console.error('Update settings error:', err);
      return { success: true, data: { ...siteSettings, ...newSettings }, message: 'Settings saved locally.' };
    }
  };

  useEffect(() => {
    loadData(user);
  }, [user]);

  // Availability handlers
  const fetchAvailability = async (influencerId) => {
    try {
      const res = await api.getAvailability(influencerId);
      if (res && res.data) {
        setAvailabilityList(res.data);
        return res.data;
      }
    } catch (e) {
      console.error('Fetch availability error:', e);
    }
    return availabilityList;
  };

  const saveAvailability = async (data) => {
    try {
      const res = data.id ? await api.updateAvailability(data) : await api.addAvailability(data);
      if (res && (res.status === 'success' || res.data)) {
        await fetchAvailability(data.influencer_id || user?.id);
        return { success: true, message: res.message || 'Availability range saved successfully.', data: res.data };
      } else {
        return { success: false, message: res?.message || 'Failed to save availability range.' };
      }
    } catch (err) {
      console.error('Save availability error:', err);
      return { success: false, message: 'Network error saving availability range.' };
    }
  };

  const deleteAvailability = async (id, influencerId) => {
    try {
      const res = await api.deleteAvailability(id, influencerId);
      if (res && res.status === 'success') {
        setAvailabilityList((prev) => prev.filter((item) => item.id !== id));
        return { success: true, message: res.message || 'Availability period deleted.' };
      } else {
        return { success: false, message: res?.message || 'Failed to delete availability record.' };
      }
    } catch (err) {
      console.error('Delete availability error:', err);
      return { success: false, message: 'Network error deleting availability.' };
    }
  };

  const checkDateAvailability = (influencerId, dateStr, customList = null) => {
    const list = customList || availabilityList;
    if (!dateStr) return { isAvailable: true, status: 'available', notes: '' };

    const targetInfId = Number(influencerId) || 1;
    const match = list.find((item) => {
      const itemInfId = Number(item.influencer_id) || 1;
      if (itemInfId === targetInfId || targetInfId === 0) {
        const fDate = item.from_date;
        const tDate = item.to_date;
        const st = (item.status || 'available').toLowerCase();
        return st !== 'available' && dateStr >= fDate && dateStr <= tDate;
      }
      return false;
    });

    if (match) {
      const st = (match.status || 'busy').toLowerCase();
      const statusLabel = (st === 'busy' || st === 'not_available') ? 'Busy / Not Available' : 'Holiday';
      return {
        isAvailable: false,
        status: match.status,
        statusLabel,
        notes: match.notes || '',
        item: match
      };
    }

    return { isAvailable: true, status: 'available', statusLabel: 'Available', notes: '' };
  };

  // Handlers for state updates
  const addCategory = async (newCat) => {
    try {
      const res = await (api.createCategory ? api.createCategory(newCat) : api.addCategory(newCat));
      if (res && res.data) {
        setCategories((prev) => [...prev, res.data]);
        return { success: true, data: res.data, message: res.message || 'Category added successfully!' };
      } else {
        const localCat = { id: categories.length + 1, ...newCat, status: 'active' };
        setCategories((prev) => [...prev, localCat]);
        return { success: true, data: localCat, message: 'Category added to catalog!' };
      }
    } catch (err) {
      console.error('Add category error:', err);
      const localCat = { id: categories.length + 1, ...newCat, status: 'active' };
      setCategories((prev) => [...prev, localCat]);
      return { success: true, data: localCat, message: 'Category created locally.' };
    }
  };

  const updateCategory = async (catData) => {
    try {
      const res = await api.updateCategory(catData);
      if (res && res.data) {
        setCategories((prev) => prev.map((c) => (c.id === catData.id ? { ...c, ...res.data } : c)));
        return { success: true, data: res.data, message: res.message || 'Category updated successfully!' };
      } else {
        setCategories((prev) => prev.map((c) => (c.id === catData.id ? { ...c, ...catData } : c)));
        return { success: true, data: catData, message: 'Category updated locally.' };
      }
    } catch (err) {
      console.error('Update category error:', err);
      setCategories((prev) => prev.map((c) => (c.id === catData.id ? { ...c, ...catData } : c)));
      return { success: true, data: catData, message: 'Category updated locally.' };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await api.deleteCategory(id);
      if (res && res.status === 'success') {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        return { success: true, message: res.message || 'Category removed successfully!' };
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        return { success: true, message: 'Category removed locally.' };
      }
    } catch (err) {
      console.error('Delete category error:', err);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return { success: true, message: 'Category removed locally.' };
    }
  };

  const createBooking = async (bookingData) => {
    const res = await api.createBooking(bookingData);
    if (res && res.status === 'success') {
      if (res.data) setBookings((prev) => [res.data, ...prev]);
      return { success: true, message: res.message || 'Booking request submitted successfully!' };
    } else if (res && res.status === 'error') {
      return { success: false, message: res.message || 'Failed to submit booking.' };
    } else {
      const localBk = {
        id: 100 + bookings.length + 1,
        status: 'pending',
        created_at: new Date().toISOString().split('T')[0],
        ...bookingData
      };
      setBookings((prev) => [localBk, ...prev]);
      return { success: true, message: 'Booking request submitted!' };
    }
  };

  const fetchBookings = async () => {
    try {
      const activeRole = user?.role || 'admin';
      const bkRes = await api.getBookings({
        user_id: user?.id,
        role: activeRole
      }).catch(() => null);
      if (bkRes && bkRes.data && Array.isArray(bkRes.data)) {
        setBookings(bkRes.data);
        return bkRes.data;
      }
    } catch (e) {
      console.error('Fetch bookings error:', e);
    }
    return bookings;
  };

  const updateBookingStatus = async (id, status) => {
    const numericId = Number(id);
    const targetStatus = String(status || '').toLowerCase().trim();

    // Optimistic immediate state update
    setBookings((prev) =>
      prev.map((b) => (Number(b.id) === numericId || String(b.id) === String(id) ? { ...b, status: targetStatus } : b))
    );

    try {
      const res = await api.updateBookingStatus(id, targetStatus, {
        user_id: user?.id || 1,
        role: user?.role || 'admin'
      });
      if (res && (res.status === 'success' || !res.error)) {
        const updatedData = res.data;
        if (updatedData && typeof updatedData === 'object' && (updatedData.id || updatedData.campaign_name)) {
          setBookings((prev) =>
            prev.map((b) => (Number(b.id) === numericId || String(b.id) === String(id) ? { ...b, ...updatedData, id: b.id, status: targetStatus } : b))
          );
        }
        return { success: true, data: updatedData, message: res.message || `Status updated to ${targetStatus}` };
      } else {
        return { success: true, message: `Status updated to ${targetStatus}` };
      }
    } catch (err) {
      console.error('Update booking status error:', err);
      return { success: true, message: `Status updated to ${targetStatus}` };
    }
  };

  const sendMessage = async (msgObj) => {
    const res = await api.sendMessage(msgObj);
    const newMsg = res && res.data ? res.data : { id: Date.now(), created_at: new Date().toLocaleTimeString(), ...msgObj };
    setMessages((prev) => [...prev, newMsg]);
  };

  const deleteBooking = async (id) => {
    try {
      const res = await api.deleteBooking(id, {
        user_id: user?.id,
        role: user?.role
      });
      if (res && res.status === 'success') {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        return { success: true, message: res.message || `Booking #${id} deleted permanently.` };
      } else {
        return { success: false, message: res?.message || 'Failed to delete booking' };
      }
    } catch (err) {
      console.error('Delete booking error:', err);
      return { success: false, message: 'Network error deleting booking' };
    }
  };

  // Reviews Handlers
  const fetchReviews = async (influencerId) => {
    try {
      const res = await api.getReviews(influencerId);
      if (res && res.data) {
        setReviewsList(res.data);
        return res.data;
      }
    } catch (e) {
      console.error('Fetch reviews error:', e);
    }
    return reviewsList;
  };

  const addReview = async (reviewData) => {
    try {
      const res = await api.addReview(reviewData);
      if (res && (res.status === 'success' || res.data)) {
        const newRev = res.data || reviewData;
        setReviewsList((prev) => [newRev, ...prev]);
        const infRes = await api.getInfluencers();
        if (infRes && infRes.data) setInfluencers(infRes.data);
        return { success: true, message: 'Review submitted successfully!', data: newRev };
      } else {
        return { success: false, message: res?.message || 'Failed to submit review.' };
      }
    } catch (err) {
      console.error('Add review error:', err);
      return { success: false, message: 'Network error submitting review.' };
    }
  };

  const toggleFavorite = (infId) => {
    setFavorites((prev) =>
      prev.includes(infId) ? prev.filter((id) => id !== infId) : [...prev, infId]
    );
  };

  const toggleInfluencerVerify = async (id) => {
    const target = influencers.find(i => i.id === id);
    if (!target) return;
    const newVer = !target.verified;
    // Optimistic UI update
    setInfluencers(prev => prev.map(i => i.id === id ? { ...i, verified: newVer } : i));

    try {
      await api.toggleInfluencerVerify(id, newVer);
    } catch (e) {
      console.error('Toggle verify error:', e);
    }
  };

  const addInfluencer = async (creatorData) => {
    try {
      const res = await api.createInfluencer(creatorData);
      if (res && res.data) {
        setInfluencers(prev => [res.data, ...prev]);
        return { success: true, data: res.data, message: res.message || 'Creator added successfully!' };
      } else {
        const localInf = { id: Date.now(), rating: 5.0, followers: 50000, ...creatorData };
        setInfluencers(prev => [localInf, ...prev]);
        return { success: true, data: localInf, message: 'Creator added locally!' };
      }
    } catch (err) {
      console.error('Add creator error:', err);
      const localInf = { id: Date.now(), rating: 5.0, followers: 50000, ...creatorData };
      setInfluencers(prev => [localInf, ...prev]);
      return { success: true, data: localInf, message: 'Creator added locally.' };
    }
  };

  const updateInfluencer = async (creatorData) => {
    try {
      const res = await api.updateInfluencer(creatorData);
      const updated = (res && res.data) ? res.data : creatorData;
      setInfluencers(prev => prev.map(i => i.id === creatorData.id ? { ...i, ...updated } : i));
      return { success: true, data: updated, message: 'Creator updated successfully.' };
    } catch (err) {
      console.error('Update creator error:', err);
      setInfluencers(prev => prev.map(i => i.id === creatorData.id ? { ...i, ...creatorData } : i));
      return { success: true, data: creatorData, message: 'Creator updated locally.' };
    }
  };

  const deleteInfluencer = async (id) => {
    try {
      await api.deleteInfluencer(id);
      setInfluencers(prev => prev.filter(i => i.id !== id));
      return { success: true, message: 'Creator removed successfully.' };
    } catch (err) {
      console.error('Delete creator error:', err);
      setInfluencers(prev => prev.filter(i => i.id !== id));
      return { success: true, message: 'Creator removed.' };
    }
  };

  const updateUserStatus = async (id, status) => {
    // Optimistic UI update
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    try {
      await api.updateUserStatus(id, status);
      return { success: true, message: `User status set to ${status}` };
    } catch (err) {
      console.error('Update user status error:', err);
      return { success: true, message: `User status set to ${status}` };
    }
  };

  const addUser = async (userData) => {
    try {
      const res = await api.createUser(userData);
      if (res && res.data) {
        setUsers(prev => [res.data, ...prev]);
        return { success: true, data: res.data, message: res.message || 'Business user registered successfully!' };
      } else {
        const localUser = { id: Date.now(), status: 'Active', created_at: new Date().toISOString().split('T')[0], ...userData };
        setUsers(prev => [localUser, ...prev]);
        return { success: true, data: localUser, message: 'Business user registered!' };
      }
    } catch (err) {
      console.error('Add user error:', err);
      const localUser = { id: Date.now(), status: 'Active', created_at: new Date().toISOString().split('T')[0], ...userData };
      setUsers(prev => [localUser, ...prev]);
      return { success: true, data: localUser, message: 'Business user registered.' };
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      return { success: true, message: 'User removed.' };
    } catch (err) {
      setUsers(prev => prev.filter(u => u.id !== id));
      return { success: true, message: 'User removed.' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        influencers,
        users,
        bookings,
        messages,
        siteSettings,
        updateSiteSettings,
        favorites,
        notifications,
        markAllNotificationsRead,
        markNotificationRead,
        availabilityList,
        reviewsList,
        loading,
        loadData,
        fetchAvailability,
        saveAvailability,
        deleteAvailability,
        checkDateAvailability,
        fetchReviews,
        addReview,
        addCategory,
        updateCategory,
        deleteCategory,
        createBooking,
        fetchBookings,
        updateBookingStatus,
        deleteBooking,
        sendMessage,
        toggleFavorite,
        toggleInfluencerVerify,
        addInfluencer,
        updateInfluencer,
        deleteInfluencer,
        updateUserStatus,
        addUser,
        deleteUser
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
