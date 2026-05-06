import React from 'react';

const Rating = ({ value, max = 5 }) => {
  return (
    <div className="d-flex gap-1">
      {[...Array(max)].map((_, i) => (
        <i 
          key={i} 
          className={`bi ${i < value ? 'bi-star-fill text-warning' : 'bi-star text-body-tertiary'} small`} 
        />
      ))}
    </div>
  );
};

export default Rating;
