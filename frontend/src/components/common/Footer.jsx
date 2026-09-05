import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, TwitterIcon, LinkedinIcon } from './SocialIcons';

export default function Footer() {
  const { siteSettings } = useData();

  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: 'clamp(40px, 6vw, 60px) clamp(16px, 3vw, 24px) 24px clamp(16px, 3vw, 24px)', marginTop: 'clamp(40px, 6vw, 80px)', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '32px' }}>
        
        {/* Brand Column */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            {siteSettings?.logo_url ? (
              <img src={siteSettings.logo_url} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }} />
            ) : (
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))', padding: '6px', borderRadius: '10px', flexShrink: 0 }}>
                <Sparkles size={20} color="#FFF" />
              </div>
            )}
            <h3 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {siteSettings?.site_name || 'InfluencerConnect'}
            </h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '18px' }}>
            {siteSettings?.footer_about || 'The premier zero-commission marketplace connecting innovative brands directly with high-impact social media creators.'}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}><InstagramIcon size={18} /></a>
            <a href="#" style={{ color: 'var(--text-muted)' }}><YoutubeIcon size={18} /></a>
            <a href="#" style={{ color: 'var(--text-muted)' }}><TwitterIcon size={18} /></a>
            <a href="#" style={{ color: 'var(--text-muted)' }}><LinkedinIcon size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.96rem', marginBottom: '14px', fontWeight: 700 }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <li><Link to="/explore" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Explore Influencers</Link></li>
            <li><Link to="/categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Browse Categories</Link></li>
            <li><Link to="/how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>How It Works</Link></li>
            <li><Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link></li>
          </ul>
        </div>

        {/* For Creators & Businesses */}
        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.96rem', marginBottom: '14px', fontWeight: 700 }}>For Users & Creators</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <li><Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Join as Influencer</Link></li>
            <li><Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Register Business</Link></li>
            <li><Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Account Login</Link></li>
            <li><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact & Help</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ minWidth: 0 }}>
          <h4 style={{ color: 'var(--text-main)', fontSize: '0.96rem', marginBottom: '14px', fontWeight: 700 }}>Contact Support</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', wordBreak: 'break-word' }}>
              <Mail size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> 
              {siteSettings?.contact_email || 'support@influencerconnect.com'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> 
              {siteSettings?.contact_phone || '+91 98765 43210'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} /> 
              {siteSettings?.contact_address || 'Tech Park Tower B, Suite 402, Bangalore, India'}
            </div>
          </div>
        </div>

      </div>

      <div style={{ maxWidth: '1200px', margin: '32px auto 0 auto', paddingTop: '18px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
        <div>© 2026 {siteSettings?.site_name || 'InfluencerConnect'} Platform. All rights reserved. Completely Free & Direct Negotiations.</div>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/privacy" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
