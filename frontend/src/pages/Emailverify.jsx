import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';
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

  // Redirect to login if they try to access this page without an email
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
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
    <Container fluid className="d-flex align-items-center justify-content-center flex-grow-1 bg-brand-light min-vh-custom py-5">
      <div className="w-100 text-center max-w-600">
        <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4 bg-brand-pale border-brand-primary" style={{ width: '100px', height: '100px', borderWidth: '2px' }}>
          <span className="fs-36 opacity-50 grayscale-1">✉️</span>
        </div>

        <h2 className="fw-bold mb-3 fs-28 text-brand-dark">Check your inbox</h2>
        <p className="mb-2 fs-14 text-brand-muted lh-16">
          We sent a 6-digit verification code to <strong className="text-brand-dark">{email}</strong><br/>
          Please enter it below to activate your NexMart account.
        </p>

        <Card className="mx-auto my-4 border shadow-sm max-w-480 border-brand-gray">
          <Card.Body className="p-4">
            {errorMsg && <Alert variant="danger" className="py-2 fs-13">{errorMsg}</Alert>}
            
            <Form onSubmit={handleVerify}>
              <Form.Group className="mb-4">
                <Form.Control 
                  type="text" 
                  maxLength="6"
                  placeholder="Enter 6-digit code"
                  className="text-center fs-24 tracking-widest fw-bold h-60"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 rounded-pill border-0 h-48 fs-14 fw-bold btn-brand mb-3">
                Verify Account
              </Button>
            </Form>

            <Button 
              variant="outline-secondary"
              className={`w-100 rounded-pill h-40 fs-13 ${resendTimer > 0 ? 'bg-secondary text-white border-0' : ''}`}
              onClick={handleResend}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Code'}
            </Button>
          </Card.Body>
        </Card>

        <Link to="/login" className="d-inline-block mt-2 text-decoration-none fs-13 text-brand-muted hover-text-dark transition-color">
          ← Back to Sign In
        </Link>
      </div>
    </Container>
  );
};

export default EmailVerify;