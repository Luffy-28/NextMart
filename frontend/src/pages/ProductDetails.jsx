import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../features/product/productAction.js';
import { addToCart } from '../features/cart/cartAction.js';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const RELATED = [
  { id: 2, name: 'Running Shoes Pro X', basePrice: 129, rating: 4, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 3, name: 'Smart Desk Lamp', basePrice: 49, rating: 4, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: 4, name: 'Ergonomic Laptop Stand', basePrice: 89, rating: 5, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80' },
  { id: 7, name: 'Vitamin C Serum', basePrice: 32, rating: 5, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80' },
];

const REVIEWS = [
  { id: 1, user: 'Sarah M.', rating: 5, createdAt: 'Apr 12, 2025', comment: 'Absolutely love these headphones! The noise cancelling is incredible — I can focus for hours without any distractions. Worth every penny.' },
  { id: 2, user: 'James T.', rating: 4, createdAt: 'Mar 28, 2025', comment: 'Great sound quality and very comfortable for long sessions. Battery life is excellent. Took off one star because the carrying case feels a bit flimsy.' },
  { id: 3, user: 'Priya K.', rating: 5, createdAt: 'Feb 14, 2025', comment: "Best headphones I've owned. The build quality is premium and the bass response is perfect. Highly recommend!" },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';

const StarRating = ({ rating, size = 14 }) => (
  <span style={{ fontSize: size }}>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} style={{ color: s <= rating ? '#F59E0B' : 'rgba(255,255,255,0.12)' }}>★</span>
    ))}
  </span>
);

