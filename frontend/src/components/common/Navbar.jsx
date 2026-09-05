import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Bell, User, LogOut, Shield, Sparkles, Briefcase, Sun, Moon, ChevronDown, Check, LayoutDashboard, Menu
} from 'lucide-react';

export default function Navbar({ onToggleMobileSidebar, isPanelRoute }) {
  const { user, activeRole, theme, toggleTheme, logout } = useAuth();
  const { notifications, markAllNotificationsRead, siteSettings } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const unreadNotifs = (notifications || []).filter(n => !n.read).length;
  const userRole = user?.role || activeRole;

  const getDashboardPath = () => {
    if (userRole === 'admin') return '/admin';
    if (userRole === 'influencer') return '/creator';
    if (userRole === 'user') return '/user';
    return '/';
  };

  // Close mobile nav on route change
  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile nav drawer is open
  React.useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  // =========================================================================
  // CREATOR / INFLUENCER SPECIFIC HEADER
  // Renders ONLY creator controls. Public website navigation links are removed!
  // =========================================================================
  if (userRole === 'influencer') {
    return (
      <header className="main-navbar-fixed" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, width: '100%', height: '68px', background: 'var(--bg-nav)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 clamp(12px, 2.5vw, 28px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

          {/* Creator Brand Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)', minWidth: 0, flex: '1 1 auto' }}>
            {onToggleMobileSidebar && (
              <button
                type="button"
                className="btn btn-secondary mobile-menu-btn"
                onClick={onToggleMobileSidebar}
                style={{ width: '38px', height: '38px', padding: 0, borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Toggle Creator Navigation Menu"
              >
                <Menu size={19} />
              </button>
            )}
            <Link to="/creator" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0, overflow: 'hidden' }}>
              {siteSettings?.logo_url ? (
                <img src={siteSettings.logo_url} alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }} />
              ) : (
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px var(--primary-glow)', flexShrink: 0 }}>
                  <Sparkles size={20} color="#FFF" />
                </div>
              )}
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <h2 className="gradient-text navbar-logo-title" style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)', lineHeight: 1.15, fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
                  {siteSettings?.site_name || 'InfluencerConnect'}
                </h2>
                <span className="hide-on-mobile" style={{ fontSize: '0.68rem', color: 'var(--primary)', letterSpacing: '0.08em', fontWeight: 800, display: 'block', marginTop: '1px' }}>
                  CREATOR DASHBOARD PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Creator Top Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.2vw, 12px)', flexShrink: 0 }}>

            {/* Theme Toggle */}
            <button
              className="btn btn-secondary navbar-theme-btn"
              onClick={toggleTheme}
              style={{ padding: '7px 14px', borderRadius: '20px', gap: '6px', fontSize: '0.84rem', fontWeight: 600, height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="var(--primary)" />}
              <span className="hide-on-mobile" style={{ textTransform: 'capitalize', color: 'var(--text-main)', fontWeight: 600 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Notifications Dropdown */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (!showNotifs && markAllNotificationsRead) {
                      markAllNotificationsRead();
                    }
                    setShowNotifs(!showNotifs);
                  }}
                  style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Notifications"
                >
                  <Bell size={18} color="var(--text-main)" />
                  {unreadNotifs > 0 && (
                    <span style={{ position: 'absolute', top: '3px', right: '3px', background: '#EF4444', width: '9px', height: '9px', borderRadius: '50%', border: '2px solid var(--bg-card)' }} />
                  )}
                </button>

                {showNotifs && (
                  <div className="glass-panel animate-fade-in" style={{ position: 'absolute', right: 0, top: '48px', width: '320px', maxWidth: 'calc(100vw - 24px)', padding: '16px', zIndex: 100, boxSizing: 'border-box', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <span>Notifications</span>
                      <span className={`badge ${unreadNotifs > 0 ? 'badge-amber' : 'badge-purple'}`} style={{ fontSize: '0.72rem' }}>
                        {unreadNotifs > 0 ? `${unreadNotifs} New` : 'All Read'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto' }}>
                      {(!notifications || notifications.length === 0) ? (
                        <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                          <Bell size={24} color="var(--text-dim)" style={{ marginBottom: '6px', opacity: 0.6 }} />
                          <p>No new notifications right now.</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '10px 12px', borderRadius: '8px', background: n.read ? 'var(--bg-card)' : 'var(--bg-input)', borderLeft: n.read ? 'none' : '3px solid var(--primary)', fontSize: '0.84rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</div>
                            <div style={{ color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{n.message}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Creator Profile Dropdown */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{ height: '38px', padding: '3px 10px 3px 3px', borderRadius: '24px', gap: '8px', display: 'flex', alignItems: 'center' }}
                >
                  <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span className="hide-on-mobile" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-dim)" />
                </button>

                {showUserDropdown && (
                  <div className="glass-panel animate-fade-in" style={{ position: 'absolute', right: 0, top: '48px', width: '220px', maxWidth: 'calc(100vw - 24px)', padding: '10px', zIndex: 100, boxSizing: 'border-box', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>Creator Account</div>
                    </div>

                    <Link
                      to="/creator"
                      onClick={() => setShowUserDropdown(false)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', background: 'none', border: 'none', color: 'var(--text-main)', textDecoration: 'none', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600 }}
                    >
                      <LayoutDashboard size={16} color="var(--primary)" /> Creator Dashboard
                    </Link>

                    <Link
                      to="/creator/profile"
                      onClick={() => setShowUserDropdown(false)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', background: 'none', border: 'none', color: 'var(--text-main)', textDecoration: 'none', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600 }}
                    >
                      <User size={16} color="var(--accent-pink)" /> Edit Profile
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                        setShowUserDropdown(false);
                      }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600, marginTop: '4px', borderTop: '1px solid var(--border-color)' }}
                    >
                      <LogOut size={16} /> Sign Out Account
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </header>
    );
  }

  // =========================================================================
  // PUBLIC WEBSITE & NORMAL USER HEADER
  // Renders public website header navigation (Home, Explore, Categories, How It Works)
  // =========================================================================
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/explore', label: 'Explore Creators' },
    { path: '/categories', label: 'Categories' },
    { path: '/how-it-works', label: 'How It Works' },
  ];

  if (activeRole !== 'guest' && userRole === 'user') {
    navItems.unshift({
      path: '/user',
      label: 'User Dashboard',
      isDashboard: true
    });
  }

  if (userRole === 'admin') {
    navItems.unshift({
      path: '/admin',
      label: 'Admin Dashboard',
      isDashboard: true
    });
  }

  return (
    <>
      {/* Mobile Nav Backdrop Overlay */}
      {mobileNavOpen && (
        <div
          className="mobile-nav-backdrop active"
          onClick={() => setMobileNavOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 998 }}
        />
      )}

      <header className="main-navbar-fixed" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, width: '100%', height: '68px', background: 'var(--bg-nav)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border-color)', boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '0 clamp(12px, 2.5vw, 28px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>

          {/* Left Section: Mobile Menu Button + Brand Logo Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.5vw, 12px)', minWidth: 0, flex: '1 1 auto' }}>
            {isPanelRoute && onToggleMobileSidebar && (
              <button
                type="button"
                className="btn btn-secondary mobile-menu-btn"
                onClick={onToggleMobileSidebar}
                style={{ width: '38px', height: '38px', padding: 0, borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Toggle Navigation Menu"
              >
                <Menu size={19} />
              </button>
            )}

            {!isPanelRoute && (
              <button
                type="button"
                className="btn btn-secondary mobile-menu-btn"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                style={{ width: '38px', height: '38px', padding: 0, borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Toggle Navigation Menu"
              >
                <Menu size={19} />
              </button>
            )}

            <Link
              to={getDashboardPath()}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minWidth: 0, overflow: 'hidden' }}
            >
              {siteSettings?.logo_url ? (
                <img src={siteSettings.logo_url} alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }} />
              ) : (
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))', width: '38px', height: '38px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px var(--primary-glow)', flexShrink: 0 }}>
                  <Sparkles size={20} color="#FFF" />
                </div>
              )}
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <h2 className="gradient-text navbar-logo-title" style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)', lineHeight: 1.15, fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
                  {siteSettings?.site_name || 'InfluencerConnect'}
                </h2>
                {activeRole !== 'guest' && (
                  <span className="hide-on-mobile" style={{ fontSize: '0.68rem', color: 'var(--primary)', letterSpacing: '0.08em', fontWeight: 800, display: 'block', marginTop: '1px' }}>
                    {activeRole.toUpperCase()} DASHBOARD
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Public Header Navigation Links */}
          <nav className={`public-nav-links ${mobileNavOpen ? 'mobile-nav-active' : ''}`} style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'var(--bg-input)', padding: '5px', borderRadius: '30px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileNavOpen(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    background: item.isDashboard
                      ? 'linear-gradient(135deg, var(--primary), var(--accent-purple))'
                      : isActive
                        ? 'var(--bg-card)'
                        : 'transparent',
                    color: item.isDashboard ? '#FFFFFF' : isActive ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: (isActive || item.isDashboard) ? 700 : 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    boxShadow: item.isDashboard
                      ? '0 4px 15px var(--primary-glow)'
                      : isActive
                        ? '0 2px 8px rgba(0,0,0,0.1)'
                        : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {item.isDashboard && <LayoutDashboard size={16} />}
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Drawer Auth Links (ONLY shown inside mobile drawer when opened on small screens) */}
            {!user && mobileNavOpen && (
              <div className="mobile-drawer-auth-box" style={{ marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.94rem', fontWeight: 600, borderRadius: '10px' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileNavOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.94rem', fontWeight: 700, borderRadius: '10px' }}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </nav>

          {/* Right Action Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.2vw, 12px)', flexShrink: 0 }}>

            {/* THEME TOGGLE (DARK / LIGHT MODE) */}
            <button
              className="btn btn-secondary navbar-theme-btn"
              onClick={toggleTheme}
              style={{ padding: '7px 14px', borderRadius: '20px', gap: '6px', fontSize: '0.84rem', fontWeight: 600, height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="var(--primary)" />}
              <span className="hide-on-mobile" style={{ textTransform: 'capitalize', color: 'var(--text-main)', fontWeight: 600 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Notifications Dropdown */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (!showNotifs && markAllNotificationsRead) {
                      markAllNotificationsRead();
                    }
                    setShowNotifs(!showNotifs);
                  }}
                  style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Notifications"
                >
                  <Bell size={18} color="var(--text-main)" />
                  {unreadNotifs > 0 && (
                    <span style={{ position: 'absolute', top: '3px', right: '3px', background: '#EF4444', width: '9px', height: '9px', borderRadius: '50%', border: '2px solid var(--bg-card)' }} />
                  )}
                </button>

                {showNotifs && (
                  <div className="glass-panel animate-fade-in" style={{ position: 'absolute', right: 0, top: '48px', width: '320px', maxWidth: 'calc(100vw - 24px)', padding: '16px', zIndex: 100, boxSizing: 'border-box', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      <span>Notifications</span>
                      <span className={`badge ${unreadNotifs > 0 ? 'badge-amber' : 'badge-purple'}`} style={{ fontSize: '0.72rem' }}>
                        {unreadNotifs > 0 ? `${unreadNotifs} New` : 'All Read'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto' }}>
                      {(!notifications || notifications.length === 0) ? (
                        <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
                          <Bell size={24} color="var(--text-dim)" style={{ marginBottom: '6px', opacity: 0.6 }} />
                          <p>No new notifications right now.</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '10px 12px', borderRadius: '8px', background: n.read ? 'var(--bg-card)' : 'var(--bg-input)', borderLeft: n.read ? 'none' : '3px solid var(--primary)', fontSize: '0.84rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{n.title}</div>
                            <div style={{ color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{n.message}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth Actions */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{ height: '38px', padding: '3px 10px 3px 3px', borderRadius: '24px', gap: '8px', display: 'flex', alignItems: 'center' }}
                >
                  <img src={user.avatar} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span className="hide-on-mobile" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-dim)" />
                </button>

                {showUserDropdown && (
                  <div className="glass-panel animate-fade-in" style={{ position: 'absolute', right: 0, top: '48px', width: '220px', maxWidth: 'calc(100vw - 24px)', padding: '10px', zIndex: 100, boxSizing: 'border-box', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setShowUserDropdown(false)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', background: 'none', border: 'none', color: 'var(--text-main)', textDecoration: 'none', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600 }}
                    >
                      <LayoutDashboard size={16} color="var(--primary)" /> Go to Dashboard
                    </Link>

                    <Link
                      to="/user/profile"
                      onClick={() => setShowUserDropdown(false)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', background: 'none', border: 'none', color: 'var(--text-main)', textDecoration: 'none', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600 }}
                    >
                      <User size={16} color="var(--accent-pink)" /> Edit Profile
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                        setShowUserDropdown(false);
                      }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', borderRadius: '6px', fontSize: '0.88rem', fontWeight: 600, marginTop: '4px', borderTop: '1px solid var(--border-color)' }}
                    >
                      <LogOut size={16} /> Sign Out Account
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link to="/login" className="btn btn-secondary hide-on-mobile" style={{ padding: '8px 18px', fontSize: '0.88rem', height: '38px', borderRadius: '10px', fontWeight: 600 }}>Sign In</Link>
                <Link to="/register" className="btn btn-primary navbar-header-cta" style={{ padding: '8px 20px', fontSize: '0.88rem', height: '38px', borderRadius: '10px', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 18px var(--primary-glow)' }}>Get Started</Link>
              </div>
            )}

          </div>

        </div>
      </header>
    </>
  );
}
