import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllActiveSubCategory } from '../features/subCategory/subCategoryAction.js';
import { fetchAllActiveCategory } from '../features/category/categoryAction.js';

const COLORS = ['#8B5CF6', '#F472B6', '#06B6D4', '#34D399', '#FBBF24', '#60A5FA', '#A78BFA'];

const getCategoryIcon = (name) => {
  const n = name?.toLowerCase() || '';
  if (n.includes('elect')) return 'bi-cpu';
  if (n.includes('fash') || n.includes('apparel') || n.includes('cloth') || n.includes('bag')) return 'bi-bag-heart';
  if (n.includes('home') || n.includes('liv') || n.includes('kit')) return 'bi-house-heart';
  if (n.includes('sport') || n.includes('out') || n.includes('bi')) return 'bi-bicycle';
  if (n.includes('health') || n.includes('beaut') || n.includes('star')) return 'bi-stars';
  if (n.includes('toy') || n.includes('game') || n.includes('control')) return 'bi-controller';
  if (n.includes('auto') || n.includes('car')) return 'bi-car-front';
  if (n.includes('book') || n.includes('stat')) return 'bi-book';
  return 'bi-grid-3x3-gap';
};

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const dispatch = useDispatch();

  const { subCategories } = useSelector((state) => state.subCategoryStore);
  const { categories } = useSelector((state) => state.categoryStore);

  // Fetch active categories on mount
  useEffect(() => {
    dispatch(fetchAllActiveCategory());
  }, [dispatch]);

  // Fetch subcategories only when active category changes and has a valid ID
  useEffect(() => {
    if (activeCategory?._id) {
      dispatch(fetchAllActiveSubCategory(activeCategory._id));
    }
  }, [activeCategory, dispatch]);

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Page hero */}
      <section className="nex-page-hero nex-page-hero-center" style={{ padding: '80px 0' }}>
        <div className="nex-orb" style={{ width: 400, height: 400, background: '#8B5CF6', top: '-30%', left: '-5%', opacity: 0.1 }} />
        <div className="nex-orb" style={{ width: 300, height: 300, background: '#06B6D4', bottom: '-20%', right: '-4%', opacity: 0.1 }} />
        <div className="container-fluid px-4 px-lg-5 position-relative">
          <Reveal>
            <span className="nex-pill mb-4 d-inline-flex">
              <i className="bi bi-grid-3x3-gap-fill me-1" />{activeCategory ? activeCategory.name : 'All Categories'}
            </span>
            <h1 className="display-4 fw-bold nex-text-light mb-3">
              {activeCategory ? <>Browse <span className="nex-gradient-text">{activeCategory.name}</span></> : <>Shop by <span className="nex-gradient-text">Category</span></>}
            </h1>
            <p className="lead nex-text-muted mx-auto" style={{ maxWidth: 560 }}>
              {activeCategory
                ? 'Select a subcategory to browse our curated products.'
                : 'Explore our wide range of premium products organized by category.'}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {activeCategory && (
          <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
            <button onClick={() => setActiveCategory(null)} className="nex-btn-outline" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
              <i className="bi bi-arrow-left me-2" />All Categories
            </button>
            <Link to={`/products?category=${encodeURIComponent(activeCategory.name)}`} className="nex-btn-primary" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
              View All {activeCategory.name} <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
        )}

        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4">
          {!activeCategory
            ? categories?.map((cat, i) => {
              const catColor = cat.color || COLORS[i % COLORS.length];
              const catIcon = cat.icon || getCategoryIcon(cat.name);
              return (
                <div className="col" key={cat._id}>
                  <Reveal delay={i * 60}>
                    <div onClick={() => setActiveCategory(cat)}
                      className="nex-category-card" style={{ cursor: 'pointer', minHeight: 280 }}>
                      <div className="nex-cat-img-wrap" style={{ height: 200 }}>
                        <img src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'} alt={cat.name} className="nex-cat-img" />
                        <div className="nex-cat-overlay" />
                        <div className="position-absolute" style={{ top: 14, left: 14 }}>
                          <div className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{ width: 40, height: 40, background: `${catColor}22`, border: `1px solid ${catColor}44`, backdropFilter: 'blur(8px)' }}>
                            <i className={`bi ${catIcon}`} style={{ color: catColor, fontSize: '1.1rem' }} />
                          </div>
                        </div>
                      </div>
                      <div className="nex-cat-body d-flex align-items-center justify-content-between">
                        <div className="text-start">
                          <p className="nex-cat-name mb-0">{cat.name}</p>
                          {cat.count !== undefined && <p className="nex-cat-count mb-0">{cat.count} products</p>}
                        </div>
                        <div className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', flexShrink: 0 }}>
                          <i className="bi bi-arrow-right nex-text-purple" style={{ fontSize: '0.8rem' }} />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })
            : subCategories?.map((sub, i) => (
              <div className="col" key={sub._id || sub.name || i}>
                <Reveal delay={i * 80}>
                  <Link to={`/products?category=${encodeURIComponent(activeCategory.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                    className="text-decoration-none d-block nex-category-card" style={{ minHeight: 240 }}>
                    <div className="nex-cat-img-wrap" style={{ height: 180 }}>
                      <img src={sub.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'} alt={sub.name} className="nex-cat-img" />
                      <div className="nex-cat-overlay" />
                    </div>
                    <div className="nex-cat-body d-flex align-items-center justify-content-between">
                      <div className="text-start">
                        <p className="nex-cat-name mb-0">{sub.name}</p>
                        {sub.count !== undefined && <p className="nex-cat-count mb-0">{sub.count} products</p>}
                      </div>
                      <span className="nex-gradient-text fw-bold" style={{ fontSize: '0.88rem' }}>Browse →</span>
                    </div>
                  </Link>
                </Reveal>
              </div>
            ))
          }
        </div>

        {/* Stats bar */}
        {!activeCategory && (
          <div className="nex-glass-card p-4 mt-5">
            <div className="row g-3 text-center">
              {[
                { value: `${categories?.length || 0}`, label: 'Categories', icon: 'bi-grid-3x3-gap' },
                { value: '1,200+', label: 'Products', icon: 'bi-box-seam' },
                { value: '24+', label: 'Subcategories', icon: 'bi-diagram-3' },
                { value: '4.9★', label: 'Avg. Rating', icon: 'bi-star-fill' },
              ].map(s => (
                <div className="col-6 col-md-3" key={s.label}>
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <i className={`bi ${s.icon} nex-text-purple`} style={{ fontSize: '1.4rem' }} />
                    <div className="text-start">
                      <p className="nex-gradient-text fw-bold mb-0" style={{ fontSize: '1.3rem', lineHeight: 1 }}>{s.value}</p>
                      <p className="nex-text-muted mb-0" style={{ fontSize: '0.75rem' }}>{s.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
