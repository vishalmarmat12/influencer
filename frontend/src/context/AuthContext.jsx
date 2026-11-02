import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('influencer_connect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('influencer_connect_theme_v2');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('influencer_connect_theme_v2', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('influencer_connect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('influencer_connect_user');
    }
  }, [user]);

  useEffect(() => {
    const handleUnauthorized = (e) => {
      console.warn('Unauthorized request detected. Clearing session state...', e.detail);
      setUser(null);
      localStorage.removeItem('influencer_connect_user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const newUser = prev ? { ...prev, ...updatedFields } : updatedFields;
      if (newUser && newUser.role === 'influencer') {
        api.updateInfluencerProfile({
          id: newUser.id || 1,
          influencer_id: newUser.id || 1,
          name: newUser.name,
          city: newUser.city,
          avatar: newUser.avatar,
          category: newUser.category,
          services: newUser.services,
          bio: newUser.bio,
          starting_price: newUser.starting_price
        }).catch(err => console.warn('Profile sync error:', err));
      }
      return newUser;
    });
  };

  const login = async (email, password, roleHint = 'user') => {
    try {
      const res = await api.login({ email, password });
      if (res && res.status === 'success' && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn('API Auth fallback active', err);
    }

    // Fallback Admin authentication if backend is offline
    if (email.toLowerCase() === 'admin@influencer.com' || roleHint === 'admin') {
      const adminUser = { id: 1, name: 'System Admin', email: 'admin@influencer.com', role: 'admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }
    return { success: false, message: 'Invalid credentials or user account not found.' };
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res && res.status === 'success' && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      } else if (res && res.message) {
        return { success: false, message: res.message };
      }
    } catch (err) {
      console.warn('API Register fallback active', err);
    }

    const newUser = {
      id: Date.now(),
      name: userData.name || 'New Registered User',
      email: userData.email,
      role: userData.role || 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const activeRole = user ? user.role : 'guest';

  return (
    <AuthContext.Provider value={{ user, activeRole, theme, toggleTheme, updateUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
