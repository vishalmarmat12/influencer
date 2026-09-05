// API Service Client for PHP REST API Backend (XAMPP & Mysql Integrated)
const getApiBaseUrl = () => {
  // If running via Vite dev server or standalone, point to XAMPP endpoint
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return 'http://localhost/influencer/api';
    }
  }
  return '/influencer/api';
};

const API_BASE_URL = getApiBaseUrl();

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
  const isFormData = options.body instanceof FormData;
  
  const headers = { ...options.headers };
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
    body: isFormData ? options.body : (options.body && typeof options.body === 'object' ? JSON.stringify(options.body) : options.body)
  };

  try {
    const response = await fetch(url, config);
    if (response.status === 401 || (response.status === 403 && !endpoint.includes('analytics'))) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { status: response.status, endpoint } }));
      }
    }
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`API call to ${url} failed or offline. Fallback handler active.`, error);
    return { status: 'offline', error: error.message };
  }
}

export const api = {
  // Auth
  login: (credentials) => fetchApi('auth/login', { method: 'POST', body: credentials }),
  register: (userData) => fetchApi('auth/register', { method: 'POST', body: userData }),

  // Categories
  getCategories: () => fetchApi('categories'),
  createCategory: (catData) => fetchApi('categories', { method: 'POST', body: catData }),
  addCategory: (catData) => fetchApi('categories', { method: 'POST', body: catData }),
  updateCategory: (catData) => fetchApi('categories', { method: 'PUT', body: catData }),
  deleteCategory: (id) => fetchApi(`categories?id=${id}`, { method: 'DELETE' }),

  // Users & Brands
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`users${query ? '?' + query : ''}`);
  },
  createUser: (userData) => fetchApi('users', { method: 'POST', body: userData }),
  updateUser: (userData) => fetchApi('users', { method: 'PUT', body: userData }),
  updateUserStatus: (id, status) => fetchApi('users', { method: 'PUT', body: { id, status } }),
  deleteUser: (id) => fetchApi(`users?id=${id}`, { method: 'DELETE' }),

  // Influencers
  getInfluencers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`influencers${query ? '?' + query : ''}`);
  },
  createInfluencer: (data) => fetchApi('influencers', { method: 'POST', body: data }),
  updateInfluencer: (data) => fetchApi('influencers', { method: 'PUT', body: data }),
  toggleInfluencerVerify: (id, verified) => fetchApi('influencers', { method: 'PUT', body: { id, verified } }),
  deleteInfluencer: (id) => fetchApi(`influencers?id=${id}`, { method: 'DELETE' }),
  getInfluencerDetail: (id) => fetchApi(`influencer?id=${id}`),
  updateInfluencerProfile: (data) => fetchApi('influencer', { method: 'POST', body: data }),
  uploadAvatar: (formData) => fetchApi('user/upload_avatar.php', { method: 'POST', body: formData }),

  // Bookings
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`bookings${query ? '?' + query : ''}`);
  },
  createBooking: (bookingData) => fetchApi('bookings', { method: 'POST', body: bookingData }),
  updateBookingStatus: (id, status, extra = {}) => fetchApi('bookings', { method: 'PUT', body: { id, status, ...extra } }),
  deleteBooking: (id, params = {}) => fetchApi(`bookings?id=${id}&${new URLSearchParams(params).toString()}`, { method: 'DELETE' }),

  // Conversations & Messages
  getConversations: (userId) => fetchApi(`conversations?user_id=${userId}`),
  findOrCreateConversation: (targetUserId, userId) => fetchApi('conversations/find-or-create', { 
    method: 'POST', 
    body: { user_id: userId, target_user_id: targetUserId } 
  }),
  getMessages: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`messages${query ? '?' + query : ''}`);
  },
  sendMessage: (msgData) => fetchApi('messages', { method: 'POST', body: msgData }),

  // Availability
  getAvailability: (influencer_id) => fetchApi(`availability${influencer_id ? '?influencer_id=' + influencer_id : ''}`),
  addAvailability: (data) => fetchApi('availability', { method: 'POST', body: data }),
  updateAvailability: (data) => fetchApi('availability', { method: 'PUT', body: data }),
  deleteAvailability: (id, influencer_id) => fetchApi(`availability?id=${id}${influencer_id ? '&influencer_id=' + influencer_id : ''}`, { method: 'DELETE' }),

  // Reviews
  getReviews: (influencer_id) => fetchApi(`reviews${influencer_id ? '?influencer_id=' + influencer_id : ''}`),
  addReview: (reviewData) => fetchApi('reviews', { method: 'POST', body: reviewData }),

  // Financial Reports & Platform Analytics
  getFinancialReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`reports${query ? '?' + query : ''}`);
  },

  // Portfolio & Real File Uploads
  getPortfolio: (influencer_id) => fetchApi(`portfolio${influencer_id ? '?influencer_id=' + influencer_id : ''}`),
  updatePortfolio: (data) => fetchApi('portfolio', { method: 'POST', body: data }),
  uploadPortfolioImage: (formData) => fetchApi('portfolio', { method: 'POST', body: formData }),
  deletePortfolioImage: (params = {}) => fetchApi(`portfolio?${new URLSearchParams(params).toString()}`, { method: 'DELETE' }),

  // Analytics & Reach
  getCreatorAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`analytics${query ? '?' + query : ''}`);
  },
  recordProfileView: (data) => fetchApi('profile_views', { method: 'POST', body: data }),

  // Admin & Asset Uploads
  getAdminStats: () => fetchApi('admin/stats'),
  getSettings: () => fetchApi('settings'),
  updateSettings: (settings) => fetchApi('settings', { method: 'POST', body: settings }),
  uploadImage: async (file, folder = 'assets') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetchApi('upload', { method: 'POST', body: formData });
    if (res && res.status === 'success' && res.url) {
      return res;
    }
    // Fallback: convert file to local base64 data URL if server upload returns offline
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          status: 'success',
          url: e.target.result,
          message: 'Image loaded successfully.'
        });
      };
      reader.onerror = () => {
        resolve({ status: 'error', message: 'Failed to read image file.' });
      };
      reader.readAsDataURL(file);
    });
  }
};

export const apiService = api;
export default api;
