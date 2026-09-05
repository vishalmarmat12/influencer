import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/common/Footer';
import { useAuth } from './context/AuthContext';

// Pages Import
import Home from './pages/public/Home';
import Explore from './pages/public/Explore';
import InfluencerDetail from './pages/public/InfluencerDetail';
import BookInfluencer from './pages/public/BookInfluencer';
import { CategoriesPage, HowItWorksPage, AboutUsPage, ContactPage, LegalPage } from './pages/public/OtherPublicPages';

import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/auth/AuthPages';

import { AdminDashboard, InfluencerMgmt, UserMgmt, CategoryMgmt, BookingMgmt, AdminSettingsPage, AdminAvailabilityMgmt, AdminReportsPage } from './pages/admin/AdminPages';
import { InfluencerDashboard, InfluencerProfileEdit, InfluencerSocialsPage, InfluencerCharges, InfluencerPortfolioPage, InfluencerAvailability, InfluencerMessagesWorkspace, InfluencerAnalyticsPage, InfluencerRequestsPage } from './pages/influencer/InfluencerPages';
import { UserDashboard, UserBookingsPage, UserFavorites, UserMessagesWorkspace, UserProfileEdit } from './pages/user/UserPages';

// Protected Route Authentication Guard (Panel Access)
function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const role = user.role || 'user';

  // Admin superuser has full accessibility to view any protected panel route
  if (role === 'admin') {
    return children ? children : <Outlet />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === 'influencer') return <Navigate to="/creator" replace />;
    if (role === 'user') return <Navigate to="/user" replace />;
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

// Client / User Discovery Route Guard (Influencers redirected to /creator; Admin has full accessibility to all marketplace pages)
function ClientDiscoveryRoute({ children }) {
  const { user } = useAuth();
  if (user && user.role === 'influencer') {
    return <Navigate to="/creator" replace />;
  }
  return children ? children : <Outlet />;
}

function AppLayout() {
  const { user, activeRole } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const userRole = user?.role || activeRole;

  const isPanelRoute = location.pathname.startsWith('/admin') || 
                       location.pathname.startsWith('/creator') || 
                       location.pathname.startsWith('/user');

  // Creator Role always renders Creator Dashboard Layout (Creator Sidebar + Creator Header)
  const isCreatorRole = userRole === 'influencer';

  // Automatically close mobile sidebar on route navigation
  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
        isPanelRoute={isPanelRoute || isCreatorRole}
      />
      
      {(isPanelRoute || isCreatorRole) ? (
        <div className="panel-layout">
          <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
          <main className="panel-main-content">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="public-main-content">
          <Outlet />
        </main>
      )}

      {(!isPanelRoute && !isCreatorRole) && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Client / User Only Discovery & Profile Routes (Influencers Redirected to /creator) */}
        <Route element={<ClientDiscoveryRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/creators" element={<Explore />} />
          <Route path="/influencer/:id" element={<InfluencerDetail />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/book-influencer/:influencerId" element={<BookInfluencer />} />
          <Route path="/book-influencer/:id" element={<BookInfluencer />} />
          <Route path="/booking/:id" element={<BookInfluencer />} />
          <Route path="/book-influencer" element={<Explore />} />
          <Route path="/appointment/create" element={<Explore />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Admin Panel Routes (Admin Role Only) */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/influencers" element={<InfluencerMgmt />} />
          <Route path="/admin/users" element={<UserMgmt />} />
          <Route path="/admin/categories" element={<CategoryMgmt />} />
          <Route path="/admin/bookings" element={<BookingMgmt />} />
          <Route path="/admin/availability" element={<AdminAvailabilityMgmt />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Protected Creator / Influencer Panel Routes (Influencer Role Only) */}
        <Route element={<ProtectedRoute allowedRole="influencer" />}>
          <Route path="/creator" element={<InfluencerDashboard />} />
          <Route path="/creator/profile" element={<InfluencerProfileEdit />} />
          <Route path="/creator/socials" element={<InfluencerSocialsPage />} />
          <Route path="/creator/charges" element={<InfluencerCharges />} />
          <Route path="/creator/portfolio" element={<InfluencerPortfolioPage />} />
          <Route path="/creator/availability" element={<InfluencerAvailability />} />
          <Route path="/creator/requests" element={<InfluencerRequestsPage />} />
          <Route path="/creator/messages" element={<InfluencerMessagesWorkspace />} />
          <Route path="/creator/analytics" element={<InfluencerAnalyticsPage />} />
          <Route path="/creator/settings" element={<InfluencerProfileEdit />} />
        </Route>

        {/* Protected User / Business Panel Routes (User Role Only) */}
        <Route element={<ProtectedRoute allowedRole="user" />}>
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/bookings" element={<UserBookingsPage />} />
          <Route path="/user/favorites" element={<UserFavorites />} />
          <Route path="/user/messages" element={<UserMessagesWorkspace />} />
          <Route path="/user/profile" element={<UserProfileEdit />} />
          <Route path="/user/settings" element={<UserProfileEdit />} />
        </Route>

        {/* Catch All Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
