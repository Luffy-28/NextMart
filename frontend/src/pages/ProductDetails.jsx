import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const RELATED = [
  { id: 2, name: 'Running Shoes Pro X', price: 129, rating: 4, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 3, name: 'Smart Desk Lamp', price: 49, rating: 4, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: 4, name: 'Ergonomic Laptop Stand', price: 89, rating: 5, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
  { id: 7, name: 'Vitamin C Serum', price: 32, rating: 5, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80' },
];

const REVIEWS = [
  { id: 1, user: 'Sarah M.', rating: 5, date: 'Apr 12, 2025', text: 'Absolutely love these headphones! The noise cancelling is incredible — I can focus for hours without any distractions. Worth every penny.' },
  { id: 2, user: 'James T.', rating: 4, date: 'Mar 28, 2025', text: 'Great sound quality and very comfortable for long sessions. Battery life is excellent. Took off one star because the carrying case feels a bit flimsy.' },
  { id: 3, user: 'Priya K.', rating: 5, date: 'Feb 14, 2025', text: "Best headphones I've owned. The build quality is premium and the bass response is perfect. Highly recommend!" },
];

const IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
  'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
  'https://images.unsplash.com/photo-1546435770-a3e426fa99e5?w=800&q=80',
];

const COLORS = [
  { name: 'Midnight Black', hex: '#1F2937' },
  { name: 'Pearl White', hex: '#F8FAFC' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
];

const SIZES = ['Standard', 'Pro (Over-ear)', 'Compact (On-ear)'];

const StarRating = ({ rating, size = 14 }) => (
  <span style={{ fontSize: size }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ color: s <= rating ? '#F59E0B' : 'rgba(255,255,255,0.12)' }}>★</span>
    ))}
  </span>
);

