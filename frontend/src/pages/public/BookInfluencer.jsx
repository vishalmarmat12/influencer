import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/apiService';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Users, 
  MapPin, 
  TrendingUp, 
  Tag, 
  Briefcase, 
  FileText, 
  Mail, 
  Phone, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../../components/common/SocialIcons';
import { encryptId, decryptId, matchesEntityId } from '../../utils/cryptoId';

export default function BookInfluencer() {
  const { id, influencerId } = useParams();
  const targetId = id || influencerId;
  const numericTargetId = decryptId(targetId);
  const navigate = useNavigate();
  
  const { influencers, createBooking, checkDateAvailability, loading: dataLoading } = useData();
  const { user } = useAuth();
  
  const [influencer, setInfluencer] = useState(null);
  const [loadingInf, setLoadingInf] = useState(true);
  const [loadError, setLoadError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    campaign_name: '',
    business_name: user?.name || '',
    promotion_type: 'Instagram Reel',
    budget: 15000,
    date: defaultDate,
    time: '14:00',
    duration: '7 Days',
    description: '',
    additional_requirements: '',
    contact_email: user?.email || '',
    contact_phone: user?.phone || ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch influencer data
  useEffect(() => {
    let isMounted = true;

    async function loadInfluencerData() {
      if (!targetId) {
        setLoadError('No influencer ID specified.');
        setLoadingInf(false);
        return;
      }

      setLoadingInf(true);
      setLoadError('');

      // Check in DataContext first
      const existing = (influencers || []).find(
        (inf) => matchesEntityId(inf, targetId) || Number(inf.id) === numericTargetId || Number(inf.user_id) === numericTargetId
      );

      if (existing) {
        if (isMounted) {
          setInfluencer(existing);
          setFormData((prev) => ({
            ...prev,
            promotion_type: existing.services?.[0]?.type || prev.promotion_type,
            budget: existing.starting_price || existing.pricing || prev.budget
          }));
          setLoadingInf(false);
        }
        return;
      }

      // If not in context yet, fetch via API
      try {
        const res = await api.getInfluencerDetail(numericTargetId || targetId);
        if (isMounted) {
          if (res && res.data) {
            setInfluencer(res.data);
            setFormData((prev) => ({
              ...prev,
              promotion_type: res.data.services?.[0]?.type || prev.promotion_type,
              budget: res.data.starting_price || res.data.pricing || prev.budget
            }));
          } else {
            setLoadError('Influencer not found. They may have been removed or the ID is invalid.');
          }
          setLoadingInf(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoadError('Unable to load influencer details. Please check your network connection.');
          setLoadingInf(false);
        }
      }
    }

    loadInfluencerData();

    return () => {
      isMounted = false;
    };
  }, [targetId, influencers]);

  // If user logs in while on this page, update contact fields if empty
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        business_name: prev.business_name || user.name || '',
        contact_email: prev.contact_email || user.email || '',
        contact_phone: prev.contact_phone || user.phone || ''
      }));
    }
  }, [user]);

  const infId = influencer?.id || influencer?.user_id || targetId;
  const availCheck = checkDateAvailability(infId, formData.date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Role check: Influencer accounts cannot create campaign bookings
    if (user && user.role === 'influencer') {
      setErrorMsg('Influencer accounts cannot book influencers. Please log in with a Brand / Client account to create campaign bookings.');
      return;
    }

    // Self-booking check
    if (user && (Number(user.id) === Number(infId) || Number(user.id) === Number(influencer?.user_id) || (user.email && influencer?.email && user.email.toLowerCase() === influencer.email.toLowerCase()))) {
      setErrorMsg('You cannot book your own profile.');
      return;
    }

    // Past date check
    if (formData.date < todayStr) {
      setErrorMsg('Booking date cannot be in the past. Please select an upcoming date.');
      return;
    }

    // Availability check
    if (!availCheck.isAvailable) {
      setErrorMsg(`The influencer is NOT available on ${formData.date} (Status: ${availCheck.statusLabel}). Please choose an available date.`);
      return;
    }

    setSubmitting(true);
    const res = await createBooking({
      user_id: user?.id || 2,
      user_name: user?.name || formData.business_name || 'Brand User',
      influencer_id: infId,
      influencer_user_id: influencer?.user_id || infId,
      influencer_name: influencer?.name,
      ...formData
    });
    setSubmitting(false);

    if (res && res.success) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg(res?.message || 'Failed to submit booking request. Please verify the dates and try again.');
    }
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  // Loading State
  if (loadingInf && dataLoading) {
    return (
      <div className="book-influencer-page animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '60px 30px' }}>
          <Loader2 size={48} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 20px auto' }} />
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '10px' }}>Loading Influencer Details...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Fetching creator rates, availability calendar, and profile data.</p>
        </div>
      </div>
    );
  }

  // Error State
  if (loadError || (!influencer && !loadingInf)) {
    return (
      <div className="book-influencer-page animate-fade-in" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '50px 30px' }}>
          <AlertCircle size={56} color="#EF4444" style={{ margin: '0 auto 18px auto' }} />
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '12px' }}>Influencer Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
            {loadError || 'The creator you are looking for does not exist or has been removed from the platform.'}
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <ArrowLeft size={16} /> Back to Explore
            </Link>
            <Link to="/" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const followersCount = influencer?.followers || 250;
  const ratingValue = influencer?.rating || 4.9;
  const username = influencer?.username || (influencer?.name ? `@${influencer.name.toLowerCase().replace(/\s+/g, '.')}` : '@creator');
  const startingPrice = influencer?.starting_price || influencer?.pricing || 12000;
  const location = influencer?.location || influencer?.city || 'Mumbai, India';
  const engagementRate = influencer?.engagement_rate || influencer?.engagement || '4.8%';

  return (
    <div className="book-influencer-page animate-fade-in">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="book-influencer-header">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="book-influencer-back-btn"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={18} /> Back to Influencers
        </button>

        <div className="book-influencer-title-wrapper">
          <span className="badge badge-purple" style={{ marginBottom: '10px' }}>
            <Sparkles size={13} color="var(--accent-purple)" /> DIRECT CAMPAIGN COLLABORATION
          </span>
          <h1 className="book-influencer-page-title">
            Book <span className="gradient-text">{influencer?.name}</span>
          </h1>
          <p className="book-influencer-page-subtitle">
            Create your campaign request and send it directly to the influencer for review and scheduling.
          </p>
        </div>
      </div>

      {/* 2. SUCCESS CONFIRMATION STATE */}
      {submitted ? (
        <div className="glass-panel animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto', padding: '50px 30px', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.15)', 
            border: '2px solid rgba(16, 185, 129, 0.4)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px auto'
          }}>
            <CheckCircle2 size={46} color="var(--accent-emerald)" />
          </div>
          
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '12px' }}>
            Booking Request Submitted!
          </h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Your campaign proposal for <strong style={{ color: 'var(--text-main)' }}>"{formData.campaign_name}"</strong> has been successfully sent to <strong style={{ color: 'var(--primary)' }}>{influencer?.name}</strong>.
          </p>

          <div className="booking-summary-card" style={{ maxWidth: '520px', margin: '0 auto 32px auto', textAlign: 'left' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Proposal Summary
            </h4>
            <div className="booking-summary-grid">
              <div className="summary-item">
                <span className="summary-label">Creator:</span>
                <span className="summary-value">{influencer?.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Deliverable:</span>
                <span className="summary-value">{formData.promotion_type}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Target Date:</span>
                <span className="summary-value">{formatDate(formData.date)} at {formData.time}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Duration:</span>
                <span className="summary-value">{formData.duration}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Offered Budget:</span>
                <span className="summary-value" style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>
                  ₹{Number(formData.budget).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/explore" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Explore More Creators
            </Link>
            <Link to={`/influencer/${influencer?.id}`} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
              View Creator Profile
            </Link>
          </div>
        </div>
      ) : (
        /* 3. TWO-COLUMN MAIN LAYOUT */
        <div className="book-influencer-grid">
          
          {/* ============================================================= */}
          {/* LEFT COLUMN: INFLUENCER PROFILE CARD                          */}
          {/* ============================================================= */}
          <aside className="book-influencer-sidebar">
            <div className="glass-panel influencer-profile-card">
              
              {/* Profile Header Image & Avatar */}
              <div className="profile-card-header">
                <div className="profile-banner-bg" />
                <div className="profile-avatar-wrapper">
                  <img 
                    src={influencer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'} 
                    alt={influencer?.name || 'Influencer'} 
                    className="profile-avatar-img"
                  />
                  {influencer?.verified && (
                    <span className="verified-badge-pill" title="Verified Creator">
                      <ShieldCheck size={14} color="#FFF" />
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="profile-card-body">
                <h3 className="profile-name">{influencer?.name}</h3>
                <span className="profile-handle">{username}</span>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', margin: '12px 0 16px 0' }}>
                  <span className="badge badge-purple">{influencer?.category || 'Fashion & Lifestyle'}</span>
                  <span className="badge badge-green">
                    <CheckCircle2 size={12} /> Available
                  </span>
                </div>

                {/* Rating & Stats */}
                <div className="profile-stats-grid">
                  <div className="profile-stat-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#F59E0B' }}>
                      <Star size={15} fill="#F59E0B" />
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{ratingValue}</strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Rating ({influencer?.reviews_count || 32})</span>
                  </div>

                  <div className="profile-stat-box">
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {(() => {
                        const raw = influencer?.followers || influencer?.followerCount;
                        const f = Number(raw);
                        if (isNaN(f)) return raw || '50K';
                        if (f >= 1000000) return `${(f / 1000000).toFixed(1)}M`;
                        if (f >= 1000) return `${(f / 1000).toFixed(0)}K`;
                        return `${f}K`;
                      })()}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Followers</span>
                  </div>

                  <div className="profile-stat-box">
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{engagementRate}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Engagement</span>
                  </div>
                </div>

                {/* Location & Starting Rate */}
                <div className="profile-meta-list">
                  <div className="profile-meta-row">
                    <span className="meta-label"><MapPin size={15} color="var(--primary)" /> Location</span>
                    <span className="meta-val">{location}</span>
                  </div>
                  <div className="profile-meta-row">
                    <span className="meta-label"><DollarSign size={15} color="var(--accent-emerald)" /> Starting Price</span>
                    <span className="meta-val" style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>
                      ₹{startingPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                {influencer?.bio && (
                  <div className="profile-bio-box">
                    <p>{influencer.bio}</p>
                  </div>
                )}

                {/* Link to Full Profile */}
                <Link 
                  to={`/influencer/${influencer?.id}`} 
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  View Full Profile <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </aside>

          {/* ============================================================= */}
          {/* RIGHT COLUMN: BOOKING FORM & SUMMARY                          */}
          {/* ============================================================= */}
          <main className="book-influencer-main">
            <div className="glass-panel booking-form-panel">
              
              <div className="booking-form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      Campaign Details
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                      Fill out your brand campaign requirements to generate a formal booking proposal.
                    </p>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="booking-avail-alert danger" style={{ margin: '20px 24px 0 24px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="booking-actual-form">
                
                {/* 1. CAMPAIGN & BRAND NAME */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Briefcase size={14} /> Campaign Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Summer Sale Launch 2026"
                      required
                      value={formData.campaign_name}
                      onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Tag size={14} /> Business / Brand Name *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. TechGear India"
                      required
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. PROMOTION TYPE & OFFERED BUDGET */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Layers size={14} /> Promotion Type *
                    </label>
                    <select
                      className="form-select"
                      value={formData.promotion_type}
                      onChange={(e) => setFormData({ ...formData, promotion_type: e.target.value })}
                    >
                      <option value="Instagram Reel">Instagram Reel</option>
                      <option value="Instagram Post">Instagram Post</option>
                      <option value="Instagram Story">Instagram Story</option>
                      <option value="YouTube Video">YouTube Video</option>
                      <option value="YouTube Short">YouTube Short</option>
                      <option value="Facebook Post">Facebook Post</option>
                      <option value="Product Review">Product Review</option>
                      <option value="Brand Collaboration">Brand Collaboration</option>
                      <option value="Event Visit">Event Visit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <DollarSign size={14} /> Offered Budget (₹) *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      min="1000"
                      step="500"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                </div>

                {/* 3. PREFERRED DATE & TIME */}
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={14} /> Preferred Date *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      min={todayStr}
                      value={formData.date}
                      onChange={(e) => {
                        setErrorMsg('');
                        setFormData({ ...formData, date: e.target.value });
                      }}
                      required
                      style={{
                        borderColor: !availCheck.isAvailable ? '#EF4444' : undefined,
                        background: !availCheck.isAvailable ? 'rgba(239, 68, 68, 0.08)' : undefined
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Clock size={14} /> Preferred Time
                    </label>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Layers size={14} /> Campaign Duration
                    </label>
                    <select
                      className="form-select"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    >
                      <option value="1 Day">1 Day</option>
                      <option value="3 Days">3 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                    </select>
                  </div>
                </div>

                {/* 4. REAL-TIME AVAILABILITY BADGE */}
                {!availCheck.isAvailable ? (
                  <div className="booking-avail-alert danger">
                    <AlertCircle size={20} />
                    <div>
                      <strong>Unavailable Date:</strong> {influencer?.name} is <strong>{availCheck.statusLabel}</strong> on {formatDate(formData.date)} {availCheck.notes ? `(${availCheck.notes})` : ''}. Please choose another date.
                    </div>
                  </div>
                ) : (
                  <div className="booking-avail-alert success">
                    <CheckCircle2 size={20} />
                    <div>
                      <strong>Available for booking on {formatDate(formData.date)}:</strong> {influencer?.name} is currently open for campaign deliverables.
                    </div>
                  </div>
                )}

                {/* 5. CONTACT DETAILS */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Mail size={14} /> Contact Email *
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="marketing@brand.com"
                      required
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={14} /> Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* 6. CAMPAIGN DESCRIPTION */}
                <div className="form-group">
                  <label className="form-label">
                    <FileText size={14} /> Campaign Description *
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    required
                    placeholder="Describe your campaign, product, requirements, deliverables, key messaging, target audience, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* 7. ADDITIONAL REQUIREMENTS */}
                <div className="form-group">
                  <label className="form-label">
                    <Sparkles size={14} /> Additional Requirements (Optional)
                  </label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Any specific hashtags, brand tag guidelines, sample delivery instructions, or contract notes..."
                    value={formData.additional_requirements}
                    onChange={(e) => setFormData({ ...formData, additional_requirements: e.target.value })}
                  />
                </div>

                {/* ============================================================= */}
                {/* 8. LIVE BOOKING SUMMARY CARD                                  */}
                {/* ============================================================= */}
                <div className="booking-summary-card">
                  <div className="summary-header">
                    <Sparkles size={16} color="var(--primary)" />
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      Booking Summary
                    </h4>
                  </div>
                  
                  <div className="booking-summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Influencer:</span>
                      <span className="summary-value" style={{ fontWeight: 700 }}>{influencer?.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Promotion:</span>
                      <span className="summary-value">{formData.promotion_type || 'Instagram Reel'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Date & Time:</span>
                      <span className="summary-value">{formatDate(formData.date)} • {formData.time || '14:00'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Duration:</span>
                      <span className="summary-value">{formData.duration || '7 Days'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Budget:</span>
                      <span className="summary-value budget-highlight">
                        ₹{Number(formData.budget || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 9. SUBMIT BUTTONS */}
                <div className="booking-form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!availCheck.isAvailable || submitting}
                    style={{ 
                      opacity: !availCheck.isAvailable || submitting ? 0.6 : 1, 
                      cursor: !availCheck.isAvailable || submitting ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Sending Proposal...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send Booking Request
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </main>

        </div>
      )}
    </div>
  );
}
