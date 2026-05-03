import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useForm } from '../hooks/useForm';
import { useDispatch } from 'react-redux';
import { loginUser, autoLogin } from '../features/user/userAction';


const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { formData, setFormData, handleChange} = useForm(initialState);

  // Catch the Google Login redirect from the backend
  useEffect(() => {
    const token = searchParams.get('token');
    const ref = searchParams.get('ref');

    if (token && ref) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', ref);
      
      // Auto login will fetch the user details using the newly saved token
      dispatch(autoLogin());
      navigate('/');
    }
  }, [searchParams, dispatch, navigate]);

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (await dispatch(loginUser(formData))) {
        if (location.pathname.includes("login")) {
          navigate("/");
        }
        setFormData(initialState);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleGoogleSinIn = () => {
    // Redirect to the backend Passport trigger route
    window.location.href = import.meta.env.VITE_ROOT_URL + "/api/v1/auth/google";
  }

  return (
    <Container fluid className="p-0 d-flex flex-column flex-grow-1 bg-brand-light min-vh-custom">
      <Row className="g-0 flex-grow-1 m-0">
        {/* Left Panel */}
        <Col lg={6} className="d-flex flex-column justify-content-center p-5 text-white bg-brand-dark">
          <div className="mx-auto max-w-480">
            <h1 className="fw-bold mb-3 text-center fs-36">Welcome back</h1>
            <p className="text-center mb-5 text-brand-white-50 fs-14 lh-16">
              Sign in to access your orders,<br />
              wishlist, and exclusive member deals.
            </p>
            <div className="d-flex align-items-center justify-content-center mx-auto rounded border-brand-dashed bg-white bg-opacity-10" style={{ width: '200px', height: '160px' }}>
               <span className="text-brand-white-50 fs-11">Illustration</span>
            </div>
          </div>
        </Col>

        {/* Right Panel - Login Form */}
        <Col lg={6} className="d-flex align-items-center justify-content-center p-5">
          <div className="w-100 max-w-480">
            <h2 className="fw-bold mb-2">Sign In</h2>
            <p className="text-muted mb-4 fs-13">
              Don't have an account? <Link to="/signup" className="text-decoration-none fw-medium text-brand-primary">Sign up →</Link>
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="fs-11 fw-medium text-brand-muted">Email Address</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com" 
                  className="h-44 fs-13"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="mb-0 fs-11 fw-medium text-brand-muted">Password</Form.Label>
                  <Link to="/forgot-password" className="fs-11 text-brand-primary text-decoration-none">Forgot password?</Link>
                </div>
                <Form.Control 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••" 
                  className="h-44 fs-13"
                  required
                />
              </Form.Group>

              <Button type="submit" className="w-100 rounded-pill border-0 mb-4 h-44 fs-13 fw-medium btn-brand">
                Sign In →
              </Button>

              <div className="position-relative text-center mb-4">
                <hr className="m-0 border-brand-gray" />
                <span className="position-absolute top-50 start-50 translate-middle px-3 bg-brand-light fs-11 text-brand-muted">
                  Or continue with
                </span>
              </div>

              <Row className="g-3">
                <Col xs={12}>
                  <Button variant="light" onClick={handleGoogleSinIn} className="w-100 d-flex align-items-center justify-content-center gap-2 border rounded-pill h-40 fs-12 text-brand-muted">
                    <span className="fw-bold">G</span> Google
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;