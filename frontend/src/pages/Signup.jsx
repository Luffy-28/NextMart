import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/user/userAction';

const initialState = { name: '', email: '', password: '', confirmPassword: '' };

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData, setFormData, handleChange: handleFormChange } = useForm(initialState);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: '#EF4444' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    const strengths = [
      { score: 0, label: 'Weak', color: '#EF4444' },
      { score: 1, label: 'Weak', color: '#EF4444' },
      { score: 2, label: 'Fair', color: '#F59E0B' },
      { score: 3, label: 'Good', color: '#3B82F6' },
      { score: 4, label: 'Strong', color: '#10B981' },
      { score: 5, label: 'Very Strong', color: '#10B981' },
    ];
    return strengths[score];
  };

  const handleChange = (e) => {
    handleFormChange(e);
    if (e.target.name === 'password') {
      setPasswordStrength(calculatePasswordStrength(e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const data = await dispatch(registerUser(formData));
      if (data?.status === 'success') {
        alert('Registration successful. Please verify your account.');
        setFormData(initialState);
        navigate('/verify-email', { state: { email: formData.email } });
      }
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  const perks = [
    { icon: 'bi-bag-heart', text: 'Exclusive member-only deals' },
    { icon: 'bi-truck', text: 'Free delivery on orders over $50' },
    { icon: 'bi-arrow-repeat', text: '30-day hassle-free returns' },
    { icon: 'bi-shield-check', text: 'Secure, encrypted checkout' },
  ];

  return (
    <div className="nex-auth-wrap">
      {/* Left panel */}
      <div className="nex-auth-left">
        <div className="nex-orb" style={{ width: '280px', height: '280px', background: '#06B6D4', top: '-8%', left: '-12%', opacity: 0.15 }} />
        <div className="nex-orb" style={{ width: '220px', height: '220px', background: '#8B5CF6', bottom: '-8%', right: '-10%', opacity: 0.13 }} />
        <div className="nex-hero-grid" style={{ opacity: 0.5 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-5">
            <span className="nex-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>NexMart</span>
          </div>

          <h2 className="nex-text-light fw-bold mb-3" style={{ fontSize: '2.2rem', lineHeight: 1.2 }}>
            Join the<br />community
          </h2>
          <p className="nex-text-muted mb-5" style={{ lineHeight: 1.7 }}>
            Create your free account and start<br />shopping premium products today.
          </p>

          <div className="d-flex flex-column gap-4">
            {perks.map(({ icon, text }) => (
              <div key={text} className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad flex-shrink-0" style={{ width: 36, height: 36 }}>
                  <i className={`bi ${icon} text-white`} style={{ fontSize: '0.85rem' }} />
                </div>
                <span className="nex-text-muted" style={{ fontSize: '0.9rem' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="nex-auth-right">
        <div className="nex-auth-form-wide">
          <h2 className="nex-text-light fw-bold mb-1" style={{ fontSize: '1.8rem' }}>Create Account</h2>
          <p className="nex-text-muted mb-5" style={{ fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="nex-gradient-text fw-semibold text-decoration-none">Sign in →</Link>
          </p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            <div>
              <label className="nex-form-label">Full Name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your full name" className="nex-input" required
              />
            </div>

            <div>
              <label className="nex-form-label">Email Address</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com" className="nex-input" required
              />
            </div>

            <div>
              <label className="nex-form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} placeholder="Min 8 characters" className="nex-input" required
                  style={{ paddingRight: '42px' }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--nex-text-muted)', cursor: 'pointer', fontSize: '1rem' }}>
                  <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="d-flex gap-1 mb-1" style={{ height: '3px' }}>
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="flex-grow-1 rounded-pill"
                        style={{ background: passwordStrength.score >= n ? passwordStrength.color : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: passwordStrength.color, fontWeight: 600 }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="nex-form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="••••••••••••" className="nex-input" required
                  style={{ paddingRight: '42px' }}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--nex-text-muted)', cursor: 'pointer', fontSize: '1rem' }}>
                  <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </div>

            <button type="submit" className="nex-btn-primary w-100 justify-content-center" style={{ padding: '13px' }}>
              Create Account <i className="bi bi-arrow-right" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
