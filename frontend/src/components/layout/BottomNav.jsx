import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Compass,
  CalendarCheck,
  MessageSquare,
  User,
  Users,
  BarChart3,
  Settings,
  DollarSign,
  FolderTree,
  HelpCircle,
  Home
} from 'lucide-react';

export default function BottomNav() {
  const { user, activeRole } = useAuth();
  const { notifications, messages } = useData() || {};
  const location = useLocation();

  const userRole = user?.role || activeRole;

  // Unread messages count for authenticated user
  const unreadCount = (messages || []).filter(m => 
    user && Number(m.receiver_id) === Number(user.id) && !m.is_read
  ).length;

  let navItems = [];

  if (userRole === 'user') {
    navItems = [
      { path: '/user', label: 'Home', icon: LayoutDashboard },
      { path: '/explore', label: 'Explore', icon: Compass },
      { path: '/user/bookings', label: 'Bookings', icon: CalendarCheck },
      { path: '/user/messages', label: 'Chat', icon: MessageSquare, badge: unreadCount },
      { path: '/user/profile', label: 'Profile', icon: User }
    ];
  } else if (userRole === 'influencer') {
    navItems = [
      { path: '/creator', label: 'Home', icon: LayoutDashboard },
      { path: '/creator/requests', label: 'Requests', icon: CalendarCheck },
      { path: '/creator/charges', label: 'Rates', icon: DollarSign },
      { path: '/creator/messages', label: 'Chat', icon: MessageSquare, badge: unreadCount },
      { path: '/creator/profile', label: 'Profile', icon: User }
    ];
  } else if (userRole === 'admin') {
    navItems = [
      { path: '/admin', label: 'Home', icon: LayoutDashboard },
      { path: '/admin/influencers', label: 'Creators', icon: Users },
      { path: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
      { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
      { path: '/admin/settings', label: 'Settings', icon: Settings }
    ];
  } else {
    // Guest / Public Visitor
    navItems = [
      { path: '/', label: 'Home', icon: Home },
      { path: '/explore', label: 'Explore', icon: Compass },
      { path: '/categories', label: 'Categories', icon: FolderTree },
      { path: '/how-it-works', label: 'Guide', icon: HelpCircle },
      { path: '/login', label: 'Sign In', icon: User }
    ];
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || 
          (item.path !== '/' && location.pathname.startsWith(item.path));

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon-wrapper">
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              {item.badge > 0 && (
                <span className="bottom-nav-badge">{item.badge > 9 ? '9+' : item.badge}</span>
              )}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

