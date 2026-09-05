import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  LayoutDashboard, Users, FolderTree, CalendarCheck, ShieldCheck, 
  BarChart3, Settings, User, DollarSign, Calendar, MessageSquare, 
  LogOut, Heart, Sparkles, Image, Globe, HelpCircle, ArrowRight, X
} from 'lucide-react';
import { InstagramIcon } from '../common/SocialIcons';

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user, activeRole, logout } = useAuth();
  const { bookings, messages } = useData();
  const location = useLocation();

  // Authenticated user role validation
  const currentRole = user?.role || activeRole || 'user';

  // Calculate user-specific counts dynamically
  const userBookingsCount = bookings ? bookings.filter(b => b.user_id == user?.id || (user?.email && b.user_email === user.email)).length : 0;
  const userMessagesCount = messages ? messages.filter(m => m.sender_id == user?.id || m.receiver_id == user?.id).length : 0;
  const creatorRequestsCount = bookings ? bookings.filter(b => b.influencer_id == user?.id || b.influencer_user_id == user?.id || b.influencer_name === user?.name).length : 0;

  // Role Specific Nav Links
  const adminLinks = [
    { title: 'MAIN', items: [
      { path: '/admin', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { title: 'PLATFORM MANAGEMENT', items: [
      { path: '/admin/influencers', label: 'Influencers', icon: Users },
      { path: '/admin/users', label: 'Businesses & Users', icon: User },
      { path: '/admin/categories', label: 'Niche Categories', icon: FolderTree },
      { path: '/admin/bookings', label: 'Campaign Bookings', icon: CalendarCheck },
      { path: '/admin/availability', label: 'Master Availability', icon: Calendar }
    ]},
    { title: 'ANALYTICS & SYSTEM', items: [
      { path: '/admin/reports', label: 'Financial Reports', icon: BarChart3 },
      { path: '/admin/settings', label: 'System Settings', icon: Settings }
    ]}
  ];

  const influencerLinks = [
    { title: 'MAIN', items: [
      { path: '/creator', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/creator/profile', label: 'My Profile', icon: User }
    ]},
    { title: 'BUSINESS', items: [
      { path: '/creator/requests', label: 'Bookings & Requests', icon: CalendarCheck, badge: creatorRequestsCount > 0 ? creatorRequestsCount.toString() : null },
      { path: '/creator/charges', label: 'Services & Rate Card', icon: DollarSign },
      { path: '/creator/portfolio', label: 'Portfolio Gallery', icon: Image }
    ]},
    { title: 'REACH & ENGAGEMENT', items: [
      { path: '/creator/socials', label: 'Social Handles', icon: Globe },
      { path: '/creator/availability', label: 'Availability Calendar', icon: Calendar },
      { path: '/creator/analytics', label: 'Analytics Insights', icon: BarChart3 }
    ]},
    { title: 'COMMUNICATION', items: [
      { path: '/creator/messages', label: 'Messages', icon: MessageSquare, badge: userMessagesCount > 0 ? userMessagesCount.toString() : null }
    ]}
  ];

  const userLinks = [
    { title: 'MAIN', items: [
      { path: '/user', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/user/bookings', label: 'My Bookings', icon: CalendarCheck, badge: userBookingsCount > 0 ? userBookingsCount.toString() : null }
    ]},
    { title: 'DISCOVERY', items: [
      { path: '/explore', label: 'Find Influencers', icon: Sparkles },
      { path: '/user/favorites', label: 'Wishlist', icon: Heart }
    ]},
    { title: 'COMMUNICATION', items: [
      { path: '/user/messages', label: 'Messages', icon: MessageSquare, badge: userMessagesCount > 0 ? userMessagesCount.toString() : null }
    ]},
    { title: 'ACCOUNT', items: [
      { path: '/user/profile', label: 'Profile', icon: User },
      { path: '/user/settings', label: 'Settings', icon: Settings }
    ]}
  ];

  const navGroups = currentRole === 'admin' ? adminLinks : currentRole === 'influencer' ? influencerLinks : userLinks;

  const displayName = user?.name || (currentRole === 'admin' ? 'Admin Portal' : currentRole === 'influencer' ? 'Aanya Verma' : 'User Account');
  const displayAvatar = user?.avatar || (currentRole === 'admin' ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" : currentRole === 'influencer' ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100");

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className={`sidebar-backdrop ${mobileOpen ? 'active' : ''}`} 
        onClick={onCloseMobile} 
        aria-hidden="true"
      />

      <aside className={`sidebar-aside animate-fade-in ${mobileOpen ? 'mobile-open' : ''}`}>
        <div>
          {/* User Mini Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px', marginBottom: '16px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img 
                  src={displayAvatar} 
                  alt={displayName} 
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', bottom: '0', right: '0', width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', border: '2px solid var(--bg-card)' }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ color: 'var(--text-main)', fontSize: '0.86rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'capitalize' }}>
                  {currentRole === 'user' ? 'Brand User' : `${currentRole} Panel`}
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              type="button"
              className="btn btn-secondary mobile-close-btn" 
              onClick={onCloseMobile}
              style={{ padding: '6px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0 }}
              title="Close menu"
            >
              <X size={16} />
            </button>
          </div>

        {/* Navigation Group Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.06em', padding: '0 8px 6px 8px', display: 'block' }}>
                {group.title}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      end={item.path === '/admin' || item.path === '/creator' || item.path === '/user'}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#FFFFFF' : 'var(--text-main)',
                        background: isActive ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
                      })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span style={{ background: '#EF4444', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Logout Button */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '16px' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

    </aside>
    </>
  );
}
