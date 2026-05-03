import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

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

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => setItems(prev => prev.filter(item => item.id !== id));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 1000 ? 0 : 9.99; // Adjusted for demo
  const discount = appliedCoupon ? Math.round(subtotal * 0.15) : 0; // 15% discount
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

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <div className="bg-brand-light d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: '70vh' }}>
        <div className="mb-4" style={{ fontSize: '80px', opacity: '0.5' }}>🛒</div>
        <h2 className="fw-bold fs-24 text-brand-dark mb-2">Your cart is empty</h2>
        <p className="fs-15 text-brand-muted mb-4 max-w-400">Looks like you haven't added anything to your cart yet. Discover our premium products and start shopping.</p>
        <Button as={Link} to="/products" className="rounded-pill border-0 px-5 h-48 fs-15 fw-bold btn-brand shadow-sm transition-color hover-shadow">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-brand-dark text-white py-5">
        <Container fluid className="px-container">
          <h1 className="fw-bold mb-2 fs-36">Your Shopping Cart</h1>
          <p className="mb-0 fs-15 text-brand-white-70 fw-medium">
            <Link to="/" className="text-brand-white-50 text-decoration-none hover-text-dark transition-color">Home</Link>
            <span className="mx-2 opacity-50">›</span>
            <span className="text-white">Cart</span>
          </p>
        </Container>
      </div>

      <Container fluid className="px-container mt-4">
        <Row className="g-5">
          {/* Cart Items */}
          <Col lg={8}>
            <div className="bg-white rounded p-4 p-md-5 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-brand-light">
                <h5 className="fw-bold fs-20 text-brand-dark mb-0">Cart Items ({items.length})</h5>
                <Link to="/products" className="fs-14 text-brand-primary text-decoration-none fw-bold transition-color hover-text-dark">← Continue Shopping</Link>
              </div>

              {/* Column Headers */}
              <div className="d-none d-md-grid pb-3 mb-3 border-bottom border-brand-gray" style={{ gridTemplateColumns: '100px 3fr 1.5fr 1.5fr 1fr' }}>
                <span></span>
                <span className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest">Product Details</span>
                <span className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest text-center">Quantity</span>
                <span className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest text-center">Price</span>
                <span className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest text-end">Total</span>
              </div>

              <div className="d-flex flex-column gap-4">
                {items.map((item, idx) => (
                  <div key={item.id} className="d-flex flex-column flex-md-row gap-4 align-items-md-center position-relative pb-4" style={{ borderBottom: idx < items.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    {/* Image */}
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      <div className="bg-brand-gray rounded overflow-hidden shadow-sm transition-color hover-shadow"
                        style={{ width: '100px', height: '100px', borderRadius: '12px' }}>
                        <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fs-11 fw-bold text-brand-primary bg-brand-pale px-2 py-1 rounded">{item.category}</span>
                      </div>
                      <Link to={`/products/${item.id}`} className="text-decoration-none">
                        <h4 className="fw-bold fs-16 text-brand-dark mb-1 transition-color hover-text-primary">{item.name}</h4>
                      </Link>
                      <p className="fs-13 text-brand-muted fw-medium mb-0 d-flex align-items-center gap-2">
                        <span className="d-inline-block rounded-circle shadow-sm" style={{ width: '12px', height: '12px', background: item.color.includes('Black') ? '#1F2937' : item.color.includes('Red') ? '#DC2626' : '#94A3B8' }}></span>
                        {item.color}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="d-flex justify-content-md-center" style={{ width: '120px' }}>
                      <div className="d-flex align-items-center border rounded overflow-hidden" style={{ height: '40px', borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                        <button onClick={() => updateQty(item.id, -1)} className="border-0 bg-transparent px-3 fs-16 fw-bold text-brand-dark transition-color hover-bg-light">−</button>
                        <span className="fs-14 fw-bold text-brand-dark px-1 bg-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '100%' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="border-0 bg-transparent px-3 fs-16 fw-bold text-brand-dark transition-color hover-bg-light">+</button>
                      </div>
                    </div>

                    {/* Price & Total */}
                    <div className="d-flex flex-row flex-md-column justify-content-between justify-content-md-center align-items-center align-items-md-center gap-2" style={{ minWidth: '80px' }}>
                      <div className="d-flex flex-column text-md-center">
                        <span className="fs-11 text-brand-muted d-md-none mb-1">Price</span>
                        <span className="fw-semibold fs-15 text-brand-dark">${item.price}</span>
                      </div>
                    </div>

                    <div className="d-flex flex-row flex-md-column justify-content-between justify-content-md-center align-items-center align-items-md-end gap-2" style={{ minWidth: '100px' }}>
                      <div className="d-flex flex-column text-end">
                        <span className="fs-11 text-brand-muted d-md-none mb-1">Total</span>
                        <span className="fw-bold fs-18 text-brand-primary">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Remove button (absolute on desktop, normal on mobile) */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="position-absolute border-0 bg-transparent text-brand-muted transition-color hover-text-danger p-2"
                      style={{ top: '-10px', right: '-10px', fontSize: '20px', lineHeight: 1 }}
                      title="Remove Item"
                    >×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code Design System */}
            <div className="bg-white rounded p-4 p-md-5 shadow-sm border border-brand-light" style={{ borderRadius: '16px' }}>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-brand-pale rounded-circle d-flex align-items-center justify-content-center text-brand-primary" style={{ width: '40px', height: '40px', fontSize: '20px' }}>
                  🏷️
                </div>
                <div>
                  <h6 className="fw-bold fs-16 text-brand-dark mb-1">Promo Code & Discounts</h6>
                  <p className="fs-13 text-brand-muted mb-0">Apply a coupon to get a discount on your order.</p>
                </div>
              </div>

              {!appliedCoupon ? (
                <div className="position-relative max-w-500">
                  <div className="d-flex bg-brand-gray rounded-pill p-1 shadow-sm border" style={{ borderColor: couponError ? '#EF4444' : '#E2E8F0' }}>
                    <Form.Control
                      type="text"
                      placeholder="Enter code (e.g. NEXMART15)"
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(''); }}
                      className="border-0 fs-14 h-48 bg-transparent px-4 fw-medium text-uppercase"
                      style={{ boxShadow: 'none' }}
                      onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                    />
                    <Button 
                      onClick={handleCoupon} 
                      className="rounded-pill border-0 px-4 h-48 fs-14 fw-bold text-white transition-color"
                      style={{ background: coupon ? '#0D9488' : '#94A3B8', minWidth: '100px' }}
                      disabled={!coupon}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && <p className="position-absolute fs-12 fw-medium mt-2 ms-3" style={{ color: '#EF4444' }}>{couponError}</p>}
                </div>
              ) : (
                <div className="d-inline-flex align-items-center gap-3 px-4 py-3 rounded border shadow-sm" style={{ background: '#F0FDF4', borderColor: '#86EFAC' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-18">🎉</span>
                    <div>
                      <span className="fs-14 fw-bold text-brand-dark d-block">Code Applied: <span className="text-success">{appliedCoupon.code}</span></span>
                      <span className="fs-12 fw-medium text-success">You are saving {appliedCoupon.value}% on this order!</span>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="border-0 bg-transparent text-brand-muted fs-18 transition-color hover-text-danger ms-2 p-1" title="Remove Coupon">×</button>
                </div>
              )}
            </div>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <div className="bg-white rounded p-4 p-md-5 shadow-sm border border-brand-light" style={{ borderRadius: '16px', position: 'sticky', top: '90px' }}>
              <h5 className="fw-bold fs-20 text-brand-dark mb-4 pb-3 border-bottom border-brand-gray">Order Summary</h5>

              <div className="d-flex flex-column gap-3 pb-4 mb-4 border-bottom border-brand-gray">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-14 fw-medium text-brand-muted">Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span className="fs-15 fw-bold text-brand-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-14 fw-medium text-brand-muted">Shipping</span>
                  <span className={`fs-14 fw-bold ${shipping === 0 ? 'text-success' : 'text-brand-dark'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="d-flex justify-content-between align-items-center bg-success bg-opacity-10 p-2 rounded px-3 mt-2">
                    <span className="fs-14 fw-bold text-success">Discount ({appliedCoupon.code})</span>
                    <span className="fs-14 fw-bold text-success">−${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-end mb-4">
                <span className="fw-bold fs-16 text-brand-dark">Total</span>
                <div className="text-end">
                  <span className="fw-bold text-brand-primary d-block lh-1" style={{ fontSize: '32px' }}>${total.toFixed(2)}</span>
                  <span className="fs-11 text-brand-muted">Including taxes</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="d-flex align-items-center gap-3 p-3 rounded mb-4 shadow-sm"
                  style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <span className="fs-24">🚚</span>
                  <span className="fs-13 text-brand-dark fw-medium lh-16">Add <strong className="text-brand-primary fs-14">${(1000 - subtotal).toFixed(2)}</strong> more to unlock <span className="text-success fw-bold">FREE Shipping!</span></span>
                </div>
              )}

              <Button as={Link} to="/checkout" className="w-100 rounded border-0 h-54 fs-15 fw-bold btn-brand mb-4 shadow-sm transition-color d-flex justify-content-between align-items-center px-4">
                <span>Proceed to Checkout</span>
                <span className="fs-18">→</span>
              </Button>

              <div className="text-center bg-brand-light p-3 rounded">
                <div className="d-flex justify-content-center gap-4 mb-2">
                  <span className="fs-20 opacity-75" title="Secure Payment">🔒</span>
                  <span className="fs-20 opacity-75" title="Fast Shipping">📦</span>
                  <span className="fs-20 opacity-75" title="Quality Guarantee">🛡️</span>
                </div>
                <p className="fs-12 text-brand-muted fw-medium mb-0 tracking-wide">100% SECURE CHECKOUT</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
