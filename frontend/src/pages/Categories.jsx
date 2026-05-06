import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';

const CATEGORIES = [
  { id: 1, name: 'Electronics', count: 124, icon: 'bi-cpu', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80', color: '#8B5CF6',
    subcategories: [
      { name: 'Audio', count: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
      { name: 'Computers', count: 56, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80' },
      { name: 'Accessories', count: 23, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80' },
    ]},
  { id: 2, name: 'Fashion & Apparel', count: 342, icon: 'bi-bag-heart', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', color: '#F472B6',
    subcategories: [
      { name: 'Men', count: 120, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80' },
      { name: 'Women', count: 150, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&q=80' },
      { name: 'Kids', count: 72, image: 'https://images.unsplash.com/photo-1519238396264-bfa2bcbd3b13?w=600&q=80' },
    ]},
  { id: 3, name: 'Home & Living', count: 89, icon: 'bi-house-heart', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80', color: '#06B6D4',
    subcategories: [
      { name: 'Lighting', count: 30, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80' },
      { name: 'Kitchen', count: 40, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80' },
      { name: 'Decor', count: 19, image: 'https://images.unsplash.com/photo-1580870058882-72c67b2e3e58?w=600&q=80' },
    ]},
  { id: 4, name: 'Sports & Outdoors', count: 56, icon: 'bi-bicycle', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80', color: '#34d399',
    subcategories: [
      { name: 'Footwear', count: 20, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
      { name: 'Fitness', count: 25, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&q=80' },
      { name: 'Equipment', count: 11, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
    ]},
  { id: 5, name: 'Health & Beauty', count: 210, icon: 'bi-stars', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80', color: '#F472B6',
    subcategories: [
      { name: 'Skincare', count: 80, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80' },
      { name: 'Makeup', count: 90, image: 'https://images.unsplash.com/photo-1512496115851-a1c8f1307e5e?w=600&q=80' },
      { name: 'Haircare', count: 40, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&q=80' },
    ]},
  { id: 6, name: 'Toys & Games', count: 78, icon: 'bi-controller', image: 'https://images.unsplash.com/photo-1558060370-d6411234f9ba?w=600&q=80', color: '#fbbf24',
    subcategories: [
      { name: 'Action Figures', count: 30, image: 'https://images.unsplash.com/photo-1606663886619-21696b863cb6?w=600&q=80' },
      { name: 'Board Games', count: 28, image: 'https://images.unsplash.com/photo-1610890716171-6b1e24bc48b9?w=600&q=80' },
      { name: 'Educational', count: 20, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80' },
    ]},
  { id: 7, name: 'Automotive', count: 45, icon: 'bi-car-front', image: 'https://images.unsplash.com/photo-1602052793312-b99c2a92b5c7?w=600&q=80', color: '#60a5fa',
    subcategories: [
      { name: 'Car Care', count: 15, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80' },
      { name: 'Tools', count: 20, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80' },
      { name: 'Accessories', count: 10, image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&q=80' },
    ]},
  { id: 8, name: 'Books & Stationery', count: 156, icon: 'bi-book', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80', color: '#a78bfa',
    subcategories: [
      { name: 'Fiction', count: 60, image: 'https://images.unsplash.com/photo-1474932430478-367d16b09217?w=600&q=80' },
      { name: 'Non-Fiction', count: 50, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80' },
      { name: 'Notebooks', count: 46, image: 'https://images.unsplash.com/photo-1531346878377-a541e4ab0d55?w=600&q=80' },
    ]},
];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(null);

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
            ? CATEGORIES.map((cat, i) => (
              <div className="col" key={cat.id}>
                <Reveal delay={i * 60}>
                  <div onClick={() => setActiveCategory(cat)}
                    className="nex-category-card" style={{ cursor: 'pointer', minHeight: 280 }}>
                    <div className="nex-cat-img-wrap" style={{ height: 200 }}>
                      <img src={cat.image} alt={cat.name} className="nex-cat-img" />
                      <div className="nex-cat-overlay" />
                      <div className="position-absolute" style={{ top: 14, left: 14 }}>
                        <div className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 40, height: 40, background: `${cat.color}22`, border: `1px solid ${cat.color}44`, backdropFilter: 'blur(8px)' }}>
                          <i className={`bi ${cat.icon}`} style={{ color: cat.color, fontSize: '1.1rem' }} />
                        </div>
                      </div>
                    </div>
                    <div className="nex-cat-body d-flex align-items-center justify-content-between">
                      <div className="text-start">
                        <p className="nex-cat-name mb-0">{cat.name}</p>
                        <p className="nex-cat-count mb-0">{cat.count} products</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', flexShrink: 0 }}>
                        <i className="bi bi-arrow-right nex-text-purple" style={{ fontSize: '0.8rem' }} />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))
            : activeCategory.subcategories.map((sub, i) => (
              <div className="col" key={sub.name}>
                <Reveal delay={i * 80}>
                  <Link to={`/products?category=${encodeURIComponent(activeCategory.name)}&subcategory=${encodeURIComponent(sub.name)}`}
                    className="text-decoration-none d-block nex-category-card" style={{ minHeight: 240 }}>
                    <div className="nex-cat-img-wrap" style={{ height: 180 }}>
                      <img src={sub.image} alt={sub.name} className="nex-cat-img" />
                      <div className="nex-cat-overlay" />
                    </div>
                    <div className="nex-cat-body d-flex align-items-center justify-content-between">
                      <div className="text-start">
                        <p className="nex-cat-name mb-0">{sub.name}</p>
                        <p className="nex-cat-count mb-0">{sub.count} products</p>
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
                { value: `${CATEGORIES.length}`, label: 'Categories', icon: 'bi-grid-3x3-gap' },
                { value: `${CATEGORIES.reduce((s, c) => s + c.count, 0)}+`, label: 'Products', icon: 'bi-box-seam' },
                { value: `${CATEGORIES.reduce((s, c) => s + c.subcategories.length, 0)}`, label: 'Subcategories', icon: 'bi-diagram-3' },
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
