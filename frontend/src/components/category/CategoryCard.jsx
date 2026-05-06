import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const cardRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rotX = ((y - r.height / 2) / (r.height / 2)) * -10;
    const rotY = ((x - r.width / 2) / (r.width / 2)) * 10;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    }
  }, []);

  return (
    <Link to={`/category/${category.id}`} className="text-decoration-none d-block">
      <div
        ref={cardRef}
        className="nex-category-card"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div className="nex-cat-img-wrap">
          <img src={category.image} alt={category.name} className="nex-cat-img" />
          <div className="nex-cat-overlay" />
        </div>
        <div className="nex-cat-body">
          <h5 className="nex-cat-name">{category.name}</h5>
          <p className="nex-cat-count">{category.count || 'Browse Collection'}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
