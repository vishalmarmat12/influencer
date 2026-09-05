import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../api/apiService';
import { 
  Sparkles, Calendar, CalendarCheck, MessageSquare, DollarSign, Eye, Star, CheckCircle2, 
  XCircle, Plus, Image, Globe, MapPin, Sliders, CalendarDays, Activity, Settings, User, Users,
  TrendingUp, ArrowUpRight, Check, X, Upload, Link2, Bell, Heart, ShieldCheck, FileText, Search, Filter, Clock, Award, Trash2, Edit, Save, BarChart3, RefreshCw, AlertCircle
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, TwitterIcon, LinkedinIcon } from '../../components/common/SocialIcons';
import ChatBox from '../../components/chat/ChatBox';
import Pagination from '../../components/common/Pagination';

/* -------------------------------------------------------------------------- */
/* 1. INFLUENCER DASHBOARD OVERVIEW                                            */
/* -------------------------------------------------------------------------- */
export function InfluencerDashboard() {
  const { bookings, updateBookingStatus } = useData();
  const { user } = useAuth();
  const [growthTimeframe, setGrowthTimeframe] = useState('Week');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const myName = user?.name || 'Creator Account';

  // Filter bookings strictly assigned to this logged-in creator!
  const myBookings = bookings ? bookings.filter(b => b.influencer_id == user?.id || b.influencer_user_id == user?.id || b.influencer_name === user?.name) : [];
  const pendingCount = myBookings.filter(b => b.status === 'pending').length;
  const acceptedCount = myBookings.filter(b => b.status === 'accepted' || b.status === 'completed').length;
  const totalRevenue = myBookings.filter(b => b.status === 'accepted' || b.status === 'completed').reduce((sum, b) => sum + (b.budget || 0), 0);

  const paginatedBookings = myBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalFollowers = user?.followers ? user.followers.toLocaleString() : '250,000';
  const totalReviews = user?.reviews_count || 12;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>
      
      {/* CREATOR HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 700 }}>Creator Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Welcome back, {myName}! Here is your real-time analytics & campaign booking status.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/creator/charges" className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><Plus size={13} /> Add Service Rate</Link>
          <Link to="/creator/availability" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><Calendar size={13} /> Set Availability</Link>
        </div>
      </div>

      {/* 1. TOP 5 KPI STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px' }}>
        
        {/* Card 1: Total Followers */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #F97316', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={17} color="#F97316" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> Verified
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 700, margin: '2px 0' }}>{totalFollowers}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Total Reach / Followers</span>
        </div>

        {/* Card 2: Total Bookings */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #F59E0B', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={17} color="#F59E0B" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
              {pendingCount} Pending
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 700, margin: '2px 0' }}>{myBookings.length}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Campaign Bookings</span>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #10B981', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={17} color="#10B981" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={12} /> Total
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 700, margin: '2px 0' }}>₹{totalRevenue.toLocaleString()}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Earned Revenue</span>
        </div>

        {/* Card 4: Total Reviews */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #3B82F6', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={17} color="#3B82F6" />
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Star size={10} fill="var(--accent-amber)" color="var(--accent-amber)" /> 4.9
            </span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 700, margin: '2px 0' }}>{totalReviews}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Brand Reviews</span>
        </div>

        {/* Card 5: Account Status */}
        <div className="glass-panel" style={{ padding: '16px', borderTop: '3px solid #8B5CF6', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={17} color="#8B5CF6" />
            </div>
            <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>Active</span>
          </div>
          <h2 style={{ fontSize: '1.55rem', color: 'var(--text-main)', fontWeight: 700, margin: '2px 0' }}>Active</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Profile Status</span>
        </div>

      </div>

      {/* 2. FOLLOWER GROWTH + PLATFORM SPLIT GRAPHIC */}
      <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Audience Reach Trajectory</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Follower growth across your linked platforms</span>
            </div>
          </div>

          <div style={{ height: '140px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 130" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 0,90 Q 75,70 150,60 T 300,40 T 450,30 L 500,35 L 500,130 L 0,130 Z" fill="url(#chartGrad)" />
              <path d="M 0,90 Q 75,70 150,60 T 300,40 T 450,30 L 500,35" fill="none" stroke="#F97316" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.74rem', marginTop: '6px' }}>
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Linked Social Reach</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Followers by social platform</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '12px 0' }}>
            <div style={{ width: '105px', height: '105px', borderRadius: '50%', background: 'conic-gradient(#EC4899 0% 65%, #3B82F6 65% 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--bg-card)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EC4899' }} />
              <span style={{ color: 'var(--text-muted)' }}>Insta:</span>
              <strong style={{ color: 'var(--text-main)' }}>{user?.socials?.instagram?.followers || '180K'}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3B82F6' }} />
              <span style={{ color: 'var(--text-muted)' }}>YT:</span>
              <strong style={{ color: 'var(--text-main)' }}>{user?.socials?.youtube?.subscribers || '70K'}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* 3. QUICK ACTIONS GRID */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '14px' }}>Quick Creator Tools</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '10px' }}>
          <Link to="/creator/profile" className="glass-panel glass-panel-hover" style={{ padding: '12px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <User size={17} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Edit Profile</span>
          </Link>

          <Link to="/creator/portfolio" className="glass-panel glass-panel-hover" style={{ padding: '12px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Upload size={17} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Portfolio Gallery</span>
          </Link>

          <Link to="/creator/availability" className="glass-panel glass-panel-hover" style={{ padding: '12px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <CalendarDays size={17} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Availability</span>
          </Link>

          <Link to="/creator/charges" className="glass-panel glass-panel-hover" style={{ padding: '12px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Plus size={17} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Services Rate Card</span>
          </Link>

          <Link to="/creator/socials" className="glass-panel glass-panel-hover" style={{ padding: '12px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Link2 size={17} color="var(--accent-pink)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Social Handles</span>
          </Link>

          <Link to="/creator/messages" className="glass-panel glass-panel-hover" style={{ padding: '12px', textDecoration: 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={17} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>Direct Messages</span>
          </Link>
        </div>
      </div>

      {/* 4. RECENT BOOKINGS TABLE */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>Incoming Collaboration Bookings ({myBookings.length})</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest brand campaign proposals assigned to your profile</span>
          </div>
          <Link to="/creator/requests" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
        </div>

        {myBookings.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CalendarCheck size={36} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No incoming campaign proposals yet.</p>
            <span style={{ fontSize: '0.8rem' }}>When brands submit a booking request for your services, it will appear here.</span>
          </div>
        ) : (
          <>
            <div className="table-responsive-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px' }}>ID</th>
                    <th style={{ padding: '8px' }}>Campaign Name</th>
                    <th style={{ padding: '8px' }}>Brand Client</th>
                    <th style={{ padding: '8px' }}>Deliverable</th>
                    <th style={{ padding: '8px' }}>Date</th>
                    <th style={{ padding: '8px' }}>Offered Budget</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBookings.map(bk => (
                    <tr key={bk.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px', color: 'var(--primary)', fontWeight: 600 }}>#{bk.id}</td>
                      <td style={{ padding: '8px', color: 'var(--text-main)', fontWeight: 700 }}>{bk.campaign_name}</td>
                      <td style={{ padding: '8px', color: 'var(--text-main)' }}>{bk.business_name}</td>
                      <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{bk.promotion_type}</td>
                      <td style={{ padding: '8px', color: 'var(--text-muted)' }}>{bk.date || bk.booking_date}</td>
                      <td style={{ padding: '8px', color: 'var(--accent-emerald)', fontWeight: 700 }}>₹{(bk.budget || 0).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}>
                        <span className={`badge ${bk.status === 'accepted' ? 'badge-green' : bk.status === 'pending' ? 'badge-amber' : bk.status === 'completed' ? 'badge-blue' : 'badge-purple'}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                          {(bk.status || 'pending').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '8px' }}>
                        {bk.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => updateBookingStatus(bk.id, 'accepted')} className="btn btn-primary btn-sm" style={{ padding: '3px 6px' }} title="Accept"><Check size={12} /></button>
                            <button onClick={() => updateBookingStatus(bk.id, 'rejected')} className="btn btn-danger btn-sm" style={{ padding: '3px 6px' }} title="Reject"><X size={12} /></button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Managed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={currentPage}
              totalItems={myBookings.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. BOOKINGS & CAMPAIGN REQUESTS PAGE                                       */
/* -------------------------------------------------------------------------- */
export function InfluencerRequestsPage() {
  const { bookings, updateBookingStatus, deleteBooking, loading: dataLoading } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);

  const handleDirectChat = async (targetId) => {
    if (!user) return;
    const targetUserId = Number(targetId || 2);
    if (Number(user.id) === targetUserId) {
      alert('You cannot start a conversation with yourself.');
      return;
    }
    try {
      const res = await apiService.findOrCreateConversation(targetUserId, user.id);
      if (res && res.status === 'success' && res.conversation_id) {
        navigate(`/creator/messages?conversationId=${res.conversation_id}`);
      } else {
        navigate('/creator/messages');
      }
    } catch (e) {
      navigate('/creator/messages');
    }
  };

  // Auto-dismiss toast notification after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Bookings returned from backend API are already pre-filtered by authenticated creator identity
  const creatorRequests = Array.isArray(bookings) ? bookings : [];

  const allRequests = creatorRequests.map(req => {
    let deliv = ['1x Branded Content Post', 'Brand Mention Tag'];
    if (Array.isArray(req.deliverables)) {
      deliv = req.deliverables;
    } else if (typeof req.deliverables === 'string' && req.deliverables.trim()) {
      try {
        const parsed = JSON.parse(req.deliverables);
        if (Array.isArray(parsed)) deliv = parsed;
        else deliv = [req.deliverables];
      } catch (e) {
        deliv = [req.deliverables];
      }
    }
    const numBudget = Number(req.budget || 0);

    return {
      ...req,
      logo: req.logo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      deliverables: deliv,
      budget: isNaN(numBudget) ? 0 : numBudget,
      status: (req.status || 'pending').toLowerCase()
    };
  });

  const filteredRequests = allRequests.filter(r => {
    const bName = r.business_name || '';
    const cName = r.campaign_name || '';
    const pType = r.promotion_type || '';

    const matchesSearch = bName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pType.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'pending') matchesStatus = r.status === 'pending';
    else if (filterStatus === 'accepted') matchesStatus = r.status === 'accepted';
    else if (filterStatus === 'completed') matchesStatus = r.status === 'completed';
    else if (filterStatus === 'rejected') matchesStatus = r.status === 'rejected' || r.status === 'declined';

    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic dashboard stat cards directly from live database records
  const pendingRequests = allRequests.filter(r => r.status === 'pending');
  const acceptedRequests = allRequests.filter(r => r.status === 'accepted');
  const completedRequests = allRequests.filter(r => r.status === 'completed');
  const declinedRequests = allRequests.filter(r => r.status === 'rejected' || r.status === 'declined');

  const pendingCount = pendingRequests.length;
  const pendingValue = pendingRequests.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const acceptedCount = acceptedRequests.length;
  const completedCount = completedRequests.length;
  const declinedCount = declinedRequests.length;

  const handleStatusUpdate = async (id, targetStatus) => {
    if (actionLoading[id]) return; // prevent duplicate clicks

    setActionLoading(prev => ({ ...prev, [id]: targetStatus }));
    try {
      const res = await updateBookingStatus(id, targetStatus);
      if (res && res.success) {
        setToast({ 
          type: 'success', 
          message: res.message || `Booking #${id} updated to ${targetStatus.toUpperCase()} successfully.` 
        });
      } else {
        setToast({ 
          type: 'error', 
          message: res?.message || 'Failed to update booking status.' 
        });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Network error updating booking status.' });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm(`Are you sure you want to delete request #${id}? This will remove it permanently.`)) {
      return;
    }
    if (actionLoading[id]) return;

    setActionLoading(prev => ({ ...prev, [id]: 'delete' }));
    try {
      const res = await deleteBooking(id);
      if (res && res.success) {
        setToast({ 
          type: 'success', 
          message: res.message || `Booking #${id} deleted successfully.` 
        });
      } else {
        setToast({ 
          type: 'error', 
          message: res?.message || 'Failed to delete booking request.' 
        });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Network error deleting booking request.' });
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>
      
      {/* TOAST ALERT NOTIFICATION */}
      {toast && (
        <div 
          className="animate-fade-in"
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            zIndex: 1000
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Booking Requests & Campaigns ({allRequests.length})</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Database-driven client campaign proposals, rate negotiations, and status updates</p>
        </div>
        <Link to="/creator/charges" className="btn btn-primary btn-sm">
          <Plus size={14} /> Update Rate Card
        </Link>
      </div>

      {/* DYNAMIC DASHBOARD STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '16px' }}>
        
        {/* Card 1: Pending Proposals */}
        <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Proposals</span>
            <Clock size={18} color="#F59E0B" />
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--text-main)', fontWeight: 800, margin: '6px 0 2px 0' }}>{pendingCount}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--accent-amber)', fontWeight: 600 }}>Requires your review</span>
        </div>

        {/* Card 2: Pending Value */}
        <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Value</span>
            <DollarSign size={18} color="#10B981" />
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--accent-emerald)', fontWeight: 800, margin: '6px 0 2px 0' }}>₹{pendingValue.toLocaleString()}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>0% platform fee</span>
        </div>

        {/* Card 3: Accepted Campaigns */}
        <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #6366F1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accepted Campaigns</span>
            <CheckCircle2 size={18} color="#6366F1" />
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--text-main)', fontWeight: 800, margin: '6px 0 2px 0' }}>{acceptedCount}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 600 }}>In progress</span>
        </div>

        {/* Card 4: Completed Campaigns */}
        <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed Campaigns</span>
            <Award size={18} color="#3B82F6" />
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--text-main)', fontWeight: 800, margin: '6px 0 2px 0' }}>{completedCount}</h2>
          <span style={{ fontSize: '0.76rem', color: '#3B82F6', fontWeight: 600 }}>Finished</span>
        </div>

        {/* Card 5: Declined Campaigns */}
        <div className="glass-panel" style={{ padding: '18px', borderLeft: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Declined Proposals</span>
            <XCircle size={18} color="#EF4444" />
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--text-main)', fontWeight: 800, margin: '6px 0 2px 0' }}>{declinedCount}</h2>
          <span style={{ fontSize: '0.76rem', color: '#EF4444', fontWeight: 600 }}>Declined</span>
        </div>

      </div>

      {/* CONTROLS BAR: STATUS FILTER TABS + SEARCH */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { label: `All (${allRequests.length})`, value: 'all' },
            { label: `Pending (${pendingCount})`, value: 'pending' },
            { label: `Accepted (${acceptedCount})`, value: 'accepted' },
            { label: `Completed (${completedCount})`, value: 'completed' },
            { label: `Declined (${declinedCount})`, value: 'rejected' }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                background: filterStatus === f.value ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'var(--bg-input)',
                color: filterStatus === f.value ? '#FFF' : 'var(--text-main)',
                fontWeight: filterStatus === f.value ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: 'min(100%, 240px)' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search campaign or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px', height: '36px', fontSize: '0.85rem' }}
          />
        </div>

      </div>

      {/* REQUESTS LIST CARDS */}
      {dataLoading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Activity size={32} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--primary)' }} />
          <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Loading live campaign requests from database...</p>
        </div>
      ) : allRequests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CalendarCheck size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>No Campaign Requests Found</h3>
          <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>Brands have not sent any campaign proposals to your account yet.</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No proposals match your search or selected status filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredRequests.map(req => {
            const isLoading = !!actionLoading[req.id];
            const currentAction = actionLoading[req.id];

            return (
              <div key={req.id} className="glass-panel glass-panel-hover" style={{ padding: '22px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Top Row: Brand Info + Offered Budget */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={req.logo} alt={req.business_name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800 }}>{req.campaign_name}</h3>
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                        Brand: <strong style={{ color: 'var(--primary)' }}>{req.business_name}</strong> • Proposed Date: {req.date || req.booking_date}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>Offered Budget</span>
                      <strong style={{ fontSize: '1.3rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>₹{(req.budget || 0).toLocaleString()}</strong>
                    </div>
                    <span className={`badge ${req.status === 'accepted' ? 'badge-green' : req.status === 'pending' ? 'badge-amber' : req.status === 'completed' ? 'badge-blue' : 'badge-danger'}`} style={{ padding: '6px 12px', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      {req.status === 'rejected' || req.status === 'declined' ? 'DECLINED' : req.status}
                    </span>
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>Deliverables Included:</span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(req.deliverables || []).map((d, i) => (
                      <span key={i} className="badge badge-purple" style={{ fontSize: '0.76rem', padding: '3px 10px' }}>
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Toolbar */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Request ID: #{req.id} • 0% Platform Commission
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleDirectChat(req.user_id || 2)} 
                      className="btn btn-secondary btn-sm" 
                      style={{ fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MessageSquare size={14} /> Chat Brand
                    </button>

                    {/* STATUS PENDING: Show Accept Proposal & Decline buttons */}
                    {req.status === 'pending' && (
                      <>
                        <button 
                          disabled={isLoading}
                          onClick={() => handleStatusUpdate(req.id, 'accepted')} 
                          className="btn btn-primary btn-sm" 
                          style={{ fontSize: '0.84rem' }}
                        >
                          {currentAction === 'accepted' ? (
                            <>Updating...</>
                          ) : (
                            <><Check size={14} /> Accept Proposal</>
                          )}
                        </button>
                        <button 
                          disabled={isLoading}
                          onClick={() => handleStatusUpdate(req.id, 'rejected')} 
                          className="btn btn-danger btn-sm" 
                          style={{ fontSize: '0.84rem' }}
                        >
                          {currentAction === 'rejected' ? (
                            <>Updating...</>
                          ) : (
                            <><X size={14} /> Decline</>
                          )}
                        </button>
                      </>
                    )}

                    {/* STATUS ACCEPTED: Show Mark as Completed button */}
                    {req.status === 'accepted' && (
                      <button 
                        disabled={isLoading}
                        onClick={() => handleStatusUpdate(req.id, 'completed')} 
                        className="btn btn-primary btn-sm" 
                        style={{ background: '#3B82F6', fontSize: '0.84rem' }}
                      >
                        {currentAction === 'completed' ? (
                          <>Updating...</>
                        ) : (
                          <><CheckCircle2 size={14} /> Mark as Completed</>
                        )}
                      </button>
                    )}

                    {/* STATUS COMPLETED: Show Completed Badge only */}
                    {req.status === 'completed' && (
                      <span className="badge badge-green" style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: 800 }}>
                        ✓ COMPLETED
                      </span>
                    )}

                    {/* STATUS DECLINED / REJECTED: Show Accept Proposal button to re-accept declined requests */}
                    {(req.status === 'rejected' || req.status === 'declined') && (
                      <button 
                        disabled={isLoading}
                        onClick={() => handleStatusUpdate(req.id, 'accepted')} 
                        className="btn btn-primary btn-sm" 
                        style={{ fontSize: '0.84rem' }}
                      >
                        {currentAction === 'accepted' ? (
                          <>Updating...</>
                        ) : (
                          <><Check size={14} /> Accept Proposal</>
                        )}
                      </button>
                    )}

                    {/* DELETE REQUEST BUTTON (Always available) */}
                    <button 
                      disabled={isLoading}
                      onClick={() => handleDeleteBooking(req.id)} 
                      className="btn btn-danger btn-sm" 
                      style={{ fontSize: '0.84rem', padding: '6px 12px' }}
                      title="Delete Request"
                    >
                      {currentAction === 'delete' ? (
                        <>Deleting...</>
                      ) : (
                        <><Trash2 size={14} /> Delete</>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. EDIT PROFILE PAGE                                                        */
/* -------------------------------------------------------------------------- */
export function InfluencerProfileEdit() {
  const { user, updateUser } = useAuth();
  const fileInputRef = React.useRef(null);

  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '@creator');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [gender, setGender] = useState(user?.gender || 'Female');
  const [dob, setDob] = useState(user?.dob || '1998-04-12');
  const [category, setCategory] = useState(user?.category || 'Fashion');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [state, setState] = useState(user?.state || 'Maharashtra');
  const [country, setCountry] = useState(user?.country || 'India');
  const [bio, setBio] = useState(user?.bio || 'Content Creator passionate about fashion trends and digital aesthetics.');
  const [experience, setExperience] = useState(user?.experience || '4 Years');
  const [languages, setLanguages] = useState(user?.languages || 'English, Hindi');
  const [startingPrice, setStartingPrice] = useState(user?.starting_price || 10000);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.avatar) setAvatar(user.avatar);
      setName(user.name || '');
      if (user.username) setUsername(user.username);
      setEmail(user.email || '');
      setPhone(user.phone || '+91 9876543210');
      if (user.gender) setGender(user.gender);
      if (user.dob) setDob(user.dob);
      if (user.category) setCategory(user.category);
      if (user.city) setCity(user.city);
      if (user.state) setState(user.state);
      if (user.country) setCountry(user.country);
      if (user.bio) setBio(user.bio);
      if (user.experience) setExperience(user.experience);
      if (user.languages) setLanguages(user.languages);
      if (user.starting_price) setStartingPrice(user.starting_price);
    }
  }, [user]);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    setUploadError('');
    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      if (user?.id) formData.append('user_id', user.id);

      const res = await apiService.uploadAvatar(formData);
      if (res && (res.url || res.data?.url)) {
        const uploadedUrl = res.url || res.data.url;
        setAvatar(uploadedUrl);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Avatar upload fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ 
      avatar, 
      name, 
      username, 
      email, 
      phone, 
      gender, 
      dob, 
      category, 
      city, 
      state, 
      country, 
      bio, 
      experience, 
      languages, 
      starting_price: startingPrice 
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="animate-fade-in glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)', maxWidth: '850px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px' }}>Edit Creator Profile</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Manage profile picture, contact details, niche category, and rate card</p>

      {saved && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: '10px', fontWeight: 700, fontSize: '0.88rem', marginBottom: '20px' }}>
          ✓ Creator profile details updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '16px', background: 'var(--bg-input)', borderRadius: '14px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <img src={avatar} alt={name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
            <button
              type="button"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', color: '#FFF',
                border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
              title="Upload Profile Picture"
            >
              <Upload size={13} />
            </button>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>Profile Photo</h4>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageFileChange} 
              accept="image/jpeg,image/png,image/webp" 
              style={{ display: 'none' }} 
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? 'Uploading...' : 'Select Image File'}
              </button>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>JPG, PNG or WebP, max 5MB</span>
            </div>
            {uploadError && (
              <p style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '6px', fontWeight: 600 }}>
                {uploadError}
              </p>
            )}
          </div>
        </div>

        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
        </div>

        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
          </div>
        </div>

        <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-input" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Niche Category</label>
            <input type="text" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Fashion" />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label">Creator Bio</label>
          <textarea className="form-textarea" rows="3" value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label">City</label>
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

        <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">Experience</label>
            <input type="text" className="form-input" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="4 Years" />
          </div>
          <div className="form-group">
            <label className="form-label">Languages Known</label>
            <input type="text" className="form-input" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Hindi" />
          </div>
          <div className="form-group">
            <label className="form-label">Starting Price (₹)</label>
            <input type="number" className="form-input" value={startingPrice} onChange={(e) => setStartingPrice(Number(e.target.value))} placeholder="10000" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
          <Check size={16} /> Save Profile Changes
        </button>
      </form>

      {/* PORTFOLIO WORK GALLERY SECTION ON PROFILE PAGE */}
      <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-color)' }}>
        <InfluencerPortfolioSection />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. SOCIAL MEDIA HANDLES PAGE                                               */
/* -------------------------------------------------------------------------- */
export function InfluencerSocialsPage() {
  const { user, updateUser } = useAuth();
  const [instagram, setInstagram] = useState(user?.socials?.instagram?.handle || '@creator_official');
  const [youtube, setYoutube] = useState(user?.socials?.youtube?.channel || 'CreatorVlogs');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      socials: {
        instagram: { handle: instagram, followers: user?.socials?.instagram?.followers || '180K' },
        youtube: { channel: youtube, subscribers: user?.socials?.youtube?.subscribers || '70K' }
      }
    });
    setSaved(true);
  };

  return (
    <div className="animate-fade-in glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)', maxWidth: '750px' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Social Media Profiles</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Connect and update your official social handles for brand audits</p>

      {saved && (
        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: '8px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ Social handles updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><InstagramIcon size={16} /> Instagram Handle</label>
          <input type="text" className="form-input" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><YoutubeIcon size={16} /> YouTube Channel Name</label>
          <input type="text" className="form-input" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Save Social Links</button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. SERVICES & RATE CARD PAGE                                               */
/* -------------------------------------------------------------------------- */
export function InfluencerCharges() {
  const { user, updateUser } = useAuth();
  const defaultRates = [
    { type: 'Instagram Reel', price: 25000, desc: '30-60 second branded reel with link tag' },
    { type: 'Instagram Story', price: 8000, desc: '24-hour story with direct swipe-up link' },
    { type: 'Instagram Post', price: 18000, desc: 'Feed image post with detailed caption' },
    { type: 'YouTube Video', price: 65000, desc: 'Dedicated 8-10 min review video' }
  ];

  const [rates, setRates] = useState(user?.services || defaultRates);
  const [newType, setNewType] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Editing state
  const [editingIdx, setEditingIdx] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', price: '', desc: '' });
  const [msg, setMsg] = useState('');

  const showToast = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3500);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newType || !newPrice) return;
    const updated = [...rates, { type: newType, price: Number(newPrice), desc: newDesc }];
    setRates(updated);
    updateUser({ services: updated });
    setNewType('');
    setNewPrice('');
    setNewDesc('');
    showToast('✓ New rate card item added successfully!');
  };

  const startEdit = (idx, item) => {
    setEditingIdx(idx);
    setEditForm({ type: item.type, price: item.price, desc: item.desc });
  };

  const handleSaveEdit = (idx) => {
    if (!editForm.type || !editForm.price) return;
    const updated = rates.map((r, i) => (i === idx ? { ...editForm, price: Number(editForm.price) } : r));
    setRates(updated);
    updateUser({ services: updated });
    setEditingIdx(null);
    showToast('✓ Service rate & description updated successfully!');
  };

  const handleDelete = (idx) => {
    if (!window.confirm('Are you sure you want to remove this service item from your rate card?')) return;
    const updated = rates.filter((_, i) => i !== idx);
    setRates(updated);
    updateUser({ services: updated });
    showToast('✓ Service removed from rate card.');
  };

  return (
    <div className="animate-fade-in glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', marginBottom: '6px', fontWeight: 800 }}>Services & Rate Card</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
        Manage custom deliverable rates, service names, and descriptions visible on your public creator profile
      </p>

      {msg && (
        <div style={{ padding: '12px 18px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: '10px', marginBottom: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
          {msg}
        </div>
      )}

      {/* Add New Rate Form */}
      <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '20px', marginBottom: '24px', background: 'var(--bg-input)' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', fontWeight: 700 }}>Add New Deliverable / Rate</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
          <input type="text" className="form-input" placeholder="Service Name (e.g. Instagram Reel)" required value={newType} onChange={(e) => setNewType(e.target.value)} />
          <input type="number" className="form-input" placeholder="Price in ₹" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          <input type="text" className="form-input" placeholder="Short deliverable description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}><Plus size={14} /> Add Rate Item</button>
      </form>

      {/* Rates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
        {rates.map((r, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: editingIdx === idx ? '2px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: '16px' }}>
            {editingIdx === idx ? (
              // EDITABLE FORM
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Service Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editForm.type} 
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Rate Charge (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editForm.price} 
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px', display: 'block' }}>Deliverable Description</label>
                  <textarea 
                    className="form-input" 
                    rows={3} 
                    value={editForm.desc} 
                    onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => handleSaveEdit(idx)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    <Save size={14} /> Save Changes
                  </button>
                  <button onClick={() => setEditingIdx(null)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // READ-ONLY DISPLAY CARD WITH EDIT & DELETE BUTTONS
              <>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 800 }}>{r.type}</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => startEdit(idx, r)} className="btn btn-secondary btn-sm" style={{ padding: '5px 10px', fontSize: '0.78rem' }} title="Edit Rate & Description">
                        <Edit size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(idx)} className="btn btn-danger btn-sm" style={{ padding: '5px 8px' }} title="Delete Service">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '10px', lineHeight: 1.45 }}>
                    {r.desc || 'No description provided.'}
                  </p>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem', fontWeight: 600 }}>Deliverable Rate</span>
                  <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.3rem', fontWeight: 800 }}>₹{(Number(r.price) || 0).toLocaleString()}</strong>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. PORTFOLIO GALLERY PAGE WITH FILE UPLOAD                                  */
/* -------------------------------------------------------------------------- */
export function InfluencerPortfolioSection() {
  const { user, updateUser } = useAuth();
  const fileInputRef = React.useRef(null);

  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch portfolio items for current creator
  const loadPortfolio = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiService.getPortfolio(user.id);
      if (res && res.status === 'success' && Array.isArray(res.data)) {
        setItems(res.data);
      } else if (user?.portfolio && Array.isArray(user.portfolio)) {
        setItems(user.portfolio);
      } else {
        setItems([
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'
        ]);
      }
    } catch (err) {
      if (user?.portfolio) setItems(user.portfolio);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, [user]);

  // Handle File Selection
  const handleFileSelect = (file) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMsg('Please select a valid image file (JPG, JPEG, PNG, WEBP).');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg('Image size must be less than 5 MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearSelected = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('user_id', user?.id || 1);
      formData.append('influencer_id', user?.id || 1);

      const res = await apiService.uploadPortfolioImage(formData);

      if (res && res.status === 'success') {
        setSuccessMsg(res.message || 'Portfolio image uploaded successfully!');
        handleClearSelected();
        await loadPortfolio();
      } else {
        setErrorMsg(res?.message || 'Failed to upload image. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error while uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (item, idx) => {
    const itemUrl = typeof item === 'object' ? item.url : item;
    const itemId = typeof item === 'object' ? item.id : 0;

    if (!window.confirm('Are you sure you want to delete this portfolio image?')) return;

    try {
      const res = await apiService.deletePortfolioImage({
        id: itemId,
        url: itemUrl,
        user_id: user?.id
      });
      if (res && res.status === 'success') {
        const updated = items.filter((_, i) => i !== idx);
        setItems(updated);
        updateUser({ portfolio: updated });
      } else {
        const updated = items.filter((_, i) => i !== idx);
        setItems(updated);
        updateUser({ portfolio: updated });
      }
    } catch (err) {
      const updated = items.filter((_, i) => i !== idx);
      setItems(updated);
      updateUser({ portfolio: updated });
    }
  };

  return (
    <div className="animate-fade-in glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 28px)', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image color="var(--primary)" size={26} /> Portfolio Work Gallery
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Upload high-resolution image files showcasing your past brand collaborations and campaign deliverables.
        </p>
      </div>

      {/* ERROR & SUCCESS MESSAGES */}
      {errorMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', borderRadius: '10px', marginBottom: '20px', fontSize: '0.86rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} /> <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', borderRadius: '10px', marginBottom: '20px', fontSize: '0.86rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> <span>{successMsg}</span>
        </div>
      )}

      {/* FILE UPLOAD DROPZONE */}
      <form onSubmit={handleUploadSubmit} style={{ marginBottom: '32px' }}>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/jpeg,image/jpg,image/png,image/webp" 
          onChange={handleInputChange} 
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <div 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              padding: '40px 20px',
              border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--border-light)',
              borderRadius: '16px',
              background: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-input)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))', padding: '14px', borderRadius: '50%', color: '#FFF', boxShadow: '0 4px 16px var(--primary-glow)' }}>
              <Upload size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Click to select or drag & drop portfolio image
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
                JPG • JPEG • PNG • WEBP • Max file size: 5MB
              </p>
            </div>
          </div>
        ) : (
          /* IMAGE PREVIEW CARD */
          <div className="glass-panel animate-fade-in" style={{ padding: '24px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: '160px', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                <img src={previewUrl} alt="Selected Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 'min(100%, 200px)' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.74rem', marginBottom: '8px', display: 'inline-block' }}>Selected File</span>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 700, wordBreak: 'break-all' }}>
                  {selectedFile.name}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
                  Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Type: {selectedFile.type}
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    Change Image
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={handleClearSelected}
                    style={{ color: '#EF4444' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={uploading}
                style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', width: 'min(100%, 220px)', justifyContent: 'center' }}
              >
                {uploading ? <RefreshCw size={16} className="spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading Image...' : 'Add Portfolio Item'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* PORTFOLIO GALLERY GRID */}
      <div>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '16px' }}>
          Current Portfolio Items ({items.length})
        </h3>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '18px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel" style={{ height: '220px', background: 'var(--bg-card)', opacity: 0.6 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-input)', borderRadius: '16px', color: 'var(--text-muted)' }}>
            No portfolio images uploaded yet. Use the upload box above to add brand campaign visuals.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '18px' }}>
            {items.map((item, idx) => {
              const url = typeof item === 'object' ? item.url : item;
              return (
                <div 
                  key={idx} 
                  className="glass-panel glass-panel-hover animate-fade-in" 
                  style={{ height: '220px', overflow: 'hidden', padding: 0, position: 'relative' }}
                >
                  <img src={url} alt={`Portfolio ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  
                  {/* Delete Button Overlay */}
                  <button 
                    onClick={() => handleDeleteItem(item, idx)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#FFF',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    title="Delete portfolio image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export function InfluencerPortfolioPage() {
  return <InfluencerPortfolioSection />;
}

/* -------------------------------------------------------------------------- */
/* 7. AVAILABILITY CALENDAR PAGE                                              */
/* -------------------------------------------------------------------------- */
export function InfluencerAvailability() {
  const { user } = useAuth();
  const { availabilityList, saveAvailability, deleteAvailability, fetchAvailability } = useData();

  const todayStr = new Date().toISOString().split('T')[0];
  const myInfId = Number(user?.id) || 1;

  // Filter availability records assigned to this creator
  const myRanges = availabilityList.filter(
    (item) => Number(item.influencer_id) === myInfId || Number(item.influencer_id) === 1 || myInfId === 1
  );

  const [editingId, setEditingId] = useState(null);
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(todayStr);
  const [status, setStatus] = useState('busy');
  const [notes, setNotes] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const paginatedRanges = myRanges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    fetchAvailability(myInfId);
  }, [myInfId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return 1;
    const f = new Date(from);
    const t = new Date(to);
    const diffTime = t - f;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fromDate || !toDate) {
      setErrorMsg('Please select both From Date and To Date.');
      return;
    }

    if (toDate < fromDate) {
      setErrorMsg('To Date cannot be earlier than From Date.');
      return;
    }

    if (!editingId && fromDate < todayStr) {
      setErrorMsg('Past dates are not allowed when creating a new availability range.');
      return;
    }

    const overlapping = myRanges.filter((r) => {
      if (editingId && r.id === editingId) return false;
      return !(toDate < r.from_date || fromDate > r.to_date);
    });

    if (overlapping.length > 0 && status === 'available') {
      const busyOverlap = overlapping.some(o => o.status !== 'available');
      if (busyOverlap) {
        setErrorMsg('Note: A date marked as Busy or Holiday takes priority over Available. Existing unavailable dates will remain restricted.');
      }
    }

    setLoading(true);
    const payload = {
      id: editingId || undefined,
      influencer_id: myInfId,
      from_date: fromDate,
      to_date: toDate,
      status: status,
      notes: notes.trim()
    };

    const res = await saveAvailability(payload);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(editingId ? 'Availability range updated successfully!' : 'New availability range added successfully!');
      resetForm();
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.message || 'Failed to save availability range.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFromDate(todayStr);
    setToDate(todayStr);
    setStatus('busy');
    setNotes('');
    setErrorMsg('');
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFromDate(item.from_date);
    setToDate(item.to_date);
    setStatus(item.status || 'busy');
    setNotes(item.notes || '');
    setErrorMsg('');
    setSuccessMsg('');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability record?')) {
      const res = await deleteAvailability(id, myInfId);
      if (res.success) {
        setSuccessMsg('Availability period deleted successfully.');
        if (editingId === id) resetForm();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg(res.message || 'Failed to delete availability record.');
      }
    }
  };

  const renderBadge = (st) => {
    const s = (st || 'available').toLowerCase();
    if (s === 'busy' || s === 'not_available') {
      return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          🔴 Busy / Not Available
        </span>
      );
    } else if (s === 'holiday') {
      return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          🟠 Holiday / Off Day
        </span>
      );
    } else {
      return (
        <span style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          🟢 Available
        </span>
      );
    }
  };

  const totalBusyDays = myRanges.filter(r => r.status === 'busy').reduce((acc, r) => acc + calculateDays(r.from_date, r.to_date), 0);
  const totalHolidays = myRanges.filter(r => r.status === 'holiday').reduce((acc, r) => acc + calculateDays(r.from_date, r.to_date), 0);
  const totalAvailableRanges = myRanges.filter(r => r.status === 'available').length;

  const currentMonthDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    let dayStatus = 'available';
    let dayNotes = '';

    myRanges.forEach(r => {
      if (dateStr >= r.from_date && dateStr <= r.to_date) {
        if (r.status === 'busy' || r.status === 'holiday') {
          dayStatus = r.status;
          dayNotes = r.notes;
        } else if (dayStatus === 'available') {
          dayStatus = r.status;
          dayNotes = r.notes;
        }
      }
    });

    return { dayNum, dateStr, dayStatus, dayNotes };
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 800 }}>Availability & Unavailability Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Set your date ranges for Available, Busy, or Holiday slots to control when brands can book your services.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => fetchAvailability(myInfId)}>
            Refresh Data
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px', borderTop: '3px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Open Ranges</span>
            <span style={{ fontSize: '1.2rem' }}>🟢</span>
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--text-main)', fontWeight: 800 }}>{totalAvailableRanges}</h2>
          <span style={{ fontSize: '0.76rem', color: 'var(--accent-emerald)' }}>Open for campaign bookings</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderTop: '3px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Busy / Unavailable Days</span>
            <span style={{ fontSize: '1.2rem' }}>🔴</span>
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--text-main)', fontWeight: 800 }}>{totalBusyDays} Days</h2>
          <span style={{ fontSize: '0.76rem', color: '#EF4444' }}>Booking restricted</span>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderTop: '3px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Holidays & Off Days</span>
            <span style={{ fontSize: '1.2rem' }}>🟠</span>
          </div>
          <h2 style={{ fontSize: '1.7rem', color: 'var(--text-main)', fontWeight: 800 }}>{totalHolidays} Days</h2>
          <span style={{ fontSize: '0.76rem', color: '#F59E0B' }}>Personal time off</span>
        </div>
      </div>

      {/* ALERT NOTIFICATIONS */}
      {successMsg && (
        <div style={{ padding: '14px 18px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--accent-emerald)', borderRadius: '10px', fontWeight: 600, fontSize: '0.92rem' }}>
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', borderRadius: '10px', fontWeight: 600, fontSize: '0.92rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* FORM & PREVIEW SECTION */}
      <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* ADD / EDIT AVAILABILITY FORM CARD */}
        <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 24px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 800 }}>
              {editingId ? 'Edit Availability Range' : 'Add New Date Range'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>From Date *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  min={editingId ? undefined : todayStr}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>To Date *</label>
                <input 
                  type="date" 
                  className="form-input" 
                  min={fromDate || todayStr}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Availability Status *</label>
              <select 
                className="form-select" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                style={{ fontSize: '0.95rem', fontWeight: 600 }}
              >
                <option value="available">🟢 Available for Bookings</option>
                <option value="busy">🔴 Busy / Not Available</option>
                <option value="holiday">🟠 Holiday / Off Day</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Notes / Reason (Optional)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Brand shoot in Goa, Vacation, Tech Summit Speaker"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {fromDate && toDate && (
              <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>Selected Range Summary:</strong> {formatDate(fromDate)} to {formatDate(toDate)} ({calculateDays(fromDate, toDate)} Days)
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, minWidth: '160px' }} disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Range' : 'Add Availability Range'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* VISUAL MONTHLY SCHEDULE OVERVIEW */}
        <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 24px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 800 }}>August 2026 Schedule Visualizer</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Current Month</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', fontSize: '0.78rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span> Available</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span> Busy</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span> Holiday</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, paddingBottom: '4px' }}>{day}</div>
            ))}
            {currentMonthDays.map(d => {
              let bg = 'rgba(16, 185, 129, 0.12)';
              let color = 'var(--accent-emerald)';
              let border = '1px solid rgba(16, 185, 129, 0.3)';

              if (d.dayStatus === 'busy') {
                bg = 'rgba(239, 68, 68, 0.18)';
                color = '#EF4444';
                border = '1px solid rgba(239, 68, 68, 0.4)';
              } else if (d.dayStatus === 'holiday') {
                bg = 'rgba(245, 158, 11, 0.18)';
                color = '#F59E0B';
                border = '1px solid rgba(245, 158, 11, 0.4)';
              }

              return (
                <div 
                  key={d.dayNum} 
                  title={`${d.dateStr}: ${d.dayStatus.toUpperCase()} ${d.dayNotes ? '(' + d.dayNotes + ')' : ''}`}
                  style={{
                    padding: '8px 2px',
                    borderRadius: '6px',
                    background: bg,
                    color: color,
                    border: border,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {d.dayNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PREVIOUSLY ADDED DATE RANGES TABLE / LIST */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--text-main)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>
          Configured Date Ranges ({myRanges.length})
        </h3>

        {myRanges.length === 0 ? (
          <div style={{ textStyle: 'center', padding: '30px', color: 'var(--text-muted)', textAlign: 'center' }}>
            No availability or unavailability date ranges configured yet. Add your first range above!
          </div>
        ) : (
          <>
            <div className="table-responsive-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-dim)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>From Date</th>
                    <th style={{ padding: '12px' }}>To Date</th>
                    <th style={{ padding: '12px' }}>Duration</th>
                    <th style={{ padding: '12px' }}>Notes / Reason</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRanges.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px' }}>{renderBadge(item.status)}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{formatDate(item.from_date)}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{formatDate(item.to_date)}</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{calculateDays(item.from_date, item.to_date)} Days</td>
                      <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{item.notes || '—'}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="btn btn-secondary btn-sm" 
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            title="Edit Date Range"
                          >
                            <Edit size={13} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="btn btn-danger btn-sm" 
                            style={{ padding: '4px 8px' }}
                            title="Delete Range"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={currentPage}
              totalItems={myRanges.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. PROFILE ANALYTICS PAGE                                                  */
/* -------------------------------------------------------------------------- */
export function InfluencerAnalyticsPage() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState('30days');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAnalytics = async (filterVal) => {
    if (!user) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiService.getCreatorAnalytics({
        user_id: user.id,
        role: user.role,
        date_filter: filterVal || dateFilter
      });
      if (res && res.status === 'success' && res.data) {
        setAnalytics(res.data);
      } else {
        setErrorMsg(res?.message || 'Failed to load creator analytics data.');
      }
    } catch (err) {
      setErrorMsg('Server connection error. Unable to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(dateFilter);
  }, [user, dateFilter]);

  const overview = analytics?.overview || {};
  const monthlyTrend = analytics?.monthly_trend || [];
  const statusDist = analytics?.status_distribution || {};

  const maxEarnings = Math.max(...monthlyTrend.map(m => m.earnings || 0), 1);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1350px', margin: '0 auto', width: '100%' }}>
      
      {/* PAGE TITLE & DATE FILTER HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 color="var(--primary)" size={28} /> Creator Performance Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Real-time, authenticated performance metrics and campaign analytics for {user?.name || 'your creator profile'}
          </p>
        </div>

        {/* DATE RANGE SELECTOR & REFRESH BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Filter size={16} color="var(--primary)" />
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.86rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              <option value="7days" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Last 7 Days</option>
              <option value="30days" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Last 30 Days</option>
              <option value="3months" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Last 3 Months</option>
              <option value="6months" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Last 6 Months</option>
              <option value="12months" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>Last 12 Months</option>
              <option value="this_year" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>This Year (2026)</option>
              <option value="all" style={{ background: 'var(--bg-card)', color: 'var(--text-main)' }}>All Time</option>
            </select>
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={() => fetchAnalytics(dateFilter)} 
            disabled={loading}
            style={{ padding: '10px 14px', borderRadius: '12px' }}
            title="Refresh Analytics"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* ERROR ALERT BANNER */}
      {errorMsg && (
        <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => fetchAnalytics(dateFilter)}>Retry</button>
        </div>
      )}

      {/* LOADING SKELETON */}
      {loading && !analytics ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: '18px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="glass-panel" style={{ padding: '24px', height: '110px', background: 'var(--bg-card)', opacity: 0.6 }}>
              <div style={{ height: '14px', width: '60%', background: 'var(--border-color)', borderRadius: '4px', marginBottom: '12px' }} />
              <div style={{ height: '28px', width: '40%', background: 'var(--border-color)', borderRadius: '6px' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* OVERVIEW KPI CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '18px' }}>
            
            {/* Total Bookings */}
            <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Total Bookings</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                  <CalendarDays size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '8px' }}>
                {overview.total_bookings ?? 0}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                {overview.period_bookings ?? 0} in selected period
              </span>
            </div>

            {/* Total Revenue */}
            <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Total Revenue</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                  <DollarSign size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--accent-emerald)', fontWeight: 800, marginTop: '8px' }}>
                ₹{(overview.total_earnings || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                ₹{(overview.period_earnings || 0).toLocaleString()} in period
              </span>
            </div>

            {/* Completed Bookings */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Completed</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '8px' }}>
                {(overview.completed_bookings || 0) + (overview.accepted_bookings || 0)}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                {overview.completed_bookings || 0} Delivered • {overview.accepted_bookings || 0} Active
              </span>
            </div>

            {/* Pending Requests */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Pending Requests</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                  <Clock size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--accent-amber)', fontWeight: 800, marginTop: '8px' }}>
                {overview.pending_bookings || 0}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                ₹{(overview.pending_earnings || 0).toLocaleString()} potential revenue
              </span>
            </div>

            {/* Profile Views */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Profile Views</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', color: 'var(--accent-pink)' }}>
                  <Eye size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '8px' }}>
                {overview.profile_views_total || 0}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                {overview.profile_views_period || 0} views in period
              </span>
            </div>

            {/* Conversion Rate */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Conversion Rate</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--accent-purple)', fontWeight: 800, marginTop: '8px' }}>
                {overview.conversion_rate || 0}%
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Accepted & Delivered ratio
              </span>
            </div>

            {/* Client Inquiries */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Client Messages</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                  <MessageSquare size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '8px' }}>
                {overview.total_messages || 0}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Direct brand inquiries
              </span>
            </div>

            {/* Avg Booking Value */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600 }}>Avg Booking Deal</span>
                <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
                  <Award size={20} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.9rem', color: 'var(--text-main)', fontWeight: 800, marginTop: '8px' }}>
                ₹{(overview.avg_booking_value || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
                Average deal size
              </span>
            </div>

          </div>

          {/* CHARTS SECTION */}
          <div className="two-col-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Monthly Earnings & Booking Trends Bar Chart */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 24px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800 }}>Monthly Revenue & Booking Trends</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Dynamic monthly distribution calculated from your authentic campaign records</p>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.76rem' }}>
                    {monthlyTrend.length} Active Months
                  </span>
                </div>

                {monthlyTrend.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No monthly activity records available for the selected date range.
                  </div>
                ) : (
                  <div className="table-responsive-container" style={{ paddingBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '220px', minWidth: '320px', paddingTop: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                      {monthlyTrend.map((m, idx) => {
                        const earningsPct = Math.max(12, Math.round((m.earnings / maxEarnings) * 100));
                        return (
                          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                              ₹{m.earnings > 0 ? (m.earnings >= 1000 ? `${(m.earnings/1000).toFixed(0)}k` : m.earnings) : 0}
                            </span>
                            <div 
                              style={{
                                width: '100%',
                                maxWidth: '38px',
                                height: `${earningsPct}%`,
                                background: 'linear-gradient(180deg, var(--primary), var(--accent-pink))',
                                borderRadius: '8px 8px 4px 4px',
                                transition: 'height 0.4s ease',
                                position: 'relative'
                              }}
                              title={`${m.month}: ₹${m.earnings.toLocaleString()} (${m.bookings} bookings)`}
                            />
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {m.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)' }} />
                  <span>Monthly Campaign Revenue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-pink)' }} />
                  <span>Booking Count</span>
                </div>
              </div>
            </div>

            {/* Booking Status Breakdown */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 3.5vw, 24px)' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '6px' }}>Booking Status Breakdown</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>Real-time status distribution of all your incoming campaign requests</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Completed */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="var(--accent-emerald)" /> Completed & Accepted
                    </span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>{(statusDist.completed || 0) + (statusDist.accepted || 0)}</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${overview.total_bookings > 0 ? (((statusDist.completed || 0) + (statusDist.accepted || 0)) / overview.total_bookings) * 100 : 0}%`, height: '100%', background: 'var(--accent-emerald)' }} />
                  </div>
                </div>

                {/* Pending */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--accent-amber)" /> Pending Review
                    </span>
                    <strong style={{ color: 'var(--accent-amber)' }}>{statusDist.pending || 0}</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${overview.total_bookings > 0 ? ((statusDist.pending || 0) / overview.total_bookings) * 100 : 0}%`, height: '100%', background: 'var(--accent-amber)' }} />
                  </div>
                </div>

                {/* Rejected */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <XCircle size={14} color="#EF4444" /> Rejected / Cancelled
                    </span>
                    <strong style={{ color: '#EF4444' }}>{(statusDist.rejected || 0) + (statusDist.cancelled || 0)}</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${overview.total_bookings > 0 ? (((statusDist.rejected || 0) + (statusDist.cancelled || 0)) / overview.total_bookings) * 100 : 0}%`, height: '100%', background: '#EF4444' }} />
                  </div>
                </div>

              </div>

              {/* Service Highlights Box */}
              <div style={{ marginTop: '24px', padding: '14px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                  Top Performing Service
                </span>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 800, marginTop: '4px' }}>
                  {overview.top_service || 'Instagram Reel'}
                </h4>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. MESSAGES WORKSPACE                                                      */
/* -------------------------------------------------------------------------- */
export function InfluencerMessagesWorkspace() {
  const { messages } = useData();
  const { user } = useAuth();

  const userMessages = messages ? messages.filter(m => m.sender_id == user?.id || m.receiver_id == user?.id) : [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>Creator Messages</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Chat directly with brand clients and negotiate campaign briefs</p>
        </div>
        {userMessages.length > 0 && (
          <div style={{ background: 'var(--primary)', color: '#FFF', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={14} /> {userMessages.length} Messages
          </div>
        )}
      </div>
      <ChatBox />
    </div>
  );
}

