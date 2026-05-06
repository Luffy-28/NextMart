import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ORDER_ITEMS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', color: 'Midnight Black', price: 349, qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: 2, name: 'Running Shoes Pro X', color: 'Crimson Red / Size 10', price: 129, qty: 2, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
];

const STEPS = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');

  const [address, setAddress] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', state: '', zip: '', country: 'Australia',
  });
  const [payment, setPayment] = useState({
    method: 'card', cardNumber: '', cardName: '', expiry: '', cvv: '',
  });

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = shippingMethod === 'express' ? 14.99 : 0;
  const discount = Math.round(subtotal * 0.15);
  const total = subtotal + shipping - discount;

  const handleAddressChange = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }));
  const handlePaymentChange = e => setPayment(p => ({ ...p, [e.target.name]: e.target.value }));

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => navigate('/orders'), 2000);
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => val.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/');

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Page hero */}
      <div className="nex-page-hero">
        <div className="nex-orb" style={{ width: 260, height: 260, background: '#06B6D4', top: '-50%', right: '-3%', opacity: 0.1 }} />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <p className="nex-label mb-2">NexMart</p>
          <h1 className="nex-text-light fw-bold mb-2" style={{ fontSize: '2rem' }}>Secure Checkout</h1>
          <p className="nex-breadcrumb mb-0">
            <Link to="/">Home</Link><span className="nex-breadcrumb-sep">›</span>
            <Link to="/cart">Cart</Link><span className="nex-breadcrumb-sep">›</span>
            <span className="nex-text-light fw-semibold">Checkout</span>
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--nex-border)', padding: '20px 0' }}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="nex-steps">
            {STEPS.map((s, i) => (
              <div key={s} className="d-flex align-items-center">
                <div className="d-flex align-items-center gap-2" onClick={() => i < step && setStep(i)} style={{ cursor: i < step ? 'pointer' : 'default', opacity: i > step ? 0.5 : 1 }}>
                  <div className={`nex-step-circle ${i < step ? 'done' : i === step ? 'active' : 'inactive'}`}>
                    {i < step ? <i className="bi bi-check-lg" style={{ fontSize: '0.9rem' }} /> : i + 1}
                  </div>
                  <span className="d-none d-sm-block fw-bold" style={{ fontSize: '0.88rem', color: i === step ? 'var(--nex-text)' : i < step ? '#34d399' : 'var(--nex-text-muted)' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`nex-step-line ${i < step ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-5">
          {/* Form area */}
          <div className="col-lg-7 col-xl-8">

            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="nex-glass-card p-4 p-md-5">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad" style={{ width: 44, height: 44 }}>
                    <i className="bi bi-geo-alt-fill text-white" />
                  </div>
                  <h5 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.2rem' }}>Shipping Information</h5>
                </div>

                <div className="row g-4 mb-4">
                  {[
                    { name: 'firstName', label: 'First Name', placeholder: 'John', col: 6 },
                    { name: 'lastName', label: 'Last Name', placeholder: 'Smith', col: 6 },
                    { name: 'email', label: 'Email Address', placeholder: 'john@example.com', col: 6, type: 'email' },
                    { name: 'phone', label: 'Phone Number', placeholder: '+61 400 000 000', col: 6 },
                    { name: 'street', label: 'Street Address', placeholder: '123 Main Street, Apt 4', col: 12 },
                    { name: 'city', label: 'City', placeholder: 'Sydney', col: 5 },
                    { name: 'state', label: 'State', placeholder: 'NSW', col: 3 },
                    { name: 'zip', label: 'Postcode', placeholder: '2000', col: 4 },
                  ].map(f => (
                    <div className={`col-${f.col}`} key={f.name}>
                      <label className="nex-form-label">{f.label}</label>
                      <input type={f.type || 'text'} name={f.name} value={address[f.name]} onChange={handleAddressChange}
                        placeholder={f.placeholder} className="nex-input" />
                    </div>
                  ))}
                </div>

                <h6 className="nex-text-light fw-bold mb-3 mt-2" style={{ fontSize: '1rem' }}>Shipping Method</h6>
                <div className="d-flex flex-column gap-3 mb-5">
                  {[
                    { key: 'standard', label: 'Standard Delivery', sub: '5–7 business days', price: 'FREE', icon: 'bi-truck', accent: '#34d399' },
                    { key: 'express', label: 'Express Delivery', sub: '1–2 business days', price: '$14.99', icon: 'bi-lightning-charge-fill', accent: 'var(--nex-cyan)' },
                  ].map(opt => (
                    <div key={opt.key} onClick={() => setShippingMethod(opt.key)}
                      className="d-flex align-items-center justify-content-between p-4"
                      style={{
                        borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                        border: `2px solid ${shippingMethod === opt.key ? 'rgba(139,92,246,0.5)' : 'var(--nex-border)'}`,
                        background: shippingMethod === opt.key ? 'rgba(139,92,246,0.07)' : 'rgba(255,255,255,0.02)',
                      }}>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${shippingMethod === opt.key ? 'var(--nex-purple)' : 'var(--nex-border)'}`, background: shippingMethod === opt.key ? 'var(--nex-purple)' : 'transparent', transition: 'all 0.2s', flexShrink: 0 }} />
                        <i className={`bi ${opt.icon} d-none d-sm-block`} style={{ color: opt.accent, fontSize: '1.2rem' }} />
                        <div>
                          <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{opt.label}</p>
                          <p className="nex-text-muted mb-0" style={{ fontSize: '0.8rem' }}>{opt.sub}</p>
                        </div>
                      </div>
                      <span className="fw-bold" style={{ color: opt.accent, fontSize: '0.95rem' }}>{opt.price}</span>
                    </div>
                  ))}
                </div>

                <div className="text-end pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                  <button onClick={() => setStep(1)} className="nex-btn-primary" style={{ padding: '13px 36px' }}>
                    Continue to Payment <i className="bi bi-arrow-right ms-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="nex-glass-card p-4 p-md-5">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad" style={{ width: 44, height: 44 }}>
                    <i className="bi bi-credit-card-2-front-fill text-white" />
                  </div>
                  <h5 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.2rem' }}>Payment Details</h5>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-4">
                  {[
                    { key: 'card', label: 'Credit / Debit Card', icon: 'bi-credit-card' },
                    { key: 'paypal', label: 'PayPal', icon: 'bi-paypal' },
                    { key: 'cod', label: 'Cash on Delivery', icon: 'bi-cash-stack' },
                  ].map(m => (
                    <button key={m.key} onClick={() => setPayment(p => ({ ...p, method: m.key }))}
                      className={payment.method === m.key ? 'nex-btn-primary' : 'nex-btn-outline'}
                      style={{ padding: '10px 20px', fontSize: '0.84rem' }}>
                      <i className={`bi ${m.icon} me-2`} />{m.label}
                    </button>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <div className="p-4 rounded mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nex-border)', borderRadius: 12 }}>
                    <div className="row g-4">
                      <div className="col-12">
                        <label className="nex-form-label">Card Number</label>
                        <input name="cardNumber" value={formatCard(payment.cardNumber)}
                          onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value.replace(/\s/g, '') }))}
                          placeholder="1234 5678 9012 3456" maxLength={19} className="nex-input"
                          style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }} />
                      </div>
                      <div className="col-12">
                        <label className="nex-form-label">Name on Card</label>
                        <input name="cardName" value={payment.cardName} onChange={handlePaymentChange}
                          placeholder="John Smith" className="nex-input" />
                      </div>
                      <div className="col-6">
                        <label className="nex-form-label">Expiry</label>
                        <input name="expiry" value={formatExpiry(payment.expiry)}
                          onChange={e => setPayment(p => ({ ...p, expiry: e.target.value.replace('/', '') }))}
                          placeholder="MM/YY" maxLength={5} className="nex-input"
                          style={{ fontFamily: 'monospace' }} />
                      </div>
                      <div className="col-6">
                        <label className="nex-form-label">CVV</label>
                        <input name="cvv" value={payment.cvv} onChange={handlePaymentChange}
                          placeholder="•••" maxLength={4} type="password" className="nex-input"
                          style={{ fontFamily: 'monospace' }} />
                      </div>
                    </div>
                  </div>
                )}

                {payment.method === 'paypal' && (
                  <div className="text-center py-5 rounded mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nex-border)', borderRadius: 12 }}>
                    <i className="bi bi-paypal nex-text-muted d-block mb-3" style={{ fontSize: '3rem' }} />
                    <p className="nex-text-muted mb-0" style={{ fontSize: '0.9rem' }}>You'll be redirected to PayPal to complete your payment securely.</p>
                  </div>
                )}

                {payment.method === 'cod' && (
                  <div className="p-4 rounded mb-4" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12 }}>
                    <div className="d-flex gap-3">
                      <i className="bi bi-cash-stack" style={{ color: '#fbbf24', fontSize: '1.5rem', flexShrink: 0 }} />
                      <div>
                        <p className="fw-bold mb-1" style={{ color: '#fbbf24' }}>Cash on Delivery Selected</p>
                        <p className="nex-text-muted mb-0" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>Pay when your order arrives. A COD fee of $2.99 applies. Please have the exact amount ready.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-center gap-3 p-3 rounded mb-4" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10 }}>
                  <i className="bi bi-shield-lock-fill nex-text-purple" style={{ fontSize: '1.2rem' }} />
                  <span className="nex-text-muted" style={{ fontSize: '0.82rem' }}>All transactions are secure and encrypted. We never store your full card details.</span>
                </div>

                <div className="d-flex gap-3 pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                  <button onClick={() => setStep(0)} className="nex-btn-outline" style={{ padding: '13px 24px' }}>← Back</button>
                  <button onClick={() => setStep(2)} className="nex-btn-primary flex-grow-1 justify-content-center" style={{ padding: '13px' }}>
                    Review Order <i className="bi bi-arrow-right ms-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="nex-glass-card p-4 p-md-5">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                  <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad" style={{ width: 44, height: 44 }}>
                    <i className="bi bi-clipboard2-check-fill text-white" />
                  </div>
                  <h5 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.2rem' }}>Review Your Order</h5>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-md-6">
                    <div className="nex-glass-card p-4 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="nex-label mb-0">Shipping To</p>
                        <button onClick={() => setStep(0)} className="nex-gradient-text fw-bold" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>Edit</button>
                      </div>
                      <p className="nex-text-light fw-bold mb-1">{address.firstName || 'John'} {address.lastName || 'Smith'}</p>
                      <p className="nex-text-muted mb-1" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                        {address.street || '123 Main St'}<br />
                        {address.city || 'Sydney'}, {address.state || 'NSW'} {address.zip || '2000'}<br />
                        {address.country}
                      </p>
                      <p className="nex-text-muted mb-0" style={{ fontSize: '0.82rem' }}>{address.email || 'john@example.com'}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="nex-glass-card p-4 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="nex-label mb-0">Payment Method</p>
                        <button onClick={() => setStep(1)} className="nex-gradient-text fw-bold" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem' }}>Edit</button>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <i className={`bi ${payment.method === 'card' ? 'bi-credit-card' : payment.method === 'paypal' ? 'bi-paypal' : 'bi-cash-stack'} nex-gradient-text`} style={{ fontSize: '1.5rem' }} />
                        <p className="nex-text-light fw-bold mb-0">
                          {payment.method === 'card' && `•••• ${payment.cardNumber.slice(-4) || '3456'}`}
                          {payment.method === 'paypal' && 'PayPal Express'}
                          {payment.method === 'cod' && 'Cash on Delivery'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="nex-text-light fw-bold mb-4">Items in Order ({ORDER_ITEMS.length})</h6>
                <div className="d-flex flex-column gap-3 mb-5">
                  {ORDER_ITEMS.map(item => (
                    <div key={item.id} className="nex-glass-card d-flex align-items-center gap-4 p-3">
                      <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--nex-border)' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="flex-grow-1">
                        <p className="nex-text-light fw-bold mb-1" style={{ fontSize: '0.92rem' }}>{item.name}</p>
                        <p className="nex-text-muted mb-0" style={{ fontSize: '0.8rem' }}>{item.color}</p>
                        <p className="nex-text-muted mb-0" style={{ fontSize: '0.78rem' }}>Qty: {item.qty} × ${item.price}</p>
                      </div>
                      <span className="nex-text-light fw-bold">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-3 pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                  <button onClick={() => setStep(1)} className="nex-btn-outline" style={{ padding: '13px 24px' }}>← Back</button>
                  <button
                    className="nex-btn-primary flex-grow-1 justify-content-center"
                    style={{ padding: '13px', background: placing ? 'linear-gradient(135deg,#10b981,#059669)' : undefined, transition: 'all 0.3s' }}
                    onClick={handlePlaceOrder} disabled={placing}>
                    {placing ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" />Processing...</>
                    ) : (
                      <>Complete Order · ${total.toFixed(2)} <i className="bi bi-check-lg ms-2" /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="col-lg-5 col-xl-4">
            <div className="nex-summary-card">
              <h6 className="nex-text-light fw-bold mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)', fontSize: '1.05rem' }}>Order Summary</h6>

              <div className="d-flex flex-column gap-3 pb-4 mb-4" style={{ borderBottom: '1px solid var(--nex-border)', maxHeight: 240, overflowY: 'auto' }}>
                {ORDER_ITEMS.map(item => (
                  <div key={item.id} className="d-flex gap-3 align-items-center">
                    <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--nex-border)' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                      <p className="nex-text-muted mb-0" style={{ fontSize: '0.75rem' }}>Qty: {item.qty}</p>
                    </div>
                    <span className="nex-text-light fw-bold" style={{ fontSize: '0.88rem', flexShrink: 0 }}>${item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="nex-summary-row">
                <span className="nex-text-muted">Subtotal</span>
                <span className="nex-text-light fw-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="nex-summary-row">
                <span className="nex-text-muted">Shipping</span>
                <span style={shipping === 0 ? { color: '#34d399', fontWeight: 700 } : { color: 'var(--nex-text)', fontWeight: 700 }}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="nex-summary-row">
                  <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.88rem' }}>Discount (NEXMART15)</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>−${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-end mt-4 pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                <span className="nex-text-light fw-bold">Total</span>
                <div className="text-end">
                  <div className="nex-summary-total">${total.toFixed(2)}</div>
                  <span className="nex-text-muted" style={{ fontSize: '0.72rem' }}>Including taxes</span>
                </div>
              </div>

              <div className="text-center mt-4 pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                <div className="d-flex justify-content-center gap-4 mb-2">
                  {['bi-lock-fill', 'bi-box-seam', 'bi-shield-fill-check'].map(icon => (
                    <i key={icon} className={`bi ${icon} nex-text-purple`} style={{ fontSize: '1.2rem' }} />
                  ))}
                </div>
                <p className="nex-text-muted mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>100% Secure Checkout</p>
                <p className="nex-text-muted mb-0" style={{ fontSize: '0.72rem' }}>Your payment info is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
