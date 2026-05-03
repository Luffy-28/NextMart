import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Collapse } from 'react-bootstrap';

const PRODUCTS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', price: 349, originalPrice: 449, rating: 5, reviews: 128, category: 'Electronics', subcategory: 'Audio', badge: 'Best Seller', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: 2, name: 'Running Shoes Pro X', price: 129, originalPrice: 159, rating: 4, reviews: 84, category: 'Sports', subcategory: 'Footwear', badge: 'Sale', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 3, name: 'Smart Desk Lamp', price: 49, originalPrice: null, rating: 4, reviews: 47, category: 'Home & Living', subcategory: 'Lighting', badge: null, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: 4, name: 'Ergonomic Laptop Stand', price: 89, originalPrice: null, rating: 5, reviews: 203, category: 'Electronics', subcategory: 'Accessories', badge: 'New', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
  { id: 5, name: 'Yoga Mat Premium', price: 39, originalPrice: 55, rating: 4, reviews: 65, category: 'Sports', subcategory: 'Fitness', badge: 'Sale', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&q=80' },
  { id: 6, name: 'Ceramic Coffee Mug Set', price: 28, originalPrice: null, rating: 4, reviews: 34, category: 'Home & Living', subcategory: 'Kitchen', badge: null, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
  { id: 7, name: 'Vitamin C Serum 30ml', price: 32, originalPrice: 40, rating: 5, reviews: 112, category: 'Beauty', subcategory: 'Skincare', badge: 'Sale', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80' },
  { id: 8, name: 'Linen Throw Blanket', price: 64, originalPrice: null, rating: 4, reviews: 28, category: 'Home & Living', subcategory: 'Decor', badge: 'New', image: 'https://images.unsplash.com/photo-1580870058882-72c67b2e3e58?w=500&q=80' },
];

const CATEGORIES = [
  { name: 'All', subcategories: [] },
  { name: 'Electronics', subcategories: ['Audio', 'Computers', 'Accessories'] },
  { name: 'Sports', subcategories: ['Footwear', 'Fitness', 'Equipment'] },
  { name: 'Home & Living', subcategories: ['Lighting', 'Kitchen', 'Decor'] },
  { name: 'Beauty', subcategories: ['Skincare', 'Makeup', 'Haircare'] },
];

const StarRating = ({ rating, size = 12 }) => (
  <div className="d-flex gap-1 align-items-center">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ fontSize: size, color: s <= rating ? '#F59E0B' : '#E2E8F0', lineHeight: 1 }}>★</span>
    ))}
  </div>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const initCategory = searchParams.get('category') || 'All';
  const initSubcategory = searchParams.get('subcategory') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initSubcategory);
  const [openCategories, setOpenCategories] = useState({ 'All': true, [initCategory]: true });
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [minRating, setMinRating] = useState(0);
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    const cat = searchParams.get('category');
    const subcat = searchParams.get('subcategory');
    if (cat) {
      setSelectedCategory(cat);
      setOpenCategories(prev => ({ ...prev, [cat]: true }));
    }
    if (subcat) setSelectedSubcategory(subcat);
  }, [searchParams]);

  const handleCategoryToggle = (catName) => {
    if (catName === 'All') {
      setSelectedCategory('All');
      setSelectedSubcategory('All');
      return;
    }
    setOpenCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
    setSelectedCategory(catName);
    setSelectedSubcategory('All');
  };

  const handleAddToCart = (id) => {
    setAddedToCart(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedToCart(prev => ({ ...prev, [id]: false })), 1500);
  };

  const filtered = PRODUCTS
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => selectedSubcategory === 'All' || p.subcategory === selectedSubcategory)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => p.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const activeBadgeColor = { 'Best Seller': '#0D9488', 'Sale': '#EF4444', 'New': '#3B82F6' };

  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="bg-brand-dark text-white py-5">
        <Container fluid className="px-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-2 fs-36">Shop All Products</h1>
              <p className="mb-0 fs-15 text-brand-white-70">
                <Link to="/" className="text-brand-white-50 text-decoration-none hover-text-dark transition-color">Home</Link>
                <span className="mx-2 opacity-50">/</span>
                <span>Shop</span>
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="fs-14 fw-medium text-brand-white-70 px-3 py-2 rounded-pill bg-white bg-opacity-10">
                {filtered.length} products found
              </span>
            </div>
          </div>
        </Container>
      </div>

      <Container fluid className="px-container mt-5">
        <Row className="g-5">
          {/* Sidebar Filters */}
          <Col lg={3} xl={2}>
            <div className="bg-white rounded shadow-sm p-4" style={{ borderRadius: '16px', position: 'sticky', top: '90px' }}>
              <h6 className="fw-bold fs-15 text-brand-dark mb-4">Filters</h6>

              {/* Two-Level Category */}
              <div className="mb-5">
                <p className="fw-bold fs-12 text-brand-muted text-uppercase mb-3 tracking-widest">Category</p>
                {CATEGORIES.map(cat => (
                  <div key={cat.name} className="mb-2">
                    <div
                      className={`d-flex align-items-center justify-content-between py-2 px-3 rounded cursor-pointer transition-color ${selectedCategory === cat.name ? 'bg-brand-pale text-brand-primary fw-bold' : 'text-brand-dark hover-bg-gray'}`}
                      onClick={() => handleCategoryToggle(cat.name)}
                    >
                      <span className="fs-14">{cat.name}</span>
                      {cat.subcategories.length > 0 && (
                        <span className="fs-12 opacity-50">{openCategories[cat.name] ? '▼' : '▶'}</span>
                      )}
                    </div>
                    
                    {/* Subcategories Collapse */}
                    <Collapse in={openCategories[cat.name] && cat.subcategories.length > 0}>
                      <div className="ps-4 pe-2 pt-1 pb-2">
                        {cat.subcategories.map(sub => (
                          <div
                            key={sub}
                            className={`py-2 px-3 rounded cursor-pointer transition-color fs-13 ${selectedSubcategory === sub ? 'text-brand-primary fw-semibold bg-brand-light' : 'text-brand-muted hover-text-dark'}`}
                            onClick={() => setSelectedSubcategory(sub)}
                          >
                            {sub}
                          </div>
                        ))}
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <p className="fw-bold fs-12 text-brand-muted text-uppercase mb-3 tracking-widest">Max Price</p>
                <Form.Range
                  min={0} max={500} step={10}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, +e.target.value])}
                  style={{ accentColor: '#0D9488' }}
                />
                <div className="d-flex justify-content-between mt-2">
                  <span className="fs-12 text-brand-muted">$0</span>
                  <span className="fs-14 fw-bold text-brand-primary">${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <p className="fw-bold fs-12 text-brand-muted text-uppercase mb-3 tracking-widest">Min Rating</p>
                {[4, 3, 2, 0].map(r => (
                  <div
                    key={r}
                    className="d-flex align-items-center gap-3 py-2 px-2 rounded cursor-pointer hover-bg-gray transition-color"
                    onClick={() => setMinRating(r)}
                  >
                    <input type="radio" readOnly checked={minRating === r} style={{ accentColor: '#0D9488', width: '16px', height: '16px' }} />
                    <StarRating rating={r} size={14} />
                    <span className="fs-13 text-brand-dark fw-medium">{r > 0 ? `${r}+ stars` : 'All'}</span>
                  </div>
                ))}
              </div>

              <hr className="border-brand-gray my-4" />
              
              <Button
                className="w-100 rounded-pill btn-brand h-44 fs-14 fw-semibold border-0"
                onClick={() => { setSelectedCategory('All'); setSelectedSubcategory('All'); setPriceRange([0, 500]); setMinRating(0); }}
                variant="outline-secondary"
                style={{ background: '#F1F5F9', color: '#475569' }}
              >
                Clear All Filters
              </Button>
            </div>
          </Col>

          {/* Products Area */}
          <Col lg={9} xl={10}>
            {/* Sort + View Controls */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-brand-gray flex-wrap gap-3">
              <div className="d-flex flex-wrap gap-2">
                {selectedCategory !== 'All' && (
                  <span className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill fs-12 fw-bold"
                    style={{ background: 'rgba(13,148,136,0.1)', color: '#0D9488' }}>
                    {selectedCategory} {selectedSubcategory !== 'All' && ` › ${selectedSubcategory}`}
                    <span className="cursor-pointer ms-2 fs-14" onClick={() => setSelectedCategory('All')}>×</span>
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex gap-1 bg-white p-1 rounded shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`border-0 rounded p-2 fs-14 transition-color ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'bg-transparent text-brand-muted hover-text-dark'}`}
                    style={{ width: '36px', height: '36px' }}
                    title="Grid view"
                  >⊞</button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`border-0 rounded p-2 fs-14 transition-color ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'bg-transparent text-brand-muted hover-text-dark'}`}
                    style={{ width: '36px', height: '36px' }}
                    title="List view"
                  >☰</button>
                </div>
                <Form.Select
                  className="border-0 shadow-sm fs-13 h-44 text-brand-dark fw-medium px-4"
                  style={{ width: '200px', borderRadius: '12px', cursor: 'pointer' }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </Form.Select>
              </div>
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-5 my-5">
                <p className="fs-64 mb-3 opacity-50">🔍</p>
                <h4 className="fw-bold text-brand-dark mb-2">No products found</h4>
                <p className="text-brand-muted fs-15 mb-4">Try adjusting your filters to find what you're looking for.</p>
                <Button className="btn-brand rounded-pill border-0 px-5 h-48 fs-15 fw-medium"
                  onClick={() => { setSelectedCategory('All'); setPriceRange([0, 500]); setMinRating(0); }}>
                  Clear All Filters
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4">
                {filtered.map(product => (
                  <Col key={product.id}>
                    <Card className="h-100 border-0 shadow-sm product-card" style={{ borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)'; }}>
                      <div className="position-relative overflow-hidden bg-brand-gray" style={{ height: '240px' }}>
                        <img src={product.image} alt={product.name} className="w-100 h-100 object-fit-cover" />
                        {product.badge && (
                          <span className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill fs-11 fw-bold text-white shadow-sm tracking-wide"
                            style={{ background: activeBadgeColor[product.badge] }}>
                            {product.badge.toUpperCase()}
                          </span>
                        )}
                        <Link to={`/products/${product.id}`}
                          className="position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center bg-white rounded-circle shadow text-brand-dark text-decoration-none hover-bg-gray transition-color"
                          style={{ width: '36px', height: '36px', fontSize: '14px' }}
                          title="View details">👁</Link>
                      </div>
                      <Card.Body className="p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <p className="fs-12 text-brand-primary fw-medium mb-0">{product.subcategory}</p>
                          <div className="d-flex align-items-center gap-1">
                            <StarRating rating={product.rating} />
                            <span className="fs-11 text-brand-muted ms-1">({product.reviews})</span>
                          </div>
                        </div>
                        <Link to={`/products/${product.id}`} className="text-decoration-none">
                          <Card.Title className="fw-bold fs-15 text-brand-dark mb-3 lh-16" style={{ minHeight: '44px' }}>
                            {product.name}
                          </Card.Title>
                        </Link>
                        <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top border-brand-gray">
                          <div>
                            <span className="fw-bold fs-20 text-brand-dark">${product.price}</span>
                            {product.originalPrice && (
                              <span className="fs-13 text-brand-muted text-decoration-line-through ms-2">${product.originalPrice}</span>
                            )}
                          </div>
                          <Button
                            className={`rounded-pill border-0 px-3 fs-13 fw-bold transition-color ${addedToCart[product.id] ? '' : 'btn-brand shadow-sm'}`}
                            style={{ height: '38px', background: addedToCart[product.id] ? '#10B981' : '', color: 'white', minWidth: '90px' }}
                            onClick={() => handleAddToCart(product.id)}
                          >
                            {addedToCart[product.id] ? '✓ Added' : '+ Cart'}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="d-flex flex-column gap-4">
                {filtered.map(product => (
                  <div key={product.id} className="bg-white rounded shadow-sm p-3 p-md-4 d-flex flex-column flex-md-row align-items-md-center gap-4 transition-color hover-bg-light" style={{ borderRadius: '16px' }}>
                    <div className="position-relative bg-brand-gray flex-shrink-0 rounded overflow-hidden shadow-sm" style={{ width: '100%', maxWidth: '200px', height: '160px' }}>
                      <img src={product.image} alt={product.name} className="w-100 h-100 object-fit-cover" />
                      {product.badge && (
                        <span className="position-absolute top-0 start-0 m-2 px-2 py-1 rounded fs-10 fw-bold text-white shadow-sm tracking-wide"
                          style={{ background: activeBadgeColor[product.badge] }}>
                          {product.badge.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fs-12 text-brand-primary fw-medium px-2 py-1 rounded bg-brand-pale">{product.category}</span>
                        <span className="fs-12 text-brand-muted fw-medium">{product.subcategory}</span>
                      </div>
                      <Link to={`/products/${product.id}`} className="text-decoration-none">
                        <h4 className="fw-bold fs-20 text-brand-dark mb-2">{product.name}</h4>
                      </Link>
                      <p className="text-brand-muted fs-14 mb-3 lh-16 max-w-600">Experience premium quality and exceptional design with this top-rated product, perfect for your everyday needs.</p>
                      <div className="d-flex align-items-center gap-2 mb-0">
                        <StarRating rating={product.rating} size={14} />
                        <span className="fs-13 text-brand-dark fw-medium ms-1">({product.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-md-end flex-shrink-0 d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end border-top border-md-0 border-brand-gray pt-3 pt-md-0 mt-3 mt-md-0">
                      <div className="mb-md-3">
                        {product.originalPrice && (
                          <div className="fs-14 text-brand-muted text-decoration-line-through mb-1">${product.originalPrice}</div>
                        )}
                        <div className="fw-bold fs-28 text-brand-dark lh-1">${product.price}</div>
                      </div>
                      <Button
                        className={`rounded-pill border-0 px-4 fs-14 fw-bold transition-color shadow-sm ${addedToCart[product.id] ? '' : 'btn-brand'}`}
                        style={{ height: '44px', background: addedToCart[product.id] ? '#10B981' : '', color: 'white' }}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        {addedToCart[product.id] ? '✓ Added to Cart' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5 pt-4">
                <button className="border-0 bg-white shadow-sm rounded-circle text-brand-dark fs-18 fw-medium hover-bg-gray transition-color d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}>‹</button>
                {[1, 2, 3].map(p => (
                  <button key={p}
                    className={`border-0 rounded-circle fs-14 fw-bold transition-color d-flex align-items-center justify-content-center ${p === 1 ? 'btn-brand text-white shadow' : 'bg-white shadow-sm text-brand-dark hover-bg-gray'}`}
                    style={{ width: '40px', height: '40px' }}>
                    {p}
                  </button>
                ))}
                <button className="border-0 bg-white shadow-sm rounded-circle text-brand-dark fs-18 fw-medium hover-bg-gray transition-color d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}>›</button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Products;