const specs = [
  { label: 'Driver Size', value: '40mm' },
  { label: 'Frequency Response', value: '20Hz – 20kHz' },
  { label: 'Battery Life', value: 'Up to 30 hours' },
  { label: 'Noise Cancellation', value: 'Active (ANC)' },
  { label: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm jack' },
  { label: 'Weight', value: '250g' },
  { label: 'Warranty', value: '2 years' },
];

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Breadcrumb bar */}
      <div style={{ background: 'var(--nex-bg-card)', borderBottom: '1px solid var(--nex-border)', padding: '14px 0' }}>
        <div className="container-fluid px-4 px-lg-5">
          <p className="nex-breadcrumb mb-0">
            <Link to="/">Home</Link>
            <span className="nex-breadcrumb-sep">›</span>
            <Link to="/products">Shop</Link>
            <span className="nex-breadcrumb-sep">›</span>
            <Link to="/products?category=electronics">Electronics</Link>
            <span className="nex-breadcrumb-sep">›</span>
            <span className="nex-text-light fw-semibold">Wireless Headphones</span>
          </p>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {/* Main product panel */}
        <div className="nex-glass-card p-4 p-md-5 mb-5">
          <div className="row g-5">
            {/* Gallery */}
            <div className="col-lg-6">
              <div style={{ position: 'sticky', top: 100 }}>
                <div style={{ height: 480, borderRadius: 16, overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nex-border)' }}>
                  <img src={IMAGES[selectedImage]} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="position-absolute" style={{ top: 14, left: 14, background: '#EF4444', color: 'white', fontSize: '0.68rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>BEST SELLER</span>
                  <button onClick={() => setWishlist(w => !w)}
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{ top: 12, right: 12, width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--nex-border)', background: 'rgba(7,7,15,0.7)', backdropFilter: 'blur(8px)', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <i className={`bi ${wishlist ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: wishlist ? '#F472B6' : 'rgba(240,244,255,0.6)' }} />
                  </button>
                </div>
                <div className="d-flex gap-2 mt-3 overflow-auto pb-1">
                  {IMAGES.map((img, i) => (
                    <div key={i} onClick={() => setSelectedImage(i)}
                      style={{
                        width: 80, height: 70, flexShrink: 0, borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                        border: `2px solid ${selectedImage === i ? 'var(--nex-purple)' : 'var(--nex-border)'}`,
                        opacity: selectedImage === i ? 1 : 0.55, transition: 'all 0.2s'
                      }}>
                      <img src={img} alt={`thumb ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="nex-status nex-status-blue">Electronics</span>
                <span className="nex-text-muted" style={{ fontSize: '0.78rem' }}>SKU: WH-1001-BLK</span>
              </div>

              <h1 className="nex-text-light fw-bold mb-3" style={{ fontSize: '1.85rem', lineHeight: 1.2 }}>
                Wireless Noise-Cancelling Headphones
              </h1>

              <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                <StarRating rating={5} size={16} />
                <span className="nex-text-light fw-bold">5.0</span>
                <span className="nex-text-muted" style={{ fontSize: '0.85rem' }}>(128 reviews)</span>
                <span className="nex-status nex-status-green ms-auto"><i className="bi bi-check-circle-fill me-1" />In Stock</span>
              </div>

              <div className="d-flex align-items-end gap-3 mb-4">
                <span className="nex-text-light fw-bold" style={{ fontSize: '2.8rem', lineHeight: 1 }}>$349</span>
                <span className="nex-text-muted text-decoration-line-through mb-1" style={{ fontSize: '1.2rem' }}>$449</span>
                <span className="nex-status nex-status-red mb-1">Save $100</span>
              </div>

              <p className="nex-text-muted mb-5" style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
                Experience studio-quality sound wherever you go. Industry-leading active noise cancellation, 30-hour battery life, and premium drivers for crystal-clear highs and deep, rich bass.
              </p>

              {/* Color selector */}
              <div className="mb-4">
                <p className="nex-form-label mb-3">Color: <span className="nex-text-muted" style={{ textTransform: 'none', fontWeight: 400 }}>{selectedColor}</span></p>
                <div className="d-flex gap-3">
                  {COLORS.map(c => (
                    <div key={c.name} onClick={() => setSelectedColor(c.name)}
                      style={{
                        width: 42, height: 42, borderRadius: '50%', cursor: 'pointer', padding: 3,
                        border: `2px solid ${selectedColor === c.name ? 'var(--nex-purple)' : 'transparent'}`,
                        transition: 'border-color 0.2s'
                      }}>
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: c.hex, border: '1px solid rgba(255,255,255,0.15)' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-5 pb-4" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                <p className="nex-form-label mb-3">Size Variant</p>
                <div className="d-flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      style={{
                        height: 42, padding: '0 18px', border: '1px solid', borderRadius: 8, cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, transition: 'all 0.2s',
                        borderColor: selectedSize === size ? 'var(--nex-purple)' : 'var(--nex-border)',
                        background: selectedSize === size ? 'rgba(139,92,246,0.12)' : 'transparent',
                        color: selectedSize === size ? 'var(--nex-purple)' : 'var(--nex-text-muted)',
                      }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + CTAs */}
              <div className="d-flex align-items-center gap-3 mb-5 flex-wrap">
                <div className="nex-qty">
                  <button className="nex-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="nex-qty-num">{quantity}</span>
                  <button className="nex-qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button className={`flex-grow-1 ${addedToCart ? 'nex-btn-primary' : 'nex-btn-primary'} justify-content-center`}
                  style={{ padding: '13px 24px', background: addedToCart ? 'linear-gradient(135deg,#10b981,#059669)' : undefined }}
                  onClick={handleAddToCart}>
                  {addedToCart ? <><i className="bi bi-check-lg me-2" />Added!</> : <><i className="bi bi-bag-plus me-2" />Add to Cart</>}
                </button>
                <Link to="/checkout" className="nex-btn-outline justify-content-center" style={{ padding: '13px 24px' }}>
                  Buy Now
                </Link>
              </div>

              {/* Trust badges */}
              <div className="row g-3">
                {[
                  { icon: 'bi-truck', title: 'Free Delivery', text: 'On orders over $50' },
                  { icon: 'bi-arrow-repeat', title: 'Free Returns', text: '30-day return policy' },
                  { icon: 'bi-shield-lock', title: 'Secure Payment', text: '100% safe checkout' },
                  { icon: 'bi-stars', title: '2-Year Warranty', text: 'Guaranteed quality' },
                ].map((b, i) => (
                  <div className="col-6" key={i}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nex-border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <i className={`bi ${b.icon} nex-gradient-text`} style={{ fontSize: '1.2rem', marginTop: 1 }} />
                      <div>
                        <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.8rem' }}>{b.title}</p>
                        <p className="nex-text-muted mb-0" style={{ fontSize: '0.72rem' }}>{b.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="nex-glass-card p-4 p-md-5 mb-5">
          <div className="nex-tabs">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${REVIEWS.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setSelectedTab(tab.key)}
                className={`nex-tab ${selectedTab === tab.key ? 'active' : ''}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {selectedTab === 'description' && (
            <div style={{ maxWidth: 740 }}>
              <h5 className="nex-text-light fw-bold mb-4">About This Product</h5>
              <p className="nex-text-muted mb-4" style={{ lineHeight: 1.8 }}>
                The NexMart Wireless Noise-Cancelling Headphones redefine premium audio. Engineered with advanced ANC technology that adapts to your environment, blocking up to 95% of ambient noise.
              </p>
              <ul className="d-flex flex-column gap-2 ps-3">
                {['Industry-leading Active Noise Cancellation', 'Up to 30 hours playtime (ANC on)', 'Fast charge: 10 min = 3 hours play', 'Multipoint Bluetooth — connect 2 devices', 'Built-in voice assistant support', 'Premium carrying case included'].map((f, i) => (
                  <li key={i} className="nex-text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedTab === 'specs' && (
            <div style={{ maxWidth: 640 }}>
              <h5 className="nex-text-light fw-bold mb-4">Technical Specifications</h5>
              {specs.map((spec, i) => (
                <div key={i} className="d-flex py-3" style={{ borderBottom: i < specs.length - 1 ? '1px solid var(--nex-border)' : 'none' }}>
                  <span className="nex-text-light fw-semibold" style={{ width: 220, flexShrink: 0, fontSize: '0.88rem' }}>{spec.label}</span>
                  <span className="nex-text-muted" style={{ fontSize: '0.88rem' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div>
              <div className="nex-glass-card-lg p-4 mb-5 d-flex gap-5 align-items-center flex-wrap">
                <div className="text-center">
                  <div className="nex-gradient-text fw-bold mb-2" style={{ fontSize: '4rem', lineHeight: 1 }}>5.0</div>
                  <StarRating rating={5} size={18} />
                  <p className="nex-text-muted mt-2 mb-0" style={{ fontSize: '0.82rem' }}>128 reviews</p>
                </div>
                <div className="flex-grow-1" style={{ maxWidth: 360 }}>
                  {[5, 4, 3, 2, 1].map(r => (
                    <div key={r} className="d-flex align-items-center gap-3 mb-2">
                      <span className="nex-text-muted" style={{ fontSize: '0.8rem', width: 20 }}>{r}★</span>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: r === 5 ? '78%' : r === 4 ? '16%' : r === 3 ? '4%' : '1%', background: '#F59E0B', borderRadius: 4 }} />
                      </div>
                      <span className="nex-text-muted" style={{ fontSize: '0.75rem', width: 30 }}>{r === 5 ? '78%' : r === 4 ? '16%' : r === 3 ? '4%' : '1%'}</span>
                    </div>
                  ))}
                </div>
                <button className="nex-btn-primary ms-auto" style={{ padding: '10px 22px' }}>Write a Review</button>
              </div>

              <div className="d-flex flex-column gap-4">
                {REVIEWS.map(review => (
                  <div key={review.id} className="pb-4" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad text-white fw-bold"
                          style={{ width: 44, height: 44, fontSize: '1rem', flexShrink: 0 }}>
                          {review.user[0]}
                        </div>
                        <div>
                          <p className="nex-text-light fw-bold mb-1 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                            {review.user}
                            <span className="nex-status nex-status-green" style={{ fontSize: '0.65rem' }}>Verified</span>
                          </p>
                          <StarRating rating={review.rating} size={13} />
                        </div>
                      </div>
                      <span className="nex-text-muted" style={{ fontSize: '0.8rem' }}>{review.date}</span>
                    </div>
                    <p className="nex-text-muted mb-0" style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related products */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)' }}>
            <h2 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.4rem' }}>You Might Also Like</h2>
            <Link to="/products" className="nex-gradient-text text-decoration-none fw-semibold" style={{ fontSize: '0.88rem' }}>View all →</Link>
          </div>
          <div className="row g-4 row-cols-2 row-cols-lg-4">
            {RELATED.map(p => (
              <div className="col" key={p.id}>
                <Link to={`/products/${p.id}`} className="text-decoration-none h-100 d-block nex-glass-card overflow-hidden"
                  style={{ transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--nex-border)'}>
                  <div style={{ height: 180, overflow: 'hidden' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''} />
                  </div>
                  <div className="p-3">
                    <p className="nex-text-light fw-semibold mb-1" style={{ fontSize: '0.88rem' }}>{p.name}</p>
                    <StarRating rating={p.rating} size={12} />
                    <p className="nex-gradient-text fw-bold mt-2 mb-0" style={{ fontSize: '1.05rem' }}>${p.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
