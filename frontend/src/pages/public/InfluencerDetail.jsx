import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Star, ShieldCheck, MapPin, Calendar, Heart, Share2, MessageSquare, 
  DollarSign, CheckCircle2, Award, ExternalLink, X, Image as ImageIcon, Plus, ThumbsUp, MessageCircle, AlertCircle
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../../components/common/SocialIcons';
import apiService from '../../api/apiService';

export default function InfluencerDetail() {
  const { id } = useParams();
  const { influencers, favorites, toggleFavorite, availabilityList, reviewsList, addReview, fetchReviews, loading } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox modal state
  const [chatLoading, setChatLoading] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const influencerId = Number(id) || 1;
  
  // Find target influencer by matching id or user_id
  const matchedInf = (influencers || []).find(i => Number(i.id) === influencerId || Number(i.user_id) === influencerId);
  const foundInf = matchedInf || (influencers || [])[0] || {};

  // Strictly check if logged-in user IS this exact creator profile
  const isSelf = Boolean(
    user && (
      (user.id && (Number(user.id) === Number(foundInf.id) || Number(user.id) === Number(foundInf.user_id))) ||
      (user.email && foundInf.email && user.email.toLowerCase() === foundInf.email.toLowerCase())
    )
  );

  // Merge user state only if viewing self
  const inf = isSelf ? { ...foundInf, ...user } : foundInf;

  const targetInfId = Number(inf.id || influencerId);
  const targetUserId = Number(inf.user_id || targetInfId);

  useEffect(() => {
    if (matchedInf) {
      fetchReviews(targetInfId);
    }
  }, [targetInfId, matchedInf]);

  // If data has loaded and creator is not found, display a clean 404 state
  if (!matchedInf && !loading && (influencers || []).length > 0) {
    return (
      <div className="animate-fade-in glass-panel" style={{ maxWidth: '600px', margin: '60px auto', padding: '40px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <AlertCircle size={32} color="#EF4444" />
        </div>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Creator Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
          The influencer profile you requested (ID #{id}) does not exist in our directory or has been unlisted.
        </p>
        <Link to="/explore" className="btn btn-primary">
          Explore Verified Creators
        </Link>
      </div>
    );
  }

  // Filter availability date ranges strictly for THIS influencer
  const creatorAvailability = (availabilityList || []).filter(
    (item) => Number(item.influencer_id) === targetInfId || Number(item.influencer_id) === targetUserId
  );

  // Filter reviews strictly for THIS creator
  const creatorReviews = (reviewsList || []).filter(
    (r) => Number(r.influencer_id) === targetInfId || Number(r.influencer_id) === targetUserId
  );

  const totalReviewsCount = creatorReviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (creatorReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / totalReviewsCount).toFixed(1)
    : (inf.rating || 4.9);

  const formatDateShort = (dStr) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return dStr;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const isFav = inf.id ? favorites.includes(inf.id) : false;

  const coverImage = inf.cover_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800';
  const avatarImage = inf.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const name = inf.name || 'Verified Creator';
  const username = inf.username || (inf.name ? `@${inf.name.toLowerCase().replace(/\s+/g, '_')}` : '@creator');
  const category = inf.category || 'Lifestyle';
  const city = inf.city || 'Mumbai';
  const state = inf.state || 'Maharashtra';
  const followersCount = inf.followers ? (inf.followers >= 1000 ? `${(inf.followers / 1000).toFixed(0)}K` : inf.followers) : '250K';
  const rating = averageRating;
  const reviewsCount = totalReviewsCount > 0 ? totalReviewsCount : (inf.reviews_count || 12);
  const experience = inf.experience || '3 Years';
  const startingPrice = inf.starting_price || 10000;
  const bio = inf.bio || 'Passionate content creator available for brand partnerships and promotions.';
  const languages = inf.languages || 'English, Hindi';
  const platforms = Array.isArray(inf.platforms) ? inf.platforms.join(', ') : (inf.platforms || 'Instagram, YouTube');

  const services = (Array.isArray(inf.services) && inf.services.length > 0)
    ? inf.services
    : (isSelf && Array.isArray(user?.services) && user.services.length > 0)
      ? user.services
      : [
          { type: 'Instagram Post', price: startingPrice, desc: 'Branded feed post with caption link' },
          { type: 'Instagram Reel', price: Math.round(startingPrice * 1.5), desc: '30-60 second dedicated video Reel with tag' },
          { type: 'YouTube Integration', price: Math.round(startingPrice * 2.5), desc: '60-second video sponsor segment' }
        ];

  const portfolio = (Array.isArray(inf.portfolio) && inf.portfolio.length > 0)
    ? inf.portfolio
    : (isSelf && Array.isArray(user?.portfolio) && user.portfolio.length > 0)
      ? user.portfolio
      : [];

  const socials = inf.socials || {
    instagram: { followers: inf.followers ? `${Math.round(inf.followers / 1000)}K` : `${followersCount}` },
    youtube: { subscribers: inf.followers ? `${Math.round((inf.followers * 0.35) / 1000)}K` : '70K' }
  };

  const handleChatClick = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    // Resolve exact target user account ID for selected influencer
    const resolvedTargetUserId = Number(inf.user_id || targetUserId || targetInfId || id);

    // Prevent self-chat if user is viewing their own profile
    if (Number(user.id) === resolvedTargetUserId || isSelf) {
      alert('You cannot start a conversation with yourself.');
      return;
    }

    setChatLoading(true);
    try {
      const res = await apiService.findOrCreateConversation(resolvedTargetUserId, user.id);
      if (res && res.status === 'success' && res.conversation_id) {
        const routePrefix = user.role === 'influencer' ? '/creator/messages' : '/user/messages';
        navigate(`${routePrefix}?conversationId=${res.conversation_id}`);
      } else {
        alert(res?.message || 'Failed to start conversation with this influencer.');
      }
    } catch (err) {
      alert('Network error starting conversation.');
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', minWidth: 0 }}>
      
      {/* COVER IMAGE BANNER */}
      <div className="glass-panel" style={{ height: 'clamp(180px, 25vw, 260px)', position: 'relative', overflow: 'hidden', padding: 0 }}>
        <img src={coverImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-main), transparent)' }} />
      </div>

      {/* HEADER OVERLAY */}
      <div style={{ position: 'relative', marginTop: 'clamp(-40px, -6vw, -60px)', padding: '0 clamp(10px, 3vw, 24px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', flexWrap: 'wrap', minWidth: 0 }}>
          <img src={avatarImage} alt={name} style={{ width: 'clamp(80px, 12vw, 110px)', height: 'clamp(80px, 12vw, 110px)', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-main)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
              {name} {inf.verified && <ShieldCheck size={22} color="var(--primary)" style={{ flexShrink: 0 }} />}
            </h1>
            <p style={{ color: 'var(--primary)', fontSize: 'clamp(0.85rem, 2vw, 0.98rem)', fontWeight: 600 }}>
              {username} • {category} Creator in {city}, {state}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => inf.id && toggleFavorite(inf.id)}
            style={{ color: isFav ? 'var(--accent-pink)' : 'var(--text-main)', padding: '8px 14px' }}
          >
            <Heart size={16} fill={isFav ? 'var(--accent-pink)' : 'none'} /> <span className="hide-on-mobile">{isFav ? 'Saved' : 'Favorite'}</span>
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleChatClick}
            disabled={chatLoading}
            style={{ padding: '8px 14px' }}
          >
            <MessageSquare size={16} /> <span className="hide-on-mobile">{chatLoading ? 'Starting...' : 'Chat Direct'}</span>
          </button>
          <Link to={`/book-influencer/${inf.id}`} className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>
            Book Appointment
          </Link>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', padding: 'clamp(16px, 3vw, 24px)', margin: '24px 0', textAlign: 'center', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Followers Reach</span>
          <h3 style={{ color: 'var(--text-main)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800 }}>
            {followersCount.toString().endsWith('K') ? followersCount : `${followersCount}K`}
          </h3>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Rating</span>
          <h3 style={{ color: 'var(--accent-amber)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontWeight: 800 }}>
            <Star size={16} fill="var(--accent-amber)" /> {rating} ({reviewsCount})
          </h3>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Experience</span>
          <h3 style={{ color: 'var(--text-main)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800 }}>{experience}</h3>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Starting Rate</span>
          <h3 style={{ color: 'var(--accent-emerald)', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800 }}>₹{startingPrice.toLocaleString()}</h3>
        </div>
      </div>

      {/* CONTENT LAYOUT */}
      <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        
        {/* MAIN TABS CONTENT */}
        <div style={{ minWidth: 0 }}>
          {/* TAB BUTTONS */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
            {['overview', 'availability', 'services', 'portfolio', 'reviews'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  color: activeTab === t ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: activeTab === t ? '2px solid var(--primary)' : '2px solid transparent',
                  fontWeight: activeTab === t ? 700 : 500,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  flexShrink: 0
                }}
              >
                {t === 'availability' ? '📅 Availability' : t}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '10px', fontWeight: 800 }}>About Creator</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{bio}</p>
              </div>

              {/* Quick Availability Highlights inside Overview */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>Availability Schedule</h4>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('availability')} style={{ fontSize: '0.78rem' }}>View Full Schedule</button>
                </div>
                {creatorAvailability.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Standard working availability. Open for brand requests.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {creatorAvailability.slice(0, 3).map((item, idx) => {
                      const st = (item.status || 'available').toLowerCase();
                      const isBusy = st === 'busy' || st === 'not_available';
                      const isHol = st === 'holiday';
                      const icon = isBusy ? '🔴' : isHol ? '🟠' : '🟢';
                      const label = isBusy ? 'Not Available' : isHol ? 'Holiday' : 'Available';
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-input)', borderRadius: '6px', fontSize: '0.88rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {icon} {label}: {formatDateShort(item.from_date)} – {formatDateShort(item.to_date)}
                          </span>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>{item.notes || 'Scheduled'}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block' }}>Languages Spoken</span>
                  <strong style={{ color: 'var(--text-main)' }}>{languages}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', display: 'block' }}>Content Platforms</span>
                  <strong style={{ color: 'var(--text-main)' }}>{platforms}</strong>
                </div>
              </div>
            </div>
          )}

          {/* AVAILABILITY SCHEDULE TAB */}
          {activeTab === 'availability' && (
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '6px' }}>
                  Creator Availability & Schedule
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Below are the configured date availability ranges for {name}. Dates marked as Busy or Holiday cannot be booked, but direct messaging remains fully open!
                </p>
              </div>

              <div style={{ padding: '14px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>💬</span>
                <div>
                  <strong>Direct Messaging Always Open:</strong> You can message {name} at any time regardless of availability status to discuss upcoming projects or negotiate campaign briefs.
                </div>
              </div>

              {creatorAvailability.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  This creator has not configured custom unavailable blocks. General availability applies!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {creatorAvailability.map((item) => {
                    const st = (item.status || 'available').toLowerCase();
                    const isBusy = st === 'busy' || st === 'not_available';
                    const isHol = st === 'holiday';

                    let badgeBg = 'rgba(16, 185, 129, 0.15)';
                    let badgeColor = 'var(--accent-emerald)';
                    let badgeLabel = '🟢 Available';

                    if (isBusy) {
                      badgeBg = 'rgba(239, 68, 68, 0.15)';
                      badgeColor = '#EF4444';
                      badgeLabel = '🔴 Not Available / Busy';
                    } else if (isHol) {
                      badgeBg = 'rgba(245, 158, 11, 0.15)';
                      badgeColor = '#F59E0B';
                      badgeLabel = '🟠 Holiday / Off Day';
                    }

                    return (
                      <div 
                        key={item.id} 
                        style={{
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center',
                          padding: '16px 20px',
                          borderRadius: '10px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '20px', background: badgeBg, color: badgeColor, fontSize: '0.82rem', fontWeight: 700 }}>
                              {badgeLabel}
                            </span>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                              {formatDateShort(item.from_date)} – {formatDateShort(item.to_date)}
                            </strong>
                          </div>
                          {item.notes && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '2px' }}>
                              Note: {item.notes}
                            </p>
                          )}
                        </div>

                        <div>
                          {isUnavailable ? (
                            <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontSize: '0.78rem', padding: '6px 12px', borderRadius: '4px' }}>
                              Booking Disabled
                            </span>
                          ) : (
                            <Link to={`/book-influencer/${inf.id}`} className="btn btn-primary btn-sm">
                              Book Dates
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SERVICES & PRICING TAB */}
          {activeTab === 'services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {services.map((s, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>{s.type}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>{s.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>₹{(s.price || 10000).toLocaleString()}</div>
                    <Link to={`/book-influencer/${inf.id}`} className="btn btn-primary btn-sm" style={{ marginTop: '8px' }}>
                      Book Deliverable
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  Past Brand Campaigns & Portfolio Showcase ({portfolio.length})
                </h3>
                {user && (user.id === targetInfId || user.name === name) && (
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/creator/portfolio')}>
                    + Manage Portfolio Work
                  </button>
                )}
              </div>

              {portfolio.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No portfolio images uploaded by this creator yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {portfolio.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className="glass-panel glass-panel-hover" 
                      onClick={() => setSelectedImage(typeof imgUrl === 'string' ? imgUrl : (imgUrl.url || imgUrl.thumbnail))}
                      style={{ height: '220px', overflow: 'hidden', padding: 0, cursor: 'pointer', position: 'relative' }}
                    >
                      <img 
                        src={typeof imgUrl === 'string' ? imgUrl : (imgUrl.url || imgUrl.thumbnail)} 
                        alt={`Portfolio item ${idx + 1}`} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* REVIEWS RATING HEADER */}
              <div className="glass-panel" style={{ padding: 'clamp(16px, 3vw, 24px)', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center', minWidth: '140px', flex: '1 1 140px' }}>
                  <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>{averageRating}</h2>
                  <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-amber)', gap: '4px', margin: '4px 0' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill={star <= Math.round(averageRating) ? 'var(--accent-amber)' : 'none'} color="var(--accent-amber)" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{totalReviewsCount} Verified Reviews</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: '2 1 200px', minWidth: '180px' }}>
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = creatorReviews.filter(r => Number(r.rating) === stars).length;
                    const pct = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : (stars === 5 ? 100 : 0);
                    return (
                      <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                        <span style={{ width: '45px', color: 'var(--text-dim)', fontWeight: 600 }}>{stars} Stars</span>
                        <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'var(--bg-input)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-amber)', borderRadius: '4px' }} />
                        </div>
                        <span style={{ width: '28px', color: 'var(--text-muted)', textAlign: 'right' }}>{count || (stars === 5 ? 1 : 0)}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ flex: '1 1 100%', display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowReviewModal(true)} style={{ padding: '8px 18px' }}>
                    + Write a Review
                  </button>
                </div>
              </div>

              {/* WRITE A REVIEW FORM MODAL / ACCORDION */}
              {showReviewModal && (
                <div className="glass-panel animate-fade-in" style={{ padding: '24px', border: '2px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1.15rem', fontWeight: 800 }}>Leave a Campaign Review for {name}</h4>
                    <button onClick={() => setShowReviewModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  </div>

                  {reviewMsg && (
                    <div style={{ padding: '10px 14px', background: reviewMsg.includes('✓') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: reviewMsg.includes('✓') ? 'var(--accent-emerald)' : '#EF4444', borderRadius: '8px', marginBottom: '14px', fontWeight: 600, fontSize: '0.88rem' }}>
                      {reviewMsg}
                    </div>
                  )}

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!reviewComment.trim()) return;
                    setReviewSubmitting(true);
                    setReviewMsg('');

                    const payload = {
                      influencer_id: targetInfId,
                      user_id: user?.id || 2,
                      user_name: user?.name || 'Verified Brand Client',
                      rating: reviewRating,
                      comment: reviewComment.trim()
                    };

                    const res = await addReview(payload);
                    setReviewSubmitting(false);

                    if (res && res.success) {
                      setReviewMsg('✓ Thank you! Your review has been submitted successfully.');
                      setReviewComment('');
                      setReviewRating(5);
                      setTimeout(() => {
                        setShowReviewModal(false);
                        setReviewMsg('');
                      }, 2000);
                    } else {
                      setReviewMsg('⚠️ Failed to submit review. Please try again.');
                    }
                  }}>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Rating</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={26} 
                            fill={star <= reviewRating ? 'var(--accent-amber)' : 'none'} 
                            color="var(--accent-amber)"
                            onClick={() => setReviewRating(star)} 
                          />
                        ))}
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, marginLeft: '8px' }}>
                          {reviewRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Your Campaign Feedback & Review</label>
                      <textarea 
                        className="form-textarea" 
                        rows="3" 
                        placeholder="Share your experience regarding campaign delivery, content quality, and engagement results..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowReviewModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={reviewSubmitting}>
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* DYNAMIC REVIEWS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {creatorReviews.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No reviews published yet. Be the first brand client to leave a review!
                  </div>
                ) : (
                  creatorReviews.map((r, idx) => (
                    <div key={r.id || idx} className="glass-panel animate-fade-in" style={{ padding: '22px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={r.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                            alt={r.user_name || 'User'} 
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                          <div>
                            <strong style={{ color: 'var(--text-main)', fontSize: '0.96rem', display: 'block' }}>
                              {r.user_name || r.name || 'Verified Brand Client'}
                            </strong>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                              Verified Client • {r.date ? formatDateShort(r.date) : 'Recently'}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', color: 'var(--accent-amber)', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} fill={star <= Number(r.rating || 5) ? 'var(--accent-amber)' : 'none'} color="var(--accent-amber)" />
                          ))}
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.65, marginTop: '8px' }}>
                        "{r.comment || r.review_text || r.text}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR CREATOR SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '16px', fontWeight: 800 }}>Social Accounts</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {socials.instagram && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-pink)' }}>
                    <InstagramIcon size={18} /> Instagram
                  </div>
                  <strong style={{ color: 'var(--text-main)' }}>{socials.instagram.followers || `${followersCount}K`}</strong>
                </div>
              )}
              {socials.youtube && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
                    <YoutubeIcon size={18} /> YouTube
                  </div>
                  <strong style={{ color: 'var(--text-main)' }}>{socials.youtube.subscribers || '150K'}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontWeight: 800 }}>Custom Requirements?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
              Message {name} directly to negotiate tailor-made multi-platform deliverables.
            </p>
            <Link to={`/book-influencer/${inf.id}`} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Send Campaign Brief
            </Link>
          </div>
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX IMAGE MODAL */}
      {selectedImage && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            >
              <X size={20} /> Close Preview
            </button>
            <img 
              src={selectedImage} 
              alt="Portfolio High-Res Lightbox" 
              style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
