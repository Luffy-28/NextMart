import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

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
  // Simulating an active discount code from Cart
  const discount = Math.round(subtotal * 0.15); // 15% discount
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
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-brand-dark text-white py-5">
        <Container fluid className="px-container">
          <h1 className="fw-bold mb-2 fs-36">Secure Checkout</h1>
          <p className="mb-0 fs-15 text-brand-white-70 fw-medium">
            <Link to="/" className="text-brand-white-50 text-decoration-none hover-text-dark transition-color">Home</Link>
            <span className="mx-2 opacity-50">›</span>
            <Link to="/cart" className="text-brand-white-50 text-decoration-none hover-text-dark transition-color">Cart</Link>
            <span className="mx-2 opacity-50">›</span>
            <span className="text-white">Checkout</span>
          </p>
        </Container>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-bottom border-brand-gray py-4 shadow-sm">
        <Container fluid className="px-container">
          <div className="d-flex align-items-center justify-content-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center gap-2 cursor-pointer transition-color"
                  onClick={() => i < step && setStep(i)}
                  style={{ opacity: i > step ? 0.6 : 1 }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold fs-14 shadow-sm"
                    style={{
                      width: '36px', height: '36px',
                      background: i < step ? '#10B981' : i === step ? '#1A2E4A' : '#E2E8F0',
                      color: i <= step ? 'white' : '#64748B',
                      transition: 'all 0.3s'
                    }}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`fs-14 fw-bold d-none d-sm-block ${i === step ? 'text-brand-dark' : i < step ? 'text-success' : 'text-brand-muted'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mx-3" style={{ width: '60px', height: '3px', borderRadius: '2px', background: i < step ? '#10B981' : '#E2E8F0', transition: 'background 0.3s' }}></div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container fluid className="px-container mt-5">
        <Row className="g-5">
          {/* Main Form Area */}
          <Col lg={7} xl={8}>

            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="bg-white rounded p-4 p-md-5 shadow-sm border border-brand-light transition-all" style={{ borderRadius: '16px' }}>
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-brand-light">
                  <span className="bg-brand-pale text-brand-primary rounded-circle d-flex align-items-center justify-content-center fs-20" style={{ width: '48px', height: '48px' }}>📍</span>
                  <h5 className="fw-bold fs-24 text-brand-dark mb-0">Shipping Information</h5>
                </div>
                
                <Row className="g-4 mb-5">
                  <Col sm={6}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">First Name</Form.Label>
                    <Form.Control name="firstName" value={address.firstName} onChange={handleAddressChange}
                      placeholder="John" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                  <Col sm={6}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">Last Name</Form.Label>
                    <Form.Control name="lastName" value={address.lastName} onChange={handleAddressChange}
                      placeholder="Smith" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                  <Col sm={6}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">Email Address</Form.Label>
                    <Form.Control name="email" type="email" value={address.email} onChange={handleAddressChange}
                      placeholder="john@example.com" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                  <Col sm={6}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">Phone Number</Form.Label>
                    <Form.Control name="phone" value={address.phone} onChange={handleAddressChange}
                      placeholder="+61 400 000 000" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                  <Col xs={12}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">Street Address</Form.Label>
                    <Form.Control name="street" value={address.street} onChange={handleAddressChange}
                      placeholder="123 Main Street, Apt 4" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                  <Col sm={5}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">City</Form.Label>
                    <Form.Control name="city" value={address.city} onChange={handleAddressChange}
                      placeholder="Sydney" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                  <Col sm={3}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">State</Form.Label>
                    <Form.Control name="state" value={address.state} onChange={handleAddressChange}
                      placeholder="NSW" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                  <Col sm={4}>
                    <Form.Label className="fs-13 fw-bold text-brand-dark">Postcode</Form.Label>
                    <Form.Control name="zip" value={address.zip} onChange={handleAddressChange}
                      placeholder="2000" className="h-48 border-brand-gray bg-brand-light bg-opacity-50 fs-14 rounded fw-medium box-shadow-none focus-ring" />
                  </Col>
                </Row>

                {/* Shipping Method */}
                <h6 className="fw-bold fs-18 text-brand-dark mt-4 mb-3">Shipping Method</h6>
                <div className="d-flex flex-column gap-3 mb-5">
                  {[
                    { key: 'standard', label: 'Standard Delivery', sub: '5–7 business days', price: 'FREE', priceColor: '#10B981', icon: '🚚' },
                    { key: 'express', label: 'Express Delivery', sub: '1–2 business days', price: '$14.99', priceColor: '#1A2E4A', icon: '🚀' },
                  ].map(opt => (
                    <div
                      key={opt.key}
                      onClick={() => setShippingMethod(opt.key)}
                      className="d-flex align-items-center justify-content-between p-4 rounded cursor-pointer transition-all hover-shadow"
                      style={{
                        border: `2px solid ${shippingMethod === opt.key ? '#0D9488' : '#E2E8F0'}`,
                        background: shippingMethod === opt.key ? 'rgba(13,148,136,0.04)' : 'white',
                        borderRadius: '12px'
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle border d-flex align-items-center justify-content-center bg-white"
                          style={{ width: '24px', height: '24px', borderColor: shippingMethod === opt.key ? '#0D9488' : '#CBD5E1', borderWidth: shippingMethod === opt.key ? '7px' : '2px', transition: 'all 0.2s' }}>
                        </div>
                        <span className="fs-24 d-none d-sm-block">{opt.icon}</span>
                        <div>
                          <p className="fw-bold fs-15 text-brand-dark mb-0">{opt.label}</p>
                          <p className="fs-13 fw-medium text-brand-muted mb-0 mt-1">{opt.sub}</p>
                        </div>
                      </div>
                      <span className="fw-bold fs-16" style={{ color: opt.priceColor }}>{opt.price}</span>
                    </div>
                  ))}
                </div>

                <div className="text-end border-top border-brand-gray pt-4">
                  <Button onClick={() => setStep(1)} className="rounded px-5 h-54 fs-15 fw-bold btn-brand shadow-sm">
                    Continue to Payment →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="bg-white rounded p-4 p-md-5 shadow-sm border border-brand-light transition-all" style={{ borderRadius: '16px' }}>
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-brand-light">
                  <span className="bg-brand-pale text-brand-primary rounded-circle d-flex align-items-center justify-content-center fs-20" style={{ width: '48px', height: '48px' }}>💳</span>
                  <h5 className="fw-bold fs-24 text-brand-dark mb-0">Payment Details</h5>
                </div>

                {/* Method Toggle */}
                <div className="d-flex flex-wrap gap-3 mb-5">
                  {[
                    { key: 'card', label: 'Credit / Debit Card' },
                    { key: 'paypal', label: 'PayPal' },
                    { key: 'cod', label: 'Cash on Delivery' },
                  ].map(m => (
                    <button
                      key={m.key}
                      onClick={() => setPayment(p => ({ ...p, method: m.key }))}
                      className="rounded px-4 fs-14 fw-bold border transition-color flex-grow-1 flex-md-grow-0"
                      style={{
                        height: '48px',
                        background: payment.method === m.key ? '#1A2E4A' : 'white',
                        color: payment.method === m.key ? 'white' : '#475569',
                        borderColor: payment.method === m.key ? '#1A2E4A' : '#CBD5E1',
                        boxShadow: payment.method === m.key ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payment.method === 'card' && (
                  <div className="p-4 border rounded bg-brand-light bg-opacity-50 mb-4" style={{ borderColor: '#E2E8F0', borderRadius: '12px' }}>
                    <Row className="g-4">
                      <Col xs={12}>
                        <Form.Label className="fs-13 fw-bold text-brand-dark">Card Number</Form.Label>
                        <Form.Control
                          name="cardNumber"
                          value={formatCard(payment.cardNumber)}
                          onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value.replace(/\s/g, '') }))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="h-48 border-brand-gray fs-15 rounded fw-medium box-shadow-none text-monospace"
                        />
                      </Col>
                      <Col xs={12}>
                        <Form.Label className="fs-13 fw-bold text-brand-dark">Name on Card</Form.Label>
                        <Form.Control
                          name="cardName" value={payment.cardName} onChange={handlePaymentChange}
                          placeholder="John Smith"
                          className="h-48 border-brand-gray fs-14 rounded fw-medium box-shadow-none"
                        />
                      </Col>
                      <Col sm={6}>
                        <Form.Label className="fs-13 fw-bold text-brand-dark">Expiry Date</Form.Label>
                        <Form.Control
                          name="expiry"
                          value={formatExpiry(payment.expiry)}
                          onChange={e => setPayment(p => ({ ...p, expiry: e.target.value.replace('/', '') }))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="h-48 border-brand-gray fs-15 rounded fw-medium box-shadow-none text-monospace"
                        />
                      </Col>
                      <Col sm={6}>
                        <Form.Label className="fs-13 fw-bold text-brand-dark">CVV</Form.Label>
                        <Form.Control
                          name="cvv" value={payment.cvv} onChange={handlePaymentChange}
                          placeholder="•••" maxLength={4}
                          type="password"
                          className="h-48 border-brand-gray fs-15 rounded fw-medium box-shadow-none text-monospace"
                        />
                      </Col>
                    </Row>
                  </div>
                )}

                <div className="d-flex align-items-center gap-3 p-3 rounded mb-5 bg-brand-pale text-brand-primary" style={{ borderRadius: '10px' }}>
                  <span className="fs-24">🔒</span>
                  <span className="fs-13 fw-medium lh-16">All transactions are secure and encrypted. We never store your full card details.</span>
                </div>

                {payment.method === 'paypal' && (
                  <div className="text-center py-5 border rounded mb-5 bg-brand-light bg-opacity-50" style={{ borderColor: '#E2E8F0', borderRadius: '12px' }}>
                    <p className="fs-15 text-brand-dark fw-medium mb-4">You will be redirected to PayPal to complete payment securely.</p>
                    <div className="d-inline-flex align-items-center justify-content-center border rounded px-5 bg-white shadow-sm" style={{ height: '64px', borderColor: '#CBD5E1', fontSize: '32px' }}>
                      🅿 <span className="fw-bold fs-24 ms-2 text-brand-dark">PayPal</span>
                    </div>
                  </div>
                )}

                {payment.method === 'cod' && (
                  <div className="p-4 rounded mb-5 border shadow-sm" style={{ background: '#FFFBEB', borderColor: '#FDE68A', borderRadius: '12px' }}>
                    <div className="d-flex align-items-start gap-3">
                      <span className="fs-32">💵</span>
                      <div>
                        <p className="fw-bold fs-16 text-warning-dark mb-2">Cash on Delivery Selected</p>
                        <p className="fs-14 text-brand-muted fw-medium mb-0 lh-16">Pay when your order arrives. Please have the exact amount ready. A COD fee of $2.99 applies to this order.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex gap-3 pt-4 border-top border-brand-gray">
                  <Button onClick={() => setStep(0)} variant="outline-secondary"
                    className="rounded px-4 px-md-5 h-54 fs-14 fw-bold"
                    style={{ background: 'transparent', color: '#475569', borderColor: '#CBD5E1' }}>
                    ← Back
                  </Button>
                  <Button onClick={() => setStep(2)} className="flex-grow-1 rounded border-0 h-54 fs-15 fw-bold btn-brand shadow-sm">
                    Review Order →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="bg-white rounded p-4 p-md-5 shadow-sm border border-brand-light transition-all" style={{ borderRadius: '16px' }}>
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-brand-light">
                  <span className="bg-brand-pale text-brand-primary rounded-circle d-flex align-items-center justify-content-center fs-20" style={{ width: '48px', height: '48px' }}>📋</span>
                  <h5 className="fw-bold fs-24 text-brand-dark mb-0">Review Your Order</h5>
                </div>

                <Row className="g-4 mb-5">
                  <Col md={6}>
                    {/* Shipping Address Summary */}
                    <div className="p-4 rounded h-100 bg-brand-light bg-opacity-50 border" style={{ borderColor: '#E2E8F0', borderRadius: '12px' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <p className="fs-13 fw-bold text-brand-muted text-uppercase tracking-widest mb-0">Shipping To</p>
                        <button onClick={() => setStep(0)} className="border-0 bg-transparent text-brand-primary fs-13 fw-bold text-decoration-underline">Edit</button>
                      </div>
                      <p className="fs-15 text-brand-dark fw-bold mb-1">
                        {address.firstName || 'John'} {address.lastName || 'Smith'}
                      </p>
                      <p className="fs-14 text-brand-muted fw-medium mb-1 lh-16">
                        {address.street || '123 Main St'}<br/>
                        {address.city || 'Sydney'}, {address.state || 'NSW'} {address.zip || '2000'}<br/>
                        {address.country || 'Australia'}
                      </p>
                      <p className="fs-14 text-brand-muted fw-medium mb-0 mt-2">{address.email || 'john@example.com'}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    {/* Payment Summary */}
                    <div className="p-4 rounded h-100 bg-brand-light bg-opacity-50 border" style={{ borderColor: '#E2E8F0', borderRadius: '12px' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <p className="fs-13 fw-bold text-brand-muted text-uppercase tracking-widest mb-0">Payment Method</p>
                        <button onClick={() => setStep(1)} className="border-0 bg-transparent text-brand-primary fs-13 fw-bold text-decoration-underline">Edit</button>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-white border rounded d-flex align-items-center justify-content-center fs-24 shadow-sm" style={{ width: '48px', height: '36px', borderColor: '#CBD5E1' }}>
                          {payment.method === 'card' ? '💳' : payment.method === 'paypal' ? '🅿' : '💵'}
                        </div>
                        <p className="fs-15 text-brand-dark fw-bold mb-0">
                          {payment.method === 'card' && `•••• ${payment.cardNumber.slice(-4) || '3456'}`}
                          {payment.method === 'paypal' && 'PayPal Express'}
                          {payment.method === 'cod' && 'Cash on Delivery'}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Items */}
                <h6 className="fw-bold fs-16 text-brand-dark mb-4">Items in Order ({ORDER_ITEMS.length})</h6>
                <div className="d-flex flex-column gap-3 mb-5">
                  {ORDER_ITEMS.map((item, idx) => (
                    <div key={item.id} className="d-flex align-items-center gap-4 p-3 rounded bg-white shadow-sm border border-brand-light transition-color hover-shadow"
                      style={{ borderRadius: '12px' }}>
                      <div className="bg-brand-gray rounded overflow-hidden flex-shrink-0"
                        style={{ width: '80px', height: '80px' }}>
                        <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div className="flex-grow-1">
                        <p className="fw-bold fs-15 text-brand-dark mb-1">{item.name}</p>
                        <p className="fs-13 fw-medium text-brand-muted mb-0">{item.color}</p>
                        <p className="fs-13 fw-medium text-brand-muted mt-1 mb-0">Qty: {item.qty} × ${item.price}</p>
                      </div>
                      <span className="fw-bold fs-18 text-brand-dark">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-3 pt-4 border-top border-brand-gray">
                  <Button onClick={() => setStep(1)} variant="outline-secondary"
                    className="rounded px-4 px-md-5 h-54 fs-14 fw-bold"
                    style={{ background: 'transparent', color: '#475569', borderColor: '#CBD5E1' }}>
                    ← Back
                  </Button>
                  <Button
                    className="flex-grow-1 rounded border-0 h-54 fs-16 fw-bold shadow"
                    style={{ background: placing ? '#10B981' : '#0D9488', color: 'white', transition: 'all 0.3s' }}
                    onClick={handlePlaceOrder}
                    disabled={placing}
                  >
                    {placing ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Processing...
                      </span>
                    ) : (
                      `✓ Complete Order • $${total.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Col>

          {/* Order Summary Sidebar */}
          <Col lg={5} xl={4}>
            <div className="bg-white rounded p-4 p-md-5 shadow-sm border border-brand-light" style={{ borderRadius: '16px', position: 'sticky', top: '90px' }}>
              <h6 className="fw-bold fs-20 text-brand-dark mb-4 pb-3 border-bottom border-brand-gray">Order Summary</h6>
              
              <div className="d-flex flex-column gap-3 mb-4 pb-4 border-bottom border-brand-gray max-h-300 overflow-auto custom-scrollbar pe-2">
                {ORDER_ITEMS.map(item => (
                  <div key={item.id} className="d-flex gap-3 align-items-center">
                    <div className="bg-brand-gray flex-shrink-0 rounded overflow-hidden"
                      style={{ width: '50px', height: '50px' }}>
                      <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="flex-grow-1">
                      <p className="fw-bold fs-13 text-brand-dark mb-1 lh-12 text-truncate">{item.name}</p>
                      <p className="fs-12 fw-medium text-brand-muted mb-0">Qty: {item.qty}</p>
                    </div>
                    <span className="fw-bold fs-14 text-brand-dark">${(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-14 fw-medium text-brand-muted">Subtotal</span>
                  <span className="fs-14 fw-bold text-brand-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-14 fw-medium text-brand-muted">Shipping</span>
                  <span className={`fs-14 fw-bold ${shipping === 0 ? 'text-success' : 'text-brand-dark'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between align-items-center p-2 rounded bg-success bg-opacity-10 px-3">
                    <span className="fs-14 fw-bold text-success">Discount (NEXMART15)</span>
                    <span className="fs-14 fw-bold text-success">−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-end pt-3 mt-1" style={{ borderTop: '1px solid #E2E8F0' }}>
                  <span className="fw-bold fs-16 text-brand-dark">Total</span>
                  <div className="text-end">
                    <span className="fw-bold text-brand-primary d-block lh-1" style={{ fontSize: '32px' }}>${total.toFixed(2)}</span>
                    <span className="fs-11 text-brand-muted">Including taxes</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-light p-4 rounded text-center">
                <div className="d-flex justify-content-center gap-4 mb-3">
                  <span className="fs-24 opacity-75" title="Secure Payment">🔒</span>
                  <span className="fs-24 opacity-75" title="Fast Shipping">📦</span>
                  <span className="fs-24 opacity-75" title="Quality Guarantee">🛡️</span>
                </div>
                <p className="fs-12 text-brand-muted fw-bold tracking-widest mb-0 text-uppercase">100% Secure Checkout</p>
                <p className="fs-11 text-brand-muted fw-medium mt-2 mb-0 lh-16">Your payment information is encrypted and secure.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
