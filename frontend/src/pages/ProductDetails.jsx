import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';

const RELATED = [
  { id: 2, name: 'Running Shoes Pro X', price: 129, rating: 4, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 3, name: 'Smart Desk Lamp', price: 49, rating: 4, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: 4, name: 'Ergonomic Laptop Stand', price: 89, rating: 5, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
  { id: 7, name: 'Vitamin C Serum', price: 32, rating: 5, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80' },
];

const REVIEWS = [
  { id: 1, user: 'Sarah M.', rating: 5, date: 'Apr 12, 2025', text: 'Absolutely love these headphones! The noise cancelling is incredible — I can focus for hours without any distractions. Worth every penny.' },
  { id: 2, user: 'James T.', rating: 4, date: 'Mar 28, 2025', text: 'Great sound quality and very comfortable for long sessions. Battery life is excellent. Took off one star because the carrying case feels a bit flimsy.' },
  { id: 3, user: 'Priya K.', rating: 5, date: 'Feb 14, 2025', text: 'Best headphones I\'ve owned. The build quality is premium and the bass response is perfect. Highly recommend!' },
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
  { name: 'Navy Blue', hex: '#1E3A8A' }
];

const SIZES = ['Standard', 'Pro (Over-ear)', 'Compact (On-ear)'];

const StarRating = ({ rating, interactive = false, onRate, size = 14 }) => (
  <div className="d-flex gap-1 align-items-center">
    {[1, 2, 3, 4, 5].map(s => (
      <span
        key={s}
        onClick={() => interactive && onRate && onRate(s)}
        style={{ fontSize: size, color: s <= rating ? '#F59E0B' : '#E2E8F0', lineHeight: 1, cursor: interactive ? 'pointer' : 'default' }}
      >★</span>
    ))}
  </div>
);

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

  const specs = [
    { label: 'Driver Size', value: '40mm' },
    { label: 'Frequency Response', value: '20Hz – 20kHz' },
    { label: 'Battery Life', value: 'Up to 30 hours' },
    { label: 'Noise Cancellation', value: 'Active (ANC)' },
    { label: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm jack' },
    { label: 'Weight', value: '250g' },
    { label: 'Warranty', value: '2 years' },
  ];

  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="bg-white border-bottom border-brand-light py-3">
        <Container fluid className="px-container">
          <p className="mb-0 fs-13 text-brand-muted fw-medium">
            <Link to="/" className="text-brand-muted text-decoration-none transition-color hover-text-dark">Home</Link>
            <span className="mx-2 opacity-50">›</span>
            <Link to="/products" className="text-brand-muted text-decoration-none transition-color hover-text-dark">Shop</Link>
            <span className="mx-2 opacity-50">›</span>
            <Link to="/products?category=electronics" className="text-brand-muted text-decoration-none transition-color hover-text-dark">Electronics</Link>
            <span className="mx-2 opacity-50">›</span>
            <span className="text-brand-dark fw-bold">Wireless Headphones</span>
          </p>
        </Container>
      </div>

      <Container fluid className="px-container mt-4">
        <div className="bg-white rounded p-4 p-md-5 shadow-sm mb-5" style={{ borderRadius: '16px' }}>
          <Row className="g-5">
            {/* Image Gallery */}
            <Col lg={6}>
              <div className="position-relative sticky-top" style={{ top: '100px' }}>
                <div className="d-flex align-items-center justify-content-center bg-brand-gray rounded mb-3 position-relative shadow-sm transition-color hover-shadow"
                  style={{ height: '500px', borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={IMAGES[selectedImage]} alt="Product view" className="w-100 h-100 object-fit-cover" />
                  <span className="position-absolute top-0 start-0 m-4 px-3 py-1 rounded-pill fs-11 fw-bold text-white bg-danger tracking-wide shadow-sm">
                    BEST SELLER
                  </span>
                  <button
                    onClick={() => setWishlist(w => !w)}
                    className="position-absolute top-0 end-0 m-4 border-0 bg-white rounded-circle shadow d-flex align-items-center justify-content-center transition-color hover-bg-gray"
                    style={{ width: '44px', height: '44px', fontSize: '20px' }}
                  >
                    {wishlist ? '❤️' : '🤍'}
                  </button>
                </div>
                <div className="d-flex gap-3 overflow-auto pb-2 custom-scrollbar">
                  {IMAGES.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className="rounded cursor-pointer flex-shrink-0 overflow-hidden shadow-sm transition-color"
                      style={{
                        width: '85px', height: '85px', borderRadius: '12px',
                        border: selectedImage === i ? '2px solid #0D9488' : '2px solid transparent',
                        opacity: selectedImage === i ? 1 : 0.7
                      }}
                    >
                      <img src={img} alt={`Thumbnail ${i+1}`} className="w-100 h-100 object-fit-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            {/* Product Info */}
            <Col lg={6}>
              <div className="ps-lg-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="fs-12 fw-bold px-3 py-1 rounded-pill" style={{ background: 'rgba(13,148,136,0.1)', color: '#0D9488' }}>Electronics</span>
                  <span className="fs-12 fw-medium text-brand-muted bg-brand-light px-3 py-1 rounded-pill">SKU: WH-1001-BLK</span>
                </div>

                <h1 className="fw-bold fs-36 text-brand-dark mb-3 lh-12">
                  Wireless Noise-Cancelling Headphones
                </h1>

                <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom border-brand-light">
                  <div className="d-flex align-items-center gap-2">
                    <StarRating rating={5} size={18} />
                    <span className="fw-bold fs-15 text-brand-dark">5.0</span>
                  </div>
                  <span className="text-brand-muted fs-14 fw-medium text-decoration-underline cursor-pointer">(128 verified reviews)</span>
                  <span className="text-brand-muted fs-14">|</span>
                  <span className="fs-14 fw-bold px-2 py-1 rounded" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}>✓ In Stock</span>
                </div>

                <div className="d-flex align-items-end gap-3 mb-4">
                  <span className="fw-bold text-brand-dark lh-1" style={{ fontSize: '48px' }}>$349</span>
                  <span className="fs-20 text-brand-muted text-decoration-line-through mb-1">$449</span>
                  <span className="px-2 py-1 rounded fs-13 fw-bold text-danger bg-danger bg-opacity-10 mb-2">Save $100</span>
                </div>

                <p className="fs-15 text-brand-muted lh-16 mb-5">
                  Experience studio-quality sound wherever you go. These over-ear headphones feature
                  industry-leading active noise cancellation, 30-hour battery life, and premium drivers
                  for crystal-clear highs and deep, rich bass.
                </p>

                {/* SKU: Color Selector */}
                <div className="mb-4 pb-2">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="fs-14 fw-bold text-brand-dark mb-0">
                      Color: <span className="fw-medium text-brand-muted ms-1">{selectedColor}</span>
                    </p>
                  </div>
                  <div className="d-flex gap-3">
                    {COLORS.map(color => (
                      <div
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className="rounded-circle cursor-pointer d-flex align-items-center justify-content-center transition-color"
                        style={{
                          width: '44px', height: '44px',
                          border: selectedColor === color.name ? `2px solid ${color.hex}` : '2px solid transparent',
                          padding: '3px'
                        }}
                      >
                        <div className="w-100 h-100 rounded-circle shadow-sm" style={{ backgroundColor: color.hex, border: '1px solid rgba(0,0,0,0.1)' }}></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SKU: Size Selector */}
                <div className="mb-5 pb-3 border-bottom border-brand-light">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="fs-14 fw-bold text-brand-dark mb-0">Size Variant</p>
                    <span className="fs-13 fw-medium text-brand-primary text-decoration-underline cursor-pointer">Size Guide</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border rounded px-4 fw-medium transition-color`}
                        style={{
                          height: '46px',
                          fontSize: '14px',
                          borderColor: selectedSize === size ? '#0D9488' : '#CBD5E1',
                          background: selectedSize === size ? 'rgba(13,148,136,0.05)' : 'white',
                          color: selectedSize === size ? '#0D9488' : '#475569'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity + CTA */}
                <div className="d-flex align-items-center gap-3 mb-5 flex-wrap">
                  <div className="d-flex align-items-center border rounded overflow-hidden shadow-sm" style={{ borderColor: '#E2E8F0', height: '54px', background: '#F8FAFC' }}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="border-0 bg-transparent text-brand-dark fw-bold px-4 fs-20 hover-bg-light transition-color"
                      style={{ height: '100%' }}
                    >−</button>
                    <span className="fw-bold fs-16 text-brand-dark px-2 bg-white d-flex align-items-center justify-content-center" style={{ minWidth: '48px', height: '100%' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="border-0 bg-transparent text-brand-dark fw-bold px-4 fs-20 hover-bg-light transition-color"
                      style={{ height: '100%' }}
                    >+</button>
                  </div>

                  <Button
                    className={`rounded border-0 px-5 fs-15 fw-bold flex-grow-1 flex-sm-grow-0 shadow-sm transition-color d-flex align-items-center justify-content-center gap-2`}
                    style={{ background: addedToCart ? '#10B981' : '#0D9488', color: 'white', height: '54px', minWidth: '200px' }}
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                  </Button>

                  <Button
                    className="rounded border-0 px-5 fs-15 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center"
                    style={{ background: '#1A2E4A', height: '54px', minWidth: '160px' }}
                    as={Link} to="/checkout"
                  >
                    Buy It Now
                  </Button>
                </div>

                {/* Trust Badges */}
                <Row className="g-3">
                  {[
                    { icon: '🚚', title: 'Free Delivery', text: 'On orders over $50' },
                    { icon: '↩', title: 'Free Returns', text: '30-day return policy' },
                    { icon: '🔒', title: 'Secure Payment', text: '100% secure checkout' },
                    { icon: '⭐', title: '2-Year Warranty', text: 'Guaranteed quality' },
                  ].map((badge, i) => (
                    <Col xs={6} key={i}>
                      <div className="d-flex align-items-start gap-3 p-3 rounded" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '24px', lineHeight: 1 }}>{badge.icon}</span>
                        <div>
                          <p className="fw-bold fs-13 text-brand-dark mb-1 lh-1">{badge.title}</p>
                          <p className="fs-12 text-brand-muted mb-0 lh-1">{badge.text}</p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="bg-white rounded p-4 p-md-5 shadow-sm mb-5" style={{ borderRadius: '16px' }}>
          <div className="d-flex gap-4 border-bottom border-brand-light mb-5 overflow-auto custom-scrollbar">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
              { key: 'reviews', label: `Customer Reviews (${REVIEWS.length})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className="border-0 bg-transparent px-2 pb-3 fw-bold fs-15 transition-color text-nowrap"
                style={{
                  color: selectedTab === tab.key ? '#0D9488' : '#64748B',
                  borderBottom: selectedTab === tab.key ? '3px solid #0D9488' : '3px solid transparent',
                  marginBottom: '-1px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {selectedTab === 'description' && (
            <div className="max-w-800">
              <h5 className="fw-bold fs-20 text-brand-dark mb-4">About This Product</h5>
              <p className="fs-15 text-brand-muted lh-16 mb-4">
                The NexMart Wireless Noise-Cancelling Headphones redefine what premium audio means for everyday listening.
                Engineered with advanced ANC technology that automatically adapts to your environment, blocking out up to 95%
                of ambient noise so you can focus on what matters — your music, podcasts, or calls.
              </p>
              <p className="fs-15 text-brand-muted lh-16 mb-4">
                Our 40mm custom drivers deliver an expansive soundstage with balanced, detailed audio across all frequencies.
                The cushioned memory-foam ear cups and adjustable headband ensure comfort during extended wear, while the
                foldable design makes them easy to take anywhere.
              </p>
              <ul className="ps-4">
                {['Industry-leading Active Noise Cancellation', 'Up to 30 hours playtime (ANC on)', 'Fast charge: 10 min = 3 hours play', 'Multipoint Bluetooth — connect 2 devices simultaneously', 'Built-in voice assistant support', 'Premium carrying case included'].map((f, i) => (
                  <li key={i} className="fs-15 text-brand-muted mb-2 lh-16 fw-medium">{f}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedTab === 'specs' && (
            <div className="max-w-800">
              <h5 className="fw-bold fs-20 text-brand-dark mb-4">Technical Specifications</h5>
              <div className="d-flex flex-column gap-0">
                {specs.map((spec, i) => (
                  <div key={i} className="d-flex py-3 align-items-center" style={{ borderBottom: i < specs.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <span className="fw-bold fs-14 text-brand-dark" style={{ width: '250px', flexShrink: 0 }}>{spec.label}</span>
                    <span className="fs-14 text-brand-muted fw-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div>
              {/* Rating Summary */}
              <div className="bg-brand-light border border-brand-gray rounded p-4 p-md-5 mb-5 d-flex gap-5 align-items-center flex-wrap" style={{ borderRadius: '16px' }}>
                <div className="text-center">
                  <div className="fw-bold text-brand-dark mb-2" style={{ fontSize: '64px', lineHeight: 1 }}>5.0</div>
                  <StarRating rating={5} size={20} />
                  <p className="fs-14 text-brand-muted mt-2 fw-medium">Based on 128 reviews</p>
                </div>
                <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
                  {[5, 4, 3, 2, 1].map(r => (
                    <div key={r} className="d-flex align-items-center gap-3 mb-2">
                      <div className="d-flex align-items-center gap-1" style={{ width: '40px' }}>
                        <span className="fs-13 fw-bold text-brand-dark">{r}</span>
                        <span className="fs-13 text-brand-muted">★</span>
                      </div>
                      <div className="flex-grow-1 rounded-pill" style={{ height: '8px', background: '#E2E8F0', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: r === 5 ? '78%' : r === 4 ? '16%' : r === 3 ? '4%' : '1%', background: '#F59E0B', borderRadius: '4px' }}></div>
                      </div>
                      <span className="fs-12 text-brand-muted fw-medium text-end" style={{ width: '30px' }}>{r === 5 ? '78%' : r === 4 ? '16%' : r === 3 ? '4%' : '1%'}</span>
                    </div>
                  ))}
                </div>
                <div className="text-md-end ms-auto">
                  <Button className="btn-brand rounded-pill px-4 py-2 fs-14 fw-bold">Write a Review</Button>
                </div>
              </div>
              
              <div className="d-flex flex-column gap-4">
                {REVIEWS.map(review => (
                  <div key={review.id} className="border-bottom border-brand-light pb-4">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold fs-16 text-white shadow-sm"
                          style={{ width: '48px', height: '48px', background: '#0D9488', flexShrink: 0 }}>
                          {review.user[0]}
                        </div>
                        <div>
                          <p className="fw-bold fs-15 text-brand-dark mb-1 d-flex align-items-center gap-2">
                            {review.user}
                            <span className="fs-11 fw-bold text-white px-2 py-0 rounded-pill" style={{ background: '#10B981', paddingTop: '2px', paddingBottom: '2px' }}>Verified</span>
                          </p>
                          <StarRating rating={review.rating} size={14} />
                        </div>
                      </div>
                      <span className="fs-13 fw-medium text-brand-muted">{review.date}</span>
                    </div>
                    <p className="fs-15 text-brand-dark lh-16 mb-0 ps-md-5 ms-md-3">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-5 pt-3">
          <div className="d-flex justify-content-between align-items-end mb-4 pb-2 border-bottom border-brand-gray">
            <h2 className="fw-bold fs-24 text-brand-dark mb-2">You Might Also Like</h2>
            <Link to="/products" className="fs-14 fw-bold text-brand-primary text-decoration-none mb-2">View all products →</Link>
          </div>
          <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-xl-4">
            {RELATED.map(p => (
              <Col key={p.id}>
                <Card as={Link} to={`/products/${p.id}`} className="h-100 border-0 shadow-sm text-decoration-none transition-color hover-shadow"
                  style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  <div className="position-relative bg-brand-gray" style={{ height: '200px' }}>
                    <img src={p.image} alt={p.name} className="w-100 h-100 object-fit-cover" />
                  </div>
                  <Card.Body className="p-4">
                    <p className="fw-bold fs-15 text-brand-dark mb-2 lh-16">{p.name}</p>
                    <StarRating rating={p.rating} size={14} />
                    <p className="fw-bold fs-18 text-brand-primary mt-3 mb-0">${p.price}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetails;
