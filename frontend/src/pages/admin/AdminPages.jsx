import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import apiService from '../../api/apiService';
import {
  Users, Sparkles, FolderTree, CalendarCheck, ShieldCheck, Trash2, Edit,
  Plus, Check, X, Download, Bell, Settings, Filter, ArrowUpRight, BarChart3,
  CalendarDays, PieChart, CheckCircle2, AlertTriangle, FileText, Globe, Search,
  DollarSign, Eye, Activity, Sliders, User, MessageSquare, Clock, RefreshCw, CheckSquare,
  Image as ImageIcon, Phone, MapPin, Layers, Layout, Info, Upload, TrendingUp
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. ADMIN DASHBOARD OVERVIEW                                                */
/* -------------------------------------------------------------------------- */
export function AdminDashboard() {
  const { influencers, bookings, categories, users, siteSettings, updateBookingStatus } = useData();
  const [timeframe, setTimeframe] = useState('Month');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const commissionRate = (Number(siteSettings?.commission_fee) || 10) / 100;
  const totalBookingsVolume = (bookings || []).reduce((sum, b) => sum + (Number(b.budget) || 0), 0);

  // Dynamic timeframe data mapping for Week, Month, and Year (Smooth, padded SVG curve paths)
  const timeframeData = {
    Week: {
      title: 'Weekly Platform Growth',
      description: 'Daily campaign bookings & transaction volume (Past 7 Days)',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      pathMain: 'M 0,110 C 50,90 80,75 125,80 C 170,85 210,95 250,65 C 290,45 330,40 375,50 C 420,60 460,80 500,50 L 500,150 L 0,150 Z',
      pathStroke: 'M 0,110 C 50,90 80,75 125,80 C 170,85 210,95 250,65 C 290,45 330,40 375,50 C 420,60 460,80 500,50',
      pathDashed: 'M 0,122 C 50,102 80,90 125,95 C 170,100 210,110 250,80 C 290,60 330,55 375,65 C 420,75 460,95 500,65',
      feeRevenue: Math.round(totalBookingsVolume > 0 ? (totalBookingsVolume * 0.25 * commissionRate) : 5100),
      growthRate: '+14.8%',
      bookingsCount: bookings ? Math.max(1, Math.round(bookings.length * 0.3)) : 8,
      nicheShare: { Fashion: '42%', Beauty: '28%', Tech: '18%', Fitness: '12%' },
      donutGradient: 'conic-gradient(#6366F1 0% 42%, #EC4899 42% 70%, #10B981 70% 88%, #F59E0B 88% 100%)'
    },
    Month: {
      title: 'Monthly Platform Growth',
      description: 'Monthly campaign bookings & gross transaction volume (Current Year)',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      pathMain: 'M 0,105 C 60,90 120,75 180,65 C 240,55 300,45 360,40 C 420,35 460,30 500,35 L 500,150 L 0,150 Z',
      pathStroke: 'M 0,105 C 60,90 120,75 180,65 C 240,55 300,45 360,40 C 420,35 460,30 500,35',
      pathDashed: 'M 0,120 C 60,105 120,92 180,82 C 240,72 300,62 360,56 C 420,52 460,46 500,52',
      feeRevenue: Math.round(totalBookingsVolume > 0 ? (totalBookingsVolume * commissionRate) : 12450),
      growthRate: '+28.4%',
      bookingsCount: bookings ? bookings.length : 24,
      nicheShare: { Fashion: '35%', Beauty: '30%', Tech: '20%', Fitness: '15%' },
      donutGradient: 'conic-gradient(#6366F1 0% 35%, #EC4899 35% 65%, #10B981 65% 85%, #F59E0B 85% 100%)'
    },
    Year: {
      title: 'Annual Platform Growth',
      description: 'Yearly aggregate transaction volume & revenue progression',
      labels: ['2021', '2022', '2023', '2024', '2025', '2026'],
      pathMain: 'M 0,120 C 80,105 160,85 240,65 C 320,48 400,38 500,30 L 500,150 L 0,150 Z',
      pathStroke: 'M 0,120 C 80,105 160,85 240,65 C 320,48 400,38 500,30',
      pathDashed: 'M 0,130 C 80,118 160,100 240,80 C 320,64 400,54 500,45',
      feeRevenue: Math.round(totalBookingsVolume > 0 ? (totalBookingsVolume * 3.5 * commissionRate) : 222000),
      growthRate: '+46.2%',
      bookingsCount: bookings ? bookings.length * 4 : 312,
      nicheShare: { Fashion: '38%', Beauty: '26%', Tech: '22%', Fitness: '14%' },
      donutGradient: 'conic-gradient(#6366F1 0% 38%, #EC4899 38% 64%, #10B981 64% 86%, #F59E0B 86% 100%)'
    }
  };

  const currentTF = timeframeData[timeframe] || timeframeData.Month;

  const totalInf = influencers ? influencers.length : 0;
  const paginatedBookings = (bookings || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      {/* ADMIN HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 800 }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Real-time audit overview of creators, platform volume, brand bookings, and catalogs.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/admin/influencers" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Users size={13} /> Audit Creators
          </Link>
          <Link to="/admin/bookings" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <CalendarCheck size={13} /> Manage Bookings
          </Link>
        </div>
      </div>

      {/* 1. TOP 5 KPI STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px' }}>

        {/* Card 1: Total Creators */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #F97316', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={17} color="#F97316" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> +14.2%
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>{totalInf}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Active Creators</span>
        </div>

        {/* Card 2: Total Bookings (Dynamic to timeframe) */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #F59E0B', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={17} color="#F59E0B" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> {currentTF.growthRate}
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>{currentTF.bookingsCount}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Campaign Bookings ({timeframe})</span>
        </div>

        {/* Card 3: Platform Fee Revenue (Dynamic to timeframe) */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #10B981', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={17} color="#10B981" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> {currentTF.growthRate}
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>₹{currentTF.feeRevenue.toLocaleString()}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Est. Platform Fees ({timeframe})</span>
        </div>

        {/* Card 4: Categories Catalog */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #3B82F6', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderTree size={17} color="#3B82F6" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700 }}>
              Catalog
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>{(categories || []).length}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Niche Categories</span>
        </div>

        {/* Card 5: Registered Brands & Users */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #8B5CF6', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={17} color="#8B5CF6" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> +18.5%
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0' }}>{(users || []).length}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Registered Brands</span>
        </div>

      </div>

      {/* 2. PLATFORM VOLUME CHART + CATEGORY SHARE DONUT */}
      <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>

        {/* Platform Booking Volume Curve */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>{currentTF.title}</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentTF.description}</span>
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

          <div style={{ height: '160px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 150" style={{ width: '100%', height: '125px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={currentTF.pathMain} fill="url(#adminChartGrad)" />
              <path d={currentTF.pathStroke} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d={currentTF.pathDashed} fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.76rem', marginTop: '10px', padding: '0 4px', fontWeight: 600 }}>
              {currentTF.labels.map(lbl => (
                <span key={lbl}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Category Share Donut (Dynamic to timeframe) */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Niche Share ({timeframe})</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bookings distribution by niche</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '12px 0' }}>
            <div style={{ width: '105px', height: '105px', borderRadius: '50%', background: currentTF.donutGradient, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-card)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6366F1' }} />
              <span style={{ color: 'var(--text-muted)' }}>Fashion:</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentTF.nicheShare.Fashion}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EC4899' }} />
              <span style={{ color: 'var(--text-muted)' }}>Beauty:</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentTF.nicheShare.Beauty}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ color: 'var(--text-muted)' }}>Tech:</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentTF.nicheShare.Tech}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ color: 'var(--text-muted)' }}>Fitness:</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentTF.nicheShare.Fitness}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 3. QUICK ACTIONS 6-GRID */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '14px' }}>Quick Admin Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '10px' }}>
          <Link to="/admin/influencers" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Users size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Creators Audit</span>
          </Link>

          <Link to="/admin/users" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <User size={18} color="var(--accent-pink)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Brands & Users</span>
          </Link>

          <Link to="/admin/categories" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <FolderTree size={18} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Niche Catalogs</span>
          </Link>

          <Link to="/admin/bookings" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <CalendarCheck size={18} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Bookings Escrow</span>
          </Link>

          <Link to="/admin/availability" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <CalendarDays size={18} color="#3B82F6" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>Master Calendar</span>
          </Link>

          <Link to="/admin/settings" className="glass-panel glass-panel-hover" style={{ padding: '14px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Settings size={18} color="#8B5CF6" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>System Settings</span>
          </Link>
        </div>
      </div>

      {/* 4. RECENT APPOINTMENTS TABLE + SYSTEM ACTIVITY FEED */}
      <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>

        {/* Recent Appointments Table */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Recent Platform Appointments</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest campaign bookings across all creators</span>
            </div>
            <Link to="/admin/bookings" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>

          <div className="table-responsive-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px' }}>ID</th>
                  <th style={{ padding: '8px' }}>Campaign</th>
                  <th style={{ padding: '8px' }}>Business</th>
                  <th style={{ padding: '8px' }}>Influencer</th>
                  <th style={{ padding: '8px' }}>Budget</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', color: 'var(--primary)', fontWeight: 600 }}>#{b.id}</td>
                    <td style={{ padding: '8px', color: 'var(--text-main)', fontWeight: 600 }}>{b.campaign_name}</td>
                    <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{b.business_name}</td>
                    <td style={{ padding: '8px', color: 'var(--text-main)' }}>{b.influencer_name}</td>
                    <td style={{ padding: '8px', color: 'var(--accent-emerald)', fontWeight: 700 }}>₹{b.budget.toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>
                      <span className={`badge ${b.status === 'accepted' ? 'badge-green' : b.status === 'pending' ? 'badge-amber' : b.status === 'completed' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={(bookings || []).length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* System Audit Activity Stream */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Audit Activity</h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>Live Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            {[
              { text: 'Verified profile for Aanya Verma', time: '10 mins ago', icon: ShieldCheck, color: '#10B981' },
              { text: 'Escrow payment ₹25,000 held for Luxe Fashion', time: '1 hour ago', icon: DollarSign, color: '#F59E0B' },
              { text: 'New business registered: TechGear Inc', time: '3 hours ago', icon: User, color: '#3B82F6' },
              { text: 'Category added: Gaming & Esports', time: '5 hours ago', icon: FolderTree, color: '#8B5CF6' },
              { text: 'System backup performed cleanly', time: '1 day ago', icon: CheckCircle2, color: '#10B981' }
            ].map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={12} color={act.color} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{act.text}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. INFLUENCER / CREATOR MANAGEMENT (DYNAMIC API & DB CONNECTED)             */
/* -------------------------------------------------------------------------- */
export function InfluencerMgmt() {
  const { influencers, categories, toggleInfluencerVerify, addInfluencer, updateInfluencer, deleteInfluencer } = useData();
  const [filterCat, setFilterCat] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const itemsPerPage = 20;

  // Add Creator Form State
  const [newCreator, setNewCreator] = useState({
    name: '',
    username: '',
    category: 'Fashion',
    city: 'Mumbai',
    starting_price: '10000',
    followers: '50000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    bio: '',
    verified: true
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleToggleVerify = async (inf) => {
    await toggleInfluencerVerify(inf.id);
    setToastMsg({
      type: 'success',
      text: inf.verified ? `ℹ️ Creator "${inf.name}" unverified.` : `✅ Creator "${inf.name}" verified with blue tick badge!`
    });
  };

  const handleAvatarFileChange = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await apiService.uploadImage(file, 'influencers');
      if (res && res.url) {
        if (isEdit) {
          setEditingCreator(prev => ({ ...prev, avatar: res.url }));
        } else {
          setNewCreator(prev => ({ ...prev, avatar: res.url }));
        }
        setToastMsg({ type: 'success', text: '📷 Creator avatar uploaded successfully!' });
      }
    } catch (err) {
      setToastMsg({ type: 'error', text: 'Failed to upload creator avatar.' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const priceNum = Number(newCreator.starting_price) || 8000;
    const follNum = Number(newCreator.followers) || 10000;
    const uname = newCreator.username.startsWith('@') ? newCreator.username : `@${newCreator.username}`;

    const res = await addInfluencer({
      name: newCreator.name.trim(),
      username: uname.trim(),
      category: newCreator.category,
      city: newCreator.city.trim() || 'Mumbai',
      starting_price: priceNum,
      startingPrice: priceNum,
      followers: follNum,
      followerCount: follNum,
      avatar: newCreator.avatar,
      bio: newCreator.bio.trim() || 'Professional content creator open for brand sponsorships.',
      verified: newCreator.verified
    });

    if (res && res.success) {
      setShowAddModal(false);
      setNewCreator({
        name: '',
        username: '',
        category: 'Fashion',
        city: 'Mumbai',
        starting_price: '10000',
        followers: '50000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        bio: '',
        verified: true
      });
      setToastMsg({ type: 'success', text: `✨ Creator "${newCreator.name}" added to marketplace!` });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCreator) return;

    const res = await updateInfluencer({
      ...editingCreator,
      starting_price: Number(editingCreator.starting_price) || 10000,
      followers: Number(editingCreator.followers) || 50000
    });

    if (res && res.success) {
      setEditingCreator(null);
      setToastMsg({ type: 'success', text: `✅ Creator "${editingCreator.name}" profile updated!` });
    }
  };

  const handleDelete = async (inf) => {
    if (window.confirm(`Are you sure you want to delete creator "${inf.name}" (${inf.username}) from the platform?`)) {
      await deleteInfluencer(inf.id);
      setToastMsg({ type: 'info', text: `🗑️ Creator "${inf.name}" deleted from database.` });
    }
  };

  const creatorList = influencers || [];

  const filtered = creatorList.filter(i => {
    const matchesCat = filterCat ? (i.category || '').toLowerCase() === filterCat.toLowerCase() : true;
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q || (
      (i.name || '').toLowerCase().includes(q) ||
      (i.username || '').toLowerCase().includes(q) ||
      (i.city || '').toLowerCase().includes(q) ||
      (i.category || '').toLowerCase().includes(q)
    );
    return matchesCat && matchesSearch;
  });

  const paginatedCreators = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic KPI Stats Computations
  const totalCreatorsCount = creatorList.length;
  const verifiedCount = creatorList.filter(i => i.verified).length;
  const avgStartingPrice = totalCreatorsCount > 0
    ? Math.round(creatorList.reduce((sum, i) => sum + (Number(i.starting_price) || 0), 0) / totalCreatorsCount)
    : 0;
  const avgFollowersK = totalCreatorsCount > 0
    ? Math.round(creatorList.reduce((sum, i) => sum + (Number(i.followers) || 0), 0) / totalCreatorsCount / 1000)
    : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 1100,
          background: toastMsg.type === 'success' ? '#065F46' : toastMsg.type === 'error' ? '#991B1B' : '#1E293B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 700,
          animation: 'fadeIn 0.25s ease'
        }}>
          {toastMsg.text}
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Influencer Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Live audit of creators, verification status toggle, rate cards, and profile registration.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} /> Add New Creator
        </button>
      </div>

      {/* KPI STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #6366F1' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Creators</span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>{totalCreatorsCount}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #10B981' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Verified Badges</span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>
            {verifiedCount} Active
          </h3>
        </div>
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #F59E0B' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Starting Rate</span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>₹{avgStartingPrice.toLocaleString()}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #EC4899' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Audience Reach</span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>{avgFollowersK}K</h3>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 'min(100%, 240px)', background: 'var(--bg-input)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search creator by name, username, city, or niche..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '0.86rem' }}
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>✕</button>
          )}
        </div>

        <select
          className="form-select"
          style={{ width: 'min(100%, 200px)', height: '38px', fontSize: '0.86rem' }}
          value={filterCat}
          onChange={(e) => {
            setFilterCat(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories ({(categories || []).length})</option>
          {(categories || []).map(c => (
            <option key={c.id || c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Creator</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Category</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>City</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Followers</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Starting Price</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Verification</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCreators.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No creators found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedCreators.map(inf => {
                  const followersFormatted = Number(inf.followers || 0) >= 1000000
                    ? `${(Number(inf.followers) / 1000000).toFixed(1)}M`
                    : `${(Number(inf.followers) / 1000).toFixed(0)}K`;

                  return (
                    <tr key={inf.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={inf.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={inf.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)', flexShrink: 0 }}
                          />
                          <div>
                            <div style={{ color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>{inf.name}</span>
                              {inf.verified && <ShieldCheck size={14} color="#10B981" title="Verified Creator" />}
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inf.username}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.74rem' }}>{inf.category}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', verticalAlign: 'middle' }}>{inf.city || 'India'}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)', fontWeight: 700, verticalAlign: 'middle' }}>{followersFormatted}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--accent-emerald)', fontWeight: 700, verticalAlign: 'middle' }}>₹{Number(inf.starting_price || 0).toLocaleString()}</td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => handleToggleVerify(inf)}
                          className={`btn btn-sm ${inf.verified ? 'badge-green' : 'btn-secondary'}`}
                          style={{ border: 'none', cursor: 'pointer', padding: '5px 10px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Click to toggle verification status"
                        >
                          <ShieldCheck size={13} /> {inf.verified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <Link to={`/influencer/${inf.id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.76rem' }} title="View Public Profile">
                            <Eye size={12} /> Profile
                          </Link>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                            onClick={() => setEditingCreator(inf)}
                            title="Edit Creator Details"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.76rem', color: '#EF4444' }}
                            onClick={() => handleDelete(inf)}
                            title="Delete Creator"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ADD NEW CREATOR MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '620px', width: '100%', padding: '24px', borderRadius: '18px', background: 'var(--bg-card)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--primary)" /> Add New Verified Creator
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Avatar File Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-input)', padding: '12px', borderRadius: '12px' }}>
                <img
                  src={newCreator.avatar}
                  alt="Avatar Preview"
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>Creator Avatar Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatarFileChange(e, false)}
                    className="form-input"
                    style={{ fontSize: '0.8rem', padding: '6px' }}
                  />
                  {uploadingAvatar && <span style={{ fontSize: '0.74rem', color: 'var(--primary)' }}>Uploading...</span>}
                </div>
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Riya Sen"
                    value={newCreator.name}
                    onChange={(e) => setNewCreator({ ...newCreator, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Username handle *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. @riya_fashion"
                    value={newCreator.username}
                    onChange={(e) => setNewCreator({ ...newCreator, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Niche Category</label>
                  <select
                    className="form-select"
                    value={newCreator.category}
                    onChange={(e) => setNewCreator({ ...newCreator, category: e.target.value })}
                  >
                    {(categories || []).map(c => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={newCreator.city}
                    onChange={(e) => setNewCreator({ ...newCreator, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Starting Price (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="1000"
                    placeholder="e.g. 15000"
                    value={newCreator.starting_price}
                    onChange={(e) => setNewCreator({ ...newCreator, starting_price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Followers Count *</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    min="100"
                    placeholder="e.g. 250000"
                    value={newCreator.followers}
                    onChange={(e) => setNewCreator({ ...newCreator, followers: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Creator Bio & Summary</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Short description for brand discovery..."
                  value={newCreator.bio}
                  onChange={(e) => setNewCreator({ ...newCreator, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="ver_checkbox"
                  checked={newCreator.verified}
                  onChange={(e) => setNewCreator({ ...newCreator, verified: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="ver_checkbox" style={{ fontSize: '0.86rem', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600 }}>
                  Grant Verified Blue Tick Badge Immediately
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Create Creator Account
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT CREATOR MODAL */}
      {editingCreator && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', width: '100%', padding: '24px', borderRadius: '18px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={18} color="var(--primary)" /> Edit Creator: {editingCreator.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCreator(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editingCreator.name}
                    onChange={(e) => setEditingCreator({ ...editingCreator, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Niche Category</label>
                  <select
                    className="form-select"
                    value={editingCreator.category}
                    onChange={(e) => setEditingCreator({ ...editingCreator, category: e.target.value })}
                  >
                    {(categories || []).map(c => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Starting Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={editingCreator.starting_price}
                    onChange={(e) => setEditingCreator({ ...editingCreator, starting_price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Followers Count</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={editingCreator.followers}
                    onChange={(e) => setEditingCreator({ ...editingCreator, followers: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">City / Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingCreator.city || ''}
                  onChange={(e) => setEditingCreator({ ...editingCreator, city: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Bio</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={editingCreator.bio || ''}
                  onChange={(e) => setEditingCreator({ ...editingCreator, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingCreator(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Update Creator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. BUSINESS & USER MANAGEMENT (DYNAMIC API & DB CONNECTED)                 */
/* -------------------------------------------------------------------------- */
export function UserMgmt() {
  const { users, bookings, updateUserStatus, addUser, deleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const itemsPerPage = 20;

  const [newUser, setNewUser] = useState({
    name: '',
    company: '',
    email: '',
    role: 'Brand Account',
    phone: '+91 98765 43210',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleToggleStatus = async (u) => {
    const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
    await updateUserStatus(u.id, nextStatus);
    setToastMsg({
      type: 'info',
      text: `Account for "${u.name}" (${u.company || 'User'}) set to ${nextStatus}.`
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const res = await addUser({
      name: newUser.name.trim(),
      company: newUser.company.trim() || 'Brand Enterprise',
      email: newUser.email.trim(),
      role: newUser.role,
      phone: newUser.phone.trim(),
      status: newUser.status,
      avatar: newUser.avatar,
      img: newUser.avatar
    });

    if (res && res.success) {
      setShowAddModal(false);
      setNewUser({
        name: '',
        company: '',
        email: '',
        role: 'Brand Account',
        phone: '+91 98765 43210',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      });
      setToastMsg({ type: 'success', text: `✨ Business client "${newUser.name}" registered!` });
    }
  };

  const handleDelete = async (u) => {
    if (window.confirm(`Are you sure you want to remove user "${u.name}" (${u.company})?`)) {
      await deleteUser(u.id);
      setToastMsg({ type: 'info', text: `🗑️ User "${u.name}" removed from database.` });
    }
  };

  const userList = users || [];

  const filtered = userList.filter(u => {
    const q = searchTerm.toLowerCase();
    return !q || (
      (u.name || '').toLowerCase().includes(q) ||
      (u.company || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q)
    );
  });

  const paginatedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic KPI Stats Computations
  const totalBrandsCount = userList.length;
  const activeCount = userList.filter(u => (u.status || 'Active').toLowerCase() === 'active').length;
  const totalSpentVolume = (bookings || [])
    .filter(b => b.status === 'accepted' || b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.budget) || 0), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 1100,
          background: toastMsg.type === 'success' ? '#065F46' : '#1E293B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 700,
          animation: 'fadeIn 0.25s ease'
        }}>
          {toastMsg.text}
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Business & Brand Users</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Manage corporate client accounts, agencies, booking volume, and account authorizations.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={15} /> Add Business User
        </button>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #8B5CF6' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Registered Accounts</span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>{totalBrandsCount}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #10B981' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Accounts</span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>{activeCount}</h3>
        </div>
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #F59E0B' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Platform Spent</span>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}>₹{totalSpentVolume.toLocaleString()}</h3>
        </div>
      </div>

      {/* SEARCH */}
      <div className="glass-panel" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-input)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <Search size={16} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search business by name, company, email, role, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', width: '100%', fontSize: '0.86rem' }}
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>✕</button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Business / User</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Company</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Email</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Account Type</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Campaigns</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Total Spent</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Status</th>
                <th style={{ padding: '12px 14px', verticalAlign: 'middle' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map(u => {
                  // Dynamically aggregate user bookings and spent volume
                  const userBookings = (bookings || []).filter(b =>
                    b.user_id == u.id ||
                    (b.user_email && b.user_email.toLowerCase() === (u.email || '').toLowerCase()) ||
                    (b.business_name && u.company && b.business_name.toLowerCase() === u.company.toLowerCase())
                  );
                  const userSpent = userBookings
                    .filter(b => b.status === 'accepted' || b.status === 'completed')
                    .reduce((sum, b) => sum + (Number(b.budget) || 0), 0);

                  const userStatus = u.status || 'Active';

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={u.avatar || u.img || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                            alt={u.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)', flexShrink: 0 }}
                          />
                          <div>
                            <span style={{ color: 'var(--text-main)', fontWeight: 700, display: 'block' }}>{u.name}</span>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ID #{u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', verticalAlign: 'middle', fontWeight: 600 }}>{u.company || 'Enterprise'}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', verticalAlign: 'middle' }}>{u.email}</td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{u.role || 'Brand Account'}</span>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-main)', fontWeight: 700, verticalAlign: 'middle' }}>
                        {userBookings.length} {userBookings.length === 1 ? 'Booking' : 'Bookings'}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--accent-emerald)', fontWeight: 700, verticalAlign: 'middle' }}>
                        ₹{userSpent.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <span className={`badge ${userStatus === 'Active' ? 'badge-green' : 'badge-amber'}`}>
                          {userStatus.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            className={`btn btn-sm ${userStatus === 'Active' ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ padding: '4px 10px', fontSize: '0.76rem', fontWeight: 600 }}
                            onClick={() => handleToggleStatus(u)}
                            title={userStatus === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                          >
                            {userStatus === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.76rem', color: '#EF4444' }}
                            onClick={() => handleDelete(u)}
                            title="Delete User"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ADD BUSINESS USER MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '540px', width: '100%', padding: '24px', borderRadius: '18px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--primary)" /> Register Business Client Account
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Contact Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Company / Brand *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Acme Corp"
                    value={newUser.company}
                    onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Official Work Email *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. marketing@acmecorp.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Account Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="Brand Account">Brand Account</option>
                    <option value="Agency">Agency</option>
                    <option value="Business Enterprise">Business Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} /> Register Business Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. CATEGORY MANAGEMENT                                                     */
/* -------------------------------------------------------------------------- */
export function CategoryMgmt() {
  const { categories, addCategory, updateCategory, deleteCategory, influencers } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setFormError('Category name must be at least 2 characters.');
      return;
    }

    if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setFormError('A category with this name already exists.');
      return;
    }

    setSaving(true);
    const res = await addCategory({ name: trimmedName, description: desc.trim(), icon: 'Star' });
    setSaving(false);

    if (res && res.success) {
      setSuccessMsg(`Category "${trimmedName}" created successfully!`);
      setName('');
      setDesc('');
      setShowAdd(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setFormError(res?.message || 'Failed to create category.');
    }
  };

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
    setFormError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    setFormError('');

    const trimmedName = editName.trim();
    if (trimmedName.length < 2) {
      setFormError('Category name must be at least 2 characters.');
      return;
    }

    if (categories.some(c => c.id !== editingCategory.id && c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setFormError('Another category with this name already exists.');
      return;
    }

    setSaving(true);
    const res = await updateCategory({
      id: editingCategory.id,
      name: trimmedName,
      description: editDesc.trim(),
      icon: editingCategory.icon || 'Star',
      status: editingCategory.status || 'active'
    });
    setSaving(false);

    if (res && res.success) {
      setSuccessMsg(`Category "${trimmedName}" updated successfully!`);
      setEditingCategory(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setFormError(res?.message || 'Failed to update category.');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Are you sure you want to delete the "${cat.name}" category? Creators in this category may need reassignment.`)) {
      return;
    }

    setSaving(true);
    const res = await deleteCategory(cat.id);
    setSaving(false);

    if (res && res.success) {
      setSuccessMsg(`Category "${cat.name}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setFormError(res?.message || 'Failed to delete category.');
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Niche Categories Catalog</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Organize and curate content niches for brand discovery and creator indexing.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', width: '180px' }}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => { setShowAdd(!showAdd); setEditingCategory(null); setFormError(''); }}>
            <Plus size={14} /> Add New Category
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {formError && (
        <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} /> {formError}
        </div>
      )}

      {/* ADD CATEGORY FORM */}
      {showAdd && (
        <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '20px', background: 'var(--bg-input)', border: '1px solid var(--primary)' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} color="var(--primary)" /> Add Niche Category
          </h4>

          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Category Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Category Name (e.g. Travel, Fitness)"
                required
                minLength={2}
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Catalog Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="Short description for explore filters"
                maxLength={200}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              <Check size={13} /> {saving ? 'Saving...' : 'Save Category'}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setShowAdd(false); setFormError(''); }}>Cancel</button>
          </div>
        </form>
      )}

      {/* EDIT CATEGORY MODAL / INLINE FORM */}
      {editingCategory && (
        <form onSubmit={handleSaveEdit} className="glass-panel" style={{ padding: '20px', background: 'var(--bg-input)', border: '1px solid var(--accent-pink)' }}>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Edit size={16} color="var(--accent-pink)" /> Edit Category: {editingCategory.name}
          </h4>

          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Category Name</label>
              <input
                type="text"
                className="form-input"
                required
                minLength={2}
                maxLength={50}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Catalog Description</label>
              <input
                type="text"
                className="form-input"
                maxLength={200}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              <Check size={13} /> {saving ? 'Saving...' : 'Update Category'}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditingCategory(null); setFormError(''); }}>Cancel</button>
          </div>
        </form>
      )}

      {/* CATEGORIES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '18px' }}>
        {filtered.map((c, idx) => {
          const count = (influencers || []).filter(i => (i.category || '').toLowerCase() === (c.name || '').toLowerCase() || i.categoryId === c.id).length;
          return (
            <div key={c.id || idx} className="glass-panel glass-panel-hover" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px', borderTop: '3px solid var(--primary)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1.1rem' }}>{c.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.72rem', padding: '2px 7px' }}>
                      {count} {count === 1 ? 'Creator' : 'Creators'}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{c.description || 'Active Content Niche'}</p>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>ACTIVE</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => startEdit(c)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Edit Category"
                  >
                    <Edit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Delete Category"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. BOOKING MANAGEMENT & EXPORT (DYNAMIC ESCROW & ACTIONS)                  */
/* -------------------------------------------------------------------------- */
export function BookingMgmt() {
  const { bookings, updateBookingStatus } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMsg, setToastMsg] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 20;

  // Auto-dismiss toast notification after 4 seconds
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const handleAction = async (b, newStatus) => {
    setActionLoadingId(b.id);
    const actionLabel = newStatus === 'accepted'
      ? 'Approve Campaign'
      : newStatus === 'completed'
        ? 'Release Escrow Funds'
        : 'Process Refund';

    // Quick confirmation for releasing escrow or refunding
    if (newStatus === 'completed') {
      const confirmRelease = window.confirm(`Release escrow funds of ₹${(b.budget || 0).toLocaleString()} to creator "${b.influencer_name}"?`);
      if (!confirmRelease) {
        setActionLoadingId(null);
        return;
      }
    } else if (newStatus === 'rejected') {
      const confirmRefund = window.confirm(`Process refund of ₹${(b.budget || 0).toLocaleString()} back to business "${b.business_name}"?`);
      if (!confirmRefund) {
        setActionLoadingId(null);
        return;
      }
    }

    const res = await updateBookingStatus(b.id, newStatus);
    setActionLoadingId(null);

    if (newStatus === 'accepted') {
      setToastMsg({ type: 'success', text: `✅ Campaign #${b.id} "${b.campaign_name}" approved!` });
    } else if (newStatus === 'completed') {
      setToastMsg({ type: 'success', text: `💰 Escrow funds of ₹${(b.budget || 0).toLocaleString()} released to ${b.influencer_name}!` });
    } else if (newStatus === 'rejected') {
      setToastMsg({ type: 'info', text: `↩️ Refund of ₹${(b.budget || 0).toLocaleString()} processed for ${b.business_name}.` });
    }
  };

  // Filter Bookings
  const filteredBookings = (bookings || []).filter(b => {
    const s = (b.status || 'pending').toLowerCase();
    if (statusFilter !== 'all' && s !== statusFilter) return false;
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matchId = String(b.id).includes(query);
      const matchCamp = (b.campaign_name || '').toLowerCase().includes(query);
      const matchBiz = (b.business_name || '').toLowerCase().includes(query);
      const matchInf = (b.influencer_name || '').toLowerCase().includes(query);
      return matchId || matchCamp || matchBiz || matchInf;
    }
    return true;
  });

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Escrow Stats Computations
  const totalEscrowHeld = (bookings || [])
    .filter(b => b.status === 'accepted')
    .reduce((sum, b) => sum + (Number(b.budget) || 0), 0);
  const totalFundsReleased = (bookings || [])
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.budget) || 0), 0);
  const pendingCount = (bookings || []).filter(b => b.status === 'pending').length;

  const exportCSV = () => {
    const headers = "ID,Campaign,Business,Influencer,Date,Budget,EscrowStatus\n";
    const rows = filteredBookings.map(b => `${b.id},"${b.campaign_name || ''}","${b.business_name || ''}","${b.influencer_name || ''}",${b.date || ''},${b.budget || 0},${b.status || 'pending'}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign_bookings_escrow_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>

      {/* TOAST FEEDBACK NOTIFICATION */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 1100,
          background: toastMsg.type === 'success' ? '#065F46' : '#1E293B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.92rem',
          fontWeight: 700,
          animation: 'fadeIn 0.25s ease'
        }}>
          {toastMsg.text}
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', padding: '0 4px', fontSize: '1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Campaign Bookings & Escrow</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Monitor master booking status, approve campaigns, release escrow funds, and export reports.</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={14} /> Export CSV Report ({filteredBookings.length})
        </button>
      </div>

      {/* QUICK SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Total Bookings</span>
          <strong style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 800 }}>{(bookings || []).length}</strong>
        </div>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Active Escrow Held</span>
          <strong style={{ fontSize: '1.4rem', color: 'var(--accent-amber)', fontWeight: 800 }}>₹{totalEscrowHeld.toLocaleString()}</strong>
        </div>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Escrow Released</span>
          <strong style={{ fontSize: '1.4rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>₹{totalFundsReleased.toLocaleString()}</strong>
        </div>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Pending Approval</span>
          <strong style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800 }}>{pendingCount} Action Required</strong>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glass-panel" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${(bookings || []).length})` },
            { id: 'pending', label: `Pending (${(bookings || []).filter(b => b.status === 'pending').length})` },
            { id: 'accepted', label: `In Escrow (${(bookings || []).filter(b => b.status === 'accepted').length})` },
            { id: 'completed', label: `Released (${(bookings || []).filter(b => b.status === 'completed').length})` },
            { id: 'rejected', label: `Refunded (${(bookings || []).filter(b => b.status === 'rejected' || b.status === 'cancelled').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`btn btn-sm ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px', minWidth: '240px' }}>
          <Search size={15} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search campaign, brand, creator..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.84rem', outline: 'none', width: '100%' }}
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div className="table-responsive-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Campaign</th>
                <th style={{ padding: '12px' }}>Business</th>
                <th style={{ padding: '12px' }}>Influencer</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Budget</th>
                <th style={{ padding: '12px' }}>Escrow Status</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No bookings found matching the current filter.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map(b => {
                  const isLoadingThis = actionLoadingId === b.id;
                  const st = (b.status || 'pending').toLowerCase();
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', color: 'var(--primary)', fontWeight: 600 }}>#{b.id}</td>
                      <td style={{ padding: '12px', color: 'var(--text-main)', fontWeight: 700 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{b.campaign_name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(b)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
                            title="View Campaign Details"
                          >
                            <Info size={14} />
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{b.business_name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-main)', fontWeight: 600 }}>{b.influencer_name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{b.date || b.booking_date || 'Upcoming'}</td>
                      <td style={{ padding: '12px', color: 'var(--accent-emerald)', fontWeight: 700 }}>₹{(Number(b.budget) || 0).toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${st === 'accepted' ? 'badge-green' : st === 'pending' ? 'badge-amber' : st === 'completed' ? 'badge-blue' : 'badge-amber'}`}>
                          {st === 'accepted' ? 'ACCEPTED (IN ESCROW)' : st === 'completed' ? 'COMPLETED (RELEASED)' : st === 'rejected' ? 'REFUNDED' : 'PENDING'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {st === 'pending' && (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ padding: '5px 12px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                                onClick={() => handleAction(b, 'accepted')}
                                disabled={isLoadingThis}
                                title="Approve Campaign Request"
                              >
                                {isLoadingThis ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />} Approve
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#EF4444', fontWeight: 600 }}
                                onClick={() => handleAction(b, 'rejected')}
                                disabled={isLoadingThis}
                                title="Reject Request"
                              >
                                <X size={12} /> Reject
                              </button>
                            </>
                          )}

                          {st === 'accepted' && (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ padding: '5px 12px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', color: '#FFF', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                                onClick={() => handleAction(b, 'completed')}
                                disabled={isLoadingThis}
                                title="Release Escrow Funds to Creator"
                              >
                                {isLoadingThis ? <RefreshCw size={13} className="animate-spin" /> : <DollarSign size={13} />} Release Escrow
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '5px 10px', fontSize: '0.78rem', color: '#EF4444', fontWeight: 600 }}
                                onClick={() => handleAction(b, 'rejected')}
                                disabled={isLoadingThis}
                                title="Refund Payment to Client"
                              >
                                Refund
                              </button>
                            </>
                          )}

                          {st === 'completed' && (
                            <span className="badge badge-green" style={{ fontSize: '0.76rem', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} /> ESCROW RELEASED
                            </span>
                          )}

                          {(st === 'rejected' || st === 'cancelled') && (
                            <span className="badge badge-amber" style={{ fontSize: '0.76rem', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={13} /> REFUNDED
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredBookings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* CAMPAIGN DETAILS MODAL */}
      {selectedBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', width: '100%', padding: '24px', borderRadius: '18px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-purple">#{selectedBooking.id}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                  {selectedBooking.campaign_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Business / Client</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.94rem' }}>{selectedBooking.business_name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Influencer Creator</span>
                <strong style={{ color: 'var(--primary)', fontSize: '0.94rem' }}>{selectedBooking.influencer_name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Deliverable Type</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.94rem' }}>{selectedBooking.promotion_type || 'Instagram Reel'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Campaign Date</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.94rem' }}>{selectedBooking.date || selectedBooking.booking_date || 'Upcoming'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Offered Budget</span>
                <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>₹{(Number(selectedBooking.budget) || 0).toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Escrow Status</span>
                <strong style={{ color: 'var(--accent-amber)', fontSize: '0.94rem', textTransform: 'uppercase' }}>{selectedBooking.status}</strong>
              </div>
            </div>

            {selectedBooking.description && (
              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Campaign Brief:</strong>
                {selectedBooking.description}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {selectedBooking.status === 'pending' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    handleAction(selectedBooking, 'accepted');
                    setSelectedBooking(null);
                  }}
                >
                  <Check size={14} /> Approve Campaign
                </button>
              )}
              {selectedBooking.status === 'accepted' && (
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none' }}
                  onClick={() => {
                    handleAction(selectedBooking, 'completed');
                    setSelectedBooking(null);
                  }}
                >
                  <DollarSign size={14} /> Release Escrow Funds
                </button>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. ADMIN MASTER AVAILABILITY                                               */
/* -------------------------------------------------------------------------- */
export function AdminAvailabilityMgmt() {
  const { influencers } = useData();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>
      <div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Master Creator Availability</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Overview of active calendar slots, vacation status, and booking readiness of creators.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '18px' }}>
        {influencers.map(inf => (
          <div key={inf.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={inf.avatar} alt={inf.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ color: 'var(--text-main)', fontWeight: 700 }}>{inf.name}</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inf.category} • {inf.city}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-input)', borderRadius: '8px', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Today's Status:</span>
              <span className="badge badge-green">AVAILABLE TODAY</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. ADMIN SYSTEM SETTINGS & ASSET MANAGER                                   */
/* -------------------------------------------------------------------------- */
export function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useData();
  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'hero' | 'contact' | 'policies'

  // Form State initialized with current siteSettings
  const [formData, setFormData] = useState({
    site_name: siteSettings?.site_name || 'InfluencerConnect',
    site_tagline: siteSettings?.site_tagline || "India's #1 Verified Creator Marketplace",
    logo_url: siteSettings?.logo_url || '',
    commission_fee: siteSettings?.commission_fee !== undefined ? String(siteSettings.commission_fee) : '10',
    hero_badge: siteSettings?.hero_badge || "⚡ India's #1 Verified Creator Marketplace",
    hero_title: siteSettings?.hero_title || 'Connect & Book Top Influencers for Your Brand Campaigns',
    hero_subtitle: siteSettings?.hero_subtitle || 'Discover hand-vetted Instagram, YouTube, and multi-channel creators. Transparent fixed rate cards, verified audience analytics, and seamless instant booking.',
    hero_image_url: siteSettings?.hero_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
    about_story_image: siteSettings?.about_story_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    contact_email: siteSettings?.contact_email || 'support@influencerconnect.com',
    contact_phone: siteSettings?.contact_phone || '+91 98765 43210',
    contact_address: siteSettings?.contact_address || 'Tech Park Tower B, Suite 402, Bangalore, India',
    office_hours: siteSettings?.office_hours || 'Mon - Sat: 9:00 AM - 7:00 PM IST',
    footer_about: siteSettings?.footer_about || 'The premier zero-commission marketplace connecting innovative brands directly with high-impact social media creators.',
    cta_title: siteSettings?.cta_title || 'Are You a Creator or Influencer?',
    cta_subtitle: siteSettings?.cta_subtitle || 'Monetize your audience with premium brand deals. Set your fixed rates, receive pre-paid bookings, and manage all your sponsorships in one place.',
    terms_content: siteSettings?.terms_content || 'Welcome to InfluencerConnect. By accessing or using our platform, you agree to comply with our terms and guidelines for brands and creators.',
    privacy_content: siteSettings?.privacy_content || 'Your privacy is paramount. InfluencerConnect ensures secure handling of user accounts, transactions, verified analytics, and campaign briefs.'
  });

  const [uploadingField, setUploadingField] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync if siteSettings changes from remote
  useEffect(() => {
    if (siteSettings) {
      setFormData(prev => ({
        ...prev,
        ...siteSettings,
        commission_fee: siteSettings.commission_fee !== undefined ? String(siteSettings.commission_fee) : prev.commission_fee
      }));
    }
  }, [siteSettings]);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleFileUpload = async (e, field, folder = 'assets') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    setError('');
    try {
      const res = await apiService.uploadImage(file, folder);
      if (res && res.url) {
        handleChange(field, res.url);
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } else {
        setError(res?.message || 'Failed to upload image file.');
      }
    } catch (err) {
      setError('Error uploading image file. Please try again.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const feeNum = Number(formData.commission_fee);
    if (isNaN(feeNum) || feeNum < 0 || feeNum > 100) {
      setError('Commission fee must be a valid percentage between 0% and 100%.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        commission_fee: feeNum
      };
      const res = await updateSiteSettings(payload);
      if (res && res.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setError(res?.message || 'Failed to save settings.');
      }
    } catch (err) {
      setError('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all website branding, images, and text assets to platform default values?')) {
      const defaults = {
        site_name: 'InfluencerConnect',
        site_tagline: "India's #1 Verified Creator Marketplace",
        logo_url: '',
        commission_fee: '10',
        hero_badge: "⚡ India's #1 Verified Creator Marketplace",
        hero_title: 'Connect & Book Top Influencers for Your Brand Campaigns',
        hero_subtitle: 'Discover hand-vetted Instagram, YouTube, and multi-channel creators. Transparent fixed rate cards, verified audience analytics, and seamless instant booking.',
        hero_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
        about_story_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
        contact_email: 'support@influencerconnect.com',
        contact_phone: '+91 98765 43210',
        contact_address: 'Tech Park Tower B, Suite 402, Bangalore, India',
        office_hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
        footer_about: 'The premier zero-commission marketplace connecting innovative brands directly with high-impact social media creators.',
        cta_title: 'Are You a Creator or Influencer?',
        cta_subtitle: 'Monetize your audience with premium brand deals. Set your fixed rates, receive pre-paid bookings, and manage all your sponsorships in one place.',
        terms_content: 'Welcome to InfluencerConnect. By accessing or using our platform, you agree to comply with our terms and guidelines for brands and creators.',
        privacy_content: 'Your privacy is paramount. InfluencerConnect ensures secure handling of user accounts, transactions, verified analytics, and campaign briefs.'
      };
      setFormData(defaults);
      updateSiteSettings({ ...defaults, commission_fee: 10 });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }
  };

  const tabs = [
    { id: 'branding', label: 'Branding & Logo', icon: Sparkles },
    { id: 'hero', label: 'Hero & Images', icon: ImageIcon },
    { id: 'contact', label: 'Contact & Support', icon: Phone },
    { id: 'policies', label: 'CTA & Legal', icon: FileText }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Platform Settings & Dynamic Assets</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Customize all website images, hero showcase banners, branding logos, contact info, and legal terms in real-time.
          </p>
        </div>
        <button
          type="button"
          onClick={resetToDefaults}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
        >
          <RefreshCw size={14} /> Reset Defaults
        </button>
      </div>

      {saved && (
        <div style={{ padding: '14px 18px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <CheckCircle2 size={18} /> Website assets and settings updated successfully across all pages!
        </div>
      )}

      {error && (
        <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave}>

        {/* TAB 1: BRANDING & LOGO */}
        {activeTab === 'branding' && (
          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--primary)" /> Brand Identity & Logo
            </h3>

            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Platform Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  minLength={2}
                  maxLength={80}
                  value={formData.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  placeholder="e.g. InfluencerConnect"
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>Appears in header, footer, and page title bars.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Site Tagline / Slogan</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.site_tagline}
                  onChange={(e) => handleChange('site_tagline', e.target.value)}
                  placeholder="e.g. India's #1 Verified Creator Marketplace"
                />
              </div>
            </div>

            {/* AUTOMATIC LOGO FILE UPLOAD DROPZONE */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Brand Logo Image File</span>
                {uploadingField === 'logo_url' && (
                  <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>Uploading image...</span>
                )}
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'center' }}>
                {/* Upload box */}
                <div style={{ padding: '20px', border: '2px dashed var(--primary)', borderRadius: '12px', background: 'var(--bg-input)', textAlign: 'center', position: 'relative' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo_url', 'branding')}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 5 }}
                    title="Click or drag an image file to upload"
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)', display: 'block' }}>
                        {uploadingField === 'logo_url' ? 'Uploading Logo...' : 'Click or Drag Logo File Here'}
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Supports PNG, SVG, JPG, WEBP (transparent background recommended)</span>
                    </div>
                  </div>
                </div>

                {/* Live Logo Preview Box */}
                <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Header Logo Preview:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo Preview" style={{ height: '40px', maxWidth: '140px', objectFit: 'contain', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={20} color="#FFF" />
                      </div>
                    )}
                    <h3 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                      {formData.site_name || 'InfluencerConnect'}
                    </h3>
                  </div>
                  {formData.logo_url && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleChange('logo_url', '')} style={{ alignSelf: 'flex-start', fontSize: '0.75rem', padding: '3px 8px' }}>
                      Reset to Default Icon
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Platform Service Commission Fee (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="form-input"
                required
                value={formData.commission_fee}
                onChange={(e) => handleChange('commission_fee', e.target.value)}
                style={{ maxWidth: '240px' }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: HERO & IMAGES */}
        {activeTab === 'hero' && (
          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={20} color="var(--primary)" /> Hero Section & Visual Image Assets
            </h3>

            <div className="form-group">
              <label className="form-label">Hero Feature Pill Tagline</label>
              <input
                type="text"
                className="form-input"
                value={formData.hero_badge}
                onChange={(e) => handleChange('hero_badge', e.target.value)}
                placeholder="⚡ India's #1 Verified Creator Marketplace"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Main Heading (H1)</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.hero_title}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                placeholder="Connect & Book Top Influencers for Your Brand Campaigns"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Subtitle Paragraph</label>
              <textarea
                className="form-input"
                rows={3}
                value={formData.hero_subtitle}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                placeholder="Discover hand-vetted Instagram, YouTube, and multi-channel creators..."
              />
            </div>

            {/* DUAL AUTOMATIC FILE UPLOADS: HERO IMAGE & ABOUT US IMAGE */}
            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

              {/* 1. Hero Right Showcase Image File Upload */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Hero Showcase Image</span>
                  {uploadingField === 'hero_image_url' && (
                    <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>Uploading...</span>
                  )}
                </label>

                {/* Upload Drop Box */}
                <div style={{ padding: '16px', border: '2px dashed var(--primary)', borderRadius: '12px', background: 'var(--bg-input)', textAlign: 'center', position: 'relative' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'hero_image_url', 'hero')}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 5 }}
                    title="Click or drag to upload Hero Image file"
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                    <Upload size={22} color="var(--primary)" />
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)', display: 'block' }}>
                        {uploadingField === 'hero_image_url' ? 'Uploading Image...' : 'Upload Hero Image File'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click or drag & drop high-res image</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                {formData.hero_image_url && (
                  <div style={{ marginTop: '4px', borderRadius: '12px', overflow: 'hidden', height: '170px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <img
                      src={formData.hero_image_url}
                      alt="Hero Showcase Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900'; }}
                    />
                    <div style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(0,0,0,0.75)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', color: '#FFF', fontWeight: 600 }}>
                      ⚡ Live Hero Showcase Preview
                    </div>
                  </div>
                )}
              </div>

              {/* 2. About Us Story Photo File Upload */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>About Us Story Photo</span>
                  {uploadingField === 'about_story_image' && (
                    <span style={{ color: 'var(--accent-pink)', fontSize: '0.8rem', fontWeight: 600 }}>Uploading...</span>
                  )}
                </label>

                {/* Upload Drop Box */}
                <div style={{ padding: '16px', border: '2px dashed var(--accent-pink)', borderRadius: '12px', background: 'var(--bg-input)', textAlign: 'center', position: 'relative' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'about_story_image', 'about')}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 5 }}
                    title="Click or drag to upload About Us Image file"
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                    <Upload size={22} color="var(--accent-pink)" />
                    <div>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)', display: 'block' }}>
                        {uploadingField === 'about_story_image' ? 'Uploading Photo...' : 'Upload About Us Photo File'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Click or drag & drop team/story photo</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                {formData.about_story_image && (
                  <div style={{ marginTop: '4px', borderRadius: '12px', overflow: 'hidden', height: '170px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <img
                      src={formData.about_story_image}
                      alt="About Story Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800'; }}
                    />
                    <div style={{ position: 'absolute', bottom: '6px', left: '8px', background: 'rgba(0,0,0,0.75)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', color: '#FFF', fontWeight: 600 }}>
                      ✨ Live /about Photo Preview
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: CONTACT & SUPPORT */}
        {activeTab === 'contact' && (
          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={20} color="var(--primary)" /> Contact Details & Office Location
            </h3>

            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Support Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  placeholder="support@influencerconnect.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Support Phone Hotline</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Headquarters Physical Address</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.contact_address}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  placeholder="Tech Park Tower B, Suite 402, Bangalore, India"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Office Hours</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.office_hours}
                  onChange={(e) => handleChange('office_hours', e.target.value)}
                  placeholder="Mon - Sat: 9:00 AM - 7:00 PM IST"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Footer Brand Bio / Summary</label>
              <textarea
                className="form-input"
                rows={3}
                value={formData.footer_about}
                onChange={(e) => handleChange('footer_about', e.target.value)}
                placeholder="The premier zero-commission marketplace connecting innovative brands..."
              />
            </div>
          </div>
        )}

        {/* TAB 4: CTA & POLICIES */}
        {activeTab === 'policies' && (
          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--primary)" /> Call to Action Banner & Legal Policies
            </h3>

            <div className="form-group">
              <label className="form-label">Bottom CTA Banner Title</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.cta_title}
                onChange={(e) => handleChange('cta_title', e.target.value)}
                placeholder="Are You a Creator or Influencer?"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bottom CTA Banner Subtitle</label>
              <textarea
                className="form-input"
                rows={2}
                value={formData.cta_subtitle}
                onChange={(e) => handleChange('cta_subtitle', e.target.value)}
                placeholder="Monetize your audience with premium brand deals..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Terms of Service Content</label>
              <textarea
                className="form-input"
                rows={4}
                value={formData.terms_content}
                onChange={(e) => handleChange('terms_content', e.target.value)}
                placeholder="Terms and conditions text..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Privacy Policy Content</label>
              <textarea
                className="form-input"
                rows={4}
                value={formData.privacy_content}
                onChange={(e) => handleChange('privacy_content', e.target.value)}
                placeholder="Privacy policy details..."
              />
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px 32px', fontSize: '0.96rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={18} /> {loading ? 'Saving Changes...' : 'Save All Website Settings & Assets'}
          </button>
        </div>

      </form>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. DYNAMIC FINANCIAL REPORTS & AUDIT LEDGER (/admin/reports)                */
/* -------------------------------------------------------------------------- */
export function AdminReportsPage() {
  const { siteSettings } = useData();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await apiService.getFinancialReports({
        timeframe,
        status: statusFilter,
        search: searchTerm
      });
      if (res && res.status === 'success') {
        setReportData(res);
      }
    } catch (err) {
      console.error('Failed to fetch financial reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeframe, statusFilter]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchReports();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Lock body scroll when Audit Modal is open so the background page NEVER scrolls
  useEffect(() => {
    if (selectedTx) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [selectedTx]);

  const metrics = reportData?.metrics || {
    total_gmv: 0,
    platform_commission: 0,
    commission_rate_percent: 10,
    escrow_held: 0,
    escrow_released: 0,
    creator_disbursed: 0,
    escrow_refunded: 0,
    total_deals_count: 0,
    avg_deal_size: 0,
    settlement_rate_percent: 0
  };

  const ledger = reportData?.ledger || [];
  const monthlyTrend = reportData?.monthly_trend || [];
  const categoryBreakdown = reportData?.category_breakdown || [];
  const topCreators = reportData?.top_creators || [];
  const topBrands = reportData?.top_brands || [];

  const paginatedLedger = ledger.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportCSV = () => {
    const headers = "S_No,Campaign_Name,Brand_Client,Creator,Deal_Budget,Platform_Fee,Creator_Net,Status,Date,Settlement_Status\n";
    const rows = ledger.map((item, idx) => 
      `${idx + 1},"${(item.campaign_name || '').replace(/"/g, '""')}","${(item.business_name || '').replace(/"/g, '""')}","${(item.influencer_name || '').replace(/"/g, '""')}",${item.budget},${item.platform_fee},${item.creator_net},${item.status},${item.date},${item.settlement_status}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial_report_audit_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
              Financial Reports & Platform Analytics
            </h1>
            <span className="badge badge-purple" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} /> Live API Dynamic
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Audited financial settlement ledger, platform commission metrics, escrow custody, and category revenue performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            type="button"
            className="btn btn-secondary btn-sm" 
            onClick={fetchReports} 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Refresh Financial API Data"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> {loading ? 'Syncing...' : 'Refresh'}
          </button>
          <button 
            type="button"
            className="btn btn-secondary btn-sm" 
            onClick={() => window.print()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Print Financial Statement"
          >
            <FileText size={14} /> Print Statement
          </button>
          <button 
            type="button"
            className="btn btn-primary btn-sm" 
            onClick={exportCSV} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <Download size={14} /> Export Audit CSV ({ledger.length})
          </button>
        </div>
      </div>

      {/* TIMEFRAME FILTER BAR */}
      <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Time Period:</span>
          {[
            { id: 'all', label: 'All Time' },
            { id: 'year', label: 'This Year' },
            { id: '90days', label: 'Past 90 Days' },
            { id: '30days', label: 'Past 30 Days' },
            { id: '7days', label: 'Past 7 Days' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setTimeframe(tab.id);
                setCurrentPage(1);
              }}
              className={`btn btn-sm ${timeframe === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Active Commission Rate: <strong style={{ color: 'var(--primary)' }}>{metrics.commission_rate_percent}%</strong> (Configured in Settings)
        </div>
      </div>

      {/* TOP STATS CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
        
        {/* Card 1: Gross Transaction Volume */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '3px solid #6366F1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Gross Merchandise Value (GMV)</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} color="#6366F1" />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 800 }}>
            ₹{metrics.total_gmv.toLocaleString()}
          </strong>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Across {metrics.total_deals_count} verified campaign bookings
          </span>
        </div>

        {/* Card 2: Net Platform Commission */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '3px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Net Platform Revenue</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#10B981" />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>
            ₹{metrics.platform_commission.toLocaleString()}
          </strong>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            {metrics.commission_rate_percent}% platform fee on held & released deals
          </span>
        </div>

        {/* Card 3: Active Escrow in Custody */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '3px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Active Escrow In Custody</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="#F59E0B" />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: 'var(--accent-amber)', fontWeight: 800 }}>
            ₹{metrics.escrow_held.toLocaleString()}
          </strong>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Funds securely locked awaiting campaign deliverable signoff
          </span>
        </div>

        {/* Card 4: Disbursed to Creators */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '3px solid #EC4899' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Disbursed to Creators</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} color="#EC4899" />
            </div>
          </div>
          <strong style={{ fontSize: '1.75rem', color: '#EC4899', fontWeight: 800 }}>
            ₹{metrics.creator_disbursed.toLocaleString()}
          </strong>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Net funds released directly to verified creator payouts
          </span>
        </div>

      </div>

      {/* ANALYTICS SECTION: REVENUE BREAKDOWN & CATEGORY PERFORMANCE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '18px' }}>
        
        {/* Category Performance Breakdown */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
              Category Transaction Distribution
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Volume Share</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categoryBreakdown.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', textAlign: 'center', padding: '20px 0' }}>No category transactions recorded in this period.</p>
            ) : (
              categoryBreakdown.map((cat, idx) => {
                const totalVol = Math.max(1, metrics.total_gmv);
                const percent = Math.min(100, Math.round((cat.volume / totalVol) * 100));
                const colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
                const col = colors[idx % colors.length];

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{cat.category} ({cat.count} deals)</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>₹{cat.volume.toLocaleString()} ({percent}%)</strong>
                    </div>
                    <div style={{ height: '7px', width: '100%', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: col, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Earners & Spenders Leaderboard */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
              Top Earning Creators & Spenders
            </h3>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Leaderboard</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Top Creators */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Top Creators (Net Payout)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topCreators.slice(0, 4).map((cr, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', background: 'var(--bg-input)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)' }}>#{idx + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 700 }}>{cr.name}</span>
                    </div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--accent-emerald)' }}>₹{cr.total_earned.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Brands */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Top Brands (Total Spend)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topBrands.slice(0, 4).map((br, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', background: 'var(--bg-input)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-amber)' }}>#{idx + 1}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 700 }}>{br.name}</span>
                    </div>
                    <strong style={{ fontSize: '0.84rem', color: 'var(--text-main)' }}>₹{br.total_spent.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AUDIT TRANSACTION LEDGER TABLE */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        
        {/* Table Filter Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
              Audited Financial Transaction Ledger
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: '2px 0 0 0' }}>
              Full transaction log with deal amounts, platform commission deductions, and escrow settlements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'all', label: 'All Statuses' },
                { id: 'accepted', label: 'In Escrow' },
                { id: 'completed', label: 'Disbursed' },
                { id: 'rejected', label: 'Refunded' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`btn btn-sm ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '5px 10px', minWidth: '220px' }}>
              <Search size={14} color="var(--text-dim)" />
              <input 
                type="text" 
                placeholder="Search transaction..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.82rem', outline: 'none', width: '100%' }}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>✕</button>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle', width: '70px' }}>S.No</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Campaign</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Brand Client</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Creator</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Deal Budget</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Fee ({metrics.commission_rate_percent}%)</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Net Creator Payout</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Date</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Settlement Status</th>
                <th style={{ padding: '14px 16px', verticalAlign: 'middle' }}>Audit Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                    Loading financial records from API...
                  </td>
                </tr>
              ) : paginatedLedger.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No financial transaction records found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLedger.map((item, idx) => {
                  const serialNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '13px 16px', verticalAlign: 'middle' }}>
                        <strong style={{ color: 'var(--primary)', fontSize: '0.88rem' }}>#{serialNumber}</strong>
                      </td>
                      <td style={{ padding: '13px 16px', color: 'var(--text-main)', fontWeight: 700, verticalAlign: 'middle' }}>
                        {item.campaign_name}
                      </td>
                      <td style={{ padding: '13px 16px', color: 'var(--text-muted)', verticalAlign: 'middle' }}>
                        {item.business_name}
                      </td>
                      <td style={{ padding: '13px 16px', color: 'var(--primary)', fontWeight: 600, verticalAlign: 'middle' }}>
                        {item.influencer_name}
                      </td>
                      <td style={{ padding: '13px 16px', color: 'var(--text-main)', fontWeight: 800, verticalAlign: 'middle' }}>
                        ₹{item.budget.toLocaleString()}
                      </td>
                      <td style={{ padding: '13px 16px', color: 'var(--accent-emerald)', fontWeight: 700, verticalAlign: 'middle' }}>
                        +₹{item.platform_fee.toLocaleString()}
                      </td>
                      <td style={{ padding: '13px 16px', color: 'var(--accent-amber)', fontWeight: 700, verticalAlign: 'middle' }}>
                        ₹{item.creator_net.toLocaleString()}
                      </td>
                      <td style={{ padding: '13px 16px', color: 'var(--text-muted)', verticalAlign: 'middle' }}>
                        {item.date}
                      </td>
                      <td style={{ padding: '13px 16px', verticalAlign: 'middle' }}>
                        <span className={`badge ${
                          item.status === 'completed' ? 'badge-green' : 
                          item.status === 'accepted' ? 'badge-purple' : 
                          item.status === 'rejected' ? 'badge-danger' : 'badge-amber'
                        }`} style={{ fontSize: '0.74rem', padding: '4px 8px' }}>
                          {item.settlement_status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '13px 16px', verticalAlign: 'middle' }}>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setSelectedTx({ ...item, serialNumber })}
                          style={{ padding: '5px 10px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
                        >
                          <Eye size={13} /> Audit Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalItems={ledger.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* TRANSACTION AUDIT MODAL (Center Fixed & Viewport Locked) */}
      {selectedTx && (
        <div 
          onClick={() => setSelectedTx(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            margin: 0
          }}
        >
          <div 
            className="glass-panel animate-scale-in" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxWidth: '580px', 
              width: '100%', 
              padding: '24px', 
              borderRadius: '20px', 
              background: 'var(--bg-card)', 
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-purple">Record #{selectedTx.serialNumber || selectedTx.id}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
                  Financial Audit Breakdown
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedTx(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px' }}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>Serial Number</span>
                <strong style={{ color: 'var(--primary)', fontSize: '0.94rem' }}>
                  #{selectedTx.serialNumber || selectedTx.id}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>Settlement Status</span>
                <strong style={{ color: 'var(--accent-emerald)', fontSize: '0.92rem', textTransform: 'uppercase' }}>
                  {selectedTx.settlement_status}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>Campaign Name</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.94rem' }}>{selectedTx.campaign_name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>Brand Client</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.94rem' }}>{selectedTx.business_name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>Influencer Creator</span>
                <strong style={{ color: 'var(--primary)', fontSize: '0.94rem' }}>{selectedTx.influencer_name}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>Transaction Date</span>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.94rem' }}>{selectedTx.date}</strong>
              </div>
            </div>

            {/* Financial Math Box */}
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gross Deal Amount (Escrow Deposit):</span>
                <strong style={{ color: 'var(--text-main)' }}>₹{selectedTx.budget.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Platform Commission ({metrics.commission_rate_percent}%):</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>-₹{selectedTx.platform_fee.toLocaleString()}</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Net Disbursable Creator Payout:</span>
                <strong style={{ color: 'var(--accent-amber)' }}>₹{selectedTx.creator_net.toLocaleString()}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedTx(null)}
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


