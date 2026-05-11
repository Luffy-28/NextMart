import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';

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

const BADGE_COLOR = { 'Best Seller': '#8B5CF6', 'Sale': '#EF4444', 'New': '#06B6D4' };

const StarRating = ({ rating, size = 12 }) => (
  <span style={{ fontSize: size, letterSpacing: 1 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ color: s <= rating ? '#F59E0B' : 'rgba(255,255,255,0.12)' }}>★</span>
    ))}
  </span>
);

const ProductCard = ({ product, added, onAdd }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    card.style.transform = `perspective(900px) rotateX(${((y - cy) / cy) * -10}deg) rotateY(${((x - cx) / cx) * 10}deg) scale3d(1.02,1.02,1.02)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139,92,246,0.15) 0%, transparent 65%)`;
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = '';
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  }, []);

  return (
    <div ref={cardRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
      className="nex-glass-card h-100 d-flex flex-column overflow-hidden"
      style={{ transition: 'transform 0.15s ease', position: 'relative' }}>
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, borderRadius: 'inherit', transition: 'background 0.2s' }} />

      <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
        <img src={product.image} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''} />
        {product.badge && (
          <span className="position-absolute" style={{ top: 12, left: 12, background: BADGE_COLOR[product.badge], color: 'white', fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
            {product.badge.toUpperCase()}
          </span>
        )}
        <Link to={`/products/${product.id}`}
          className="position-absolute d-flex align-items-center justify-content-center"
          style={{ top: 10, right: 10, width: 34, height: 34, background: 'rgba(7,7,15,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', color: 'rgba(240,244,255,0.7)', textDecoration: 'none', backdropFilter: 'blur(8px)', fontSize: '0.85rem' }}>
          <i className="bi bi-eye" />
        </Link>
      </div>

      <div className="d-flex flex-column flex-grow-1 p-3" style={{ position: 'relative', zIndex: 1 }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--nex-cyan)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{product.subcategory}</span>
          <div className="d-flex align-items-center gap-1">
            <StarRating rating={product.rating} />
            <span style={{ fontSize: '0.7rem', color: 'var(--nex-text-muted)' }}>({product.reviews})</span>
          </div>
        </div>

        <Link to={`/products/${product.id}`} className="text-decoration-none flex-grow-1">
          <p className="nex-text-light fw-semibold mb-3" style={{ fontSize: '0.9rem', lineHeight: 1.4, minHeight: 40 }}>{product.name}</p>
        </Link>

        <div className="d-flex align-items-center justify-content-between mt-auto pt-2" style={{ borderTop: '1px solid var(--nex-border)' }}>
          <div>
            <span className="nex-text-light fw-bold" style={{ fontSize: '1.15rem' }}>${product.price}</span>
            {product.originalPrice && (
              <span className="nex-text-muted ms-2 text-decoration-line-through" style={{ fontSize: '0.82rem' }}>${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAdd(product.id)}
            className={added ? 'nex-btn-primary' : 'nex-btn-outline'}
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
            {added ? <><i className="bi bi-check-lg me-1" />Added</> : <><i className="bi bi-bag-plus me-1" />Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterPanel = ({
  selectedCategory, selectedSubcategory, openCategories, priceRange, minRating,
  handleCategoryToggle, setSelectedSubcategory, setPriceRange, setMinRating, onClear,
}) => (
  <>
    <p className="nex-filter-heading">Category</p>
    {CATEGORIES.map(cat => (
      <div key={cat.name} className="mb-1">
        <div
          onClick={() => handleCategoryToggle(cat.name)}
          className="d-flex align-items-center justify-content-between py-2 px-3 rounded"
          style={{
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: selectedCategory === cat.name ? 700 : 500,
            background: selectedCategory === cat.name ? 'rgba(139,92,246,0.12)' : 'transparent',
            color: selectedCategory === cat.name ? 'var(--nex-purple)' : 'var(--nex-text-muted)',
            transition: 'all 0.2s',
          }}>
          <span>{cat.name}</span>
          {cat.subcategories.length > 0 && (
            <i className={`bi bi-chevron-${openCategories[cat.name] ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }} />
          )}
        </div>
        <Collapse in={!!openCategories[cat.name] && cat.subcategories.length > 0}>
          <div className="ps-3 pt-1">
            {cat.subcategories.map(sub => (
              <div key={sub} onClick={() => setSelectedSubcategory(sub)}
                className="py-1 px-3 rounded"
                style={{
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: selectedSubcategory === sub ? 600 : 400,
                  color: selectedSubcategory === sub ? 'var(--nex-cyan)' : 'var(--nex-text-muted)',
                  transition: 'color 0.2s',
                }}>
                {sub}
              </div>
            ))}
          </div>
        </Collapse>
      </div>
    ))}

    <div style={{ height: 1, background: 'var(--nex-border)', margin: '20px 0' }} />
    <p className="nex-filter-heading">Max Price</p>
    <input type="range" min={0} max={500} step={10} value={priceRange[1]}
      onChange={e => setPriceRange([0, +e.target.value])}
      style={{ width: '100%', accentColor: 'var(--nex-purple)' }} />
    <div className="d-flex justify-content-between mt-1">
      <span style={{ fontSize: '0.78rem', color: 'var(--nex-text-muted)' }}>$0</span>
      <span className="nex-gradient-text fw-bold" style={{ fontSize: '0.88rem' }}>${priceRange[1]}</span>
    </div>

    <div style={{ height: 1, background: 'var(--nex-border)', margin: '20px 0' }} />
    <p className="nex-filter-heading">Min Rating</p>
    {[4, 3, 2, 0].map(r => (
      <div key={r} onClick={() => setMinRating(r)}
        className="d-flex align-items-center gap-2 py-2 px-2 rounded"
        style={{ cursor: 'pointer', background: minRating === r ? 'rgba(139,92,246,0.08)' : 'transparent', transition: 'background 0.2s' }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${minRating === r ? 'var(--nex-purple)' : 'var(--nex-border)'}`, background: minRating === r ? 'var(--nex-purple)' : 'transparent', transition: 'all 0.2s' }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--nex-text-muted)' }}>
          {r > 0 ? `${r}+ ★` : 'All'}
        </span>
      </div>
    ))}

    <div style={{ height: 1, background: 'var(--nex-border)', margin: '20px 0' }} />
    <button className="nex-btn-outline w-100 justify-content-center" style={{ padding: '9px', fontSize: '0.82rem' }}
      onClick={onClear}>
      Clear Filters
    </button>
  </>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const initCategory = searchParams.get('category') || 'All';
  const initSubcategory = searchParams.get('subcategory') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initSubcategory);
  const [openCategories, setOpenCategories] = useState({ All: true, [initCategory]: true });
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [minRating, setMinRating] = useState(0);
  const [addedToCart, setAddedToCart] = useState({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    const subcat = searchParams.get('subcategory');
    if (cat) { setSelectedCategory(cat); setOpenCategories(p => ({ ...p, [cat]: true })); }
    if (subcat) setSelectedSubcategory(subcat);
  }, [searchParams]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = filterDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filterDrawerOpen]);

  const handleCategoryToggle = (catName) => {
    if (catName === 'All') { setSelectedCategory('All'); setSelectedSubcategory('All'); return; }
    setOpenCategories(p => ({ ...p, [catName]: !p[catName] }));
    setSelectedCategory(catName);
    setSelectedSubcategory('All');
  };

  const handleAddToCart = (id) => {
    setAddedToCart(p => ({ ...p, [id]: true }));
    setTimeout(() => setAddedToCart(p => ({ ...p, [id]: false })), 1500);
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setPriceRange([0, 500]);
    setMinRating(0);
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

  const activeFilterCount = [
    selectedCategory !== 'All',
    selectedSubcategory !== 'All',
    priceRange[1] !== 500,
    minRating > 0,
  ].filter(Boolean).length;

  const filterPanelProps = {
    selectedCategory, selectedSubcategory, openCategories, priceRange, minRating,
    handleCategoryToggle, setSelectedSubcategory, setPriceRange, setMinRating,
    onClear: clearFilters,
  };

  const ViewToggle = ({ size = 34 }) => (
    <div className="d-flex gap-1 p-1 rounded flex-shrink-0" style={{ background: 'var(--nex-bg-card)', border: '1px solid var(--nex-border)' }}>
      {[['grid', 'bi-grid'], ['list', 'bi-list-ul']].map(([mode, icon]) => (
        <button key={mode} onClick={() => setViewMode(mode)}
          style={{
            width: size, height: size, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.9rem',
            background: viewMode === mode ? 'var(--nex-gradient)' : 'transparent',
            color: viewMode === mode ? 'white' : 'var(--nex-text-muted)',
            transition: 'all 0.2s',
          }}>
          <i className={`bi ${icon}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Page hero */}
      <div className="nex-page-hero">
        <div className="nex-orb" style={{ width: 300, height: 300, background: '#8B5CF6', top: '-60%', right: '-5%', opacity: 0.1 }} />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <p className="nex-label mb-2">NexMart Shop</p>
              <h1 className="nex-text-light fw-bold mb-2" style={{ fontSize: '2rem' }}>All Products</h1>
              <p className="nex-breadcrumb mb-0">
                <Link to="/">Home</Link><span className="nex-breadcrumb-sep">›</span>Shop
              </p>
            </div>
            <div className="nex-glass-card px-4 py-2">
              <span className="nex-text-muted" style={{ fontSize: '0.88rem' }}>{filtered.length} products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        <div className="row g-4">
          {/* Sidebar — desktop only */}
          <div className="col-lg-3 col-xl-2 d-none d-lg-block">
            <div className="nex-sidebar">
              <FilterPanel {...filterPanelProps} />
            </div>
          </div>

          {/* Products area */}
          <div className="col-12 col-lg-9 col-xl-10">

            {/* ── MOBILE: filter / sort bar ── */}
            <div className="d-flex d-lg-none align-items-center gap-2 mb-3">
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="nex-btn-outline d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                style={{ padding: '10px 16px', fontSize: '0.88rem', position: 'relative', fontWeight: 600 }}>
                <i className="bi bi-sliders2" />
                Filters
                {activeFilterCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -7, right: -7,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--nex-purple)', color: 'white',
                    fontSize: '0.68rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 0 2px var(--nex-bg)',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="nex-input flex-grow-1"
                style={{ padding: '10px 10px', cursor: 'pointer', fontSize: '0.82rem', minWidth: 0 }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating">Top Rated</option>
              </select>
              <ViewToggle size={40} />
            </div>

            {/* ── MOBILE: active filter chips ── */}
            {activeFilterCount > 0 && (
              <div className="d-flex d-lg-none gap-2 flex-wrap mb-3">
                {selectedCategory !== 'All' && (
                  <span className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                    style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--nex-purple)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {selectedCategory}{selectedSubcategory !== 'All' && ` › ${selectedSubcategory}`}
                    <span style={{ cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                      onClick={() => { setSelectedCategory('All'); setSelectedSubcategory('All'); }}>×</span>
                  </span>
                )}
                {priceRange[1] < 500 && (
                  <span className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                    style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--nex-purple)', fontSize: '0.8rem', fontWeight: 600 }}>
                    Max ${priceRange[1]}
                    <span style={{ cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                      onClick={() => setPriceRange([0, 500])}>×</span>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                    style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--nex-purple)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {minRating}+ ★
                    <span style={{ cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                      onClick={() => setMinRating(0)}>×</span>
                  </span>
                )}
              </div>
            )}

            {/* ── DESKTOP: controls bar ── */}
            <div className="d-none d-lg-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <div className="d-flex gap-2 flex-wrap">
                {selectedCategory !== 'All' && (
                  <span className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                    style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--nex-purple)', fontSize: '0.82rem', fontWeight: 600 }}>
                    {selectedCategory}{selectedSubcategory !== 'All' && ` › ${selectedSubcategory}`}
                    <span style={{ cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                      onClick={() => { setSelectedCategory('All'); setSelectedSubcategory('All'); }}>×</span>
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-3">
                <ViewToggle size={34} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="nex-input" style={{ width: 190, padding: '9px 14px', cursor: 'pointer' }}>
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="nex-glass-card text-center py-5 my-4">
                <i className="bi bi-search nex-text-muted mb-3 d-block" style={{ fontSize: '3rem' }} />
                <h4 className="nex-text-light fw-bold mb-2">No products found</h4>
                <p className="nex-text-muted mb-4">Try adjusting your filters.</p>
                <button className="nex-btn-primary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4">
                {filtered.map(p => (
                  <div className="col" key={p.id}>
                    <ProductCard product={p} added={!!addedToCart[p.id]} onAdd={handleAddToCart} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filtered.map(p => (
                  <div key={p.id} className="nex-glass-card d-flex flex-column flex-md-row align-items-md-center gap-4 p-4"
                    style={{ transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--nex-border)'}>
                    <div style={{ width: 120, height: 100, flexShrink: 0, borderRadius: 10, overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="flex-grow-1">
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--nex-cyan)', textTransform: 'uppercase' }}>{p.category}</span>
                      <Link to={`/products/${p.id}`} className="text-decoration-none">
                        <p className="nex-text-light fw-bold mb-1" style={{ fontSize: '1rem' }}>{p.name}</p>
                      </Link>
                      <div><StarRating rating={p.rating} size={13} /><span className="nex-text-muted ms-2" style={{ fontSize: '0.78rem' }}>({p.reviews})</span></div>
                    </div>
                    <div className="d-flex flex-md-column align-items-center align-items-md-end gap-3 flex-shrink-0">
                      <div className="text-md-end">
                        {p.originalPrice && <span className="nex-text-muted d-block text-decoration-line-through" style={{ fontSize: '0.82rem' }}>${p.originalPrice}</span>}
                        <span className="nex-text-light fw-bold" style={{ fontSize: '1.3rem' }}>${p.price}</span>
                      </div>
                      <button onClick={() => handleAddToCart(p.id)} className={addedToCart[p.id] ? 'nex-btn-primary' : 'nex-btn-outline'} style={{ padding: '8px 18px', fontSize: '0.84rem', whiteSpace: 'nowrap' }}>
                        {addedToCart[p.id] ? '✓ Added' : '+ Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                <button className="nex-glass-card d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, border: 'none', color: 'var(--nex-text-muted)', fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}>‹</button>
                {[1, 2, 3].map(pg => (
                  <button key={pg} style={{
                    width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem',
                    background: pg === 1 ? 'var(--nex-gradient)' : 'var(--nex-bg-card)',
                    color: pg === 1 ? 'white' : 'var(--nex-text-muted)',
                  }}>{pg}</button>
                ))}
                <button className="nex-glass-card d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, border: 'none', color: 'var(--nex-text-muted)', fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}>›</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE: bottom sheet filter drawer ── */}

      {/* Backdrop */}
      <div
        onClick={() => setFilterDrawerOpen(false)}
        className="d-lg-none"
        style={{
          position: 'fixed', inset: 0, zIndex: 1040,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)',
          opacity: filterDrawerOpen ? 1 : 0,
          pointerEvents: filterDrawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer sheet */}
      <div
        className="d-lg-none"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1050,
          background: 'var(--nex-bg-card)',
          borderTop: '1px solid var(--nex-border)',
          borderRadius: '20px 20px 0 0',
          transform: filterDrawerOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '82vh',
          overflowY: 'auto',
          padding: '0 20px 40px',
          WebkitOverflowScrolling: 'touch',
        }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 6 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--nex-border)' }} />
        </div>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center py-3 mb-1"
          style={{ borderBottom: '1px solid var(--nex-border)', position: 'sticky', top: 0, background: 'var(--nex-bg-card)', zIndex: 1 }}>
          <span className="nex-text-light fw-bold" style={{ fontSize: '1rem' }}>
            Filters
            {activeFilterCount > 0 && (
              <span style={{ color: 'var(--nex-purple)', fontWeight: 400, fontSize: '0.85rem', marginLeft: 8 }}>
                {activeFilterCount} active
              </span>
            )}
          </span>
          <button onClick={() => setFilterDrawerOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--nex-text-muted)', fontSize: '1.5rem', cursor: 'pointer', padding: '0 4px', lineHeight: 1, marginRight: -4 }}>
            ×
          </button>
        </div>

        <div className="pt-2">
          <FilterPanel {...filterPanelProps} />
        </div>

        {/* Show results CTA */}
        <button
          className="nex-btn-primary w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
          style={{ padding: '14px', fontSize: '0.95rem', fontWeight: 700 }}
          onClick={() => setFilterDrawerOpen(false)}>
          <i className="bi bi-check-lg" />
          Show {filtered.length} Product{filtered.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default Products;
