import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import CategoryCard from '../components/category/CategoryCard';
import ProductCard from '../components/product/ProductCard';
import Rating from '../components/ui/Rating';
import ThreeHero from '../components/ui/ThreeHero';

const Home = () => {
  // Mock data — unchanged
  const categories = [
    { id: 'electronics', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', count: '1.2k+ Products' },
    { id: 'fashion', name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', count: '850+ Products' },
    { id: 'home', name: 'Home & Living', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80', count: '430+ Products' },
    { id: 'beauty', name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=400&q=80', count: '620+ Products' },
    { id: 'sports', name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', count: '290+ Products' },
    { id: 'toys', name: 'Toys', image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&q=80', count: '150+ Products' },
    { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', count: '310+ Products' },
    { id: 'gadgets', name: 'Gadgets', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80', count: '540+ Products' },
  ];

  const trending = [
    { id: 1, name: 'Premium Wireless Headphones', price: 249.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', rating: 5, badge: 'Hot' },
    { id: 2, name: 'Smart Watch Series 7', price: 399.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', rating: 4, badge: 'Trending' },
    { id: 3, name: 'Minimalist Leather Wallet', price: 45.00, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80', rating: 5 },
    { id: 4, name: 'Ergonomic Office Chair', price: 189.50, image: 'https://images.unsplash.com/photo-1505797149-43b0ad7664a3?w=600&q=80', rating: 4 },
    { id: 5, name: 'Mechanical Keyboard RGB', price: 120.00, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&q=80', rating: 5, badge: 'New' },
    { id: 6, name: 'Portable Bluetooth Speaker', price: 79.99, image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&q=80', rating: 4 },
    { id: 7, name: 'Instant Film Camera', price: 69.00, image: 'https://images.unsplash.com/photo-1526170315873-3a561629923d?w=600&q=80', rating: 5 },
    { id: 8, name: 'Yoga Mat Premium', price: 35.00, image: 'https://images.unsplash.com/photo-1592432678899-9a25df5d1228?w=600&q=80', rating: 4 },
  ];

  const featuredProducts = trending.slice(0, 4);

  const testimonials = [
    { id: 1, name: 'Sarah Johnson', role: 'Fashion Blogger', quote: 'The collection is absolutely stunning. I found pieces I couldn\'t find anywhere else!', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 5 },
    { id: 2, name: 'Michael Chen', role: 'Tech Enthusiast', quote: 'Fast shipping and great customer service. My gadgets arrived in perfect condition.', avatar: 'https://i.pravatar.cc/150?u=michael', rating: 5 },
    { id: 3, name: 'Emma Davis', role: 'Interior Designer', quote: 'Love the home decor section. It adds such a unique touch to my projects.', avatar: 'https://i.pravatar.cc/150?u=emma', rating: 4 },
    { id: 4, name: 'James Wilson', role: 'Verified Buyer', quote: 'Unbeatable prices and high-quality products. NexMart is my new favorite shop!', avatar: 'https://i.pravatar.cc/150?u=james', rating: 5 },
  ];

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="nex-hero">
        <ThreeHero />
        <div className="nex-hero-grid" />
        <div className="nex-orb" style={{ width: '600px', height: '600px', background: '#8B5CF6', top: '-15%', left: '-8%' }} />
        <div className="nex-orb" style={{ width: '500px', height: '500px', background: '#06B6D4', bottom: '-15%', right: '-8%' }} />
        <div className="nex-orb" style={{ width: '300px', height: '300px', background: '#F472B6', top: '20%', right: '15%' }} />

        <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <Reveal>
                <span className="nex-pill mb-4 d-inline-flex">
                  <i className="bi bi-stars me-1" />New Collection 2026
                </span>
                <h1 className="display-3 fw-bold mb-3 lh-1 nex-hero-title">
                  Discover, Shop &<br />
                  <span className="nex-gradient-text">Live Beautifully</span>
                </h1>
                <p className="lead mb-4 nex-hero-sub" style={{ maxWidth: '520px' }}>
                  Curated collections of premium products at unbeatable prices.
                  Free shipping over $50, easy returns, always.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/products" className="nex-btn-primary">
                    Shop now <i className="bi bi-arrow-right" />
                  </Link>
                  <Link to="/deals" className="nex-btn-outline">
                    <i className="bi bi-fire nex-pink" /> Today's deals
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="row g-3 mt-4">
                  {[
                    { value: '50K+', label: 'Happy customers', icon: 'bi-people' },
                    { value: '10K+', label: 'Products', icon: 'bi-box-seam' },
                    { value: '4.9★', label: 'Avg. rating', icon: 'bi-star-fill' },
                  ].map((s) => (
                    <div className="col-4" key={s.label}>
                      <div className="nex-stat-item">
                        <i className={`bi ${s.icon} nex-text-purple`} style={{ fontSize: '1.4rem' }} />
                        <div>
                          <div className="fw-bold lh-1 nex-gradient-text" style={{ fontSize: '1.3rem' }}>{s.value}</div>
                          <small className="nex-text-muted" style={{ fontSize: '0.72rem' }}>{s.label}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Hero floating cards */}
            <div className="col-lg-6 d-none d-lg-block">
              <Reveal delay={150} x={20} y={0}>
                <div className="position-relative" style={{ height: '500px' }}>
                  <div className="nex-float-card position-absolute" style={{ top: 0, right: 0, width: '290px', zIndex: 3 }}>
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" alt="Headphones"
                      style={{ width: '100%', height: '270px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
                    <div style={{ padding: '14px 16px' }}>
                      <span className="nex-badge-inline" style={{ background: 'rgba(244,114,182,0.2)', color: '#F472B6', border: '1px solid rgba(244,114,182,0.3)' }}>FEATURED</span>
                      <h6 className="mt-2 mb-1 nex-text-light fw-semibold">Premium Headphones</h6>
                      <span className="nex-gradient-text fw-bold">$249.99</span>
                    </div>
                  </div>

                  <div className="nex-float-card position-absolute" style={{ bottom: 0, left: 0, width: '255px', zIndex: 2 }}>
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" alt="Watch"
                      style={{ width: '100%', height: '230px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
                    <div style={{ padding: '14px 16px' }}>
                      <span className="nex-badge-inline" style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>TRENDING</span>
                      <h6 className="mt-2 mb-1 nex-text-light fw-semibold">Smart Watch Pro</h6>
                      <span className="nex-gradient-text fw-bold">$199.00</span>
                    </div>
                  </div>

                  <div className="nex-float-badge position-absolute" style={{ top: '44%', left: '-6%', zIndex: 4 }}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                      <i className="bi bi-truck text-white" />
                    </div>
                    <div>
                      <div className="fw-bold small nex-text-light">Free shipping</div>
                      <small className="nex-text-muted">On orders over $50</small>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Benefits bar ===== */}
      <section className="nex-benefits-bar">
        <div className="container">
          <div className="row g-3 text-center text-md-start">
            {[
              { icon: 'bi-truck', title: 'Free shipping', text: 'On orders over $50' },
              { icon: 'bi-arrow-counterclockwise', title: '30-day returns', text: 'Hassle-free' },
              { icon: 'bi-shield-check', title: 'Secure payment', text: '256-bit SSL' },
              { icon: 'bi-headset', title: '24/7 support', text: 'Anytime help' },
            ].map((f) => (
              <div className="col-6 col-md-3" key={f.title}>
                <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
                  <i className={`bi ${f.icon} nex-text-purple`} style={{ fontSize: '1.6rem' }} />
                  <div>
                    <div className="fw-semibold small nex-text-light">{f.title}</div>
                    <small className="nex-text-muted">{f.text}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="nex-section">
        <div className="container">
          <Reveal>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold nex-text-light">
                Shop by <span className="nex-gradient-text">category</span>
              </h2>
              <p className="lead nex-text-muted">Find exactly what you're looking for, faster.</p>
            </div>
          </Reveal>
          <div className="row g-3 g-md-4">
            {categories.slice(0, 8).map((c, i) => (
              <div className="col-6 col-md-4 col-lg-3" key={c.id}>
                <Reveal delay={i * 80}>
                  <CategoryCard category={c} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Mega banner ===== */}
      <section className="my-5">
        <div className="container">
          <Reveal>
            <div className="nex-banner position-relative rounded-4 overflow-hidden text-white text-center"
              style={{ minHeight: '420px', backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.35) 0%, transparent 65%)', zIndex: 1, pointerEvents: 'none' }} />
              <div className="position-relative d-flex flex-column justify-content-center align-items-center p-5" style={{ minHeight: '420px', zIndex: 2 }}>
                <span className="nex-pill mb-3">MEGA SALE</span>
                <h2 className="display-3 fw-bold mb-3 text-white">
                  Up to <span className="display-2 nex-gradient-text">50% OFF</span> Sitewide
                </h2>
                <p className="lead mb-4 mx-auto" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px' }}>
                  Limited-time offer ends soon. Don't miss out on our biggest sale of the year.
                </p>
                <Link to="/deals" className="nex-btn-primary">
                  Shop the sale <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Trending ===== */}
      <section className="nex-section-alt">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-5">
            <div>
              <Reveal>
                <h2 className="display-5 fw-bold mb-1 nex-text-light">
                  Trending <span className="nex-gradient-text">now</span>
                </h2>
                <p className="nex-text-muted mb-0">What everyone's loving this week</p>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <Link to="/products" className="nex-btn-outline">
                View all <i className="bi bi-arrow-right" />
              </Link>
            </Reveal>
          </div>
          <div className="row g-3 g-md-4">
            {trending.slice(0, 8).map((p, i) => (
              <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                <Reveal delay={i * 50}>
                  <ProductCard product={p} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured picks ===== */}
      <section className="nex-section">
        <div className="container">
          <Reveal>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold nex-text-light">
                Featured <span className="nex-gradient-text">picks</span>
              </h2>
              <p className="lead nex-text-muted">Hand-picked by our team for you.</p>
            </div>
          </Reveal>
          <div className="row g-3 g-md-4">
            {featuredProducts.slice(0, 4).map((p, i) => (
              <div className="col-6 col-md-3" key={p.id}>
                <Reveal delay={i * 150} duration={0.8}>
                  <ProductCard product={p} />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="nex-section-alt">
        <div className="container">
          <Reveal>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold nex-text-light">
                Loved by <span className="nex-gradient-text">thousands</span>
              </h2>
              <p className="lead nex-text-muted">Don't take our word for it — hear from our customers.</p>
            </div>
          </Reveal>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div className="col-md-6 col-lg-3" key={t.id}>
                <Reveal delay={i * 100}>
                  <div className="nex-testimonial-card">
                    <Rating value={t.rating} />
                    <p className="my-4 fst-italic nex-text-muted" style={{ lineHeight: 1.75 }}>"{t.quote}"</p>
                    <div className="d-flex align-items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="rounded-circle" width="44" height="44"
                        style={{ border: '2px solid rgba(139,92,246,0.35)' }} />
                      <div>
                        <div className="fw-bold small nex-text-light">{t.name}</div>
                        <small className="nex-text-muted">{t.role}</small>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section className="nex-section pb-5">
        <div className="container">
          <Reveal>
            <div className="nex-newsletter">
              <i className="bi bi-envelope-paper-fill nex-gradient-text d-block mb-3" style={{ fontSize: '3.2rem' }} />
              <h2 className="display-5 fw-bold nex-text-light mb-3">
                Get <span className="nex-gradient-text">10% off</span> your first order
              </h2>
              <p className="lead nex-text-muted mx-auto mb-4" style={{ maxWidth: '520px' }}>
                Join the NexMart newsletter for exclusive deals, early access, and a welcome discount.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="mx-auto" style={{ maxWidth: '500px' }}>
                <div className="nex-email-group">
                  <span className="nex-email-icon">
                    <i className="bi bi-envelope" />
                  </span>
                  <input type="email" className="nex-email-input" placeholder="you@email.com" required />
                  <button type="submit" className="nex-email-btn">Subscribe</button>
                </div>
              </form>
              <p className="small mt-3" style={{ color: 'rgba(240,244,255,0.3)' }}>We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Home;
