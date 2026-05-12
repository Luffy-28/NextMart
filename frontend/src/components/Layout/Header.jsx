import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSun,
  FiMoon,
  FiShoppingBag,
  FiChevronDown,
  FiUser,
  FiPackage,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import { setUser } from "../../features/user/userSlice";
import { toggleTheme } from "../../features/theme/themeSlice";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [navExpanded, setNavExpanded] = useState(false);

  const { user } = useSelector((state) => state.userStore);
  const { isDark } = useSelector((state) => state.themeStore);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/verify-email";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(setUser({}));
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/categories", label: "Categories" },
    { to: "/deals", label: "Deals" },
  ];

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="nex-navbar"
      expanded={navExpanded}
      onToggle={setNavExpanded}
    >
      <Container fluid className="px-4 px-lg-5">
        <Navbar.Brand as={Link} to="/" className="nex-nav-logo">
          NexMart
        </Navbar.Brand>

        <div className="d-flex align-items-center ms-auto order-lg-last gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="nex-nav-icon-btn"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            type="button"
            style={{
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isDark ? (
              <FiSun size={20} color="#fbbf24" />
            ) : (
              <FiMoon size={20} color="#8B5CF6" />
            )}
          </button>

          {!isAuthPage && (
            <Link
              to="/cart"
              className="nex-nav-icon-btn position-relative me-1"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <FiShoppingBag size={21} />
              <span className="nex-nav-badge">3</span>
            </Link>
          )}

          {isAuthPage ? (
            location.pathname === "/login" ? (
              <Link to="/signup" className="nex-btn-primary nex-btn-sm">
                Create Account
              </Link>
            ) : (
              <Link to="/login" className="nex-btn-outline nex-btn-sm">
                Sign In
              </Link>
            )
          ) : user && user.email ? (
            <Dropdown align="end">
              <Dropdown.Toggle as="div" className="nex-avatar-toggle">
                <div className="nex-avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <span className="d-none d-sm-block small fw-medium nex-text-light">
                  {user.name?.split(" ")[0] || "User"}
                </span>

                <FiChevronDown size={14} className="nex-text-muted" />
              </Dropdown.Toggle>

              <Dropdown.Menu className="nex-dropdown mt-2">
                <div className="px-3 py-2">
                  <p className="mb-0 fw-semibold small nex-text-light">
                    {user.name}
                  </p>
                  <p className="mb-0 small nex-text-muted text-truncate">
                    {user.email}
                  </p>
                </div>

                <Dropdown.Divider className="nex-dropdown-divider" />

                <Dropdown.Item
                  as={Link}
                  to="/profile"
                  className="nex-dropdown-item"
                >
                  <FiUser size={16} className="me-2" />
                  My Profile
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/orders"
                  className="nex-dropdown-item"
                >
                  <FiPackage size={16} className="me-2" />
                  My Orders
                </Dropdown.Item>

                <Dropdown.Divider className="nex-dropdown-divider" />

                <Dropdown.Item
                  onClick={handleLogout}
                  className="nex-dropdown-item nex-dropdown-danger"
                >
                  <FiLogOut size={16} className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div className="d-flex gap-2">
              <Link
                to="/login"
                className="nex-btn-outline nex-btn-sm d-none d-sm-flex"
              >
                Sign In
              </Link>

              <Link to="/signup" className="nex-btn-primary nex-btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {!isAuthPage && (
          <>
            <Navbar.Toggle
              aria-controls="nex-navbar-nav"
              className="nex-nav-toggler ms-3"
            />

            <Navbar.Collapse id="nex-navbar-nav">
              <Nav className="mx-auto d-flex align-items-lg-center mt-4 mt-lg-0">
                {navLinks.map(({ to, label }) => (
                  <Nav.Link
                    key={to}
                    as={Link}
                    to={to}
                    onClick={() => setNavExpanded(false)}
                    className={`nex-nav-link ${
                      location.pathname === to ? "active" : ""
                    }`}
                  >
                    {label}
                  </Nav.Link>
                ))}

                {user && user.email && (
                  <Nav.Link
                    as={Link}
                    to="/orders"
                    onClick={() => setNavExpanded(false)}
                    className="nex-nav-link d-lg-none"
                  >
                    My Orders
                  </Nav.Link>
                )}
              </Nav>

              <div className="nex-search-wrap mx-lg-3 mt-4 mt-lg-0 mb-2 mb-lg-0">
                <FiSearch size={17} className="nex-search-icon" />

                <input
                  type="text"
                  placeholder="Search products..."
                  className="nex-search-field"
                />
              </div>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
