import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../api/apiService';
import Pagination from '../../components/common/Pagination';
import {
  CalendarCheck, Calendar, Heart, MessageSquare, Star, Sparkles, Search,
  CheckCircle2, Plus, ArrowRight, DollarSign, ShieldCheck, User,
  Bell, Send, BarChart3, Clock, Check, X, ThumbsUp, ArrowUpRight,
  Filter, Eye, Sliders, Settings, Users, Image, Globe, ArrowDownRight, CheckSquare,
  Camera, Phone, Mail, MapPin
} from 'lucide-react';
import ChatBox from '../../components/chat/ChatBox';
import { computeBookingTimeSeries, generateSvgCurve, computeChannelDistribution } from '../../utils/chartUtils';

/* -------------------------------------------------------------------------- */
/* 1. USER / BRAND DASHBOARD OVERVIEW                                        */
/* -------------------------------------------------------------------------- */
export function UserDashboard({ setSelectedInfluencerId }) {
  const { bookings, influencers, favorites } = useData();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('Month');

  const myName = user?.name || 'Brand User';

  // Filter bookings strictly for the authenticated user
  const myBookings = bookings ? bookings.filter(b => b.user_id == user?.id || (user?.email && b.user_email === user.email)) : [];
  const pendingCount = myBookings.filter(b => b.status === 'pending').length;
  const activeCount = myBookings.filter(b => b.status === 'accepted' || b.status === 'pending').length;
  const totalSpent = myBookings.reduce((sum, b) => sum + (b.budget || 0), 0);

  // Dynamic Chart & Donut Calculations from authentic bookings
  const timeSeries = computeBookingTimeSeries(myBookings, timeframe);
  const chart = generateSvgCurve(timeSeries, { height: 130, strokeColor: '#8B5CF6' });
  const channelData = computeChannelDistribution(myBookings);

  const savedInfluencers = (influencers || []).filter(inf => (favorites || []).includes(inf.id));
  const displayWishlist = savedInfluencers.length > 0 ? savedInfluencers.slice(0, 4) : (influencers || []).slice(0, 3);

  const recentActivities = [
    ...(myBookings.slice(0, 2).map(b => ({
      text: `Campaign "${b.campaign_name || 'Campaign'}" status is ${b.status || 'pending'}`,
      time: b.date || 'Recent',
      color: b.status === 'accepted' ? '#10B981' : '#F59E0B',
      icon: CheckCircle2
    }))),
    { text: 'Account active and verified cleanly', time: 'Active', color: '#3B82F6', icon: ShieldCheck }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      {/* 1. BRAND / USER HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 800 }}>Welcome back, {myName}! 👋</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Here is your personal brand marketing overview, campaign bookings, and creator wishlist.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/explore" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Search size={13} /> Find Creators
          </Link>
          <Link to="/user/messages" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <MessageSquare size={13} /> Direct Messages
          </Link>
        </div>
      </div>

      {/* 2. TOP 5 KPI STAT CARDS */}
      <div className="dashboard-stats-grid">

        {/* Card 1: Total Bookings */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #6366F1', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={17} color="#6366F1" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> Active
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>{myBookings.length}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>My Campaign Bookings</span>
        </div>

        {/* Card 2: Active Requests */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #8B5CF6', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={17} color="#8B5CF6" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              {pendingCount} Pending
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>{activeCount}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Active Proposals</span>
        </div>

        {/* Card 3: Wishlist */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #EC4899', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={17} color="#EC4899" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> Wishlist
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>{favorites ? favorites.length : 0}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Saved Creators</span>
        </div>

        {/* Card 4: Total Spent Volume */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #10B981', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={17} color="#10B981" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> Total
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>₹{totalSpent.toLocaleString()}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Campaign Budget Spent</span>
        </div>

        {/* Card 5: Unread Messages */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #F59E0B', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={17} color="#F59E0B" />
            </div>
            <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
              Account Verified
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>1</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Notifications</span>
        </div>

      </div>

      {/* 3. CAMPAIGN SPEND ANALYTICS + BUDGET SPLIT DONUT */}
      <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>

        {/* Campaign Spend Chart */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Campaign Budget Investment</h3>
                <span className="badge badge-purple" style={{ fontSize: '0.72rem', padding: '1px 6px' }}>
                  ₹{chart.total.toLocaleString()} spent
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {timeframe === 'Week' ? 'Daily campaign spend trajectory (Past 7 Days)' : timeframe === 'Year' ? 'Yearly marketing budget progression' : 'Monthly marketing spend trajectory'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '3px', background: 'var(--bg-input)', padding: '3px', borderRadius: '6px' }}>
              {['Week', 'Month', 'Year'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    background: timeframe === t ? 'var(--primary)' : 'transparent',
                    color: timeframe === t ? '#FFF' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '140px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 130" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="userChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {chart.pathArea && (
                <path d={chart.pathArea} fill="url(#userChartGrad)" />
              )}
              {chart.pathStroke && (
                <path d={chart.pathStroke} fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {chart.coords.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#8B5CF6"
                    stroke="var(--bg-card)"
                    strokeWidth="2"
                    style={{ cursor: 'pointer' }}
                  >
                    <title>{`${pt.label}: ₹${pt.value.toLocaleString()}`}</title>
                  </circle>
                </g>
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.74rem', marginTop: '6px', padding: '0 8px' }}>
              {chart.coords.map(pt => (
                <span key={pt.label} style={{ fontWeight: 600 }}>{pt.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Spend Split Donut Graphic */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Channel Split</h3>
              <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>Dynamic</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Spend by content promotion format</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '12px 0' }}>
            <div style={{ width: '105px', height: '105px', borderRadius: '50%', background: channelData.conicGradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s ease' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-card)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
            {channelData.channels.map(ch => (
              <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: ch.color, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.name}:</span>
                <strong style={{ color: 'var(--text-main)' }}>{ch.percent}%</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. QUICK ACTIONS 6-GRID */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '14px' }}>Quick Actions</h3>
        <div className="dashboard-quick-actions-grid">
          <Link to="/explore" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Search size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Find Creators</span>
          </Link>

          <Link to="/user/bookings" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <CalendarCheck size={18} color="var(--accent-pink)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>My Bookings</span>
          </Link>

          <Link to="/user/favorites" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Heart size={18} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Saved Wishlist</span>
          </Link>

          <Link to="/user/messages" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={18} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Messages</span>
          </Link>

          <Link to="/user/profile" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <User size={18} color="#3B82F6" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Brand Profile</span>
          </Link>

          <Link to="/user/settings" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Settings size={18} color="#8B5CF6" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Settings</span>
          </Link>
        </div>
      </div>

      {/* 5. UPCOMING BOOKINGS + SAVED WISHLIST SIDE PANEL */}
      <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>

        {/* Upcoming Bookings */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Upcoming Campaign Appointments</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status of your booked collaborations</span>
            </div>
            <Link to="/user/bookings" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myBookings.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                No active bookings yet. Explore creators to start a campaign.
              </div>
            ) : (
              myBookings.slice(0, 4).map(b => (
                <div 
                  key={b.id} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr auto', 
                    alignItems: 'center', 
                    padding: '11px 13px', 
                    background: 'var(--bg-input)', 
                    borderRadius: '12px', 
                    gap: '12px' 
                  }}
                >
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--primary), #8B5CF6)', 
                    color: '#FFF', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '0.85rem', 
                    flexShrink: 0 
                  }}>
                    {b.influencer_name ? b.influencer_name.charAt(0).toUpperCase() : 'I'}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ 
                      fontSize: '0.88rem', 
                      color: 'var(--text-main)', 
                      fontWeight: 700, 
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {b.campaign_name || b.influencer_name}
                    </h4>
                    <span style={{ 
                      fontSize: '0.74rem', 
                      color: 'var(--text-muted)', 
                      display: 'block', 
                      marginTop: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {b.promotion_type} • {b.date || b.booking_date}
                    </span>
                  </div>

                  <div style={{ 
                    textAlign: 'right', 
                    flexShrink: 0, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end', 
                    gap: '3px' 
                  }}>
                    <strong style={{ 
                      fontSize: '0.92rem', 
                      color: 'var(--accent-emerald)', 
                      fontWeight: 800,
                      lineHeight: 1
                    }}>
                      ₹{(b.budget || 0).toLocaleString()}
                    </strong>
                    <span 
                      className={`badge ${
                        b.status === 'accepted' ? 'badge-green' : 
                        b.status === 'completed' ? 'badge-blue' : 
                        b.status === 'pending' ? 'badge-amber' : 
                        'badge-red'
                      }`} 
                      style={{ fontSize: '0.66rem', padding: '2px 6px', textTransform: 'uppercase' }}
                    >
                      {b.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Wishlist Quick Sidebar */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Saved Wishlist</h3>
            <Link to="/user/favorites" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayWishlist.map(w => {
              const followersFormatted = w.followers ? (w.followers >= 1000000 ? `${(w.followers / 1000000).toFixed(1)}M` : `${(w.followers / 1000).toFixed(0)}K`) : '50K';
              return (
                <div 
                  key={w.id} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr auto', 
                    alignItems: 'center', 
                    gap: '10px' 
                  }}
                >
                  <img src={w.avatar || w.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt={w.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.name}</h4>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {followersFormatted} • <Star size={10} fill="var(--accent-amber)" color="var(--accent-amber)" /> {w.rating || '4.9'}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--primary)', fontWeight: 700, flexShrink: 0, textAlign: 'right' }}>
                    ₹{(w.starting_price || w.startingPrice || 8000).toLocaleString()}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. RECENT ACTIVITY STREAM */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Recent Activity</h3>
          <span style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>Active Log</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
          {recentActivities.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={13} color={act.color} />
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{act.text}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>{act.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. USER BOOKINGS & CAMPAIGN APPOINTMENTS                                   */
/* -------------------------------------------------------------------------- */
export function UserBookingsPage() {
  const { bookings } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter bookings strictly for the currently authenticated user!
  const myBookings = bookings ? bookings.filter(b => b.user_id == user?.id || (user?.email && b.user_email === user.email)) : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = myBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleDirectChat = async (targetId) => {
    if (!user) return;
    const targetUserId = Number(targetId || 1);
    if (Number(user.id) === targetUserId) {
      alert('You cannot start a conversation with yourself.');
      return;
    }
    try {
      const res = await apiService.findOrCreateConversation(targetUserId, user.id);
      if (res && res.status === 'success' && res.conversation_id) {
        navigate(`/user/messages?conversationId=${res.conversation_id}`);
      } else {
        navigate('/user/messages');
      }
    } catch (e) {
      navigate('/user/messages');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>My Campaign Appointments ({myBookings.length})</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Track pending proposals, accepted campaigns, deliverable deadlines, and payment statuses for your account.</p>
        </div>
        <Link to="/explore" className="btn btn-primary btn-sm">
          <Plus size={14} /> New Campaign Request
        </Link>
      </div>

      <div className="light-table-card" data-theme="light">
        {myBookings.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
            <CalendarCheck size={40} color="#94A3B8" style={{ marginBottom: '12px', opacity: 0.6 }} />
            <h3 style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>No Campaign Bookings Found</h3>
            <p style={{ fontSize: '0.88rem', marginTop: '4px', color: '#64748B' }}>You haven't booked any influencers yet. Browse creators to start your first campaign!</p>
            <Link to="/explore" className="btn btn-primary btn-sm" style={{ marginTop: '14px' }}>
              Explore Influencers
            </Link>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className="desktop-table-view light-table-wrapper">
              <table className="light-table">
                <thead>
                  <tr>
                    <th style={{ padding: '13px 14px', width: '55px', textAlign: 'center' }}>ID</th>
                    <th style={{ padding: '13px 14px', textAlign: 'left', minWidth: '150px' }}>Campaign Name</th>
                    <th style={{ padding: '13px 14px', textAlign: 'left', minWidth: '130px' }}>Influencer</th>
                    <th style={{ padding: '13px 14px', textAlign: 'left', minWidth: '110px' }}>Deliverable</th>
                    <th style={{ padding: '13px 14px', textAlign: 'center', minWidth: '95px', whiteSpace: 'nowrap' }}>Date</th>
                    <th style={{ padding: '13px 14px', textAlign: 'right', minWidth: '100px', whiteSpace: 'nowrap' }}>Budget</th>
                    <th style={{ padding: '13px 14px', textAlign: 'center', minWidth: '95px' }}>Status</th>
                    <th style={{ padding: '13px 14px', textAlign: 'center', minWidth: '100px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ textAlign: 'center', color: '#4F46E5', fontWeight: 700, fontSize: '0.82rem' }}>#{b.id}</td>
                      <td style={{ textAlign: 'left', color: '#0F172A', fontWeight: 700 }}>{b.campaign_name}</td>
                      <td style={{ textAlign: 'left', color: '#1E293B', fontWeight: 600 }}>{b.influencer_name}</td>
                      <td style={{ textAlign: 'left', color: '#64748B' }}>{b.promotion_type}</td>
                      <td style={{ textAlign: 'center', color: '#64748B', whiteSpace: 'nowrap' }}>{b.date}</td>
                      <td style={{ textAlign: 'right', color: '#059669', fontWeight: 800, whiteSpace: 'nowrap' }}>₹{(b.budget || 0).toLocaleString()}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${b.status === 'accepted' ? 'badge-green' : b.status === 'pending' ? 'badge-amber' : b.status === 'completed' ? 'badge-blue' : 'badge-red'}`} style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                          {(b.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleDirectChat(b.influencer_id || b.influencer_user_id || 1)}
                          style={{
                            background: '#EEF2FF',
                            color: '#4F46E5',
                            border: '1px solid #C7D2FE',
                            borderRadius: '7px',
                            padding: '5px 12px',
                            fontSize: '0.76rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <MessageSquare size={13} /> Chat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DEDICATED MOBILE CARDS VIEW */}
            <div className="mobile-cards-view">
              {paginatedBookings.map(b => (
                <div key={b.id} className="mobile-data-card">
                  <div className="mobile-card-top-bar">
                    <span className="mobile-card-id">#{b.id}</span>
                    <span className={`badge ${b.status === 'accepted' ? 'badge-green' : b.status === 'pending' ? 'badge-amber' : b.status === 'completed' ? 'badge-blue' : 'badge-red'}`} style={{ fontSize: '0.74rem', padding: '3px 9px' }}>
                      {(b.status || 'pending').toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h4 className="mobile-card-title">{b.campaign_name}</h4>
                    <span className="mobile-card-subtitle">
                      Creator: <strong style={{ color: '#0F172A' }}>{b.influencer_name}</strong>
                    </span>
                  </div>

                  <div className="mobile-card-grid">
                    <div className="mobile-card-grid-item">
                      <span className="mobile-card-grid-label">Deliverable</span>
                      <span className="mobile-card-grid-value">{b.promotion_type || 'Brand Post'}</span>
                    </div>
                    <div className="mobile-card-grid-item">
                      <span className="mobile-card-grid-label">Campaign Date</span>
                      <span className="mobile-card-grid-value">{b.date || 'TBD'}</span>
                    </div>
                    <div className="mobile-card-grid-item" style={{ gridColumn: 'span 2' }}>
                      <span className="mobile-card-grid-label">Agreed Budget</span>
                      <span className="mobile-card-grid-value" style={{ color: '#059669', fontSize: '1.05rem', fontWeight: 800 }}>
                        ₹{(b.budget || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mobile-card-actions">
                    <button
                      onClick={() => handleDirectChat(b.influencer_id || b.influencer_user_id || 1)}
                      style={{
                        background: '#4F46E5',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '9px 14px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageSquare size={14} /> Message Creator
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
              <Pagination
                currentPage={currentPage}
                totalItems={myBookings.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. USER FAVORITES WISHLIST                                                 */
/* -------------------------------------------------------------------------- */
export function UserFavorites() {
  const { influencers, favorites, toggleFavorite } = useData();
  const favoriteCreators = influencers.filter(i => favorites.includes(i.id));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Saved Creators Wishlist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Quickly re-book, audit rate cards, or start a message with your favorite influencers.</p>
        </div>
        <Link to="/explore" className="btn btn-primary btn-sm">
          <Search size={14} /> Browse More Creators
        </Link>
      </div>

      {favoriteCreators.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Heart size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No saved creators in your wishlist yet.</p>
          <Link className="btn btn-primary btn-sm" style={{ marginTop: '14px' }} to="/explore">
            Browse Influencers Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '18px' }}>
          {favoriteCreators.map(inf => (
            <div key={inf.id} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <img src={inf.avatar} alt={inf.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 700 }}>{inf.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inf.category} • {inf.city}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '16px', background: 'var(--bg-input)', padding: '10px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Followers</span>
                    <strong style={{ color: 'var(--text-main)' }}>{(inf.followers / 1000).toFixed(0)}K</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>Rating</span>
                    <strong style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} fill="var(--accent-amber)" /> {inf.rating}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 'auto' }}>
                <Link to={`/influencer/${inf.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>View Profile</Link>
                <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => toggleFavorite(inf.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. USER PROFILE EDIT & SETTINGS                                            */
/* -------------------------------------------------------------------------- */
export function UserProfileEdit() {
  const { user, updateUser } = useAuth();
  const fileInputRef = React.useRef(null);

  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');
  const [contactName, setContactName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.company || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [dob, setDob] = useState(user?.dob || '1995-06-15');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [state, setState] = useState(user?.state || 'Maharashtra');
  const [country, setCountry] = useState(user?.country || 'India');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.avatar) setAvatar(user.avatar);
      setContactName(user.name || '');
      setBusinessName(user.company || user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+91 9876543210');
      if (user.gender) setGender(user.gender);
      if (user.dob) setDob(user.dob);
      if (user.city) setCity(user.city);
      if (user.state) setState(user.state);
      if (user.country) setCountry(user.country);
    }
  }, [user]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      avatar,
      name: contactName,
      company: businessName,
      email,
      phone,
      gender,
      dob,
      city,
      state,
      country
    });
    setSaved(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Business Profile Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Manage profile picture, contact phone number, gender, location, and account details.</p>
      </div>

      {saved && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem' }}>
          ✓ Profile details updated successfully!
        </div>
      )}

      <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)' }}>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageFileChange}
          style={{ display: 'none' }}
        />

        {/* PROFILE PICTURE AVATAR HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ position: 'relative', cursor: 'pointer' }}
            title="Click to change profile picture"
          >
            <img
              src={avatar}
              alt={contactName}
              style={{ width: '95px', height: '95px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: '0 4px 15px var(--primary-glow)' }}
            />
            <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'var(--primary)', padding: '7px', borderRadius: '50%', color: '#FFF', display: 'flex', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              <Camera size={15} />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 'min(100%, 200px)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800 }}>{contactName || 'User Avatar'}</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>{email} • {gender}</span>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.82rem', padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Camera size={14} /> Upload Picture from Device
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* SECTION 1: PERSONAL & CONTACT DETAILS */}
          <h4 style={{ fontSize: '0.96rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '14px', letterSpacing: '0.04em' }}>
            1. PERSONAL & CONTACT DETAILS
          </h4>

          <div className="form-grid-2" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="var(--primary)" /> Full Name / Contact Person
              </label>
              <input type="text" className="form-input" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="var(--accent-pink)" /> Business / Brand Name
              </label>
              <input type="text" className="form-input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
            </div>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="var(--accent-purple)" /> Email Address
              </label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="var(--accent-emerald)" /> Mobile Number
              </label>
              <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 9876543210" />
            </div>
          </div>

          <div className="form-grid-2" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="var(--accent-amber)" /> Date of Birth
              </label>
              <input type="date" className="form-input" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>

          {/* SECTION 2: LOCATION & ADDRESS */}
          <h4 style={{ fontSize: '0.96rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '14px', letterSpacing: '0.04em' }}>
            2. LOCATION & ADDRESS
          </h4>

          <div className="form-grid-3" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--primary)" /> City
              </label>
              <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" className="form-input" value={state} onChange={(e) => setState(e.target.value)} placeholder="Maharashtra" />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input type="text" className="form-input" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <Check size={16} /> Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. USER MESSAGES WORKSPACE                                                 */
/* -------------------------------------------------------------------------- */
export function UserMessagesWorkspace() {
  return (
    <div className="chat-fullscreen-page-wrapper animate-fade-in">
      <ChatBox activeBookingId={101} />
    </div>
  );
}

