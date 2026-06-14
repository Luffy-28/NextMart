import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveDeals } from '../features/deal/dealAction.js';
import { addToCart } from '../features/cart/cartAction.js';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Countdown = ({ startsAt, endsAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(new Date(endsAt).getTime() - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = new Date(endsAt).getTime() - Date.now();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt, onExpire]);

  if (timeLeft <= 0) {
    return <span className="text-danger fw-bold" style={{ fontSize: '0.85rem' }}>EXPIRED</span>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const total = end - start;
  const elapsed = Date.now() - start;
  const pct = Math.max(0, Math.min(100, ((total - elapsed) / total) * 100));

  return (
    <div className="w-100">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center gap-1">
          {[
            { val: String(days).padStart(2, '0'), label: 'd' },
            { val: String(hours).padStart(2, '0'), label: 'h' },
            { val: String(minutes).padStart(2, '0'), label: 'm' },
            { val: String(seconds).padStart(2, '0'), label: 's' },
          ].map((t, i) => (
            <div key={i} className="d-flex align-items-center gap-1">
              <div className="text-center" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: '3px 8px', minWidth: 32 }}>
                <span className="fw-bold" style={{ fontSize: '0.85rem', color: 'white', fontFamily: 'monospace' }}>{t.val}</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700 }}>{t.label}</span>
              {i < 3 && <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>:</span>}
            </div>
          ))}
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--nex-text-muted)', fontWeight: 600 }}>
          {pct > 50 ? 'Active' : pct > 20 ? 'Ending Soon' : 'Urgent!'}
        </span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: pct < 20 ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
          borderRadius: 2,
          transition: 'width 1s linear'
        }} />
      </div>
    </div>
  );
};

