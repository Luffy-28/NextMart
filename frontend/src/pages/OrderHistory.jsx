import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const ORDERS = [
  {
    id: 'NX-2025-00412',
    date: 'Apr 28, 2025',
    status: 'Delivered',
    total: 607,
    items: [
      { name: 'Wireless Headphones', qty: 1, price: 349, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
      { name: 'Running Shoes Pro X', qty: 2, price: 129, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    ],
    address: 'Sydney, NSW 2000',
    tracking: 'AUS1234567890',
  },
  {
    id: 'NX-2025-00388',
    date: 'Apr 10, 2025',
    status: 'Shipped',
    total: 149,
    items: [
      { name: 'Ergonomic Laptop Stand', qty: 1, price: 89, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
      { name: 'Ceramic Coffee Mug Set', qty: 2, price: 30, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
    ],
    address: 'Melbourne, VIC 3000',
    tracking: 'AUS9876543210',
  },
  {
    id: 'NX-2025-00347',
    date: 'Mar 19, 2025',
    status: 'Processing',
    total: 64,
    items: [
      { name: 'Linen Throw Blanket', qty: 1, price: 64, image: 'https://images.unsplash.com/photo-1580828369019-2220f1885f8f?w=500&q=80' },
    ],
    address: 'Brisbane, QLD 4000',
    tracking: null,
  },
  {
    id: 'NX-2025-00315',
    date: 'Mar 05, 2025',
    status: 'Refunded',
    total: 199,
    items: [
      { name: 'Mechanical Keyboard Pro', qty: 1, price: 199, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
    ],
    address: 'Adelaide, SA 5000',
    tracking: 'AUS4455667788',
  },
  {
    id: 'NX-2025-00301',
    date: 'Feb 28, 2025',
    status: 'Cancelled',
    total: 39,
    items: [
      { name: 'Yoga Mat Premium', qty: 1, price: 39, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80' },
    ],
    address: 'Perth, WA 6000',
    tracking: null,
  },
];

const STATUS_CONFIG = {
  Delivered: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', icon: '✓', label: 'Delivered' },
  Shipped:   { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', icon: '🚚', label: 'Shipped' },
  Processing:{ bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', icon: '⏳', label: 'Processing' },
  Refunded:  { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6', icon: '💸', label: 'Refunded' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)',  color: '#EF4444', icon: '×', label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Processing;
  return (
    <span className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-bold fs-12 shadow-sm"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      <span style={{ fontSize: '14px' }}>{cfg.icon}</span> {cfg.label}
    </span>
  );
};

const OrderHistory = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const statuses = ['All', 'Delivered', 'Shipped', 'Processing', 'Refunded', 'Cancelled'];

  const filtered = ORDERS
    .filter(o => filter === 'All' || o.status === filter)
    .filter(o =>
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
    );

  const toggleExpand = (id) => setExpanded(prev => prev === id ? null : id);

  const totalSpent = ORDERS.filter(o => o.status === 'Delivered' || o.status === 'Shipped').reduce((s, o) => s + o.total, 0);
  const deliveredCount = ORDERS.filter(o => o.status === 'Delivered').length;
  const refundedCount = ORDERS.filter(o => o.status === 'Refunded').length;

  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="bg-brand-dark text-white py-5">
        <Container fluid className="px-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-2 fs-36">Order History</h1>
              <p className="mb-0 fs-15 text-brand-white-70 fw-medium">
                <Link to="/" className="text-brand-white-50 text-decoration-none hover-text-dark transition-color">Home</Link>
                <span className="mx-2 opacity-50">›</span>
                <span className="text-white">My Orders</span>
              </p>
            </div>
            <Button as={Link} to="/products" className="rounded-pill border-0 px-4 h-48 fs-15 fw-bold btn-brand shadow-sm transition-color hover-shadow">
              Continue Shopping
            </Button>
          </div>
        </Container>
      </div>

      <Container fluid className="px-container mt-4">
        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Orders', value: ORDERS.length, icon: '📦', color: '#0D9488' },
            { label: 'Total Spent', value: `$${totalSpent}`, icon: '💰', color: '#1A2E4A' },
            { label: 'Delivered', value: deliveredCount, icon: '✅', color: '#10B981' },
            { label: 'Refunded', value: refundedCount, icon: '💸', color: '#8B5CF6' },
          ].map((stat, i) => (
            <Col xs={6} lg={3} key={i}>
              <div className="bg-white rounded p-4 d-flex align-items-center gap-3 shadow-sm border border-brand-light transition-color hover-shadow" style={{ borderRadius: '16px' }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '56px', height: '56px', background: `${stat.color}15`, fontSize: '24px', flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="fw-bold fs-24 text-brand-dark mb-0 lh-1">{stat.value}</p>
                  <p className="fs-13 fw-medium text-brand-muted mb-0 mt-1">{stat.label}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Search + Filter */}
        <div className="bg-white rounded p-4 mb-4 d-flex flex-wrap align-items-center gap-4 shadow-sm border border-brand-light" style={{ borderRadius: '16px' }}>
          <div className="position-relative flex-grow-1" style={{ minWidth: '250px', maxWidth: '400px' }}>
            <span className="position-absolute top-50 translate-middle-y ps-3 text-brand-muted fs-15">🔍</span>
            <Form.Control
              type="text"
              placeholder="Search by order ID or product name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-48 border-brand-gray fs-14 rounded-pill fw-medium"
              style={{ paddingLeft: '44px', boxShadow: 'none' }}
            />
          </div>
          <div className="d-flex flex-wrap gap-2">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="rounded-pill px-4 fw-bold fs-13 border transition-color"
                style={{
                  height: '42px',
                  background: filter === s ? '#1A2E4A' : 'white',
                  color: filter === s ? 'white' : '#64748B',
                  borderColor: filter === s ? '#1A2E4A' : '#E2E8F0',
                  boxShadow: filter === s ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded shadow-sm text-center py-5 border border-brand-light" style={{ borderRadius: '16px' }}>
            <p style={{ fontSize: '72px', opacity: 0.5 }} className="mb-3">📭</p>
            <h5 className="fw-bold fs-20 text-brand-dark mb-2">No orders found</h5>
            <p className="fs-15 text-brand-muted mb-4">We couldn't find any orders matching your criteria.</p>
            <Button onClick={() => { setFilter('All'); setSearch(''); }} className="rounded-pill border-0 px-4 h-48 fs-14 fw-bold btn-brand">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filtered.map(order => (
              <div key={order.id} className="bg-white rounded shadow-sm overflow-hidden border border-brand-light transition-color hover-shadow" style={{ borderRadius: '16px' }}>
                {/* Order Header */}
                <div
                  className="d-flex align-items-center justify-content-between flex-wrap gap-3 p-4 p-md-5 cursor-pointer bg-white"
                  onClick={() => toggleExpand(order.id)}
                  style={{ borderBottom: expanded === order.id ? '1px solid #F1F5F9' : 'none' }}
                >
                  <div className="d-flex align-items-center gap-4 flex-wrap">
                    <div>
                      <p className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest mb-1">Order ID</p>
                      <p className="fw-bold fs-16 text-brand-dark mb-0">{order.id}</p>
                    </div>
                    <div className="d-none d-sm-block" style={{ width: '2px', height: '40px', background: '#F1F5F9' }}></div>
                    <div>
                      <p className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest mb-1">Date</p>
                      <p className="fs-15 fw-medium text-brand-dark mb-0">{order.date}</p>
                    </div>
                    <div className="d-none d-md-block" style={{ width: '2px', height: '40px', background: '#F1F5F9' }}></div>
                    <div className="d-none d-md-block" style={{ maxWidth: '300px' }}>
                      <p className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest mb-1">Items</p>
                      <p className="fs-14 text-brand-dark mb-0 text-truncate">{order.items.map(i => i.name).join(', ')}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-4 flex-wrap">
                    <StatusBadge status={order.status} />
                    <div className="text-end ms-3">
                      <p className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest mb-1">Total</p>
                      <p className={`fw-bold fs-18 mb-0 ${order.status === 'Refunded' ? 'text-brand-muted text-decoration-line-through' : 'text-brand-primary'}`}>
                        ${order.total}
                      </p>
                    </div>
                    <span className="text-brand-muted fs-20 d-flex align-items-center justify-content-center bg-brand-light rounded-circle" 
                          style={{ width: '40px', height: '40px', transition: 'transform 0.3s, background 0.2s', transform: expanded === order.id ? 'rotate(180deg)' : 'rotate(0)' }}>
                      ↓
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === order.id && (
                  <div className="p-4 p-md-5 bg-brand-light bg-opacity-50">
                    <Row className="g-5">
                      {/* Items */}
                      <Col lg={7}>
                        <p className="fs-14 fw-bold text-brand-dark mb-4 border-bottom pb-2">Items in this Order</p>
                        <div className="d-flex flex-column gap-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center gap-4 p-3 rounded bg-white shadow-sm border border-brand-light">
                              <div className="bg-brand-gray rounded overflow-hidden flex-shrink-0"
                                style={{ width: '70px', height: '70px' }}>
                                <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" />
                              </div>
                              <div className="flex-grow-1">
                                <p className="fw-bold fs-15 text-brand-dark mb-1">{item.name}</p>
                                <p className="fs-13 fw-medium text-brand-muted mb-0">Qty: {item.qty} × ${item.price}</p>
                              </div>
                              <span className="fw-bold fs-16 text-brand-primary">${item.qty * item.price}</span>
                            </div>
                          ))}
                        </div>
                      </Col>

                      {/* Info */}
                      <Col lg={5}>
                        <p className="fs-14 fw-bold text-brand-dark mb-4 border-bottom pb-2">Order Details</p>
                        <div className="d-flex flex-column gap-3">
                          {/* Delivery Address */}
                          <div className="p-4 rounded bg-white shadow-sm border border-brand-light">
                            <div className="d-flex align-items-start gap-3">
                              <span className="fs-20 text-brand-primary">📍</span>
                              <div>
                                <p className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest mb-1">Delivery Address</p>
                                <p className="fs-14 fw-medium text-brand-dark mb-0">{order.address}</p>
                              </div>
                            </div>
                          </div>

                          {/* Tracking */}
                          {order.tracking && (
                            <div className="p-4 rounded bg-white shadow-sm border border-brand-light">
                              <div className="d-flex align-items-start gap-3">
                                <span className="fs-20 text-brand-primary">🚚</span>
                                <div>
                                  <p className="fs-12 fw-bold text-brand-muted text-uppercase tracking-widest mb-1">Tracking Number</p>
                                  <p className="fs-14 fw-bold text-brand-primary mb-0 text-decoration-underline cursor-pointer">{order.tracking}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Order Total */}
                          <div className="p-4 rounded bg-white shadow-sm border border-brand-light">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="fs-14 text-brand-muted fw-medium">Subtotal</span>
                              <span className="fs-14 text-brand-dark fw-bold">${order.total}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                              <span className="fs-14 text-brand-muted fw-medium">Shipping</span>
                              <span className="fs-14 text-success fw-bold">FREE</span>
                            </div>
                            
                            {order.status === 'Refunded' && (
                              <div className="d-flex justify-content-between mb-3 p-2 rounded bg-danger bg-opacity-10">
                                <span className="fs-14 text-danger fw-bold">Refund Applied</span>
                                <span className="fs-14 text-danger fw-bold">-${order.total}</span>
                              </div>
                            )}

                            <div className="d-flex justify-content-between pt-3" style={{ borderTop: '1px solid #E2E8F0' }}>
                              <span className="fs-16 fw-bold text-brand-dark">Total</span>
                              <span className={`fs-18 fw-bold ${order.status === 'Refunded' ? 'text-brand-muted' : 'text-brand-primary'}`}>
                                ${order.status === 'Refunded' ? '0' : order.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Action Buttons */}
                    <div className="d-flex flex-wrap gap-3 mt-5 pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
                      {order.status === 'Delivered' && (
                        <>
                          <Button className="rounded border-0 px-4 h-48 fs-14 fw-bold btn-brand shadow-sm">
                            Buy It Again
                          </Button>
                          <Button variant="outline-secondary" className="rounded px-4 h-48 fs-14 fw-bold"
                            style={{ borderColor: '#CBD5E1', color: '#475569' }}>
                            Write a Review
                          </Button>
                          <Button variant="outline-secondary" className="rounded px-4 h-48 fs-14 fw-bold ms-auto"
                            style={{ borderColor: '#CBD5E1', color: '#475569' }}>
                            Return Item
                          </Button>
                        </>
                      )}
                      {order.status === 'Shipped' && (
                        <Button className="rounded border-0 px-4 h-48 fs-14 fw-bold btn-brand shadow-sm">
                          Track Package
                        </Button>
                      )}
                      {order.status === 'Processing' && (
                        <Button variant="outline-danger" className="rounded px-4 h-48 fs-14 fw-bold shadow-sm"
                          style={{ borderColor: '#FCA5A5', color: '#EF4444' }}>
                          Cancel Order
                        </Button>
                      )}
                      {(order.status === 'Cancelled' || order.status === 'Refunded') && (
                        <Button className="rounded border-0 px-4 h-48 fs-14 fw-bold btn-brand shadow-sm">
                          Shop Similar Items
                        </Button>
                      )}
                      
                      <Button variant="outline-secondary" className={`rounded px-4 h-48 fs-14 fw-bold ${order.status !== 'Delivered' ? 'ms-auto' : ''}`}
                        style={{ borderColor: '#CBD5E1', color: '#475569' }}>
                        View Invoice
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrderHistory;
