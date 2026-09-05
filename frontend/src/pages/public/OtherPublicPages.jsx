import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  FolderTree, ShieldCheck, HelpCircle, Mail, Phone, MapPin, 
  Send, Sparkles, CheckCircle2, FileText, ArrowRight, Target, Compass, 
  DollarSign, MessageSquare, TrendingUp, BarChart3, Users, Briefcase, Award,
  Search, Star, Camera, Heart, Utensils, Cpu, Dumbbell, Gamepad2, BookOpen, Globe,
  UserPlus, SlidersHorizontal, CalendarCheck, MessageCircle, Rocket, Shield, Lock, Clock, ChevronDown
} from 'lucide-react';

export function CategoriesPage() {
  const { categories, influencers } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?category=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const nicheImages = [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600', // Fashion
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', // Beauty
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600', // Fitness
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', // Food
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600', // Travel
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600', // Lifestyle
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600', // Tech
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600', // Gaming
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600', // Education
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600', // Automobile
  ];

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCreators = influencers?.length || 0;
  const avgSatisfaction = influencers && influencers.length > 0
    ? (influencers.reduce((acc, i) => acc + (parseFloat(i.rating) || 5.0), 0) / influencers.length).toFixed(1)
    : '4.9';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(36px, 6vw, 70px)', maxWidth: '1280px', margin: '0 auto', width: '100%', minWidth: 0 }}>
      
      {/* 1. ENHANCED HERO BANNER */}
      <section className="page-hero-banner">
        <div className="hero-glow-blob-1" style={{ opacity: 0.5 }} />
        <div className="hero-glow-blob-2" style={{ opacity: 0.4 }} />
        
        <div className="hero-content-relative">
          <span className="page-hero-badge">
            <Sparkles size={14} color="var(--accent-purple)" /> ALL CREATOR NICHES
          </span>
          <h1 className="page-hero-title">
            Explore Influencers by <span className="gradient-text">Category</span>
          </h1>
          <p className="page-hero-desc" style={{ marginBottom: '28px' }}>
            Discover {totalCreators} verified creators categorized across top industries for high-converting, targeted brand marketing outreach.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-search-glass" style={{ maxWidth: '640px', margin: '0 auto 28px' }}>
            <div className="hero-search-input-group" style={{ flex: 1 }}>
              <Search size={18} color="var(--text-dim)" style={{ flexShrink: 0 }} />
              <input 
                type="text" 
                placeholder="Search category name or niche..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.92rem', outline: 'none', padding: '12px 0' }}
              />
            </div>
            <button type="submit" className="btn btn-primary hero-search-btn">
              <Search size={15} /> Search
            </button>
          </form>

          {/* Quick Filter Stats Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderTree size={15} color="var(--primary)" /> {categories.length} Verified Categories
            </div>
            <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="var(--accent-pink)" /> {totalCreators} Top Creators
            </div>
            <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={15} fill="var(--accent-amber)" color="var(--accent-amber)" /> {avgSatisfaction}★ Avg Satisfaction
            </div>
            <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={15} color="var(--accent-emerald)" /> ₹0 Middleman Fees
            </div>
          </div>
        </div>
      </section>

      {/* 2. BROWSE BY NICHE (GRID CARDS) */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>ALL NICHES</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Browse by Niche</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Find specialists tailored to your specific product market</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '18px' }}>
          {filteredCategories.map((cat, idx) => {
            const count = influencers.filter(i => (i.category || '').toLowerCase() === cat.name.toLowerCase() || i.categoryId === cat.id).length;
            return (
              <Link 
                key={cat.id} 
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="glass-panel glass-panel-hover"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', textDecoration: 'none', borderRadius: '16px' }}
              >
                <div style={{ height: '140px', position: 'relative' }}>
                  <img src={nicheImages[idx % nicheImages.length]} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge badge-purple" style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(15,23,42,0.85)', color: '#FFF' }}>
                    {count} {count === 1 ? 'Creator' : 'Creators'}
                  </span>
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>{cat.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      {cat.description || 'Verified niche influencers ready for brand campaigns and product sponsorships.'}
                    </p>
                  </div>
                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.84rem', fontWeight: 700 }}>
                    View Creators ({count}) <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING CATEGORIES */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>POPULAR THIS MONTH</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Trending Categories</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Discover top performing niches driving high engagement</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Beauty & Skincare */}
          <div className="glass-panel two-col-responsive" style={{ padding: 'clamp(18px, 3vw, 28px)', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'center' }}>
            <div style={{ height: 'clamp(180px, 30vw, 240px)', borderRadius: '14px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800" alt="Beauty & Skincare" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span className="badge badge-pink" style={{ marginBottom: '10px' }}>HOT TRENDING</span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', color: 'var(--text-main)', fontWeight: 800, marginBottom: '8px' }}>Beauty & Skincare</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Makeup tutorials, organic skincare reviews, product unboxing, and aesthetic routines crafted by verified beauty vloggers.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', background: 'var(--bg-input)', padding: '12px', borderRadius: '12px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem', display: 'block' }}>Verified Creators</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                    {influencers.filter(i => (i.category || '').toLowerCase() === 'beauty').length || 1} Available
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem', display: 'block' }}>Avg Rating</span>
                  <strong style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>4.9★</strong>
                </div>
              </div>

              <Link to="/explore?category=Beauty" className="btn btn-primary btn-sm">Browse Beauty Creators <ArrowRight size={14} /></Link>
            </div>
          </div>

          {/* Card 2: Fashion & Style */}
          <div className="glass-panel two-col-responsive" style={{ padding: 'clamp(18px, 3vw, 28px)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'center' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '10px' }}>HIGH REACH</span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', color: 'var(--text-main)', fontWeight: 800, marginBottom: '8px' }}>Fashion & Style</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Lookbooks, luxury streetwear, ethnic wear showcases, and seasonal outfit inspiration with high engagement reels.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', background: 'var(--bg-input)', padding: '12px', borderRadius: '12px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem', display: 'block' }}>Verified Creators</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                    {influencers.filter(i => (i.category || '').toLowerCase() === 'fashion').length || 1} Available
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem', display: 'block' }}>Avg Rating</span>
                  <strong style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>4.9★</strong>
                </div>
              </div>

              <Link to="/explore?category=Fashion" className="btn btn-primary btn-sm">Browse Fashion Creators <ArrowRight size={14} /></Link>
            </div>
            <div style={{ height: 'clamp(180px, 30vw, 240px)', borderRadius: '14px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" alt="Fashion & Style" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Card 3: Fitness & Wellness */}
          <div className="glass-panel two-col-responsive" style={{ padding: 'clamp(18px, 3vw, 28px)', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'center' }}>
            <div style={{ height: 'clamp(180px, 30vw, 240px)', borderRadius: '14px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800" alt="Fitness & Wellness" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '10px' }}>FAST GROWING</span>
              <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', color: 'var(--text-main)', fontWeight: 800, marginBottom: '8px' }}>Fitness & Wellness</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
                Certified personal trainers, supplement reviewers, diet planners, and transformation vloggers.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', background: 'var(--bg-input)', padding: '12px', borderRadius: '12px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem', display: 'block' }}>Verified Creators</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>
                    {influencers.filter(i => (i.category || '').toLowerCase() === 'fitness').length || 1} Available
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem', display: 'block' }}>Avg Rating</span>
                  <strong style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>5.0★</strong>
                </div>
              </div>

              <Link to="/explore?category=Fitness" className="btn btn-primary btn-sm">Browse Fitness Creators <ArrowRight size={14} /></Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INFLUENCER DISTRIBUTION BY CATEGORY */}
      <section className="glass-panel" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>PLATFORM INSIGHTS</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Influencer Distribution by Category</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.95rem' }}>Live breakdown of registered verified creators across all niches</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {categories.map((cat, idx) => {
            const count = influencers.filter(i => (i.category || '').toLowerCase() === cat.name.toLowerCase() || i.categoryId === cat.id).length;
            const pct = totalCreators > 0 ? Math.max(10, Math.round((count / totalCreators) * 100)) : 10;
            const colors = ['#8B5CF6', '#EC4899', '#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#A855F7', '#EF4444', '#14B8A6', '#F97316'];
            const color = colors[idx % colors.length];

            return (
              <div key={cat.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '160px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'right' }}>
                  {cat.name}
                </div>
                <div style={{ flex: 1, height: '24px', background: 'var(--bg-input)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                  <div 
                    style={{ 
                      width: `${pct}%`, 
                      height: '100%', 
                      background: color, 
                      borderRadius: '12px',
                      transition: 'width 0.6s ease'
                    }} 
                  />
                </div>
                <div style={{ width: '100px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {count} {count === 1 ? 'Creator' : 'Creators'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section>
        <div 
          className="glass-panel"
          style={{
            padding: '50px 30px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 16px 40px rgba(99, 102, 241, 0.35)'
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, marginBottom: '12px', color: '#FFFFFF' }}>
            Can't Find Your Category?
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.95, maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: '1.5' }}>
            Submit a request to add your niche or register as a creator to list your services today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-secondary" style={{ background: '#FFFFFF', color: '#4F46E5', padding: '12px 28px', fontWeight: 800 }}>
              Request Category
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.4)', padding: '12px 28px', fontWeight: 800 }}>
              Register as Creator
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export function HowItWorksPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const steps = [
    {
      step: '1',
      title: 'Create Your Free Account',
      desc: 'Register as a Business or Creator in less than 2 minutes with zero platform registration fees.',
      bullets: ['Instant email registration & login', 'Set up business details or creator portfolio', 'List deliverable rate cards & location'],
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700',
      badge: 'GET STARTED'
    },
    {
      step: '2',
      title: 'Discover & Filter Creators',
      desc: 'Search 10,000+ verified creators by content category, city location, follower reach, and budget.',
      bullets: ['Advanced filter by reach & target budget', 'Compare transparent deliverable rate cards', 'Audit verified follower engagement stats'],
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700',
      badge: 'EXPLORE NICHES'
    },
    {
      step: '3',
      title: 'Send Collaboration Request',
      desc: 'Submit appointment details, target schedule dates, and offered budget directly to the creator.',
      bullets: ['Specify deliverables (Reels, Posts, Stories)', 'Set proposed campaign schedule date', 'Instant notification sent to creator'],
      img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700',
      badge: 'BOOK APPOINTMENT'
    },
    {
      step: '4',
      title: 'Direct 1-on-1 Chat & Negotiation',
      desc: 'Communicate directly with creators in your real-time chat workspace to finalize script and content guidelines.',
      bullets: ['Real-time 1-on-1 chat workspace', 'Share moodboards & campaign briefs', 'Approve final creative direction'],
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700',
      badge: 'DIRECT DMs'
    },
    {
      step: '5',
      title: 'Launch & Track Results',
      desc: 'Execute campaign, review performance analytics, and publish verified client star ratings.',
      bullets: ['Publish branded content live across socials', '100% direct payment outside platform with ₹0 fees', 'Submit verified client review & star rating'],
      img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700',
      badge: 'CAMPAIGN SUCCESS'
    }
  ];

  const faqs = [
    { q: 'Is Influencer Connect completely free to use?', a: 'Yes! Businesses and social media creators can register, list rate cards, and book campaign appointments with 0% platform commission fees.' },
    { q: 'How do payments work between brands and creators?', a: 'Businesses and creators negotiate payment directly outside the platform via bank transfer, UPI, or PayPal. Influencer Connect charges 0% transaction fees.' },
    { q: 'How are creator profiles verified?', a: 'Our team audits linked social profiles (Instagram, YouTube, Twitter) for follower authenticity, engagement rates, and content quality before granting verified status.' },
    { q: 'Can I book multiple deliverables in one campaign?', a: 'Yes! You can combine Instagram Reels, Feed Posts, Stories, and YouTube Reviews in a single campaign booking request.' },
    { q: 'What happens if a creator is unavailable?', a: 'Creators manage an active availability calendar. If a requested date is unavailable, you can message the creator directly to adjust schedule dates.' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(36px, 6vw, 70px)', maxWidth: '1250px', margin: '0 auto', width: '100%', minWidth: 0 }}>
      
      {/* 1. ENHANCED HERO SECTION */}
      <section className="page-hero-banner">
        <div className="hero-glow-blob-1" style={{ opacity: 0.5 }} />
        <div className="hero-glow-blob-3" style={{ opacity: 0.4 }} />

        <div className="hero-content-relative">
          <span className="page-hero-badge">
            <Sparkles size={14} color="var(--accent-purple)" /> SIMPLE 5-STEP WORKFLOW
          </span>
          <h1 className="page-hero-title">
            From Discovery to <span className="gradient-text">Results in 5 Steps</span>
          </h1>
          <p className="page-hero-desc" style={{ marginBottom: '24px' }}>
            A simple, transparent process built for brands and content creators to collaborate seamlessly without middleman friction or hidden fees.
          </p>

          {/* Quick Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="glass-panel" style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>For Brands</span>
            <span className="glass-panel" style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>For Creators</span>
            <span className="glass-panel" style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>For Agencies</span>
            <span className="glass-panel" style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>0% Commission</span>
          </div>
        </div>
      </section>

      {/* 2. YOUR COMPLETE GUIDE (5 ALTERNATING STEP SHOWCASE CARDS) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>STEP BY STEP</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Your Complete Guide</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Follow our simple 5-step roadmap to launch high impact campaigns</p>
        </div>

        {steps.map((item, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <div 
              key={idx} 
              className="glass-panel two-col-responsive"
              style={{
                padding: 'clamp(20px, 3.5vw, 36px)',
                display: 'grid',
                gridTemplateColumns: isEven ? '1.2fr 1fr' : '1fr 1.2fr',
                gap: 'clamp(20px, 3vw, 40px)',
                alignItems: 'center',
                borderRadius: '20px'
              }}
            >
              {/* Photo on Left for Even Steps */}
              {isEven && (
                <div style={{ height: 'clamp(200px, 30vw, 300px)', borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Text Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                    {item.step}
                  </div>
                  <span className="badge badge-purple">{item.badge}</span>
                </div>

                <h3 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', color: 'var(--text-main)', fontWeight: 800, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '16px' }}>{item.desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  {item.bullets.map((b, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} /> {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photo on Right for Odd Steps */}
              {!isEven && (
                <div style={{ height: 'clamp(200px, 30vw, 300px)', borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 3. TAILORED FOR YOUR ROLE (ROLE COMPARISON CARDS) */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>ROLE COMPARISON</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Tailored for Your Role</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Discover the specific workflow advantages for brands and content creators</p>
        </div>

        <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* For Brands */}
          <div className="glass-panel" style={{ padding: 'clamp(20px, 3vw, 32px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Briefcase size={22} color="var(--primary)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>For Brands & Businesses</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Scale reach & drive measurable ROI</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {[
                { title: 'Search Verified Creators', desc: 'Filter 10,000+ creators by niche, city, and reach.' },
                { title: 'Compare Rate Cards Upfront', desc: 'Transparent deliverable pricing with zero hidden costs.' },
                { title: 'Direct 1-on-1 Messaging', desc: 'Communicate directly without agency delays.' },
                { title: 'Zero Commission Payments', desc: '100% of your budget goes to creator collaboration.' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px' }}>
                  <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.88rem' }}>{c.title}</div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{c.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/explore" className="btn btn-primary" style={{ marginTop: '10px', width: '100%' }}>Find Creators Now</Link>
          </div>

          {/* For Creators */}
          <div className="glass-panel" style={{ padding: 'clamp(20px, 3vw, 32px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={22} color="var(--accent-pink)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>For Influencers & Creators</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Monetize your content & reach</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {[
                { title: 'Free Rate Card Link', desc: 'List custom prices for Reels, Stories, Posts, and Videos.' },
                { title: 'Availability Calendar', desc: 'Set working days, busy slots, and off days.' },
                { title: 'Direct Brand Offers', desc: 'Receive genuine campaign requests from real businesses.' },
                { title: 'Keep 100% Earnings', desc: 'Zero commission deductions on your hard-earned fees.' }
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px' }}>
                  <CheckCircle2 size={16} color="var(--accent-pink)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '0.88rem' }}>{c.title}</div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{c.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/register" className="btn btn-secondary" style={{ marginTop: '10px', width: '100%' }}>Join as Creator</Link>
          </div>

        </div>
      </section>

      {/* 4. YOUR COLLABORATION IS PROTECTED (6 GUARANTEE CARDS) */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>PLATFORM GUARANTEE</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Your Collaboration is Protected</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>We ensure safety, transparency, and quality across every partnership</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
          {[
            { title: 'Verified Profiles', desc: 'Authentic creators with genuine audience reach & audited engagement.', icon: ShieldCheck, color: 'var(--accent-emerald)' },
            { title: '0% Hidden Fees', desc: 'Absolutely zero middleman markups or platform transaction cuts.', icon: DollarSign, color: 'var(--primary)' },
            { title: 'Direct DM Control', desc: '100% direct communication without agency delays or telephone games.', icon: MessageSquare, color: 'var(--accent-pink)' },
            { title: 'Transparent Pricing', desc: 'Pre-set deliverable rate cards visible upfront before booking.', icon: Award, color: 'var(--accent-amber)' },
            { title: 'Real Client Reviews', desc: 'Authentic 5-star rating system from completed brand campaigns.', icon: Star, color: 'var(--primary)' },
            { title: '24/7 Support Assistance', desc: 'Dedicated customer support team available for any inquiry.', icon: HelpCircle, color: 'var(--accent-emerald)' }
          ].map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={v.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: '1.5' }}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>FAQS</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-main)', gap: '10px' }}>
                <span>{faq.q}</span>
                <ChevronDown size={18} style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }} />
              </div>
              {activeFaq === idx && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '10px', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section>
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(32px, 6vw, 50px) clamp(16px, 4vw, 30px)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 16px 40px rgba(99, 102, 241, 0.35)'
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)', fontWeight: 800, marginBottom: '12px', color: '#FFFFFF' }}>
            Ready to Start Your First Campaign?
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', opacity: 0.95, maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
            Join thousands of brands and content creators executing high-impact influencer marketing campaigns today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn btn-secondary" style={{ background: '#FFFFFF', color: '#4F46E5', padding: '11px 24px', fontWeight: 800 }}>
              Find Creators
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.4)', padding: '11px 24px', fontWeight: 800 }}>
              Join as Creator
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export function AboutUsPage() {
  const { siteSettings } = useData();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(36px, 6vw, 70px)', maxWidth: '1250px', margin: '0 auto', width: '100%', minWidth: 0 }}>
      
      {/* 1. ENHANCED HERO SECTION */}
      <section className="page-hero-banner">
        <div className="hero-glow-blob-1" style={{ opacity: 0.5 }} />
        <div className="hero-glow-blob-2" style={{ opacity: 0.4 }} />

        <div className="hero-content-relative">
          <span className="page-hero-badge">
            <Sparkles size={14} color="var(--accent-purple)" /> ABOUT {siteSettings?.site_name?.toUpperCase() || 'INFLUENCER CONNECT'}
          </span>
          <h1 className="page-hero-title">
            We're on a Mission to <span className="gradient-text">Redefine Influencer Marketing</span>
          </h1>
          <p className="page-hero-desc">
            Empowering businesses and social media content creators to collaborate seamlessly without agency barriers, hidden markups, or middleman fees.
          </p>
        </div>
      </section>

      {/* 2. COMPANY STORY */}
      <section className="glass-panel two-col-responsive" style={{ padding: 'clamp(20px, 4vw, 40px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(20px, 3vw, 40px)', alignItems: 'center' }}>
        <div style={{ height: 'clamp(200px, 30vw, 340px)', borderRadius: '16px', overflow: 'hidden' }}>
          <img 
            src={siteSettings?.about_story_image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"} 
            alt="Our Story Team" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'; }}
          />
        </div>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '12px' }}>OUR STORY</span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800, marginBottom: '14px' }}>Building a Future of Authentic Partnerships</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '18px' }}>
            {siteSettings?.site_name || 'InfluencerConnect'} was created to eliminate the manual frustration of cold DMs, unverified follower stats, and opaque middleman fees. We built an open ecosystem where brands of any size can search, filter, and connect directly with verified creators.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} /> Direct 1-on-1 brand & creator messaging</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} /> Transparent deliverable rate cards & pricing</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} /> 100% Zero platform commission fee model</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} /> Verified social statistics & audience reach audits</span>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION CARDS */}
      <section className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: 'clamp(20px, 3.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: 800 }}>Our Mission</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
            To democratize influencer marketing by giving every business direct access to verified content creators, fostering genuine brand advocacy without financial middleman barriers.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 'clamp(20px, 3.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={24} color="var(--accent-pink)" />
          </div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: 800 }}>Our Vision</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
            To become the global standard platform where creators build sustainable careers and brands achieve measurable marketing ROI through authentic, transparent collaborations.
          </p>
        </div>
      </section>

      {/* 4. WHAT SETS US APART */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>WHY CHOOSE US</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>What Sets Us Apart</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
          {[
            { title: 'Verified Creator Network', desc: 'Rigorous profile audits to ensure authentic followers and genuine audience engagement.', icon: ShieldCheck, color: 'var(--accent-emerald)' },
            { title: 'Transparent Rate Cards', desc: 'Fixed deliverable pricing for Reels, Posts, Stories, and Videos upfront.', icon: DollarSign, color: 'var(--primary)' },
            { title: 'Zero Commission Model', desc: '100% of your agreed campaign budget goes directly to the content creator.', icon: Award, color: 'var(--accent-pink)' },
            { title: 'Direct Chat & Scheduling', desc: 'Instant 1-on-1 messaging workspace to finalize deliverables and target dates.', icon: MessageSquare, color: 'var(--accent-amber)' },
            { title: 'Built for Scale', desc: 'Designed for local cafes, e-commerce startups, and national brands alike.', icon: TrendingUp, color: 'var(--primary)' },
            { title: 'Data-Driven Search', desc: 'Multi-filter engine by city location, follower reach, and content niche.', icon: BarChart3, color: 'var(--accent-emerald)' }
          ].map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={v.color} />
                </div>
                <h4 style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.05rem' }}>{v.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MILESTONES THAT DEFINE US */}
      <section style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>OUR JOURNEY</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Milestones That Define Us</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { year: '2024', title: 'Platform Launch', desc: 'Initial launch connecting first 1,000 creators with local businesses.' },
            { year: '2025', title: '25,000+ Campaigns', desc: 'Reached 25,000 completed brand appointment requests across 15 cities.' },
            { year: '2026', title: 'Nationwide Expansion', desc: 'Expanded zero-commission ecosystem with over 10,000+ verified creators.' }
          ].map((m, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))', color: '#FFF', fontWeight: 800, fontSize: '1.1rem' }}>
                {m.year}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>{m.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '2px' }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BUILT FOR EVERYONE IN THE ECOSYSTEM */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>FOR EVERYONE</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Built for Everyone in the Ecosystem</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          {/* Brands */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '12px' }}>FOR BRANDS</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '10px' }}>Created for Brands & Businesses</h3>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                <li>Direct search by reach, city, and target niche</li>
                <li>Transparent deliverable rate card index</li>
                <li>Instant 1-on-1 direct creator messaging</li>
                <li>Zero middleman booking commissions</li>
              </ul>
            </div>
            <Link to="/explore" className="btn btn-primary btn-sm" style={{ marginTop: '18px', alignSelf: 'flex-start' }}>Find Creators</Link>
          </div>

          {/* Creators */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '12px' }}>FOR CREATORS</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '10px' }}>Created for Content Creators</h3>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                <li>Share your free profile link & rate card</li>
                <li>Automate campaign availability schedule</li>
                <li>Keep 100% of your earned campaign fees</li>
                <li>Build direct long-term brand relationships</li>
              </ul>
            </div>
            <Link to="/register" className="btn btn-secondary btn-sm" style={{ marginTop: '18px', alignSelf: 'flex-start' }}>Join as Creator</Link>
          </div>

          {/* Agencies */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '12px' }}>FOR AGENCIES</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '10px' }}>Created for Agencies & Managers</h3>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                <li>Manage multiple client brand campaigns</li>
                <li>Organize creator rosters and rate cards</li>
                <li>Track appointment dates & statuses</li>
                <li>Export campaign reports directly to CSV</li>
              </ul>
            </div>
            <Link to="/register" className="btn btn-secondary btn-sm" style={{ marginTop: '18px', alignSelf: 'flex-start' }}>Agency Access</Link>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section>
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(32px, 6vw, 50px) clamp(16px, 4vw, 30px)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 16px 40px rgba(99, 102, 241, 0.35)'
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.4rem)', fontWeight: 800, marginBottom: '12px', color: '#FFFFFF' }}>
            Want to Be Part of Our Story?
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', opacity: 0.95, maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
            Join thousands of brands and content creators executing authentic influencer marketing campaigns today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary" style={{ background: '#FFFFFF', color: '#4F46E5', padding: '11px 24px', fontWeight: 800 }}>
              Join as Business
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.4)', padding: '11px 24px', fontWeight: 800 }}>
              Join as Creator
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export function ContactPage() {
  const { siteSettings } = useData();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', width: '100%', minWidth: 0 }}>
      {/* 1. ENHANCED HERO BANNER */}
      <section className="page-hero-banner" style={{ marginBottom: '32px' }}>
        <div className="hero-glow-blob-1" style={{ opacity: 0.4 }} />
        <div className="hero-content-relative">
          <span className="page-hero-badge">
            <Mail size={14} color="var(--primary)" /> 24/7 DEDICATED SUPPORT
          </span>
          <h1 className="page-hero-title">
            Get in Touch with Our <span className="gradient-text">Support Team</span>
          </h1>
          <p className="page-hero-desc">
            Have questions about booking creators, verifying your profile, or need custom enterprise campaign assistance? We're here to help.
          </p>
        </div>
      </section>

      <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: 'clamp(20px, 3.5vw, 32px)' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '14px', fontSize: '1.25rem', fontWeight: 700 }}>Send Us a Message</h3>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.86rem' }}>Your Name</label>
              <input type="text" className="form-input" required placeholder="John Doe" />
            </div>
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.86rem' }}>Email Address</label>
              <input type="email" className="form-input" required placeholder="john@example.com" />
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.86rem' }}>Message</label>
              <textarea className="form-textarea" rows="4" required placeholder="How can we help you?" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '46px', fontWeight: 700 }}>
              <Send size={16} /> {submitted ? 'Message Sent Successfully!' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: 'clamp(20px, 3.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 700 }}>Contact Details</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'break-word', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px' }}>
            <Mail color="var(--primary)" size={20} style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Email Us</span>
              <strong>{siteSettings?.contact_email || 'support@influencerconnect.com'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px' }}>
            <Phone color="var(--accent-emerald)" size={20} style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Call Us</span>
              <strong>{siteSettings?.contact_phone || '+1 (800) 555-0199'}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px' }}>
            <MapPin color="var(--accent-pink)" size={20} style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Headquarters</span>
              <strong>{siteSettings?.contact_address || 'Tech Park Tower B, Suite 402, Silicon Hub'}</strong>
            </div>
          </div>

          <div style={{ marginTop: 'auto', background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--text-main)', fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="var(--primary)" /> Office Hours
            </h4>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '4px' }}>
              {siteSettings?.office_hours || 'Monday - Friday: 9:00 AM - 6:00 PM EST'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalPage({ type }) {
  const { siteSettings } = useData();
  const isTerms = type === 'terms';
  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', minWidth: 0 }}>
      {/* 1. ENHANCED HERO BANNER */}
      <section className="page-hero-banner" style={{ marginBottom: '28px' }}>
        <div className="hero-glow-blob-1" style={{ opacity: 0.35 }} />
        <div className="hero-content-relative">
          <span className="page-hero-badge">
            <ShieldCheck size={14} color="var(--primary)" /> LEGAL & POLICIES
          </span>
          <h1 className="page-hero-title">
            {isTerms ? 'Terms & Conditions' : 'Privacy Policy'}
          </h1>
          <p className="page-hero-desc">
            Last updated: September 2026. Please read our guidelines carefully.
          </p>
        </div>
      </section>

      <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 36px)', borderRadius: 'var(--radius-md)' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '16px', fontWeight: 800 }}>
          {isTerms ? '1. Platform Use & Direct Booking Agreement' : '1. Information Collection & Privacy Protection'}
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.92rem', marginBottom: '16px' }}>
          {isTerms 
            ? (siteSettings?.terms_content || 'Welcome to Influencer Connect. By using our platform, businesses and creators agree to negotiate fairly and directly. Influencer Connect is a zero-commission communication and booking index connecting brands with verified social content creators.')
            : (siteSettings?.privacy_content || 'Influencer Connect protects user data privacy. We never sell your personal information or contact details to unverified third parties. Social statistics presented on creator profiles are displayed transparently for campaign auditing.')}
        </p>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.92rem' }}>
          {isTerms
            ? 'Creators maintain full creative integrity over their deliverables while adhering to the agreed brief. All financial arrangements negotiated directly between brands and creators are the sole responsibility of the respective parties.'
            : 'We use industry-standard encryption protocols to protect your login credentials and chat communications. You may request account and data removal at any time through your account settings.'}
        </p>
      </div>
    </div>
  );
}
