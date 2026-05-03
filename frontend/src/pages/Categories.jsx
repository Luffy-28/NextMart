import { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { 
    id: 1, name: 'Electronics', count: 124, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
    subcategories: [
      { name: 'Audio', count: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
      { name: 'Computers', count: 56, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80' },
      { name: 'Accessories', count: 23, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80' }
    ]
  },
  { 
    id: 2, name: 'Fashion & Apparel', count: 342, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    subcategories: [
      { name: 'Men', count: 120, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80' },
      { name: 'Women', count: 150, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&q=80' },
      { name: 'Kids', count: 72, image: 'https://images.unsplash.com/photo-1519238396264-bfa2bcbd3b13?w=600&q=80' }
    ]
  },
  { 
    id: 3, name: 'Home & Living', count: 89, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80',
    subcategories: [
      { name: 'Lighting', count: 30, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80' },
      { name: 'Kitchen', count: 40, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80' },
      { name: 'Decor', count: 19, image: 'https://images.unsplash.com/photo-1580870058882-72c67b2e3e58?w=600&q=80' }
    ]
  },
  { 
    id: 4, name: 'Sports & Outdoors', count: 56, image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    subcategories: [
      { name: 'Footwear', count: 20, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
      { name: 'Fitness', count: 25, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&q=80' },
      { name: 'Equipment', count: 11, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' }
    ]
  },
  { 
    id: 5, name: 'Health & Beauty', count: 210, image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80',
    subcategories: [
      { name: 'Skincare', count: 80, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80' },
      { name: 'Makeup', count: 90, image: 'https://images.unsplash.com/photo-1512496115851-a1c8f1307e5e?w=600&q=80' },
      { name: 'Haircare', count: 40, image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&q=80' }
    ]
  },
  { 
    id: 6, name: 'Toys & Games', count: 78, image: 'https://images.unsplash.com/photo-1558060370-d6411234f9ba?w=600&q=80',
    subcategories: [
      { name: 'Action Figures', count: 30, image: 'https://images.unsplash.com/photo-1606663886619-21696b863cb6?w=600&q=80' },
      { name: 'Board Games', count: 28, image: 'https://images.unsplash.com/photo-1610890716171-6b1e24bc48b9?w=600&q=80' },
      { name: 'Educational', count: 20, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80' }
    ]
  },
  { 
    id: 7, name: 'Automotive', count: 45, image: 'https://images.unsplash.com/photo-1602052793312-b99c2a92b5c7?w=600&q=80',
    subcategories: [
      { name: 'Car Care', count: 15, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80' },
      { name: 'Tools', count: 20, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80' },
      { name: 'Accessories', count: 10, image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&q=80' }
    ]
  },
  { 
    id: 8, name: 'Books & Stationery', count: 156, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    subcategories: [
      { name: 'Fiction', count: 60, image: 'https://images.unsplash.com/photo-1474932430478-367d16b09217?w=600&q=80' },
      { name: 'Non-Fiction', count: 50, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80' },
      { name: 'Notebooks', count: 46, image: 'https://images.unsplash.com/photo-1531346878377-a541e4ab0d55?w=600&q=80' }
    ]
  },
];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="bg-brand-dark text-white py-5 text-center position-relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.2) 0%, transparent 100%)' }}></div>
        <div className="position-absolute" style={{ top: '-100px', right: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        
        <Container fluid className="px-container position-relative z-1 py-4">
          <h1 className="fw-bold mb-3 fs-48 tracking-tight">
            {activeCategory ? activeCategory.name : 'Shop by Category'}
          </h1>
          <p className="mb-0 fs-16 text-brand-white-70 max-w-600 mx-auto lh-16 fw-medium">
            {activeCategory 
              ? 'Select a subcategory to browse our carefully curated products.' 
              : 'Explore our wide range of products organized by category. Discover premium items tailored to your lifestyle.'}
          </p>
        </Container>
      </div>

      <Container fluid className="px-container mt-5 pt-3">
        {activeCategory && (
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <Button 
              variant="link" 
              className="text-decoration-none text-brand-dark fw-bold d-inline-flex align-items-center gap-2 p-0 hover-text-primary transition-color"
              onClick={() => setActiveCategory(null)}
            >
              <span className="fs-20">←</span> Back to All Categories
            </Button>
            <Link to={`/products?category=${encodeURIComponent(activeCategory.name)}`} className="btn btn-outline-dark rounded-pill px-4 fs-14 fw-bold shadow-sm">
              View All {activeCategory.name}
            </Link>
          </div>
        )}

        <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4">
          {!activeCategory ? CATEGORIES.map(category => (
            <Col key={category.id}>
              <div onClick={() => setActiveCategory(category)} className="text-decoration-none cursor-pointer h-100">
                <Card className="h-100 border-0 shadow-sm category-card overflow-hidden transition-all" 
                  style={{ borderRadius: '20px', minHeight: '280px', position: 'relative' }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.transform = 'translateY(-8px)'; 
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'; 
                    e.currentTarget.querySelector('.cat-bg').style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; 
                    e.currentTarget.querySelector('.cat-bg').style.transform = 'scale(1)';
                  }}>
                  
                  {/* Background Image with Zoom Effect */}
                  <div className="cat-bg position-absolute top-0 start-0 w-100 h-100 transition-all duration-500" 
                    style={{ backgroundImage: `url(${category.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                  </div>
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="position-absolute top-0 start-0 w-100 h-100" 
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)' }}>
                  </div>

                  <Card.Body className="p-4 d-flex flex-column justify-content-end position-relative z-1 h-100">
                    <div className="mt-auto">
                      <h5 className="fw-bold text-white fs-24 mb-2 text-shadow-sm">{category.name}</h5>
                      <span className="fs-13 fw-bold rounded-pill px-3 py-1 bg-brand-primary text-white d-inline-block shadow-sm tracking-wide">
                        {category.count} Products
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          )) : activeCategory.subcategories.map(sub => (
            <Col key={sub.name}>
              <Link to={`/products?category=${encodeURIComponent(activeCategory.name)}&subcategory=${encodeURIComponent(sub.name)}`} className="text-decoration-none h-100 d-block">
                <Card className="h-100 border-0 shadow-sm category-card overflow-hidden transition-all" 
                  style={{ borderRadius: '20px', minHeight: '220px', position: 'relative' }}
                  onMouseEnter={e => { 
                    e.currentTarget.style.transform = 'translateY(-6px)'; 
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.12)'; 
                    e.currentTarget.querySelector('.cat-bg').style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={e => { 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; 
                    e.currentTarget.querySelector('.cat-bg').style.transform = 'scale(1)';
                  }}>
                  
                  <div className="cat-bg position-absolute top-0 start-0 w-100 h-100 transition-all duration-500" 
                    style={{ backgroundImage: `url(${sub.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                  </div>
                  
                  <div className="position-absolute top-0 start-0 w-100 h-100" 
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }}>
                  </div>

                  <Card.Body className="p-4 d-flex flex-column justify-content-end position-relative z-1 h-100 text-center">
                    <div className="mt-auto">
                      <h5 className="fw-bold text-white fs-20 mb-2 text-shadow-sm">{sub.name}</h5>
                      <span className="fs-12 fw-bold rounded-pill px-3 py-1 bg-white text-brand-dark d-inline-block shadow-sm tracking-wide">
                        View Products →
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Categories;
