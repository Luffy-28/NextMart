import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useSelector(state => state.userStore);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || !user.email) return null;

  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="bg-brand-dark text-white py-5">
        <Container fluid className="px-container">
          <h1 className="fw-bold mb-1 fs-32">My Profile</h1>
          <p className="mb-0 fs-14 text-brand-white-70">Manage your account settings and preferences.</p>
        </Container>
      </div>

      <Container fluid className="px-container mt-4">
        <Row className="g-4">
          <Col lg={4}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-4 text-center">
                <div className="mx-auto rounded-circle bg-brand-primary text-white d-flex align-items-center justify-content-center fw-bold fs-36 mb-3" 
                     style={{ width: '96px', height: '96px' }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h4 className="fw-semibold text-brand-dark fs-20 mb-1">{user.name}</h4>
                <p className="text-brand-muted fs-14 mb-3">{user.email}</p>
                <div className="d-flex justify-content-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-pill fs-11 fw-semibold ${user.isVerified ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                    {user.isVerified ? '✓ Verified Account' : '⚠ Unverified'}
                  </span>
                  <span className="px-3 py-1 rounded-pill fs-11 fw-semibold" style={{ background: '#F1F5F9', color: '#475569', textTransform: 'capitalize' }}>
                    {user.role || 'Customer'}
                  </span>
                </div>
                <hr className="border-brand-gray mb-4" />
                <div className="text-start">
                  <div className="d-flex align-items-center gap-3 p-3 rounded mb-2 cursor-pointer" style={{ background: '#F8FAFC' }}>
                    <span className="fs-18">👤</span>
                    <span className="fs-14 fw-medium text-brand-primary">Personal Information</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 p-3 rounded mb-2 cursor-pointer hover-bg-gray transition-color">
                    <span className="fs-18 opacity-50">🔒</span>
                    <span className="fs-14 fw-medium text-brand-muted">Security Settings</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 p-3 rounded mb-2 cursor-pointer hover-bg-gray transition-color">
                    <span className="fs-18 opacity-50">📍</span>
                    <span className="fs-14 fw-medium text-brand-muted">Saved Addresses</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
              <Card.Body className="p-4 p-xl-5">
                <h5 className="fw-bold text-brand-dark fs-18 mb-4">Personal Information</h5>
                <Form>
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fs-12 fw-semibold text-brand-muted text-uppercase tracking-wide mb-2">Full Name</Form.Label>
                        <Form.Control type="text" defaultValue={user.name} className="h-44 fs-14 bg-brand-light border-0 px-3" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fs-12 fw-semibold text-brand-muted text-uppercase tracking-wide mb-2">Email Address</Form.Label>
                        <Form.Control type="email" defaultValue={user.email} disabled className="h-44 fs-14 bg-brand-gray border-0 px-3 text-muted" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fs-12 fw-semibold text-brand-muted text-uppercase tracking-wide mb-2">Phone Number</Form.Label>
                        <Form.Control type="tel" placeholder="+1 (555) 000-0000" className="h-44 fs-14 bg-brand-light border-0 px-3" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fs-12 fw-semibold text-brand-muted text-uppercase tracking-wide mb-2">Date of Birth</Form.Label>
                        <Form.Control type="date" className="h-44 fs-14 bg-brand-light border-0 px-3" />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Button className="btn-brand rounded-pill border-0 px-5 h-44 fs-14 fw-medium mt-3">
                        Save Changes
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
