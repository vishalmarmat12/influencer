import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { X, Calendar, DollarSign, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookingModal({ influencer, onClose }) {
  const { createBooking, checkDateAvailability } = useData();
  const { user } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  // Default initial date set to 2 days ahead
  const defaultDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    campaign_name: '',
    business_name: user?.name || '',
    promotion_type: influencer?.services?.[0]?.type || 'Instagram Reel',
    description: '',
    date: defaultDate,
    time: '14:00',
    budget: influencer?.starting_price || 15000
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const infId = influencer?.id || influencer?.user_id || 1;
  const availCheck = checkDateAvailability(infId, formData.date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Role check: Influencer accounts cannot create campaign bookings
    if (user && user.role === 'influencer') {
      setErrorMsg('Influencer accounts cannot book influencers. Please log in with a Client/Business account to create campaign bookings.');
      return;
    }

    // Self-booking check: logged_in_user_id == influencer_id
    if (user && (Number(user.id) === Number(infId) || Number(user.id) === Number(influencer?.user_id) || (user.email && influencer?.email && user.email.toLowerCase() === influencer.email.toLowerCase()))) {
      setErrorMsg('You cannot book yourself.');
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

    setLoading(true);
    const res = await createBooking({
      user_id: user?.id || 2,
      user_name: user?.name || 'Brand User',
      influencer_id: infId,
      influencer_user_id: influencer?.user_id || infId,
      influencer_name: influencer?.name,
      ...formData
    });
    setLoading(false);

    if (res && res.success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      setErrorMsg(res?.message || 'Failed to submit booking. Date may be unavailable.');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '580px', padding: '32px', position: 'relative', background: 'var(--bg-card)' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={60} color="var(--accent-emerald)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Booking Request Sent!</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Your appointment request has been submitted to {influencer?.name}. You can chat directly in your dashboard.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <img src={influencer?.avatar} alt={influencer?.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800 }}>Book Appointment</h3>
                <span style={{ fontSize: '0.86rem', color: 'var(--primary)', fontWeight: 600 }}>{influencer?.name} • {influencer?.category}</span>
              </div>
            </div>

            {errorMsg && (
              <div style={{ padding: '12px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Campaign Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Summer Wear Launch 2026"
                  required
                  value={formData.campaign_name}
                  onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business / Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TechGear Lifestyle"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Promotion Type</label>
                  <select
                    className="form-select"
                    value={formData.promotion_type}
                    onChange={(e) => setFormData({ ...formData, promotion_type: e.target.value })}
                  >
                    <option value="Instagram Reel">Instagram Reel</option>
                    <option value="Instagram Story">Instagram Story</option>
                    <option value="Instagram Post">Instagram Post</option>
                    <option value="YouTube Video">YouTube Video</option>
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Event Visit">Event Visit</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Offered Budget (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
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
                  <label className="form-label">Preferred Time Slot</label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* REAL-TIME AVAILABILITY STATUS WARNING BADGE */}
              {!availCheck.isAvailable ? (
                <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '8px', marginBottom: '16px', color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                  🔴 Unavailable Date selected! {influencer?.name} is <strong>{availCheck.statusLabel}</strong> on {formData.date} {availCheck.notes ? `(${availCheck.notes})` : ''}. Please choose another date.
                </div>
              ) : (
                <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '8px', marginBottom: '16px', color: 'var(--accent-emerald)', fontSize: '0.82rem', fontWeight: 600 }}>
                  🟢 Date Available: {influencer?.name} is open for bookings on {formData.date}.
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Campaign Description & Deliverables</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Detail your goals, product sample delivery, and deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!availCheck.isAvailable || loading}
                  style={{ opacity: !availCheck.isAvailable ? 0.5 : 1, cursor: !availCheck.isAvailable ? 'not-allowed' : 'pointer' }}
                >
                  <Send size={16} /> {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
