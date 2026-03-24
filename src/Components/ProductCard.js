import './ProductCard.css';

// =====================================================
// COMPONENT: ProductCard
// Props:
//   image    — đường dẫn ảnh sản phẩm (string)
//   name     — tên sản phẩm (string)
//   price    — giá hiện tại (number)
//   oldPrice — giá gốc, không bắt buộc (number)
//   onAdd    — hàm gọi khi bấm nút thêm giỏ hàng
// =====================================================
export default function ProductCard({ image, name, price, oldPrice, onAdd }) {

  // Tính % giảm giá nếu có oldPrice
  const discount = oldPrice
    ? Math.round((1 - price / oldPrice) * 100)
    : null;

  // Format số tiền → "10.000đ"
  const fmt = (n) => n.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="pcard">

      {/* ẢNH SẢN PHẨM */}
      <div className="pcard__img-wrap">
        <img src={image} alt={name} className="pcard__img" />
      </div>

      {/* THÔNG TIN */}
      <div className="pcard__body">
        <h3 className="pcard__name">{name}</h3>

        {/* GIÁ */}
        <div className="pcard__price-row">
          <span className="pcard__price">{fmt(price)}</span>
          <button className="pcard__btn" onClick={onAdd}>+</button>
        </div>

        {/* GIÁ GỐC + % GIẢM — chỉ hiện khi có oldPrice */}
        {oldPrice && (
          <div className="pcard__old-row">
            <s className="pcard__old-price">{fmt(oldPrice)}</s>
            <span className="pcard__discount">-{discount}%</span>
          </div>
        )}
      </div>

    </div>
  );
}