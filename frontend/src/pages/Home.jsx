import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="bg-brand-dark text-white position-relative overflow-hidden" style={{ padding: '80px 0' }}>
        {/* Abstract Background Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.15) 0%, transparent 100%)' }}></div>
        <div className="position-absolute" style={{ top: '-150px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        
        <Container fluid className="px-container position-relative z-1">
          <Row className="align-items-center justify-content-between gy-5">
            <Col lg={6} xl={5} className="pe-xl-5">
              <span className="d-inline-block px-3 py-1 mb-4 rounded-pill fs-12 fw-bold tracking-widest" style={{ background: 'rgba(13,148,136,0.2)', color: '#2DD4BF' }}>
                ✨ NEW COLLECTION 2025
              </span>
              <h1 className="fw-bold mb-4 tracking-tight" style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: '1.1' }}>
                Shop Smarter.<br/><span style={{ color: '#2DD4BF' }}>Live Better.</span>
              </h1>
              <p className="fs-18 text-brand-white-70 mb-5 lh-16 fw-medium" style={{ maxWidth: '480px' }}>
                Discover our curated selection of premium products. Free shipping on orders over $50 • Fast delivery across Australia.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/products" className="rounded-pill border-0 d-inline-flex align-items-center justify-content-center px-5 h-56 fs-16 fw-bold btn-brand shadow-lg transition-transform hover-scale">
                  Shop Now →
                </Button>
                <Button as={Link} to="/deals" variant="light" className="rounded-pill border-0 d-inline-flex align-items-center justify-content-center px-5 h-56 fs-16 fw-bold text-brand-dark bg-white shadow-lg transition-transform hover-scale hover-bg-light">
                  View Deals
                </Button>
              </div>
            </Col>
            <Col lg={6} xl={6} className="position-relative">
              <div className="position-relative mx-auto" style={{ maxWidth: '600px' }}>
                <div className="position-absolute w-100 h-100 rounded-circle" style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)', transform: 'scale(1.2)', zIndex: 0 }}></div>
                <img 
                  src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80" 
                  alt="Premium Sneakers" 
                  className="w-100 position-relative z-1 drop-shadow-2xl" 
                  style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.3))', transform: 'rotate(-5deg) scale(1.05)' }} 
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Shop by Category */}
      <Container fluid className="mt-5 pt-5 px-container">
        <div className="d-flex justify-content-between align-items-end mb-4 pb-2">
          <div>
            <h2 className="fw-bold fs-32 text-brand-dark mb-2 tracking-tight">Shop by Category</h2>
            <p className="mb-0 fs-16 text-brand-muted">Browse our curated collections</p>
          </div>
        </div>
        <Row className="g-4 row-cols-2 row-cols-md-3 row-cols-lg-5">
          {[
            { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', items: '240+ items' },
            { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', items: '342+ items' },
            { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80', items: '89+ items' },
            { name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', items: '156+ items' },
            { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=400&q=80', items: '210+ items' }
          ].map((cat, idx) => (
            <Col key={idx}>
              <Card as={Link} to={`/category/${cat.name.toLowerCase()}`} className="h-100 text-center text-decoration-none border-0 shadow-sm transition-all hover-shadow" style={{ borderRadius: '20px', padding: '24px 16px' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <Card.Body className="d-flex flex-column align-items-center p-0">
                  <div className="rounded-circle mb-4 overflow-hidden shadow-sm" style={{ width: '100px', height: '100px', border: '4px solid white' }}>
                    <img src={cat.image} alt={cat.name} className="w-100 h-100 object-fit-cover transition-transform hover-scale" />
                  </div>
                  <Card.Title className="fw-bold mb-1 fs-16 text-brand-dark">{cat.name}</Card.Title>
                  <Card.Text className="mb-0 fs-13 fw-medium text-brand-primary">{cat.items}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Featured Products */}
      <Container fluid className="mt-5 pt-5 px-container">
        <div className="d-flex justify-content-between align-items-end mb-4 pb-2 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold fs-32 text-brand-dark mb-2 tracking-tight">Featured Products</h2>
            <p className="mb-0 fs-16 text-brand-muted">Handpicked premium items just for you</p>
          </div>
          <Link to="/products" className="text-decoration-none fw-bold fs-15 text-brand-primary d-flex align-items-center gap-2 hover-opacity transition-color">
            View all products <span className="fs-18">→</span>
          </Link>
        </div>
        <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4">
          {[
            { name: 'Sony WH-1000XM5', price: 349.00, originalPrice: 399.00, rating: 5, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', badge: 'Best Seller' },
            { name: 'Nike Air Max Pro', price: 129.00, originalPrice: null, rating: 4, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', badge: 'New' },
            { name: 'Modern Desk Lamp', price: 49.00, originalPrice: 65.00, rating: 4, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80', badge: 'Sale' },
            { name: 'Ergonomic Laptop Stand', price: 89.00, originalPrice: null, rating: 5, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80', badge: null }
          ].map((prod, idx) => (
            <Col key={idx}>
              <Card className="h-100 border-0 shadow-sm transition-all hover-shadow" style={{ borderRadius: '16px', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div className="position-relative bg-white" style={{ height: '260px', padding: '20px' }}>
                  <img src={prod.image} alt={prod.name} className="w-100 h-100 object-fit-contain mix-blend-multiply transition-transform hover-scale" style={{ transitionDuration: '0.5s' }} />
                  {prod.badge && (
                    <span className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill fs-11 fw-bold text-white shadow-sm tracking-wide" 
                          style={{ background: prod.badge === 'Sale' ? '#EF4444' : prod.badge === 'New' ? '#3B82F6' : '#0D9488' }}>
                      {prod.badge.toUpperCase()}
                    </span>
                  )}
                </div>
                <Card.Body className="d-flex flex-column p-4 border-top border-brand-light bg-white">
                  <div className="d-flex gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className="fs-14" style={{ color: star <= prod.rating ? '#F59E0B' : '#E2E8F0' }}>★</span>
                    ))}
                  </div>
                  <Card.Title className="fw-bold mb-3 fs-16 text-brand-dark lh-16" style={{ minHeight: '40px' }}>{prod.name}</Card.Title>
                  <div className="mt-auto d-flex justify-content-between align-items-end">
                    <div>
                      {prod.originalPrice && <span className="fs-13 text-brand-muted text-decoration-line-through d-block mb-1">${prod.originalPrice.toFixed(2)}</span>}
                      <span className="fw-bold fs-20 text-brand-dark">${prod.price.toFixed(2)}</span>
                    </div>
                    <Button className="rounded border-0 px-3 fs-13 fw-bold btn-brand shadow-sm d-flex align-items-center justify-content-center" style={{ height: '38px' }}>
                      + Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Newsletter */}
      <Container fluid className="mt-5 pt-5 pb-5 px-container">
        <div className="position-relative overflow-hidden text-center text-white bg-brand-dark shadow-lg" style={{ borderRadius: '24px', padding: '80px 20px' }}>
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(45deg, rgba(13,148,136,0.2) 0%, transparent 100%)' }}></div>
          <div className="position-relative z-1 max-w-600 mx-auto">
            <span className="d-inline-block px-3 py-1 mb-3 rounded-pill fs-12 fw-bold text-brand-dark bg-white shadow-sm tracking-widest">
              STAY CONNECTED
            </span>
            <h2 className="fw-bold mb-3 fs-36 tracking-tight">Join our newsletter</h2>
            <p className="mb-5 text-brand-white-70 fs-16 lh-16">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered straight to your inbox.
            </p>
            <Form className="d-flex flex-column flex-sm-row mx-auto gap-3">
              <Form.Control 
                type="email" 
                placeholder="Enter your email address" 
                className="rounded-pill border-0 text-white bg-white bg-opacity-10 px-4 h-56 fs-15 shadow-none focus-ring-brand" 
                style={{ backdropFilter: 'blur(10px)' }}
              />
              <Button className="rounded-pill border-0 text-nowrap fw-bold px-5 h-56 fs-15 btn-brand shadow-lg transition-transform hover-scale">
                Subscribe
              </Button>
            </Form>
            <p className="mt-3 mb-0 fs-12 text-brand-white-50">By subscribing you agree to our Terms & Conditions and Privacy Policy.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Home;