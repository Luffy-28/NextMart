import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyOtp, resendOtp } from '../features/user/userAction';

const EmailVerify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setErrorMsg('');
    const data = await dispatch(resendOtp({ email }));
    if (data?.status === 'error') {
      setErrorMsg(data.message);
      setResendTimer(0);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit code');
      return;
    }
    const data = await dispatch(verifyOtp({ email, otp }));
    if (data?.status === 'success') {
      alert('Verification successful! You can now log in.');
      navigate('/login');
    } else {
      setErrorMsg(data?.message || 'Verification failed. Invalid code.');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', background: 'var(--nex-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
        {/* Icon */}
        <div className="mx-auto mb-5 d-flex align-items-center justify-content-center rounded-circle nex-icon-grad"
          style={{ width: 80, height: 80, fontSize: '1.8rem' }}>
          <i className="bi bi-envelope-check text-white" />
        </div>

        <h2 className="nex-text-light fw-bold mb-3" style={{ fontSize: '1.9rem' }}>Check your inbox</h2>
        <p className="nex-text-muted mb-2" style={{ lineHeight: 1.7 }}>
          We sent a 6-digit verification code to
        </p>
        <p className="nex-gradient-text fw-bold mb-5" style={{ fontSize: '0.95rem' }}>{email}</p>

        <div className="nex-glass-card" style={{ padding: '32px' }}>
          {errorMsg && (
            <div className="mb-4 px-4 py-3 rounded" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.88rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerify} className="d-flex flex-column gap-4">
            <div>
              <label className="nex-form-label">Verification Code</label>
              <input
                type="text" maxLength={6} placeholder="000000" value={otp}
                onChange={e => { setOtp(e.target.value.replace(/[^0-9]/g, '')); setErrorMsg(''); }}
                className="nex-input"
                style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.4em', padding: '14px' }}
                required
              />
            </div>

            <button type="submit" className="nex-btn-primary w-100 justify-content-center" style={{ padding: '13px' }}>
              Verify Account <i className="bi bi-check-lg" />
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              style={{
                width: '100%', padding: '11px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--nex-border)', borderRadius: '10px',
                color: resendTimer > 0 ? 'var(--nex-text-muted)' : 'var(--nex-text)',
                fontSize: '0.88rem', fontWeight: 500, cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Code'}
            </button>
          </div>
        </div>

        <Link to="/login" className="nex-text-muted text-decoration-none d-inline-block mt-4" style={{ fontSize: '0.88rem' }}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
};

export default EmailVerify;