const specs = [
  { label: 'Driver Size', value: '40mm' },
  { label: 'Frequency Response', value: '20Hz – 20kHz' },
  { label: 'Battery Life', value: 'Up to 30 hours' },
  { label: 'Noise Cancellation', value: 'Active (ANC)' },
  { label: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm jack' },
  { label: 'Weight', value: '250g' },
  { label: 'Warranty', value: '2 years' },
];

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  //redux store
   const { product, loading } = useSelector((state) => state.productStore);
   const {items: cartItems} = useSelector((state) => state.cartStore);

  // const handleAddToCart = () => {
  //   setAddedToCart(true);
  //   setTimeout(() => setAddedToCart(false), 2000);
  // };

  // load cart to data base 
  
    const handleAddToCart = async (productId, quantity) => {
      const data = await dispatch(addToCart({ productId, quantity }));
      if (data?.status === 'success') {
        setAddedToCart(p => ({ ...p, [productId]: true }));
        setTimeout(() => setAddedToCart(p => ({ ...p, [productId]: false })), 1500);
        toast.success('Item added to cart');
      } else {
        toast.error(data?.message || 'Failed to add item to cart');
      }
    };
  

  useEffect(()=>{
    dispatch(getProductById(id))
  },[dispatch, id])

  if (loading || !product) {
    return <LoadingSpinner fullPage={true} />;
  }

  const productImages = product?.images?.length ? product.images : [FALLBACK_IMAGE];
  const imageUrl = (image) => typeof image === 'string' ? image : image?.url || FALLBACK_IMAGE;
  const categoryName = product?.category?.name || 'Products';
  const subCategoryName = product?.subCategory?.name;
  const displayCategory = subCategoryName || categoryName;
  const displayPrice = product?.discountedPrice || product?.basePrice || 0;
  const originalPrice = product?.discountedPrice ? product?.basePrice : null;
  const savings = originalPrice ? originalPrice - displayPrice : 0;
  const isInStock = (product?.stock || 0) > 0;

  return (
    <div style={{ background: 'var(--nex-bg)', minHeight: '100vh' }}>
      {/* Breadcrumb bar */}
      <div style={{ background: 'var(--nex-bg-card)', borderBottom: '1px solid var(--nex-border)', padding: '14px 0' }}>
        <div className="container-fluid px-4 px-lg-5">
          <p className="nex-breadcrumb mb-0">
            <Link to="/">Home</Link>
            <span className="nex-breadcrumb-sep">›</span>
            <Link to="/products">Shop</Link>
            <span className="nex-breadcrumb-sep">›</span>
	            <Link to={`/products?category=${product?.category?._id || ''}`}>{categoryName}</Link>
	            <span className="nex-breadcrumb-sep">›</span>
	            <span className="nex-text-light fw-semibold">{product?.name || 'Product details'}</span>
          </p>
        </div>
      </div>

      <div className="container-fluid px-4 px-lg-5 py-5">
        {/* Main product panel */}
        <div className="nex-glass-card p-4 p-md-5 mb-5">
          <div className="row g-5">
            {/* Gallery */}
            <div className="col-lg-6">
              <div style={{ position: 'sticky', top: 100 }}>
                <div style={{ height: 480, borderRadius: 16, overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nex-border)' }}>
	                  <img src={imageUrl(productImages[selectedImage])} alt={product?.name || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
	                  {product?.featured && <span className="position-absolute" style={{ top: 14, left: 14, background: '#EF4444', color: 'white', fontSize: '0.68rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>FEATURED</span>}
	                  <button onClick={() => setWishlist(w => !w)}
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{ top: 12, right: 12, width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--nex-border)', background: 'rgba(7,7,15,0.7)', backdropFilter: 'blur(8px)', cursor: 'pointer', fontSize: '1.1rem' }}>
                    <i className={`bi ${wishlist ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: wishlist ? '#F472B6' : 'rgba(240,244,255,0.6)' }} />
                  </button>
	                </div>
	                {productImages.length > 1 && (
	                  <div className="d-flex gap-3 mt-3 flex-wrap">
	                    {productImages.map((image, index) => (
	                      <button
	                        key={`${imageUrl(image)}-${index}`}
	                        onClick={() => setSelectedImage(index)}
	                        style={{ width: 78, height: 78, borderRadius: 10, overflow: 'hidden', border: selectedImage === index ? '2px solid var(--nex-purple)' : '1px solid var(--nex-border)', background: 'rgba(255,255,255,0.03)', padding: 0, cursor: 'pointer' }}
	                      >
	                        <img src={imageUrl(image)} alt={`${product?.name || 'Product'} ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
	                      </button>
	                    ))}
	                  </div>
	                )}
	              </div>
	            </div>

            {/* Product info */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-3">
	                <span className="nex-status nex-status-blue">{displayCategory}</span>
	                {product?.brand && <span className="nex-status">{product.brand}</span>}
              </div>

              <h1 className="nex-text-light fw-bold mb-3" style={{ fontSize: '1.85rem', lineHeight: 1.2 }}>
                {product?.name}
              </h1>

              <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                <StarRating rating={product?.rating} size={16} />
                <span className="nex-text-light fw-bold">{product?.rating}</span>
	                <span className="nex-text-muted" style={{ fontSize: '0.85rem' }}>({product?.reviewCount || 0} reviews)</span>
	                <span className={`nex-status ${isInStock ? 'nex-status-green' : 'nex-status-red'} ms-auto`}><i className={`bi ${isInStock ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`} />{isInStock ? 'In Stock' : 'Out of Stock'}</span>
	              </div>

	              <div className="d-flex align-items-end gap-3 mb-4">
	                <span className="nex-text-light fw-bold" style={{ fontSize: '2.8rem', lineHeight: 1 }}>${displayPrice}</span>
	                {originalPrice && <span className="nex-text-muted text-decoration-line-through mb-1" style={{ fontSize: '1.2rem' }}>${originalPrice}</span>}
	                {savings > 0 && <span className="nex-status nex-status-red mb-1">Save ${savings}</span>}
	              </div>

              <p className="nex-text-muted mb-5" style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
                {product?.description}
              </p>

              {/* Color & size info */}
              <div className="mb-5 pb-4 d-flex gap-4 flex-wrap" style={{ borderBottom: '1px solid var(--nex-border)' }}>
	                {product?.color && <div>
	                  <p className="nex-form-label mb-1">Color</p>
	                  <div className="d-flex align-items-center gap-2">
	                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1F2937', border: '1px solid rgba(255,255,255,0.2)' }} />
	                    <span className="nex-text-muted" style={{ fontSize: '0.88rem' }}>{product?.color}</span>
	                  </div>
	                </div>}
	                {product?.size && <div>
	                  <p className="nex-form-label mb-1">Size</p>
	                  <span className="nex-text-muted" style={{ fontSize: '0.88rem' }}>{product?.size}</span>
	                </div>}
	                <div>
	                  <p className="nex-form-label mb-1">Stock</p>
	                  <span className="nex-text-muted" style={{ fontSize: '0.88rem' }}>{product?.stock || 0} available</span>
	                </div>
	              </div>

              {/* Quantity + CTAs */}
              <div className="d-flex align-items-center gap-3 mb-5 flex-wrap">
                <div className="nex-qty">
                  <button className="nex-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="nex-qty-num">{quantity}</span>
                  <button className="nex-qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
	                <button className={`flex-grow-1 ${addedToCart ? 'nex-btn-primary' : 'nex-btn-primary'} justify-content-center`}
	                  style={{ padding: '13px 24px', background: addedToCart ? 'linear-gradient(135deg,#10b981,#059669)' : undefined }}
	                  onClick={()=>handleAddToCart(product._id,quantity)}
	                  disabled={!isInStock}>
                  {addedToCart ? <><i className="bi bi-check-lg me-2" />Added!</> : <><i className="bi bi-bag-plus me-2" />Add to Cart</>}
                </button>
                <Link to="/checkout" className="nex-btn-outline justify-content-center" style={{ padding: '13px 24px' }}>
                  Buy Now
                </Link>
              </div>

              {/* Trust badges */}
              <div className="row g-3">
                {[
                  { icon: 'bi-truck', title: 'Free Delivery', text: 'On orders over $50' },
                  { icon: 'bi-arrow-repeat', title: 'Free Returns', text: '30-day return policy' },
                  { icon: 'bi-shield-lock', title: 'Secure Payment', text: '100% safe checkout' },
                  { icon: 'bi-stars', title: '2-Year Warranty', text: 'Guaranteed quality' },
                ].map((b, i) => (
                  <div className="col-6" key={i}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--nex-border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <i className={`bi ${b.icon} nex-gradient-text`} style={{ fontSize: '1.2rem', marginTop: 1 }} />
                      <div>
                        <p className="nex-text-light fw-bold mb-0" style={{ fontSize: '0.8rem' }}>{b.title}</p>
                        <p className="nex-text-muted mb-0" style={{ fontSize: '0.72rem' }}>{b.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="nex-glass-card p-4 p-md-5 mb-5">
          <div className="nex-tabs">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specs', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${REVIEWS.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setSelectedTab(tab.key)}
                className={`nex-tab ${selectedTab === tab.key ? 'active' : ''}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {selectedTab === 'description' && (
            <div style={{ maxWidth: 740 }}>
              <h5 className="nex-text-light fw-bold mb-4">About This Product</h5>
              <p className="nex-text-muted mb-4" style={{ lineHeight: 1.8 }}>
                {product?.description}
              </p>
              <ul className="d-flex flex-column gap-2 ps-3">
                {product?.features.map((f, i) => (
                  <li key={i} className="nex-text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedTab === 'specs' && (
            <div style={{ maxWidth: 640 }}>
              <h5 className="nex-text-light fw-bold mb-4">Technical Specifications</h5>
              {product?.specifications?.map((spec, i) => (
                <div key={i} className="d-flex py-3" style={{ borderBottom: i < specs.length - 1 ? '1px solid var(--nex-border)' : 'none' }}>
                  <span className="nex-text-light fw-semibold" style={{ width: 220, flexShrink: 0, fontSize: '0.88rem' }}>{spec.label}</span>
                  <span className="nex-text-muted" style={{ fontSize: '0.88rem' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div>
              <div className="nex-glass-card-lg p-4 mb-5 d-flex gap-5 align-items-center flex-wrap">
                <div className="text-center">
                  <div className="nex-gradient-text fw-bold mb-2" style={{ fontSize: '4rem', lineHeight: 1 }}>5.0</div>
                  <StarRating rating={5} size={18} />
                  <p className="nex-text-muted mt-2 mb-0" style={{ fontSize: '0.82rem' }}>128 reviews</p>
                </div>
                <div className="flex-grow-1" style={{ maxWidth: 360 }}>
                  {[5, 4, 3, 2, 1].map(r => (
                    <div key={r} className="d-flex align-items-center gap-3 mb-2">
                      <span className="nex-text-muted" style={{ fontSize: '0.8rem', width: 20 }}>{r}★</span>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: r === 5 ? '78%' : r === 4 ? '16%' : r === 3 ? '4%' : '1%', background: '#F59E0B', borderRadius: 4 }} />
                      </div>
                      <span className="nex-text-muted" style={{ fontSize: '0.75rem', width: 30 }}>{r === 5 ? '78%' : r === 4 ? '16%' : r === 3 ? '4%' : '1%'}</span>
                    </div>
                  ))}
                </div>
                <button className="nex-btn-primary ms-auto" style={{ padding: '10px 22px' }}>Write a Review</button>
              </div>

              <div className="d-flex flex-column gap-4">
                {REVIEWS.map(review => (
                  <div key={review.id} className="pb-4" style={{ borderBottom: '1px solid var(--nex-border)' }}>
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center rounded-circle nex-icon-grad text-white fw-bold"
                          style={{ width: 44, height: 44, fontSize: '1rem', flexShrink: 0 }}>
                          {review.user[0]}
                        </div>
                        <div>
                          <p className="nex-text-light fw-bold mb-1 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                            {review.user}
                            <span className="nex-status nex-status-green" style={{ fontSize: '0.65rem' }}>Verified</span>
                          </p>
                          <StarRating rating={review.rating} size={13} />
                        </div>
                      </div>
                      <span className="nex-text-muted" style={{ fontSize: '0.8rem' }}>{review.createdAt}</span>
                    </div>
                    <p className="nex-text-muted mb-0" style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related products */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid var(--nex-border)' }}>
            <h2 className="nex-text-light fw-bold mb-0" style={{ fontSize: '1.4rem' }}>You Might Also Like</h2>
            <Link to="/products" className="nex-gradient-text text-decoration-none fw-semibold" style={{ fontSize: '0.88rem' }}>View all →</Link>
          </div>
          <div className="row g-4 row-cols-2 row-cols-lg-4">
            {RELATED.map(p => (
              <div className="col" key={p.id}>
                <Link to={`/products/${p.id}`} className="text-decoration-none h-100 d-block nex-glass-card overflow-hidden"
                  style={{ transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--nex-border)'}>
                  <div style={{ height: 180, overflow: 'hidden' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''} />
                  </div>
                  <div className="p-3">
                    <p className="nex-text-light fw-semibold mb-1" style={{ fontSize: '0.88rem' }}>{p.name}</p>
                    <StarRating rating={p.rating} size={12} />
                    <p className="nex-gradient-text fw-bold mt-2 mb-0" style={{ fontSize: '1.05rem' }}>${p.basePrice}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
