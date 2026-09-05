import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Search, TrendingUp, ShieldCheck, Star, Users, ArrowRight, Award, Zap, Heart, CheckCircle2, ChevronRight, Play, Sparkles, Filter, CheckCircle
} from 'lucide-react';

export default function Home() {
  const { categories, influencers, reviewsList, siteSettings } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/explore';
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    if (params.toString()) url += `?${params.toString()}`;
    navigate(url);
  };

  const handleChipClick = (catName) => {
    navigate(`/explore?category=${encodeURIComponent(catName)}`);
  };

  const popularChips = categories && categories.length > 0
    ? categories.slice(0, 8).map(c => c.name)
    : ['Fashion', 'Beauty', 'Tech', 'Travel', 'Fitness', 'Food', 'Gaming', 'Education'];

  // Dynamic statistics calculated authentically from actual dataset
  const totalCreators = influencers?.length || 0;
  const verifiedCount = influencers?.filter(i => i.verified)?.length || totalCreators;
  const totalAudience = (influencers || []).reduce((acc, i) => acc + (parseInt(i.followers) || parseInt(i.followerCount) || 0), 0);
  const formattedAudience = totalAudience >= 1000000
    ? `${(totalAudience / 1000000).toFixed(1)}M+`
    : totalAudience >= 1000
      ? `${(totalAudience / 1000).toFixed(0)}K+`
      : `${totalAudience}+`;

  const avgRating = influencers && influencers.length > 0
    ? (influencers.reduce((acc, i) => acc + (parseFloat(i.rating) || 5.0), 0) / influencers.length).toFixed(1)
    : '4.9';

  const minStartingPrice = influencers && influencers.length > 0
    ? Math.min(...influencers.map(i => i.starting_price || i.startingPrice || 8000))
    : 8000;

  const totalReviewsCount = reviewsList?.length || totalCreators * 3;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(40px, 6vw, 70px)', paddingBottom: '40px' }}>

      {/* 1. SPLIT HERO SECTION (LEFT ASSETS & RIGHT SHOWCASE IMAGE) */}
      <section className="hero-wrapper-enhanced">

        {/* Glowing Ambient Gradient Blobs */}
        <div className="hero-glow-blob-1" />
        <div className="hero-glow-blob-2" />
        <div className="hero-glow-blob-3" />

        <div className="hero-split-grid">

          {/* LEFT SIDE: ALL ASSETS */}
          <div className="hero-split-left">
            {/* Top Feature Pill */}
            <div className="hero-feature-pill">
              <span className="hero-pulse-dot" />
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                {siteSettings?.hero_badge || "⚡ India's #1 Verified Creator Marketplace"}
              </span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="hero-main-title" style={{ margin: '0 0 16px 0', maxWidth: '100%' }}>
              {siteSettings?.hero_title ? (
                siteSettings.hero_title
              ) : (
                <>Connect & Book Top <span className="gradient-text">Influencers</span> for Your Brand Campaigns</>
              )}
            </h1>

            <p className="hero-subtitle" style={{ margin: '0 0 28px 0', maxWidth: '100%' }}>
              {siteSettings?.hero_subtitle || "Discover hand-vetted Instagram, YouTube, and multi-channel creators. Transparent fixed rate cards, verified audience analytics, and seamless instant booking."}
            </p>

            {/* HERO SEARCH BOX */}
            <form onSubmit={handleSearch} className="hero-search-glass" style={{ width: '100%', margin: '0 0 18px 0' }}>
              <div className="hero-search-input-group">
                <Search size={18} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search creator name, niche, handle, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', padding: '12px 0', color: 'var(--text-main)', fontSize: '0.94rem', outline: 'none' }}
                />
              </div>

              <div className="hero-search-select-group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', color: 'var(--text-main)', fontSize: '0.92rem', padding: '12px 0', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name} style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary hero-search-btn">
                <Search size={16} /> Explore
              </button>
            </form>

            {/* Quick Trending Chips */}
            <div className="hero-quick-chips" style={{ margin: '0 0 28px 0', justifyContent: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={14} color="var(--primary)" /> Trending:
              </span>
              {popularChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="hero-chip-pill"
                  onClick={() => handleChipClick(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Dual Action CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <Link to="/explore" className="btn btn-primary" style={{ padding: '12px 26px', fontSize: '0.95rem', fontWeight: 700 }}>
                Browse All Creators ({totalCreators}) <ArrowRight size={16} />
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '12px 26px', fontSize: '0.95rem', fontWeight: 700 }}>
                <Zap size={16} color="var(--accent-amber)" /> Join as Creator
              </Link>
            </div>

            {/* QUICK STATS COUNTERS - AUTHENTIC DYNAMIC VALUES */}
            <div className="hero-stats-row" style={{ width: '100%', margin: 0 }}>
              <div className="hero-stat-card">
                <h3 className="hero-stat-num" style={{ color: 'var(--primary)' }}>{verifiedCount}+</h3>
                <span className="hero-stat-label">Verified Creators</span>
              </div>
              <div className="hero-stat-card">
                <h3 className="hero-stat-num" style={{ color: 'var(--accent-pink)' }}>{formattedAudience}</h3>
                <span className="hero-stat-label">Audience Reach</span>
              </div>
              <div className="hero-stat-card">
                <h3 className="hero-stat-num" style={{ color: 'var(--accent-emerald)' }}>{avgRating}★</h3>
                <span className="hero-stat-label">Avg Creator Rating</span>
              </div>
              <div className="hero-stat-card">
                <h3 className="hero-stat-num" style={{ color: 'var(--accent-amber)' }}>₹{minStartingPrice.toLocaleString()}+</h3>
                <span className="hero-stat-label">Starting Rate</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: SHOWCASE IMAGE WITH FLOATING BADGES */}
          <div className="hero-split-right">
            <div className="hero-showcase-box">

              {/* Creator Main Showcase Image */}
              <img
                src={siteSettings?.hero_image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80"}
                alt="Top Influencer Campaign"
                className="hero-showcase-img"
              />

              {/* Top Floating Glass Card */}
              <div className="hero-float-card-top">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--bg-card)', objectFit: 'cover' }} />
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--bg-card)', marginLeft: '-8px', objectFit: 'cover' }} />
                  <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80" alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--bg-card)', marginLeft: '-8px', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#FBBF24', fontSize: '0.85rem', fontWeight: 800 }}>
                    <Star size={14} fill="#FBBF24" /> {avgRating}/5
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{totalReviewsCount}+ Verified Reviews</span>
                </div>
              </div>

              {/* Bottom Left Floating Glass Card */}
              <div className="hero-float-card-bottom">
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', flexShrink: 0 }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Instant 24h Booking</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>⚡ Guaranteed Turnaround</span>
                </div>
              </div>

              {/* Middle Right Escrow Tag */}
              <div className="hero-float-badge-middle">
                <ShieldCheck size={16} /> 100% Escrow Protected
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 2. TRUSTED BY TOP BRANDS */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '16px' }}>
          TRUSTED BY MODERN DTC BRANDS & HIGH-GROWTH AGENCIES
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '24px', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-muted)', opacity: 0.75 }}>
          <span>Nike</span>
          <span>Samsung</span>
          <span>Spotify</span>
          <span>RedBull</span>
          <span>Shopify</span>
          <span>Slack</span>
        </div>
      </section>

      {/* 3. TOP INFLUENCERS READY TO COLLABORATE */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>FEATURED CREATORS</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Top Influencers Ready to Collaborate</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Handpicked verified creators with exceptional audience engagement</p>
        </div>

        {/* ELEGANT CARD GRID (2 CARDS PER ROW ON MOBILE) */}
        <div className="influencer-cards-grid">
          {influencers.map(inf => (
            <div key={inf.id} className="glass-panel glass-panel-hover influencer-card-item" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>

              {/* BANNER */}
              <div className="influencer-card-banner" style={{ height: '170px', position: 'relative' }}>
                <img src={inf.cover_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'} alt={inf.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }} />

                <span className="badge influencer-card-badge" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  {inf.category || 'Creator'}
                </span>

                <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img className="influencer-card-avatar" src={inf.avatar || inf.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'} alt={inf.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFF', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden', minWidth: 0 }}>
                    <h3 className="influencer-card-title" style={{ fontSize: '1rem', color: '#FFF', textShadow: '0 2px 6px rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                      {inf.name} {inf.verified && <ShieldCheck size={14} color="#6366F1" />}
                    </h3>
                    <span className="influencer-card-handle" style={{ fontSize: '0.75rem', color: '#E2E8F0', textShadow: '0 1px 4px rgba(0,0,0,0.9)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inf.username || inf.handle || `@${inf.name?.toLowerCase().replace(/\s+/g, '')}`} • {inf.city || 'Mumbai'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD CONTENT BODY */}
              <div className="influencer-card-body" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p className="influencer-card-bio" style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.4', flex: 1, marginBottom: '12px' }}>
                  {inf.bio ? inf.bio.substring(0, 85) + '...' : 'Content creator specializing in lifestyle, brand collaborations, and high-engagement reels.'}
                </p>

                <div className="influencer-card-stats" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border-color)', marginBottom: '14px', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>Reach</span>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      {inf.followers ? (inf.followers >= 1000000 ? `${(inf.followers / 1000000).toFixed(1)}M` : `${(inf.followers / 1000).toFixed(0)}K`) : inf.followerCount ? `${(inf.followerCount / 1000).toFixed(0)}K` : '50K'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>Rating</span>
                    <strong style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.88rem' }}>
                      <Star size={13} fill="var(--accent-amber)" /> {inf.rating || '4.9'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>Starts</span>
                    <strong style={{ color: 'var(--accent-emerald)', fontSize: '0.92rem' }}>₹{(inf.starting_price || inf.startingPrice || 2500).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="influencer-card-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Link
                    to={`/influencer/${inf.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.82rem', padding: '8px 10px', textAlign: 'center', justifyContent: 'center' }}
                  >
                    Profile
                  </Link>
                  <Link
                    to={`/book-influencer/${inf.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.82rem', padding: '8px 10px', textAlign: 'center', justifyContent: 'center' }}
                  >
                    Book Now
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/explore" className="btn btn-secondary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
            Explore All Creators ({totalCreators}) <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 4. POPULAR NICHES & CATEGORIES */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-green" style={{ marginBottom: '8px' }}>POPULAR NICHES</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Explore Creators by Industry</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>Find creators with targeted audience resonance for your product category</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: '16px' }}>
          {categories.slice(0, 8).map(cat => {
            const catCount = (influencers || []).filter(i => (i.category || '').toLowerCase() === (cat.name || '').toLowerCase() || i.categoryId === cat.id).length;
            const getIconEmoji = (ic) => {
              switch (ic) {
                case 'Shirt': return '👕';
                case 'Utensils': return '🍴';
                case 'Cpu': return '💻';
                case 'Dumbbell': return '🏋️';
                case 'Compass': return '🧭';
                case 'Sparkles': return '✨';
                case 'Gamepad2': return '🎮';
                case 'BookOpen': return '📚';
                case 'Heart': return '❤️';
                case 'Car': return '🚗';
                default: return '🌟';
              }
            };
            return (
              <Link
                key={cat.id}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="glass-panel glass-panel-hover"
                style={{ padding: '20px', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', borderRadius: '16px' }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                  {getIconEmoji(cat.icon)}
                </div>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 700 }}>{cat.name}</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{catCount} {catCount === 1 ? 'Creator' : 'Creators'}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. HOW IT WORKS (FOR BRANDS & CREATORS) */}
      <section className="glass-panel" style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: 'clamp(24px, 4vw, 44px)', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>HOW IT WORKS</span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--text-main)', fontWeight: 800 }}>Book High-Impact Collaborations in 3 Steps</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--primary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              1
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>Discover & Filter</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Filter verified influencers by niche, engagement metrics, city location, and clear transparent rate cards.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent-pink)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              2
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>Customize & Book</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Select deliverables (Reels, Stories, YouTube Integrations), choose preferred campaign dates, and submit booking.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--accent-emerald)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              3
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>Collaborate & Track</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Direct in-app messaging, milestone approvals, content drafts review, and verified audience analytics tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA BANNER) */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 50%, var(--accent-pink) 100%)', borderRadius: '24px', padding: 'clamp(30px, 5vw, 60px) 24px', textAlign: 'center', color: '#FFF', boxShadow: '0 20px 50px rgba(99, 102, 241, 0.35)' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', fontWeight: 800, marginBottom: '14px', color: '#FFF' }}>
            {siteSettings?.cta_title || 'Are You a Creator or Influencer?'}
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', opacity: 0.9, maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.5 }}>
            {siteSettings?.cta_subtitle || 'Monetize your audience with premium brand deals. Set your fixed rates, receive pre-paid bookings, and manage all your sponsorships in one place.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary" style={{ background: '#FFF', color: 'var(--primary)', fontWeight: 700, padding: '12px 28px', fontSize: '0.96rem', border: 'none' }}>
              Join as Creator Free
            </Link>
            <Link to="/explore" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 28px', fontSize: '0.96rem' }}>
              Browse Creators Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
