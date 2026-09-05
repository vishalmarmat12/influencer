import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Briefcase, ShieldCheck, CheckCircle2, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect param from URL if present
  const queryParams = new URLSearchParams(location.search);
  const redirectParam = queryParams.get('redirect');

  const [selectedRole, setSelectedRole] = useState('user'); // user, influencer, admin
  const [email, setEmail] = useState('user@demo.com');
  const [password, setPassword] = useState('user123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setEmail('admin@influencer.com');
      setPassword('admin123');
    } else if (role === 'influencer') {
      setEmail('influencer@demo.com');
      setPassword('creator123');
    } else {
      setEmail('user@demo.com');
      setPassword('user123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email.trim(), password, selectedRole);
      if (res && res.user) {
        const userRole = res.user.role;

        // Verify role authorization
        if (selectedRole === 'admin' && userRole !== 'admin') {
          setErrorMsg('Unauthorized: Account is not an Admin!');
          setLoading(false);
          return;
        }

        // Navigate to appropriate panel or redirect query path
        if (redirectParam) {
          navigate(redirectParam);
        } else if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'influencer') {
          navigate('/creator');
        } else {
          navigate('/user');
        }
      } else {
        setErrorMsg('Invalid email or password credentials.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '480px', margin: '20px auto 0 auto', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-pink))', width: '48px', height: '48px', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', boxShadow: '0 6px 20px var(--primary-glow)' }}>
            <Sparkles size={24} color="#FFF" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', color: 'var(--text-main)', fontWeight: 800 }}>Panel Authentication</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>Select panel role and log in with credentials</p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', background: 'var(--bg-input)', padding: '4px', borderRadius: '12px', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
          {[
            { role: 'user', label: 'Business User' },
            { role: 'influencer', label: 'Creator' },
            { role: 'admin', label: 'Admin' }
          ].map(r => {
            const isSelected = selectedRole === r.role;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => handleRoleChange(r.role)}
                style={{
                  padding: '9px 4px',
                  border: 'none',
                  borderRadius: '8px',
                  background: isSelected ? 'linear-gradient(135deg, var(--primary), var(--accent-purple))' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px var(--primary-glow)' : 'none',
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* PRESET HINT BOX */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '10px 12px', borderRadius: '10px', marginBottom: '18px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
            <KeyRound size={14} /> Panel Login Credentials:
          </div>
          <div style={{ color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
            <span>Email: <strong>{email}</strong></span>
            <span>Pass: <strong>{password}</strong></span>
          </div>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '8px', marginBottom: '18px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : `Sign In to ${selectedRole === 'admin' ? 'Admin Panel' : selectedRole === 'influencer' ? 'Creator Panel' : 'Business Panel'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
            Register Free
          </button>
        </div>

      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const { loadData } = useData();
  const navigate = useNavigate();

  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [city, setCity] = useState('Mumbai');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setErrorMsg('Please enter a valid full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: trimmedName,
        email: email.trim(),
        password,
        role,
        category: role === 'influencer' ? category : undefined,
        city: role === 'influencer' ? (city.trim() || 'Mumbai') : undefined
      };

      const res = await register(payload);
      if (res && res.success) {
        if (loadData) loadData(); // Reload global dataset
        if (role === 'influencer') {
          navigate('/creator');
        } else {
          navigate('/user');
        }
      } else {
        setErrorMsg(res?.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setErrorMsg('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '500px', margin: '20px auto 0 auto', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', color: 'var(--text-main)', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>Register as a Creator or Business User</p>
        </div>

        {/* ROLE TOGGLE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'var(--bg-input)', padding: '5px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setRole('user')}
            style={{
              padding: '9px',
              border: 'none',
              borderRadius: '8px',
              background: role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--accent-purple))' : 'transparent',
              color: role === 'user' ? '#FFFFFF' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            Business / Brand
          </button>
          <button
            type="button"
            onClick={() => setRole('influencer')}
            style={{
              padding: '9px',
              border: 'none',
              borderRadius: '8px',
              background: role === 'influencer' ? 'linear-gradient(135deg, var(--accent-pink), var(--accent-purple))' : 'transparent',
              color: role === 'influencer' ? '#FFFFFF' : 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            Influencer / Creator
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '8px', marginBottom: '18px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>{role === 'influencer' ? 'Creator Name' : 'Full Name / Business Name'}</label>
            <input type="text" className="form-input" required minLength={2} maxLength={60} placeholder="e.g. Rohan Sharma" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Email Address</label>
            <input type="email" className="form-input" required placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {role === 'influencer' && (
            <div className="form-grid-2" style={{ marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Category / Niche</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Fashion">Fashion</option>
                  <option value="Tech">Tech</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>City Location</label>
                <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
              </div>
            </div>
          )}

          <div className="form-grid-2" style={{ marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                minLength={6}
                placeholder="Min 6 characters" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Confirm Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                minLength={6}
                placeholder="Re-enter password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }} disabled={loading}>
            {loading ? 'Registering...' : `Complete Free ${role === 'influencer' ? 'Creator' : 'Business'} Registration`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '420px', margin: '30px auto 0 auto', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 36px)' }}>
        <h2 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', color: 'var(--text-main)', textAlign: 'center', marginBottom: '8px', fontWeight: 800 }}>Reset Password</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '20px' }}>
          Enter your registered email and we will send you a password reset link.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle2 size={42} color="var(--accent-emerald)" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 700 }}>Reset Link Sent!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Please check your inbox.</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: '14px' }} onClick={() => navigate('/login')}>Back to Login</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '0.86rem', fontWeight: 600 }}>Email Address</label>
              <input type="email" className="form-input" required placeholder="user@company.com" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
