import { useState } from 'react';
import { Link } from 'react-router-dom';

const ORDERS = [
  {
    id: 'NX-2025-00412', date: 'Apr 28, 2025', status: 'Delivered', total: 607,
    items: [
      { name: 'Wireless Headphones', qty: 1, price: 349, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
      { name: 'Running Shoes Pro X', qty: 2, price: 129, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    ],
    address: 'Sydney, NSW 2000', tracking: 'AUS1234567890',
  },
  {
    id: 'NX-2025-00388', date: 'Apr 10, 2025', status: 'Shipped', total: 149,
    items: [
      { name: 'Ergonomic Laptop Stand', qty: 1, price: 89, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
      { name: 'Ceramic Coffee Mug Set', qty: 2, price: 30, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
    ],
    address: 'Melbourne, VIC 3000', tracking: 'AUS9876543210',
  },
  {
    id: 'NX-2025-00347', date: 'Mar 19, 2025', status: 'Processing', total: 64,
    items: [{ name: 'Linen Throw Blanket', qty: 1, price: 64, image: 'https://images.unsplash.com/photo-1580828369019-2220f1885f8f?w=500&q=80' }],
    address: 'Brisbane, QLD 4000', tracking: null,
  },
  {
    id: 'NX-2025-00315', date: 'Mar 05, 2025', status: 'Refunded', total: 199,
    items: [{ name: 'Mechanical Keyboard Pro', qty: 1, price: 199, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' }],
    address: 'Adelaide, SA 5000', tracking: 'AUS4455667788',
  },
  {
    id: 'NX-2025-00301', date: 'Feb 28, 2025', status: 'Cancelled', total: 39,
    items: [{ name: 'Yoga Mat Premium', qty: 1, price: 39, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80' }],
    address: 'Perth, WA 6000', tracking: null,
  },
];

const STATUS_CONFIG = {
  Delivered:  { cls: 'nex-status-green',  icon: 'bi-check-circle-fill' },
  Shipped:    { cls: 'nex-status-blue',   icon: 'bi-truck' },
  Processing: { cls: 'nex-status-yellow', icon: 'bi-hourglass-split' },
  Refunded:   { cls: 'nex-status-gray',   icon: 'bi-arrow-counterclockwise' },
  Cancelled:  { cls: 'nex-status-red',    icon: 'bi-x-circle-fill' },
};

const OrderHistory = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const statuses = ['All', 'Delivered', 'Shipped', 'Processing', 'Refunded', 'Cancelled'];

  const filtered = ORDERS
    .filter(o => filter === 'All' || o.status === filter)
    .filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase())));

  const totalSpent = ORDERS.filter(o => o.status === 'Delivered' || o.status === 'Shipped').reduce((s, o) => s + o.total, 0);
  const deliveredCount = ORDERS.filter(o => o.status === 'Delivered').length;

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Page hero */}
      <div className="nex-page-hero">
        <div className="nex-orb" style={{ width: 280, height: 280, background: '#06B6D4', top: '-50%', right: '-4%', opacity: 0.1 }} />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <p className="nex-label mb-2">NexMart</p>
              <h1 className="nex-text-light fw-bold mb-2" style={{ fontSize: '2rem' }}>Order History</h1>
              <p className="nex-breadcrumb mb-0">
                <Link to="/">Home</Link><span className="nex-breadcrumb-sep">›</span>
                <span className="nex-text-light fw-semibold">My Orders</span>
              </p>
            </div>
            <Link to="/products" className="nex-btn-outline" style={{ padding: '10px 24px', fontSize: '0.88rem' }}>
              <i className="bi bi-bag me-2" />Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {/* Stats */}
        <div className="row g-4 mb-5">
          {[
            { label: 'Total Orders', value: ORDERS.length, icon: 'bi-box-seam', color: 'var(--nex-purple)' },
            { label: 'Total Spent', value: `$${totalSpent}`, icon: 'bi-wallet2', color: 'var(--nex-cyan)' },
            { label: 'Delivered', value: deliveredCount, icon: 'bi-check-circle', color: '#34d399' },
            { label: 'Refunded', value: ORDERS.filter(o => o.status === 'Refunded').length, icon: 'bi-arrow-counterclockwise', color: 'var(--nex-text-muted)' },
          ].map((stat, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div className="nex-glass-card p-4 d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--nex-border)', flexShrink: 0 }}>
                  <i className={`bi ${stat.icon}`} style={{ color: stat.color, fontSize: '1.3rem' }} />
                </div>
                <div>
                  <p className="nex-gradient-text fw-bold mb-0" style={{ fontSize: '1.5rem', lineHeight: 1 }}>{stat.value}</p>
                  <p className="nex-text-muted mb-0 mt-1" style={{ fontSize: '0.78rem' }}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="nex-glass-card p-4 mb-4 d-flex flex-wrap align-items-center gap-4">
          <div className="position-relative flex-grow-1" style={{ minWidth: 240, maxWidth: 400 }}>
            <i className="bi bi-search position-absolute" style={{ left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--nex-text-muted)', fontSize: '0.85rem' }} />
            <input type="text" className="nex-input" placeholder="Search by order ID or product…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 38, borderRadius: 50 }} />
          </div>
          <div className="d-flex flex-wrap gap-2">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={filter === s ? 'nex-btn-primary' : 'nex-btn-outline'}
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="nex-glass-card text-center py-5">
            <i className="bi bi-inbox nex-text-muted d-block mb-3" style={{ fontSize: '3.5rem', opacity: 0.4 }} />
            <h5 className="nex-text-light fw-bold mb-2">No orders found</h5>
            <p className="nex-text-muted mb-4">No orders match your current filters.</p>
            <button onClick={() => { setFilter('All'); setSearch(''); }} className="nex-btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              const isOpen = expanded === order.id;
              return (
                <div key={order.id} className="nex-glass-card overflow-hidden" style={{ transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--nex-border)'}>

                  {/* Header row */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 p-4 p-md-5"
                    style={{ cursor: 'pointer', borderBottom: isOpen ? '1px solid var(--nex-border)' : 'none' }}
                    onClick={() => setExpanded(prev => prev === order.id ? null : order.id)}>

                    <div className="d-flex align-items-center gap-4 flex-wrap">
                      <div>
                        <p className="nex-label mb-1">Order ID</p>
                        <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.95rem', fontFamily: 'monospace' }}>{order.id}</p>
                      </div>
                      <div style={{ width: 1, height: 36, background: 'var(--nex-border)' }} className="d-none d-sm-block" />
                      <div>
                        <p className="nex-label mb-1">Date</p>
                        <p className="nex-text-muted mb-0" style={{ fontSize: '0.88rem' }}>{order.date}</p>
                      </div>
                      <div style={{ width: 1, height: 36, background: 'var(--nex-border)' }} className="d-none d-md-block" />
                      <div className="d-none d-md-block" style={{ maxWidth: 260 }}>
                        <p className="nex-label mb-1">Items</p>
                        <p className="nex-text-muted mb-0" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.items.map(i => i.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-4 flex-wrap">
                      <span className={`nex-status ${cfg.cls}`}>
                        <i className={`bi ${cfg.icon}`} />{order.status}
                      </span>
                      <div className="text-end">
                        <p className="nex-label mb-1">Total</p>
                        <p className={`fw-bold mb-0 ${order.status === 'Refunded' ? 'nex-text-muted text-decoration-line-through' : 'nex-gradient-text'}`} style={{ fontSize: '1.1rem' }}>
                          ${order.total}
                        </p>
                      </div>
                      <div className="d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--nex-border)', background: 'var(--nex-bg-card)', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                        <i className="bi bi-chevron-down nex-text-muted" style={{ fontSize: '0.8rem' }} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="p-4 p-md-5" style={{ background: 'rgba(0,0,0,0.15)' }}>
                      <div className="row g-5">
                        <div className="col-lg-7">
                          <p className="nex-label mb-3">Items in this Order</p>
                          <div className="d-flex flex-column gap-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="nex-glass-card d-flex align-items-center gap-4 p-3">
                                <div style={{ width: 68, height: 68, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--nex-border)' }}>
                                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="flex-grow-1">
                                  <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{item.name}</p>
                                  <p className="nex-text-muted mb-0" style={{ fontSize: '0.78rem' }}>Qty: {item.qty} × ${item.price}</p>
                                </div>
                                <span className="nex-gradient-text fw-bold">${item.qty * item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="col-lg-5">
                          <p className="nex-label mb-3">Order Details</p>
                          <div className="d-flex flex-column gap-3">
                            <div className="nex-glass-card p-4 d-flex align-items-start gap-3">
                              <i className="bi bi-geo-alt-fill nex-text-purple mt-1" style={{ flexShrink: 0 }} />
                              <div>
                                <p className="nex-label mb-1">Delivery Address</p>
                                <p className="nex-text-muted mb-0" style={{ fontSize: '0.88rem' }}>{order.address}</p>
                              </div>
                            </div>

                            {order.tracking && (
                              <div className="nex-glass-card p-4 d-flex align-items-start gap-3">
                                <i className="bi bi-truck nex-text-purple mt-1" style={{ flexShrink: 0 }} />
                                <div>
                                  <p className="nex-label mb-1">Tracking Number</p>
                                  <p className="nex-gradient-text fw-bold mb-0" style={{ fontSize: '0.88rem', fontFamily: 'monospace', cursor: 'pointer' }}>{order.tracking}</p>
                                </div>
                              </div>
                            )}

                            <div className="nex-glass-card p-4">
                              <div className="d-flex justify-content-between mb-2">
                                <span className="nex-text-muted" style={{ fontSize: '0.85rem' }}>Subtotal</span>
                                <span className="nex-text-light fw-bold" style={{ fontSize: '0.85rem' }}>${order.total}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-3">
                                <span className="nex-text-muted" style={{ fontSize: '0.85rem' }}>Shipping</span>
                                <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>FREE</span>
                              </div>
                              {order.status === 'Refunded' && (
                                <div className="d-flex justify-content-between mb-3 px-3 py-2 rounded" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                  <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>Refund Applied</span>
                                  <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>−${order.total}</span>
                                </div>
                              )}
                              <div className="d-flex justify-content-between pt-3" style={{ borderTop: '1px solid var(--nex-border)' }}>
                                <span className="nex-text-light fw-bold">Total</span>
                                <span className={`fw-bold ${order.status === 'Refunded' ? 'nex-text-muted' : 'nex-gradient-text'}`} style={{ fontSize: '1.1rem' }}>
                                  ${order.status === 'Refunded' ? '0' : order.total}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex flex-wrap gap-3 mt-5 pt-4" style={{ borderTop: '1px solid var(--nex-border)' }}>
                        {order.status === 'Delivered' && (
                          <>
                            <button className="nex-btn-primary" style={{ padding: '10px 22px', fontSize: '0.84rem' }}>
                              <i className="bi bi-bag-plus me-2" />Buy Again
                            </button>
                            <button className="nex-btn-outline" style={{ padding: '10px 22px', fontSize: '0.84rem' }}>
                              <i className="bi bi-star me-2" />Write Review
                            </button>
                            <button className="nex-btn-outline ms-auto" style={{ padding: '10px 22px', fontSize: '0.84rem' }}>
                              <i className="bi bi-arrow-return-left me-2" />Return Item
                            </button>
                          </>
                        )}
                        {order.status === 'Shipped' && (
                          <button className="nex-btn-primary" style={{ padding: '10px 22px', fontSize: '0.84rem' }}>
                            <i className="bi bi-geo-alt me-2" />Track Package
                          </button>
                        )}
                        {order.status === 'Processing' && (
                          <button className="nex-btn-outline" style={{ padding: '10px 22px', fontSize: '0.84rem', borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}>
                            <i className="bi bi-x-circle me-2" />Cancel Order
                          </button>
                        )}
                        {(order.status === 'Cancelled' || order.status === 'Refunded') && (
                          <Link to="/products" className="nex-btn-primary" style={{ padding: '10px 22px', fontSize: '0.84rem' }}>
                            <i className="bi bi-grid me-2" />Shop Similar
                          </Link>
                        )}
                        <button className={`nex-btn-outline ${order.status === 'Delivered' ? '' : 'ms-auto'}`} style={{ padding: '10px 22px', fontSize: '0.84rem' }}>
                          <i className="bi bi-file-text me-2" />View Invoice
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
