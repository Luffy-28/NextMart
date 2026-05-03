import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from '../hooks/useForm';
import {useDispatch} from "react-redux";
import { registerUser, verifyGoogleLoginAction } from '../features/user/userAction';

const initialState ={
  name:"",
    email: '',
    password: '',
    confirmPassword: '',
}
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {formData, setFormData, handleChange: handleFormChange } = useForm(initialState);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: 'Weak',
    variant: 'danger'
  });

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
      { score: 5, label: 'Very Strong', color: '#10B981' }
    ];
    return strengths[score];
  };

  const handleChange = (e) => {
    // 1. Let your custom hook update the state
    handleFormChange(e);

    // 2. Also run your specific password strength calculation
    const { name, value } = e.target;
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      // 1. MUST wrap Redux actions in dispatch()
      const data = await dispatch(registerUser(formData));
      console.log("Response Data:" , data)

      if(data?.status === "success"){
        alert("Registration successful. please verify your account")
        // 2. Removed dispatch(setUser()) because registerUser action already does that for you!
        setFormData(initialState)
        navigate("/verify-email", { state: { email: formData.email } });
      }
    } catch (error) {
    console.log("ERROR REGISTER CATCH:" , error.message)
    alert("Registration failed:" + error.message)  
    }
  };

  return (
    <Container fluid className="p-0 d-flex flex-column flex-grow-1 bg-brand-light min-vh-custom">
      <Row className="g-0 flex-grow-1 m-0">
        {/* Left Panel */}
        <Col lg={5} className="d-flex flex-column justify-content-center p-5 text-white bg-brand-dark">
          <div className="mx-auto max-w-400">
            <h1 className="fw-bold mb-3 text-center fs-28">Join NexMart</h1>
            <p className="text-center mb-5 text-brand-white-50 fs-13 lh-16">
              Free delivery • Exclusive deals<br />
              Easy returns • Secure payments
            </p>
            
            <ul className="list-unstyled mb-0 d-flex flex-column gap-4">
              <li className="d-flex align-items-center gap-3 text-brand-white-50 fs-13">
                <span className="fs-5">⚡</span> 30-day free returns
              </li>
              <li className="d-flex align-items-center gap-3 text-brand-white-50 fs-13">
                <span className="fs-5">🔒</span> Secure checkout
              </li>
              <li className="d-flex align-items-center gap-3 text-brand-white-50 fs-13">
                <span className="fs-5">📦</span> Fast AU delivery
              </li>
              <li className="d-flex align-items-center gap-3 text-brand-white-50 fs-13">
                <span className="fs-5">⭐</span> Loyalty rewards
              </li>
            </ul>
          </div>
        </Col>

        {/* Right Panel - Signup Form */}
        <Col lg={7} className="d-flex align-items-center justify-content-center p-5">
          <div className="w-100 max-w-600">
            <h2 className="fw-bold mb-2 text-center fs-24">Create Account</h2>
            <p className="text-muted mb-4 text-center fs-13">
              Already have an account? <Link to="/login" className="text-decoration-none fw-medium text-brand-primary">Sign in →</Link>
            </p>

            <Form onSubmit={handleSubmit}>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label className="fs-11 fw-medium text-brand-muted">Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Please enter yourFull Name" 
                      className="h-40 fs-13"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="fs-11 fw-medium text-brand-muted">Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com" 
                  className="h-40 fs-13 border-brand-primary border-2"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="fs-11 fw-medium text-brand-muted">Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="h-40 fs-13"
                  required
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="d-flex gap-1 mb-1" style={{ height: '4px' }}>
                      {[1, 2, 3, 4].map(num => (
                        <div 
                          key={num} 
                          className="flex-grow-1 rounded-pill" 
                          style={{
                            backgroundColor: passwordStrength.score >= num 
                              ? passwordStrength.color 
                              : (passwordStrength.score > 0 && num === 1 ? passwordStrength.color : '#E2E8F0'),
                            transition: 'all 0.3s ease'
                          }}
                        ></div>
                      ))}
                    </div>
                    <span className="fs-10 fw-medium" style={{ color: passwordStrength.color }}>
                      Password strength: {passwordStrength.label}
                    </span>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-4" controlId="confirmPassword">
                <Form.Label className="fs-11 fw-medium text-brand-muted">Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="h-40 fs-13"
                  required
                />
              </Form.Group>

              {/* <Form.Group className="mb-4" controlId="agreeToTerms">
                <Form.Check 
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  label={
                    <span className="fs-12 text-brand-muted">
                      I agree to NexMart's <Link to="/terms" className="text-decoration-none text-brand-primary">Terms of Service and Privacy Policy</Link>
                    </span>
                  }
                />
              </Form.Group> */}

              <Button type="submit" className="w-100 rounded-pill border-0 h-44 fs-13 fw-medium btn-brand">
                Create Account →
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;