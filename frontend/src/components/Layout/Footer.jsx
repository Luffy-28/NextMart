import { Link } from 'react-router-dom';

const shopLinks = [
  { label: 'All products', to: '/products' },
  { label: 'Categories', to: '/categories' },
  { label: 'Deals', to: '/deals' },
];

const accountLinks = [
  { label: 'Sign in', to: '/login' },
  { label: 'Create account', to: '/signup' },
  { label: 'Orders', to: '/orders' },
  { label: 'Profile', to: '/profile' },
];

const legalLinks = [
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Contact', to: '/contact' },
];

const socialIcons = ['bi-twitter-x', 'bi-instagram', 'bi-youtube', 'bi-linkedin'];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="nex-footer">
      <div className="nex-footer-glow" />

      <div className="container position-relative">
        <div className="nex-footer-grid">

          {/* Brand */}
          <div className="nex-footer-brand-col">
            <span className="nex-gradient-text nex-footer-wordmark">NexMart</span>
            <p className="nex-footer-desc">
              A curated marketplace for people who care about quality and style.
            </p>
            <div className="nex-footer-socials">
              {socialIcons.map((icon) => (
                <a key={icon} href="#" className="nex-social-icon" aria-label={icon.replace('bi-', '')}>
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="nex-footer-heading">Shop</p>
            <div className="nex-footer-links">
              {shopLinks.map(({ label, to }) => (
                <Link key={to} to={to} className="nex-footer-link">{label}</Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="nex-footer-heading">Account</p>
            <div className="nex-footer-links">
              {accountLinks.map(({ label, to }) => (
                <Link key={to} to={to} className="nex-footer-link">{label}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="nex-footer-heading">Newsletter</p>
            <p className="nex-footer-desc mb-3">
              New arrivals and exclusive offers, direct to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="nex-footer-email-group">
              <input
                type="email"
                placeholder="you@example.com"
                className="nex-footer-email-input"
              />
              <button type="submit" className="nex-footer-email-btn">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom row */}
        <div className="nex-footer-bottom">
          <p className="nex-footer-copy">© {year} NexMart — All rights reserved</p>
          <div className="nex-footer-legal">
            {legalLinks.map(({ label, to }) => (
              <Link key={to} to={to} className="nex-footer-legal-link">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
