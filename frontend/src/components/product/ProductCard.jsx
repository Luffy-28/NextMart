import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Rating from '../ui/Rating';

const BADGE_COLOR = {
  Hot: '#F472B6',
  Trending: '#8B5CF6',
  New: '#06B6D4',
};

const ProductCard = ({ product }) => {
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
    const rotX = ((y - cy) / cy) * -13;
    const rotY = ((x - cx) / cx) * 13;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.025,1.025,1.025)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139,92,246,0.18) 0%, transparent 65%)`;
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    }
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="nex-product-card"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div ref={glowRef} className="nex-card-glow" />

      <div className="nex-product-img-wrap">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="nex-product-img" />
        </Link>
        {product.badge && (
          <span
            className="nex-badge"
            style={{ background: BADGE_COLOR[product.badge] || '#8B5CF6' }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div className="nex-product-body">
        <Rating value={product.rating || 5} />
        <Link to={`/product/${product.id}`} className="text-decoration-none">
          <h6 className="nex-product-title">{product.name}</h6>
        </Link>
        <div className="nex-product-footer">
          <span className="nex-price">${product.price}</span>
          <button className="nex-cart-btn" aria-label="Add to cart">
            <i className="bi bi-cart-plus" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