const Deals = () => {
  const dispatch = useDispatch();
  const [activeDeal, setActiveDeal] = useState(null);
  const [filter, setFilter] = useState('All');
  const [addedToCart, setAddedToCart] = useState({});

  // Redux Selectors
  const { deals, loading } = useSelector((state) => state.dealStore);

  useEffect(() => {
    dispatch(fetchActiveDeals());
  }, [dispatch]);

  // If activeDeal changes, update it with fresh reference from store if refreshed
  useEffect(() => {
    if (activeDeal) {
      const fresh = deals?.find(d => d._id === activeDeal._id);
      if (fresh) setActiveDeal(fresh);
    }
  }, [deals, activeDeal]);

  const handleAdd = async (productId) => {
    const data = await dispatch(addToCart({ productId, quantity: 1 }));
    if (data?.status === 'success') {
      setAddedToCart(p => ({ ...p, [productId]: true }));
      setTimeout(() => setAddedToCart(p => ({ ...p, [productId]: false })), 1500);
      toast.success('Item added to cart');
    } else {
      toast.error(data?.message || 'Failed to add item to cart');
    }
  };

  const calculateDiscountedPrice = (basePrice, type, val) => {
    if (type === 'percentage') {
      return Math.max(0, +(basePrice - (basePrice * val) / 100).toFixed(2));
    } else {
      return Math.max(0, +(basePrice - val).toFixed(2));
    }
  };

  // Get distinct categories from deal products for filter bar
  const categoriesList = ['All', ...new Set(
    deals?.flatMap(deal =>
      deal.products?.map(p => p.category?.name).filter(Boolean)
    ) || []
  )];

  // Filter deals based on selected category
  const filteredDeals = deals?.filter(deal => {
    if (filter === 'All') return true;
    return deal.products?.some(p => p.category?.name === filter);
  }) || [];

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
            <p className="lead nex-text-muted mx-auto" style={{ maxWidth: 560 }}>
              {activeDeal 
                ? `Explore exclusive prices for "${activeDeal.title}" products.`
                : 'Save big on top-rated products. Exclusive discounts available for a limited time only.'}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {/* Loading state */}
        {loading && <LoadingSpinner />}

        {!loading && (
          <>
            {/* VIEW 1: All active deal banners */}
            {!activeDeal && (
              <>
                {deals?.length > 0 && (
                  <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
                    <div>
                      <h4 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.3rem' }}>
                        <i className="bi bi-fire me-2" style={{ color: '#EF4444' }} />Trending Deals
                      </h4>
                      <p className="nex-text-muted mb-0" style={{ fontSize: '0.82rem' }}>{filteredDeals.length} deals available</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {categoriesList.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)}
                          className={filter === cat ? 'nex-btn-primary' : 'nex-btn-outline'}
                          style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-xl-3">
                  {filteredDeals.map((deal, i) => {
                    const firstProduct = deal.products?.[0] || {};
                    const badge = firstProduct.category?.name || 'Flash Deal';
                    const imageUrl = deal.bannerImage || firstProduct.images?.[0] || firstProduct.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
                    const isUrgent = (new Date(deal.endsAt).getTime() - Date.now()) < 8 * 60 * 60 * 1000;

                    return (
                      <div className="col" key={deal._id || i}>
                        <Reveal delay={i * 60}>
                          <div className="nex-glass-card h-100 d-flex flex-column overflow-hidden"
                            onClick={() => setActiveDeal(deal)}
                            style={{ cursor: 'pointer', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(239,68,68,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--nex-border)'; e.currentTarget.style.boxShadow = 'none'; }}>

                            {/* Image */}
                            <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                              <img src={imageUrl} alt={deal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                              {/* Discount badge */}
                              <span className="position-absolute"
                                style={{ top: 12, left: 12, background: isUrgent ? '#EF4444' : '#8B5CF6', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em' }}>
                                {deal.discountType === 'percentage' ? `${deal.discountValue}% OFF` : `$${deal.discountValue} OFF`}
                              </span>

                              {/* Category badge */}
                              <span className="position-absolute"
                                style={{ top: 12, right: 12, background: 'rgba(7,7,15,0.75)', backdropFilter: 'blur(8px)', color: 'rgba(240,244,255,0.8)', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
                                {badge}
                              </span>

                              {isUrgent && (
                                <div className="position-absolute d-flex align-items-center gap-2"
                                  style={{ bottom: 12, left: 12, background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '5px 10px', borderRadius: 20 }}>
                                  <i className="bi bi-lightning-charge-fill" />ENDING SOON
                                </div>
                              )}
                            </div>

                            {/* Body */}
                            <div className="d-flex flex-column flex-grow-1 p-4">
                              <div className="mb-3">
                                <Countdown startsAt={deal.startsAt} endsAt={deal.endsAt} onExpire={() => dispatch(fetchActiveDeals())} />
                              </div>
                              <h5 className="nex-text-light fw-bold mb-2">{deal.title}</h5>
                              <p className="nex-text-muted small mb-4 flex-grow-1">{deal.description || 'Exclusive limited-time price drop.'}</p>
                              
                              <div className="mt-auto d-flex align-items-center justify-content-between pt-3" style={{ borderTop: '1px solid var(--nex-border)' }}>
                                <span className="small text-muted">{deal.products?.length || 0} Products inside</span>
                                <span className="nex-gradient-text fw-bold small">Explore Deal →</span>
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* VIEW 2: Selected Deal Products Grid */}
            {activeDeal && (
              <div>
                {/* Back and summary bar */}
                <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
                  <button onClick={() => setActiveDeal(null)} className="nex-btn-outline" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                    <i className="bi bi-arrow-left me-2" />Back to All Deals
                  </button>
                  <div className="nex-glass-card px-4 py-2">
                    <span className="nex-text-muted small">{activeDeal.products?.length || 0} Products in this deal</span>
                  </div>
                </div>

                {/* Deal Header card */}
                <Reveal>
                  <div className="nex-glass-card p-4 mb-5" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(239,68,68,0.05) 100%)', borderColor: 'rgba(139,92,246,0.2)' }}>
                    <div className="row g-4 align-items-center">
                      <div className="col-lg-3 text-center text-lg-start">
                        <span className="nex-pill mb-2 d-inline-flex" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                          ACTIVE OFFER
                        </span>
                        <h3 className="nex-text-light fw-bold mb-2">{activeDeal.title}</h3>
                        <p className="nex-text-muted small mb-0">{activeDeal.description || 'Exclusive limited-time price drop.'}</p>
                      </div>
                      <div className="col-lg-3 text-center">
                        <span className="display-4 fw-bold nex-gradient-text">
                          {activeDeal.discountType === 'percentage' ? `${activeDeal.discountValue}% OFF` : `$${activeDeal.discountValue} OFF`}
                        </span>
                        <p className="small text-muted mt-1 mb-0">Discount applied at checkout/cart</p>
                      </div>
                      <div className="col-lg-6">
                        <div className="nex-glass-card p-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <Countdown startsAt={activeDeal.startsAt} endsAt={activeDeal.endsAt} onExpire={() => { setActiveDeal(null); dispatch(fetchActiveDeals()); }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Products Grid */}
                <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4">
                  {activeDeal.products?.map((prod, i) => {
                    const imageUrl = prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
                    const discPrice = calculateDiscountedPrice(prod.basePrice, activeDeal.discountType, activeDeal.discountValue);
                    const savedAmount = +(prod.basePrice - discPrice).toFixed(2);

                    return (
                      <div className="col" key={prod._id || i}>
                        <Reveal delay={i * 60}>
                          <div className="nex-glass-card h-100 d-flex flex-column overflow-hidden"
                            style={{ transition: 'border-color 0.3s, box-shadow 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.boxShadow = 'var(--nex-glow-hover)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--nex-border)'; e.currentTarget.style.boxShadow = 'none'; }}>

                            {/* Image */}
                            <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                              <img src={imageUrl} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              
                              <span className="position-absolute"
                                style={{ top: 12, left: 12, background: '#EF4444', color: 'white', fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
                                SAVE ${savedAmount}
                              </span>

                              <Link to={`/products/${prod._id}`}
                                className="position-absolute d-flex align-items-center justify-content-center"
                                style={{ top: 10, right: 10, width: 34, height: 34, background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', color: 'rgba(240,244,255,0.7)', textDecoration: 'none', backdropFilter: 'blur(8px)', fontSize: '0.85rem' }}>
                                <i className="bi bi-eye" />
                              </Link>
                            </div>

                            {/* Body */}
                            <div className="d-flex flex-column flex-grow-1 p-3">
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--nex-cyan)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                {prod.category?.name || 'Item'}
                              </span>

                              <Link to={`/products/${prod._id}`} className="text-decoration-none flex-grow-1">
                                <p className="nex-text-light fw-semibold mb-3 mt-1" style={{ fontSize: '0.9rem', lineHeight: 1.4, minHeight: 40 }}>
                                  {prod.name}
                                </p>
                              </Link>

                              <div className="d-flex align-items-center justify-content-between mt-auto pt-2" style={{ borderTop: '1px solid var(--nex-border)' }}>
                                <div>
                                  <span className="nex-text-light fw-bold" style={{ fontSize: '1.15rem' }}>${discPrice}</span>
                                  <span className="nex-text-muted ms-2 text-decoration-line-through" style={{ fontSize: '0.82rem' }}>${prod.basePrice}</span>
                                </div>
                                <button onClick={() => handleAdd(prod._id)}
                                  className={addedToCart[prod._id] ? 'nex-btn-primary' : 'nex-btn-outline'}
                                  style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
                                  {addedToCart[prod._id] ? '✓ Added' : '+ Cart'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && (!deals || deals.length === 0) && (
          <Reveal>
            <div className="nex-glass-card text-center py-5 my-4">
              <i className="bi bi-lightning-charge nex-text-muted mb-3 d-block" style={{ fontSize: '3rem' }} />
              <h4 className="nex-text-light fw-bold mb-2">No active deals found</h4>
              <p className="nex-text-muted mb-4">Please check back later for exciting offers!</p>
            </div>
          </Reveal>
        )}

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
