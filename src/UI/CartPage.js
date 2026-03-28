import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

function fmt(n) {
  return Number(n).toLocaleString('vi-VN') + 'đ';
}

export default function CartPage() {
  const { items, updateQty, removeItem, checked, toggleChecked, setAllChecked } = useCart();
  const navigate = useNavigate();

  const allChecked = items.length > 0 && items.every(i => checked[i.productId]);
  const toggleAll  = () => setAllChecked(!allChecked);

  const selectedItems = items.filter(i => checked[i.productId]);
  const selectedQty   = selectedItems.reduce((s, i) => s + i.qty, 0);
  const selectedPrice = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping      = selectedPrice >= 300000 ? 0 : selectedPrice > 0 ? 30000 : 0;

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <button className="cart-empty-btn" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
      </div>
    );
  }

  return (
    <div className="cart-root">
      <div className="cart-inner">
        <h1 className="cart-title">🛒 Giỏ hàng của bạn</h1>

        <div className="cart-layout">
          {/* DANH SÁCH SẢN PHẨM */}
          <div className="cart-list">
            <div className="cart-list-header">
              <span className="cart-col-check">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="cart-checkbox" />
              </span>
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
              <span></span>
            </div>

            {items.map(item => {
              const hasDiscount = item.old_price && item.old_price > item.price;
              const discount = hasDiscount
                ? Math.round((1 - item.price / item.old_price) * 100)
                : null;
              const isChecked = !!checked[item.productId];
              return (
                <div key={item.productId} className={`cart-item ${!isChecked ? 'cart-item--unchecked' : ''}`}>
                  <div className="cart-col-check">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecked(item.productId)}
                      className="cart-checkbox"
                    />
                  </div>

                  <div className="cart-item-product" onClick={() => navigate(`/san-pham/${item.productId}`)}>
                    {item.image
                      ? <img src={item.image} alt={item.name} className="cart-item-img" />
                      : <div className="cart-item-img cart-item-img--empty">📦</div>
                    }
                    <div className="cart-item-name-wrap">
                      <span className="cart-item-name">{item.name}</span>
                      {hasDiscount && <span className="cart-item-badge">-{discount}%</span>}
                    </div>
                  </div>

                  <div className="cart-item-price">
                    <span className="cart-item-price-current">{fmt(item.price)}</span>
                    {hasDiscount && <s className="cart-item-price-old">{fmt(item.old_price)}</s>}
                  </div>

                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)}>+</button>
                  </div>

                  <div className="cart-item-subtotal">
                    {fmt(item.price * item.qty)}
                  </div>

                  <button className="cart-item-remove" onClick={() => removeItem(item.productId)} title="Xóa">✕</button>
                </div>
              );
            })}

            <div className="cart-continue">
              <button onClick={() => navigate('/')}>← Tiếp tục mua sắm</button>
            </div>
          </div>

          {/* TỔNG ĐƠN HÀNG */}
          <div className="cart-summary">
            <h2 className="cart-summary-title">Tóm tắt đơn hàng</h2>

            <div className="cart-summary-row">
              <span>Đã chọn ({selectedQty} sản phẩm)</span>
              <span>{fmt(selectedPrice)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Phí vận chuyển</span>
              <span className={shipping === 0 && selectedPrice > 0 ? 'cart-free-ship' : ''}>
                {selectedPrice === 0 ? '—' : shipping === 0 ? 'Miễn phí' : fmt(shipping)}
              </span>
            </div>

            {selectedPrice > 0 && selectedPrice < 300000 && (
              <div className="cart-ship-notice">
                Mua thêm <strong>{fmt(300000 - selectedPrice)}</strong> để được miễn phí ship 🚚
              </div>
            )}

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Tổng cộng</span>
              <span>{fmt(selectedPrice + shipping)}</span>
            </div>

            <button className="cart-checkout-btn" disabled={selectedQty === 0} onClick={() => navigate('/dat-hang')}>
              Tiến hành đặt hàng →
            </button>

            <div className="cart-payment-icons">
              <span>💳</span><span>🏧</span><span>💵</span>
              <span className="cart-payment-text">Thanh toán an toàn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
