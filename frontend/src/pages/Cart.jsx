import { useState } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_ITEMS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', color: 'Midnight Black', price: 349, qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: 2, name: 'Running Shoes Pro X', category: 'Sports', color: 'Crimson Red / Size 10', price: 129, qty: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 3, name: 'Ergonomic Laptop Stand', category: 'Electronics', color: 'Silver', price: 89, qty: 1, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
];

const Cart = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const updateQty = (id, delta) => setItems(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 1000 ? 0 : 9.99;
  const discount = appliedCoupon ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal + shipping - discount;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === 'NEXMART15') {
      setAppliedCoupon({ code: 'NEXMART15', value: 15 });
      setCouponError('');
      setCoupon('');
    } else {
      setCouponError('Invalid or expired promo code');
      setAppliedCoupon(null);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--nex-bg)', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
        <i className="bi bi-cart-x nex-text-muted mb-4 d-block" style={{ fontSize: '5rem', opacity: 0.35 }} />
        <h2 className="nex-text-light fw-bold mb-2" style={{ fontSize: '1.8rem' }}>Your cart is empty</h2>
        <p className="nex-text-muted mb-5" style={{ maxWidth: 400 }}>Looks like you haven't added anything yet. Discover our premium products.</p>
        <Link to="/products" className="nex-btn-primary">Start Shopping <i className="bi bi-arrow-right" /></Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Page hero */}
      <div className="nex-page-hero">
        <div className="nex-orb" style={{ width: 280, height: 280, background: '#8B5CF6', top: '-50%', right: '-4%', opacity: 0.1 }} />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <p className="nex-label mb-2">NexMart</p>
          <h1 className="nex-text-light fw-bold mb-2" style={{ fontSize: '2rem' }}>Shopping Cart</h1>
          <p className="nex-breadcrumb mb-0">
            <Link to="/">Home</Link><span className="nex-breadcrumb-sep">›</span>
            <span className="nex-text-light fw-semibold">Cart</span>
          </p>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-5">
          {/* Cart items */}
          <div className="col-lg-8">
            <div className="nex-glass-card p-4 p-md-5 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                <h5 className="nex-text-light fw-bold mb-0">Cart Items ({items.length})</h5>
                <Link to="/products" className="nex-gradient-text text-decoration-none fw-semibold" style={{ fontSize: '0.88rem' }}>← Continue Shopping</Link>
              </div>

              <div className="d-flex flex-column gap-4">
                {items.map((item, idx) => (
                  <div key={item.id} className="d-flex flex-column flex-md-row gap-4 align-items-md-center position-relative pb-4"
                    style={{ borderBottom: idx < items.length - 1 ? '1px solid var(--nex-border)' : 'none' }}>
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      <div style={{ width: 96, height: 96, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--nex-border)' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </Link>

                    <div className="flex-grow-1">
                      <span className="nex-status nex-status-blue mb-2 d-inline-flex" style={{ fontSize: '0.68rem' }}>{item.category}</span>
                      <Link to={`/products/${item.id}`} className="text-decoration-none d-block">
                        <p className="nex-text-light fw-bold mb-1" style={{ fontSize: '0.95rem' }}>{item.name}</p>
                      </Link>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color.includes('Black') ? '#1F2937' : item.color.includes('Red') ? '#DC2626' : '#94A3B8', display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)' }} />
                        <span className="nex-text-muted" style={{ fontSize: '0.82rem' }}>{item.color}</span>
                      </div>
                    </div>

                    <div className="nex-qty">
                      <button className="nex-qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="nex-qty-num">{item.qty}</span>
                      <button className="nex-qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>

                    <div className="text-md-end" style={{ minWidth: 80 }}>
                      <p className="nex-text-muted mb-0" style={{ fontSize: '0.75rem' }}>Unit</p>
                      <p className="nex-text-light fw-semibold mb-0">${item.price}</p>
                    </div>

                    <div className="text-md-end" style={{ minWidth: 90 }}>
                      <p className="nex-text-muted mb-0" style={{ fontSize: '0.75rem' }}>Total</p>
                      <p className="nex-gradient-text fw-bold mb-0" style={{ fontSize: '1.1rem' }}>${(item.price * item.qty).toFixed(2)}</p>
                    </div>

                    <button onClick={() => removeItem(item.id)}
                      className="position-absolute d-flex align-items-center justify-content-center"
                      style={{ top: -6, right: -6, width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--nex-border)', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo code */}
            <div className="nex-glass-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad" style={{ width: 40, height: 40, flexShrink: 0 }}>
                  <i className="bi bi-tag-fill text-white" style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.95rem' }}>Promo Code</p>
                  <p className="nex-text-muted mb-0" style={{ fontSize: '0.8rem' }}>Apply a coupon to save on this order</p>
                </div>
              </div>

              {!appliedCoupon ? (
                <div style={{ maxWidth: 500 }}>
                  <div className="nex-promo-wrap">
                    <input
                      type="text" className="nex-promo-input" placeholder="e.g. NEXMART15"
                      value={coupon} onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleCoupon()} />
                    <button className="nex-promo-btn" onClick={handleCoupon} disabled={!coupon}>Apply</button>
                  </div>
                  {couponError && <p className="mt-2 ms-2" style={{ color: '#f87171', fontSize: '0.8rem' }}>{couponError}</p>}
                </div>
              ) : (
                <div className="d-inline-flex align-items-center gap-3 px-4 py-3 rounded"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12 }}>
                  <i className="bi bi-check-circle-fill" style={{ color: '#34d399', fontSize: '1.1rem' }} />
                  <div>
                    <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.88rem' }}>
                      Code applied: <span style={{ color: '#34d399' }}>{appliedCoupon.code}</span>
                    </p>
                    <p className="mb-0" style={{ color: '#34d399', fontSize: '0.78rem' }}>You're saving {appliedCoupon.value}% on this order!</p>
                  </div>
                  <button onClick={() => { setAppliedCoupon(null); setCouponError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--nex-text-muted)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="col-lg-4">
            <div className="nex-summary-card">
              <h5 className="nex-text-light fw-bold mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)', fontSize: '1.1rem' }}>Order Summary</h5>

              <div className="nex-summary-row">
                <span className="nex-text-muted">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="nex-text-light fw-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="nex-summary-row">
                <span className="nex-text-muted">Shipping</span>
                <span className={shipping === 0 ? '' : 'nex-text-light fw-bold'} style={shipping === 0 ? { color: '#34d399', fontWeight: 700 } : {}}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {appliedCoupon && (
                <div className="nex-summary-row">
                  <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.88rem' }}>Discount ({appliedCoupon.code})</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>−${discount.toFixed(2)}</span>
                </div>
              )}

              {shipping > 0 && (
                <div className="d-flex align-items-center gap-3 my-3 px-3 py-2 rounded" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10 }}>
                  <i className="bi bi-truck nex-text-purple" style={{ fontSize: '1.1rem' }} />
                  <span className="nex-text-muted" style={{ fontSize: '0.8rem' }}>
                    Add <strong className="nex-gradient-text">${(1000 - subtotal).toFixed(2)}</strong> more for <strong style={{ color: '#34d399' }}>FREE shipping</strong>
                  </span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-end mt-4 pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                <span className="nex-text-light fw-bold">Total</span>
                <div className="text-end">
                  <div className="nex-summary-total">${total.toFixed(2)}</div>
                  <span className="nex-text-muted" style={{ fontSize: '0.72rem' }}>Including taxes</span>
                </div>
              </div>

              <Link to="/checkout" className="nex-btn-primary w-100 justify-content-between mt-4 d-flex" style={{ padding: '14px 20px' }}>
                <span>Proceed to Checkout</span>
                <i className="bi bi-arrow-right" />
              </Link>

              <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                <div className="d-flex justify-content-center gap-4 mb-2">
                  {[
                    { icon: 'bi-lock-fill', label: 'Secure' },
                    { icon: 'bi-box-seam', label: 'Fast ship' },
                    { icon: 'bi-shield-fill-check', label: 'Protected' },
                  ].map(b => (
                    <div key={b.label} className="d-flex flex-column align-items-center gap-1">
                      <i className={`bi ${b.icon} nex-text-purple`} style={{ fontSize: '1.1rem' }} />
                      <span className="nex-text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{b.label}</span>
                    </div>
                  ))}
                </div>
                <p className="nex-text-muted mb-0" style={{ fontSize: '0.72rem' }}>100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
