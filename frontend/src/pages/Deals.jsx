import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DEALS = [
  { id: 101, name: 'Sony WH-1000XM5 Headphones', originalPrice: 399, price: 299, discount: '25% OFF', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', endDate: 'Ends in 2 days' },
  { id: 102, name: 'Samsung 65" 4K OLED TV', originalPrice: 1899, price: 1499, discount: '$400 OFF', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80', endDate: 'Ends today' },
  { id: 103, name: 'Apple Watch Series 9', originalPrice: 399, price: 349, discount: '12% OFF', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80', endDate: 'Ends in 5 days' },
  { id: 104, name: 'Dyson V15 Detect Vacuum', originalPrice: 749, price: 599, discount: '$150 OFF', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80', endDate: 'Ends in 12 hours' },
];

const Deals = () => {
  return (
    <div className="bg-brand-light pb-5" style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="bg-brand-dark text-white py-5 text-center position-relative overflow-hidden">
        <div className="position-absolute" style={{ top: '-50px', left: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div className="position-absolute" style={{ bottom: '-80px', right: '-20px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        
        <Container fluid className="px-container position-relative z-1 py-4">
          <Badge bg="danger" className="px-4 py-2 rounded-pill fs-12 mb-4 fw-bold tracking-widest shadow-sm">
            ⚡ FLASH SALES
          </Badge>
          <h1 className="fw-bold mb-3 fs-48 tracking-tight">Weekly Deals & Offers</h1>
          <p className="mb-0 fs-16 text-brand-white-70 max-w-600 mx-auto lh-16 fw-medium">
            Save big on top-rated products. These exclusive discounts are available for a limited time only. Don't miss out!
          </p>
        </Container>
      </div>

      <Container fluid className="px-container mt-5 pt-3">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
          <h4 className="fw-bold text-brand-dark fs-24 mb-0 d-flex align-items-center gap-2">
            <span className="text-danger">🔥</span> Trending Deals
          </h4>
        </div>
        
        <Row className="g-4 row-cols-1 row-cols-md-2 row-cols-xl-4">
          {DEALS.map(deal => (
            <Col key={deal.id}>
              <Card className="h-100 border-0 shadow-sm transition-all hover-shadow" style={{ borderRadius: '16px', overflow: 'hidden' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}>
                
                <div className="position-relative bg-white" style={{ height: '240px', padding: '1.5rem' }}>
                  <img src={deal.image} alt={deal.name} className="w-100 h-100 object-fit-contain mix-blend-multiply" />
                  
                  {/* Discount Badge */}
                  <span className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill fw-bold text-white fs-12 shadow-sm tracking-wide" style={{ background: '#EF4444' }}>
                    {deal.discount}
                  </span>
                </div>
                
                <Card.Body className="p-4 p-md-5 d-flex flex-column bg-white border-top border-brand-light">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="fs-13 fw-bold text-danger bg-danger bg-opacity-10 px-2 py-1 rounded">⏱️ {deal.endDate}</span>
                  </div>
                  
                  <Link to={`/products/${deal.id}`} className="text-decoration-none mt-1">
                    <Card.Title className="fw-bold fs-18 text-brand-dark mb-4 lh-16 transition-color hover-text-primary" style={{ minHeight: '44px' }}>
                      {deal.name}
                    </Card.Title>
                  </Link>
                  
                  <div className="mt-auto d-flex align-items-end justify-content-between">
                    <div>
                      <span className="fs-13 text-brand-muted text-decoration-line-through fw-medium d-block mb-1">${deal.originalPrice}</span>
                      <span className="fw-bold text-brand-dark lh-1" style={{ fontSize: '28px' }}>${deal.price}</span>
                    </div>
                    <Button className="rounded border-0 px-4 btn-brand fs-14 fw-bold shadow-sm" style={{ height: '44px' }}>
                      View Deal
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Deals;
