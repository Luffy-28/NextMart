import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../features/user/userSlice';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.userStore);
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-email';

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(setUser({})); // Clear user in Redux
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="min-h-72 border-bottom border-brand-light bg-white py-2" sticky="top">
      <Container fluid className="w-100 px-container">
        <Navbar.Brand as={Link} to="/" className="fw-bold m-0 fs-24 text-brand-primary">
          NexMart
        </Navbar.Brand>
        
        <div className="d-flex align-items-center ms-auto order-lg-last">
          {!isAuthPage && (
            <Link to="/cart" className="position-relative d-flex align-items-center me-4 fs-20 text-brand-dark text-decoration-none">
              🛒
              <span className="position-absolute d-flex align-items-center justify-content-center fw-bold bg-brand-primary text-white fs-10 rounded-circle" style={{ top: '-6px', right: '-8px', width: '18px', height: '18px' }}>
                3
              </span>
            </Link>
          )}

          {isAuthPage ? (
            location.pathname === '/login' ? (
              <Button as={Link} to="/signup" variant="outline-primary" className="rounded-pill px-4 h-40 fs-14 btn-outline-brand">
                Create Account
              </Button>
            ) : (
              <Button as={Link} to="/login" variant="outline-primary" className="rounded-pill px-4 h-40 fs-14 btn-outline-brand">
                Sign In
              </Button>
            )
          ) : (
            user && user.email ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="rounded-pill d-flex align-items-center gap-2 border bg-transparent h-40">
                  <div className="bg-brand-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="fs-13 fw-medium text-brand-dark d-none d-sm-block">{user.name?.split(' ')[0] || 'User'}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-sm border-0 mt-2" style={{ borderRadius: '12px', minWidth: '200px' }}>
                  <div className="px-3 py-2 border-bottom mb-2">
                    <p className="mb-0 fw-semibold fs-14 text-brand-dark">{user.name}</p>
                    <p className="mb-0 fs-12 text-brand-muted text-truncate">{user.email}</p>
                  </div>
                  <Dropdown.Item as={Link} to="/profile" className="fs-13 py-2 text-brand-dark">👤 My Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders" className="fs-13 py-2 text-brand-dark">📦 My Orders</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="fs-13 py-2 text-danger">🚪 Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="light" className="rounded-pill px-3 d-none d-sm-block h-40 fs-14 bg-transparent border-0 text-brand-dark fw-medium">
                  Sign In
                </Button>
                <Button as={Link} to="/signup" className="rounded-pill px-3 h-40 fs-14 btn-brand">
                  Sign Up
                </Button>
              </div>
            )
          )}
        </div>

        {!isAuthPage && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-3 border-0 px-1" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto d-flex align-items-lg-center gap-3 gap-lg-4 mt-4 mt-lg-0 px-2 px-lg-0">
                <Nav.Link as={Link} to="/" className="text-brand-primary fw-medium fs-15">Home</Nav.Link>
                <Nav.Link as={Link} to="/products" className="text-brand-muted fw-medium fs-15">Shop</Nav.Link>
                <Nav.Link as={Link} to="/categories" className="text-brand-muted fw-medium fs-15">Categories</Nav.Link>
                <Nav.Link as={Link} to="/deals" className="text-brand-muted fw-medium fs-15">Deals</Nav.Link>
                {user && user.email && <Nav.Link as={Link} to="/orders" className="text-brand-muted fw-medium fs-15 d-lg-none">My Orders</Nav.Link>}
              </Nav>

              <Form className="d-flex align-items-center mx-lg-3 mt-4 mt-lg-0 mb-2 mb-lg-0 search-form-wrapper" style={{ minWidth: '300px' }}>
                <InputGroup>
                  <InputGroup.Text className="bg-brand-gray border-0 text-brand-light ps-3">⚲</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    className="bg-brand-gray border-0 h-44 fs-14 box-shadow-none"
                  />
                </InputGroup>
              </Form>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;