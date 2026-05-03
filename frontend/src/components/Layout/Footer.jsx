import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#0A0A0A', color: '#FAFAF7', padding: '80px 24px 40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px' }}>

          {/* Brand */}
          <div>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 500, color: '#FAFAF7', margin: '0 0 12px' }}>
              NexMart
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B6B6B', lineHeight: '1.6', margin: 0, maxWidth: '240px' }}>
              A curated marketplace for people who care about quality.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', margin: '0 0 20px' }}>
              Shop
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'All products', to: '/products' },
                { label: 'Categories', to: '/categories' },
                { label: 'Deals', to: '/deals' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#FAFAF7', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C04828'}
                  onMouseLeave={e => e.currentTarget.style.color = '#FAFAF7'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', margin: '0 0 20px' }}>
              Account
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Sign in', to: '/login' },
                { label: 'Create account', to: '/signup' },
                { label: 'Orders', to: '/orders' },
                { label: 'Profile', to: '/profile' },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#FAFAF7', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C04828'}
                  onMouseLeave={e => e.currentTarget.style.color = '#FAFAF7'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B6B6B', margin: '0 0 20px' }}>
              Newsletter
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B6B6B', margin: '0 0 16px', lineHeight: '1.5' }}>
              New arrivals and exclusive offers, direct to your inbox.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="you@example.com"
                style={{
                  flex: 1,
                  backgroundColor: '#161616',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  color: '#FAFAF7',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                style={{
                  backgroundColor: '#C04828',
                  color: '#FAFAF7',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '10px 16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6B6B6B', margin: 0 }}>
            © {year} NexMart Pty Ltd — All rights reserved
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms', to: '/terms' },
              { label: 'Contact', to: '/contact' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B6B6B', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FAFAF7'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B6B6B'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;