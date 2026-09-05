import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  Search, Filter, Star, ShieldCheck, MapPin, SlidersHorizontal,
  Zap, Clock, ThumbsUp, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { encryptId } from '../../utils/cryptoId';

export default function Explore() {
  const { influencers, categories } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [minFollowers, setMinFollowers] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch) setSearch(urlSearch);
  }, [searchParams]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedPlatform('all');
    setMinFollowers(0);
    setMaxPrice(100000);
    setOnlyVerified(false);
    setSortBy('rating');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredInfluencers = useMemo(() => {
    return influencers.filter(inf => {
      const infFollowers = inf.followers !== undefined ? Number(inf.followers) : Number(inf.followerCount || 0);
      const infPrice = inf.starting_price !== undefined ? Number(inf.starting_price) : Number(inf.startingPrice || 0);
      const infName = inf.name || '';
      const infHandle = inf.username || inf.handle || '';
      const infBio = inf.bio || '';
      const infCity = inf.city || inf.location || '';

      // Search
      const searchMatch = !search ||
        infName.toLowerCase().includes(search.toLowerCase()) ||
        infHandle.toLowerCase().includes(search.toLowerCase()) ||
        infBio.toLowerCase().includes(search.toLowerCase()) ||
        infCity.toLowerCase().includes(search.toLowerCase()) ||
        inf.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));

      // Category
      const catMatch = selectedCategory === 'all' ||
        inf.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        String(inf.categoryId) === String(selectedCategory);

      // Platform
      const platMatch = selectedPlatform === 'all' ||
        (Array.isArray(inf.platforms) && inf.platforms.some(p => (typeof p === 'string' ? p : p.name)?.toLowerCase() === selectedPlatform.toLowerCase())) ||
        (inf.socials && Object.keys(inf.socials).some(k => k.toLowerCase() === selectedPlatform.toLowerCase()));

      // Followers
      const followersMatch = infFollowers >= Number(minFollowers);

      // Price
      const priceMatch = infPrice <= Number(maxPrice);

      // Verified
      const verifiedMatch = !onlyVerified || Boolean(inf.verified);

      return searchMatch && catMatch && platMatch && followersMatch && priceMatch && verifiedMatch;
    }).sort((a, b) => {
      const fA = a.followers !== undefined ? Number(a.followers) : Number(a.followerCount || 0);
      const fB = b.followers !== undefined ? Number(b.followers) : Number(b.followerCount || 0);
      const pA = a.starting_price !== undefined ? Number(a.starting_price) : Number(a.startingPrice || 0);
      const pB = b.starting_price !== undefined ? Number(b.starting_price) : Number(b.startingPrice || 0);
      const rA = Number(a.rating || 5);
      const rB = Number(b.rating || 5);

      if (sortBy === 'rating') return rB - rA;
      if (sortBy === 'followers_high') return fB - fA;
      if (sortBy === 'price_low') return pA - pB;
      if (sortBy === 'price_high') return pB - pA;
      return 0;
    });
  }, [influencers, search, selectedCategory, selectedPlatform, minFollowers, maxPrice, onlyVerified, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredInfluencers.length / itemsPerPage);
  const paginatedInfluencers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInfluencers.slice(start, start + itemsPerPage);
  }, [filteredInfluencers, currentPage]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedPlatform !== 'all') count++;
    if (Number(minFollowers) > 0) count++;
    if (Number(maxPrice) < 100000) count++;
    if (onlyVerified) count++;
    if (search.trim()) count++;
    return count;
  }, [selectedCategory, selectedPlatform, minFollowers, maxPrice, onlyVerified, search]);

  return (
    <div className="explore-page-wrapper" style={{ minHeight: '100vh', padding: '1.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Page Hero Banner */}
        <section className="page-hero-banner">
          <div className="hero-glow-blob-1" style={{ opacity: 0.6 }} />
          <div className="hero-content-relative">
            <span className="page-hero-badge">
              <SlidersHorizontal size={14} /> DISCOVER TOP CREATORS
            </span>
            <h1 className="page-hero-title">
              Find & Book Verified <span className="gradient-text">Influencers</span>
            </h1>
            <p className="page-hero-desc">
              Filter top-tier verified creators across Instagram, YouTube, TikTok and LinkedIn. Direct transparent rate cards, engagement stats, and hassle-free booking.
            </p>
          </div>
        </section>

        {/* Search & Mobile Filter Bar */}
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search by creator name, niche, handle, or skills..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.925rem',
                  outline: 'none'
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              className="mobile-filter-btn"
              onClick={() => setMobileFilterOpen(true)}
            >
              <Filter size={18} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="mobile-filter-badge">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '0.65rem 1rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="rating">Highest Rated</option>
                <option value="followers_high">Most Followers</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid Layout (Sidebar + Results) */}
        <div className="explore-layout-grid">

          {/* Mobile Backdrop */}
          {mobileFilterOpen && (
            <div
              className="filter-drawer-backdrop active"
              onClick={() => setMobileFilterOpen(false)}
            />
          )}

          {/* Sidebar / Filter Drawer */}
          <aside className={`glass-panel explore-filter-sidebar ${mobileFilterOpen ? 'mobile-filter-open' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
                <Filter size={18} style={{ color: 'var(--primary)' }} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '999px', fontWeight: 700 }}>
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-pink)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Reset All
                  </button>
                )}
                {/* Mobile Close Button */}
                <button
                  className="mobile-filter-close-btn"
                  onClick={() => setMobileFilterOpen(false)}
                  style={{ display: 'none', background: 'var(--bg-pill)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Category Filter */}
              <div className="filter-section-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                  Category / Niche
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.35rem' }}>
                  <button 
                    onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedCategory === 'all' ? 'var(--primary)' : 'transparent',
                      color: selectedCategory === 'all' ? '#fff' : 'var(--text-main)',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: selectedCategory === 'all' ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <span>All Categories</span>
                    <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>{influencers.length}</span>
                  </button>
                  {categories.map(cat => {
                    const count = influencers.filter(i => i.category?.toLowerCase() === cat.name?.toLowerCase() || i.categoryId === cat.id).length;
                    const isSelected = selectedCategory.toLowerCase() === cat.name?.toLowerCase() || selectedCategory === cat.id;
                    return (
                      <button 
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.55rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'var(--primary)' : 'transparent',
                          color: isSelected ? '#fff' : 'var(--text-main)',
                          border: 'none',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.2s ease'
                        }}
                      >
                        <span>{cat.name}</span>
                        <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform Filter */}
              <div className="filter-section-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                  Primary Platform
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {['all', 'Instagram', 'YouTube', 'TikTok', 'LinkedIn'].map(plat => (
                    <button
                      key={plat}
                      onClick={() => { setSelectedPlatform(plat); setCurrentPage(1); }}
                      style={{
                        padding: '0.55rem 0.65rem',
                        fontSize: '0.8rem',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedPlatform === plat ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        background: selectedPlatform === plat ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-card)',
                        color: selectedPlatform === plat ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: selectedPlatform === plat ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {plat === 'all' ? 'All' : plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follower Count Filter */}
              <div className="filter-section-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Min Followers</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                    {minFollowers >= 1000000 ? `${(minFollowers / 1000000).toFixed(1)}M` : minFollowers >= 1000 ? `${(minFollowers / 1000).toFixed(0)}k` : minFollowers}+
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="1000000"
                  step="25000"
                  value={minFollowers}
                  onChange={(e) => { setMinFollowers(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', margin: '4px 0' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  <span>0</span>
                  <span>500k</span>
                  <span>1M+</span>
                </div>
              </div>

              {/* Max Starting Price */}
              <div className="filter-section-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.65rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Max Price</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    ₹{Number(maxPrice).toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min="1000"
                  max="100000"
                  step="2000"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer', margin: '4px 0' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                  <span>₹1,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Verified Only Checkbox */}
              <div className="filter-section-group" style={{ padding: '12px 14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input 
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => { setOnlyVerified(e.target.checked); setCurrentPage(1); }}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Verified Creators Only</span>
                  <ShieldCheck size={16} style={{ color: 'var(--primary)', marginLeft: 'auto' }} />
                </label>
              </div>

              {/* Mobile Drawer Action Button */}
              <div className="mobile-filter-apply-wrapper" style={{ marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-purple))',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px var(--primary-glow)'
                  }}
                >
                  Show {filteredInfluencers.length} Creators
                </button>
              </div>

            </div>
          </aside>

          {/* Results Grid */}
          <main>
            {/* Active Filters Bar & Count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Showing <strong style={{ color: 'var(--text-main)' }}>{filteredInfluencers.length}</strong> {filteredInfluencers.length === 1 ? 'creator' : 'creators'}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-pink)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Influencer Grid (2 cards per row on mobile) */}
            {paginatedInfluencers.length > 0 ? (
              <div className="influencer-cards-grid">
                {paginatedInfluencers.map(inf => (
                  <div key={inf.id} className="influencer-card glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Image Header */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: 'var(--bg-input)' }}>
                      <img
                        src={inf.avatar || inf.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60'}
                        alt={inf.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      {/* Rating Badge */}
                      <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#FBBF24' }}>
                        <Star size={12} fill="#FBBF24" />
                        <span>{inf.rating || '4.9'}</span>
                      </div>

                      {/* Verified Badge */}
                      {inf.verified && (
                        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(99, 102, 241, 0.85)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: '999px', padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShieldCheck size={14} />
                        </div>
                      )}

                      {/* Category Pill */}
                      <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(8px)', padding: '0.22rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                        {inf.category || 'Lifestyle'}
                      </div>

                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {inf.name}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {inf.username || inf.handle || `@${inf.name?.toLowerCase().replace(/\s+/g, '')}`}
                        </p>
                      </div>

                      {/* Location or Follower count */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.4rem 0 0.75rem 0' }}>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {(() => {
                            const f = inf.followers !== undefined ? Number(inf.followers) : Number(inf.followerCount || 0);
                            return f >= 1000000 ? `${(f / 1000000).toFixed(1)}M` : f >= 1000 ? `${(f / 1000).toFixed(0)}K` : `${f}`;
                          })()} Followers
                        </span>
                        {(inf.city || inf.location) && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                            <MapPin size={11} />
                            {(inf.city || inf.location).split(',')[0]}
                          </span>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div style={{ marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>From</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                            ₹{Number(inf.starting_price || inf.startingPrice || 8000).toLocaleString()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <Link
                            to={`/influencer/${encryptId(inf.id)}`}
                            style={{
                              padding: '0.4rem 0.6rem',
                              background: 'var(--bg-pill)',
                              color: 'var(--text-main)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            View
                          </Link>
                          <Link
                            to={`/book/${encryptId(inf.id)}`}
                            style={{
                              padding: '0.4rem 0.65rem',
                              background: 'var(--primary)',
                              color: '#fff',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Book
                          </Link>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <Filter size={44} style={{ color: 'var(--text-dim)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Creators Found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  No influencers matched your current search filters. Try loosening your criteria or resetting filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  style={{
                    padding: '0.65rem 1.5rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(p => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-main)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: currentPage === page ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      background: currentPage === page ? 'var(--primary)' : 'var(--bg-card)',
                      color: currentPage === page ? '#fff' : 'var(--text-main)',
                      fontWeight: currentPage === page ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(p => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
