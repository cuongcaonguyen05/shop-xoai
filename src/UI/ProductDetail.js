import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductDetail.css';
import img_test from '../Resource/ProductCard/coquetdau.webp';

const API_URL = 'http://localhost:5000/api/products';

const CATEGORY_LABELS = {
  chair:              'Ghế ăn dặm',
  pot_and_pan_grinder:'Máy xay, nồi chảo',
  kitchen:            'Đồ dùng bếp',
  utensils:           'Dụng cụ ăn uống',
  postpartum:         'Dành cho mẹ sau sinh',
  spice:              'Gia vị ăn dặm',
  instant_food:       'Thực phẩm ăn liền',
  organic_flour:      'Các loại bột, hạt hữu cơ',
  noodles:            'Nui, mì, bún',
  milk:               'Sữa, men vi sinh, vitamin',
  toys:               'Đồ chơi giáo dục',
};

function fmt(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [samePriceProducts, setSamePriceProducts] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedCart, setAddedCart] = useState(false);
  const [mainImg, setMainImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        const data = await res.json();
        setProduct(data);

        // Fetch sản phẩm cùng category
        const relRes = await fetch(`${API_URL}?category=${data.category}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelatedProducts(relData.filter(p => p._id !== data._id).slice(0, 5));

          // Sản phẩm cùng phân khúc giá: ±30% so với giá hiện tại
          const low = data.price * 0.7;
          const high = data.price * 1.3;
          const allRes = await fetch(API_URL);
          if (allRes.ok) {
            const allData = await allRes.json();
            setSamePriceProducts(
              allData
                .filter(p => p._id !== data._id && p.price >= low && p.price <= high)
                .slice(0, 5)
            );
          }
        }

        // Sản phẩm đã xem: lưu/đọc từ localStorage
        const viewed = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
        if (!viewed.includes(id)) {
          const updated = [id, ...viewed].slice(0, 10);
          localStorage.setItem('viewedProducts', JSON.stringify(updated));
        }
        const viewedIds = JSON.parse(localStorage.getItem('viewedProducts') || '[]')
          .filter(vid => vid !== id)
          .slice(0, 5);
        if (viewedIds.length > 0) {
          const viewedData = await Promise.all(
            viewedIds.map(vid => fetch(`${API_URL}/${vid}`).then(r => r.ok ? r.json() : null))
          );
          setViewedProducts(viewedData.filter(Boolean));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Ảnh mẫu — sau thay bằng ảnh thật từ API
  const images = [img_test, img_test, img_test, img_test];

  if (loading) {
    return <div className="pd-notfound">⏳ Đang tải sản phẩm...</div>;
  }

  if (error || !product) {
    return (
      <div className="pd-notfound">
        <p>😔 Không tìm thấy sản phẩm</p>
        <button onClick={() => navigate('/')}>← Về trang chủ</button>
      </div>
    );
  }

  const hasDiscount = product.old_price && product.old_price > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / product.old_price) * 100) : null;

  const handleAddCart = () => {
    addToCart(product, qty);
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 1500);
  };

  return (
    <div className="pd-root">

      {/* BREADCRUMB */}
      <div className="pd-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>›</span>
        <span onClick={() => navigate('/')} className="pd-bread-cat">{CATEGORY_LABELS[product.category] || product.category}</span>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      {/* PHẦN TRÊN — ẢNH + THÔNG TIN */}
      <div className="pd-top">

        {/* CỘT TRÁI — ẢNH */}
        <div className="pd-gallery">
          {/* ẢNH NHỎ BÊN TRÁI */}
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <div
                key={i}
                className={`pd-thumb ${mainImg === i ? 'pd-thumb--active' : ''}`}
                onClick={() => setMainImg(i)}
              >
                <img src={img} alt={`${product.name} ${i+1}`} />
              </div>
            ))}
          </div>
          {/* ẢNH CHÍNH */}
          <div className="pd-main-img">
            <img
              src={images[mainImg]}
              alt={product.name}
              onClick={() => setLightbox(true)}
              style={{ cursor: 'zoom-in' }}
            />
            {hasDiscount && <span className="pd-discount-badge">-{discount}%</span>}
            <button
              className="pd-arrow pd-arrow--prev"
              onClick={() => setMainImg(i => (i - 1 + images.length) % images.length)}
            >‹</button>
            <button
              className="pd-arrow pd-arrow--next"
              onClick={() => setMainImg(i => (i + 1) % images.length)}
            >›</button>
          </div>
        </div>

        {/* CỘT PHẢI — THÔNG TIN */}
        <div className="pd-info">
          <p className="pd-brand">Danh mục: <strong>{CATEGORY_LABELS[product.category] || product.category}</strong></p>
          <h1 className="pd-name">{product.name}</h1>
          <p className="pd-meta-info">
            Thương hiệu: <strong>BeYêuShop</strong>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            Mã sản phẩm: <strong>SP{id.slice(-6).toUpperCase()}</strong>
          </p>

          {/* SAO ĐÁNH GIÁ */}
          <div className="pd-stars">
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db', fontSize: 18 }}>★</span>
            ))}
            <span className="pd-rating-num">{product.rating}/5</span>
          </div>

          {/* GIÁ */}
          <div className="pd-price-block">
            <span className="pd-price">{fmt(product.price)}</span>
            {hasDiscount && <s className="pd-old-price">{fmt(product.old_price)}</s>}
            {hasDiscount && <span className="pd-discount-tag">-{discount}%</span>}
          </div>

          {/* THÔNG TIN NHANH */}
          <div className="pd-meta">
            <div className="pd-meta-item">
              <span>🚚</span>
              <span>Miễn ship đơn từ <strong>300K</strong></span>
            </div>
          </div>

          {/* SỐ LƯỢNG + NÚT */}
          <div className="pd-actions">
            <div className="pd-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            <button
              className={`pd-btn-cart ${addedCart ? 'pd-btn-cart--added' : ''}`}
              onClick={handleAddCart}
            >
              {addedCart ? '✓ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ hàng'}
            </button>
            <button className="pd-btn-buy" onClick={() => navigate('/checkout')}>
              Mua ngay
            </button>
          </div>

          {/* TAGS */}
          {product.tag && (
            <div className="pd-tags">
              <span className="pd-tag">#{product.tag}</span>
            </div>
          )}

          <a
            href="https://shopee.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="pd-shopee-link"
          >
            <img src="https://down-vn.img.susercontent.com/file/vn-11134233-7ras8-m1pez7n5zcdb34" alt="Shopee" className="pd-shopee-logo" />
            Xem trên Shopee
          </a>
        </div>
      </div>

      {/* MÔ TẢ SẢN PHẨM */}
      <div className="pd-body">
        <div className="pd-desc-box">
          <div className="pd-desc-title">MÔ TẢ SẢN PHẨM</div>
          <div className="pd-desc-content">
            <h3>{product.name.toUpperCase()}</h3>
            <p>{product.description}</p>
            <ul>
              <li>Danh mục: {product.category}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SẢN PHẨM THƯỜNG MUA CÙNG */}
      {relatedProducts.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-title">SẢN PHẨM THƯỜNG MUA CÙNG</div>
          <div className="pd-related-grid">
            {relatedProducts.map(p => (
              <div
                key={p._id}
                className="pd-related-card"
                onClick={() => navigate(`/san-pham/${p._id}`)}
              >
                <img src={img_test} alt={p.name} />
                <p className="pd-related-name">{p.name}</p>
                <div className="pd-related-bottom">
                  <span className="pd-related-price">{fmt(p.price)}</span>
                  <button className="pd-related-btn">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SẢN PHẨM CÙNG PHÂN KHÚC GIÁ */}
      {samePriceProducts.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-title">SẢN PHẨM CÙNG PHÂN KHÚC GIÁ</div>
          <div className="pd-related-grid">
            {samePriceProducts.map(p => (
              <div
                key={p._id}
                className="pd-related-card"
                onClick={() => navigate(`/san-pham/${p._id}`)}
              >
                <img src={p.image || img_test} alt={p.name} />
                <p className="pd-related-name">{p.name}</p>
                <div className="pd-related-bottom">
                  <span className="pd-related-price">{fmt(p.price)}</span>
                  <button className="pd-related-btn">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SẢN PHẨM ĐÃ XEM */}
      {viewedProducts.length > 0 && (
        <div className="pd-related">
          <div className="pd-related-title">SẢN PHẨM ĐÃ XEM</div>
          <div className="pd-related-grid">
            {viewedProducts.map(p => (
              <div
                key={p._id}
                className="pd-related-card"
                onClick={() => navigate(`/san-pham/${p._id}`)}
              >
                <img src={p.image || img_test} alt={p.name} />
                <p className="pd-related-name">{p.name}</p>
                <div className="pd-related-bottom">
                  <span className="pd-related-price">{fmt(p.price)}</span>
                  <button className="pd-related-btn">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="pd-lightbox" onClick={() => setLightbox(false)}>
          <button className="pd-lightbox-close" onClick={() => setLightbox(false)}>✕</button>
          <button
            className="pd-lightbox-arrow pd-lightbox-arrow--prev"
            onClick={e => { e.stopPropagation(); setMainImg(i => (i - 1 + images.length) % images.length); }}
          >‹</button>
          <img
            src={images[mainImg]}
            alt={product.name}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="pd-lightbox-arrow pd-lightbox-arrow--next"
            onClick={e => { e.stopPropagation(); setMainImg(i => (i + 1) % images.length); }}
          >›</button>
          <div className="pd-lightbox-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`pd-lightbox-dot ${i === mainImg ? 'pd-lightbox-dot--active' : ''}`}
                onClick={e => { e.stopPropagation(); setMainImg(i); }}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
