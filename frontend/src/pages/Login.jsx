import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useDispatch } from 'react-redux';
import { loginUser, autoLogin } from '../features/user/userAction';

const initialState = { email: '', password: '' };

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { formData, setFormData, handleChange } = useForm(initialState);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const ref = searchParams.get('ref');
    if (token && ref) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', ref);
      dispatch(autoLogin());
      navigate('/');
    }
  }, [searchParams, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (await dispatch(loginUser(formData))) {
        if (location.pathname.includes('login')) navigate('/');
        setFormData(initialState);
      }
    } catch {
      alert('Something went wrong');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = import.meta.env.VITE_ROOT_URL + '/api/v1/auth/google';
  };

  return (
    <div className="nex-auth-wrap">
      {/* Left panel */}
      <div className="nex-auth-left">
        <div className="nex-orb" style={{ width: '300px', height: '300px', background: '#8B5CF6', top: '-10%', left: '-10%', opacity: 0.18 }} />
        <div className="nex-orb" style={{ width: '250px', height: '250px', background: '#06B6D4', bottom: '-10%', right: '-10%', opacity: 0.14 }} />
        <div className="nex-hero-grid" style={{ opacity: 0.5 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-5">
            <span className="nex-gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>NexMart</span>
          </div>

          <h2 className="nex-text-light fw-bold mb-3" style={{ fontSize: '2.2rem', lineHeight: 1.2 }}>
            Welcome<br />back
          </h2>
          <p className="nex-text-muted mb-5" style={{ lineHeight: 1.7 }}>
            Sign in to access your orders,<br />wishlist, and exclusive member deals.
          </p>

          <div className="d-flex flex-column gap-4 mt-4">
            {[
              { icon: 'bi-bag-check', text: 'Track your orders in real-time' },
              { icon: 'bi-heart', text: 'Save items to your wishlist' },
              { icon: 'bi-stars', text: 'Unlock exclusive member deals' },
            ].map(({ icon, text }) => (
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
        <div className="nex-auth-form">
          <h2 className="nex-text-light fw-bold mb-1" style={{ fontSize: '1.8rem' }}>Sign In</h2>
          <p className="nex-text-muted mb-5" style={{ fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="nex-gradient-text fw-semibold text-decoration-none">Sign up →</Link>
          </p>

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
            <div>
              <label className="nex-form-label">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com" className="nex-input" required />
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="nex-form-label mb-0">Password</label>
                <Link to="/forgot-password" className="nex-text-muted text-decoration-none" style={{ fontSize: '0.78rem' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••••••" className="nex-input" required
                  style={{ paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--nex-text-muted)', cursor: 'pointer', fontSize: '1rem' }}>
                  <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </div>

            <button type="submit" className="nex-btn-primary w-100 justify-content-center" style={{ padding: '13px' }}>
              Sign In <i className="bi bi-arrow-right" />
            </button>

            <div className="nex-auth-divider">Or continue with</div>

            <button type="button" onClick={handleGoogleSignIn} className="nex-social-btn">
              <span className="fw-bold" style={{ fontSize: '1rem' }}>G</span> Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
