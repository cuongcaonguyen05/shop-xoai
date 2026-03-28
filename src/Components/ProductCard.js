import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

// =====================================================
// COMPONENT: ProductCard
// Props:
//   image    — đường dẫn ảnh sản phẩm (string)
//   name     — tên sản phẩm (string)
//   price    — giá hiện tại (number)
//   oldPrice — giá gốc, không bắt buộc (number)
//   onAdd    — hàm gọi khi bấm nút thêm giỏ hàng
//   productId — ID của sản phẩm
// =====================================================
export default function ProductCard({ image, name, price, oldPrice, productId }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // Tính % giảm giá nếu có oldPrice
  const hasDiscount = oldPrice && oldPrice > price;
  const discount = hasDiscount ? Math.round((1 - price / oldPrice) * 100) : null;

  // Format số tiền → "10.000đ"
  const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="pcard" onClick={() => navigate(`/san-pham/${productId}`)} style={{ cursor: 'pointer' }}>

      {/* ẢNH SẢN PHẨM */}
      <div className="pcard__img-wrap">
        <img src={image} alt={name} className="pcard__img" />
      </div>

      {/* THÔNG TIN */}
      <div className="pcard__body">
        <h3 className="pcard__name">{name}</h3>

        {/* GIÁ */}
        <div className="pcard__price-row">
          <div>
            <span className="pcard__price">{fmt(price)}</span>
            {hasDiscount && (
              <div className="pcard__old-row">
                <s className="pcard__old-price">{fmt(oldPrice)}</s>
                <span className="pcard__discount">-{discount}%</span>
              </div>
            )}
          </div>
          <button
            className="pcard__btn"
            onClick={e => {
              e.stopPropagation();
              addToCart({ _id: productId, name, price, old_price: oldPrice || null, image });
            }}
          >+</button>
        </div>
      </div>

    </div>
  );
}