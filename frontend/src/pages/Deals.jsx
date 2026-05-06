import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';

const DEALS = [
  { id: 101, name: 'Sony WH-1000XM5 Headphones', originalPrice: 399, price: 299, discount: '25% OFF', badge: 'Audio', endHours: 48, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', color: '#8B5CF6' },
  { id: 102, name: 'Samsung 65" 4K OLED TV', originalPrice: 1899, price: 1499, discount: '$400 OFF', badge: 'Electronics', endHours: 8, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80', color: '#EF4444', urgent: true },
  { id: 103, name: 'Apple Watch Series 9', originalPrice: 399, price: 349, discount: '12% OFF', badge: 'Wearables', endHours: 120, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80', color: '#06B6D4' },
  { id: 104, name: 'Dyson V15 Detect Vacuum', originalPrice: 749, price: 599, discount: '$150 OFF', badge: 'Home', endHours: 12, image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80', color: '#F472B6', urgent: true },
  { id: 105, name: 'Nike Air Max 2024', originalPrice: 189, price: 129, discount: '32% OFF', badge: 'Sports', endHours: 72, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', color: '#34d399' },
  { id: 106, name: 'Kindle Paperwhite 5', originalPrice: 149, price: 99, discount: '$50 OFF', badge: 'Books', endHours: 96, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', color: '#a78bfa' },
  { id: 107, name: 'Vitamin C Serum Bundle', originalPrice: 120, price: 79, discount: '34% OFF', badge: 'Beauty', endHours: 36, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', color: '#F472B6' },
  { id: 108, name: 'Ergonomic Gaming Chair', originalPrice: 399, price: 279, discount: '30% OFF', badge: 'Furniture', endHours: 60, image: 'https://images.unsplash.com/photo-1505797149-43b0ad7664a3?w=600&q=80', color: '#fbbf24' },
];

const FILTERS = ['All', 'Electronics', 'Audio', 'Sports', 'Home', 'Beauty', 'Wearables'];

const Countdown = ({ hours }) => {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return (
    <div className="d-flex align-items-center gap-1">
      {[
        { val: String(h).padStart(2, '0'), label: 'h' },
        { val: String(m).padStart(2, '0'), label: 'm' },
        { val: '00', label: 's' },
      ].map((t, i) => (
        <div key={i} className="d-flex align-items-center gap-1">
          <div className="text-center" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: '3px 8px', minWidth: 32 }}>
            <span className="fw-bold" style={{ fontSize: '0.85rem', color: 'white', fontFamily: 'monospace' }}>{t.val}</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700 }}>{t.label}</span>
          {i < 2 && <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>:</span>}
        </div>
      ))}
    </div>
  );
};

const Deals = () => {
  const [filter, setFilter] = useState('All');
  const [addedToCart, setAddedToCart] = useState({});

  const filtered = DEALS.filter(d => filter === 'All' || d.badge === filter);

  const handleAdd = (id) => {
    setAddedToCart(p => ({ ...p, [id]: true }));
    setTimeout(() => setAddedToCart(p => ({ ...p, [id]: false })), 1500);
  };

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Page hero */}
      <section className="nex-page-hero nex-page-hero-center" style={{ padding: '80px 0' }}>
        <div className="nex-orb" style={{ width: 400, height: 400, background: '#EF4444', top: '-30%', left: '-5%', opacity: 0.08 }} />
        <div className="nex-orb" style={{ width: 350, height: 350, background: '#8B5CF6', bottom: '-20%', right: '-4%', opacity: 0.1 }} />
        <div className="nex-hero-grid" style={{ opacity: 0.3 }} />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <Reveal>
            <span className="nex-pill mb-4 d-inline-flex" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              <i className="bi bi-lightning-charge-fill me-1" />Flash Sales — Limited Time
            </span>
            <h1 className="display-4 fw-bold nex-text-light mb-3">
              Weekly <span className="nex-gradient-text">Deals</span> & Offers
            </h1>
            <p className="lead nex-text-muted mx-auto mb-5" style={{ maxWidth: 560 }}>
              Save big on top-rated products. Exclusive discounts available for a limited time only. Don't miss out!
            </p>

            {/* Urgency counters */}
            <div className="d-flex flex-wrap justify-content-center gap-4 mt-2">
              {[
                { label: 'Flash deals ending soon', icon: 'bi-fire', color: '#EF4444', hours: 8 },
                { label: 'New deals in', icon: 'bi-stars', color: 'var(--nex-purple)', hours: 16 },
              ].map(t => (
                <div key={t.label} className="nex-glass-card px-4 py-3 d-flex align-items-center gap-3">
                  <i className={`bi ${t.icon}`} style={{ color: t.color, fontSize: '1.3rem' }} />
                  <div className="text-start">
                    <p className="nex-text-muted mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.label}</p>
                    <Countdown hours={t.hours} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {/* Filter bar */}
        <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
          <div>
            <h4 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.3rem' }}>
              <i className="bi bi-fire me-2" style={{ color: '#EF4444' }} />Trending Deals
            </h4>
            <p className="nex-text-muted mb-0" style={{ fontSize: '0.82rem' }}>{filtered.length} deals available</p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={filter === f ? 'nex-btn-primary' : 'nex-btn-outline'}
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Deal cards */}
        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-xl-4">
          {filtered.map((deal, i) => (
            <div className="col" key={deal.id}>
              <Reveal delay={i * 60}>
                <div className="nex-glass-card h-100 d-flex flex-column overflow-hidden"
                  style={{ transition: 'border-color 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow = 'var(--nex-glow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--nex-border)'; e.currentTarget.style.boxShadow = 'none'; }}>

                  {/* Image */}
                  <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                    <img src={deal.image} alt={deal.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''} />

                    {/* Discount badge */}
                    <span className="position-absolute"
                      style={{ top: 12, left: 12, background: deal.urgent ? '#EF4444' : deal.color, color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em' }}>
                      {deal.discount}
                    </span>

                    {/* Category badge */}
                    <span className="position-absolute"
                      style={{ top: 12, right: 12, background: 'rgba(7,7,15,0.75)', backdropFilter: 'blur(8px)', color: 'rgba(240,244,255,0.8)', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                      {deal.badge}
                    </span>

                    {deal.urgent && (
                      <div className="position-absolute d-flex align-items-center gap-2"
                        style={{ bottom: 12, left: 12, background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '5px 10px', borderRadius: 20 }}>
                        <i className="bi bi-lightning-charge-fill" />ENDING SOON
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="d-flex flex-column flex-grow-1 p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-clock" style={{ color: deal.urgent ? '#f87171' : 'var(--nex-text-muted)', fontSize: '0.8rem' }} />
                      <span style={{ fontSize: '0.78rem', color: deal.urgent ? '#f87171' : 'var(--nex-text-muted)', fontWeight: 600 }}>
                        {deal.endHours < 24 ? `Ends in ${deal.endHours}h` : `Ends in ${Math.floor(deal.endHours / 24)}d ${deal.endHours % 24}h`}
                      </span>
                      <div className="ms-auto" style={{ flex: 1 }}>
                        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${Math.min(100, (1 - deal.endHours / 168) * 100)}%`, background: deal.urgent ? '#EF4444' : deal.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>

                    <Link to={`/products/${deal.id}`} className="text-decoration-none flex-grow-1">
                      <p className="nex-text-light fw-bold mb-3" style={{ fontSize: '0.92rem', lineHeight: 1.4 }}>{deal.name}</p>
                    </Link>

                    <div className="d-flex align-items-end justify-content-between mt-auto pt-3" style={{ borderTop: '1px solid var(--nex-border)' }}>
                      <div>
                        <p className="nex-text-muted mb-0 text-decoration-line-through" style={{ fontSize: '0.82rem' }}>${deal.originalPrice}</p>
                        <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>${deal.price}</p>
                        <p className="mb-0 mt-1" style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 700 }}>
                          You save ${deal.originalPrice - deal.price}
                        </p>
                      </div>
                      <button onClick={() => handleAdd(deal.id)}
                        className={addedToCart[deal.id] ? 'nex-btn-primary' : 'nex-btn-outline'}
                        style={{ padding: '9px 16px', fontSize: '0.82rem', background: addedToCart[deal.id] ? 'linear-gradient(135deg,#10b981,#059669)' : undefined }}>
                        {addedToCart[deal.id] ? <><i className="bi bi-check-lg me-1" />Added</> : <><i className="bi bi-bag-plus me-1" />Grab Deal</>}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <Reveal>
          <div className="nex-newsletter mt-5 py-5 text-center">
            <i className="bi bi-bell-fill nex-gradient-text d-block mb-3" style={{ fontSize: '2.5rem' }} />
            <h3 className="nex-text-light fw-bold mb-2" style={{ fontSize: '1.6rem' }}>
              Never Miss a <span className="nex-gradient-text">Deal</span>
            </h3>
            <p className="nex-text-muted mx-auto mb-4" style={{ maxWidth: 420 }}>
              Get notified when flash deals drop. Sign up for our deal alerts and save more.
            </p>
            <Link to="/products" className="nex-btn-primary">
              Browse All Products <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Deals;
