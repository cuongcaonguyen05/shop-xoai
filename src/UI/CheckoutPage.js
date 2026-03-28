import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './CheckoutPage.css';

function fmt(n) {
  return Number(n).toLocaleString('vi-VN') + 'đ';
}

const PAYMENT_METHODS = [
  { id: 'cod',      label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { id: 'bank',     label: 'Chuyển khoản ngân hàng',         icon: '🏧' },
  { id: 'momo',     label: 'Ví MoMo',                        icon: '💳' },
];

export default function CheckoutPage() {
  const { items, checked, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const selectedItems = items.filter(i => checked[i.productId]);
  const subtotal  = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal >= 300000 ? 0 : subtotal > 0 ? 30000 : 0;
  const total     = subtotal + shipping;

  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', note: '' });

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('shop_token');
    fetch('http://localhost:5000/api/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) return;
        const def = data.find(a => a.isDefault) || data[0];
        setForm(f => ({
          ...f,
          name:    def.name           || f.name,
          phone:   def.recipientPhone || f.phone,
          address: [def.address, def.ward, def.province].filter(Boolean).join(', '),
        }));
      })
      .catch(() => {});
  }, [user]);
  const [payment, setPayment]   = useState('cod');
  const [submitted, setSubmitted]   = useState(false);
  const [savedTotal, setSavedTotal]           = useState(0);
  const [order_id, setTrackingCode]       = useState('');
  const [error, setError]         = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())    { setError('Vui lòng nhập họ tên.'); return; }
    if (!/^(0|\+84)\d{9,10}$/.test(form.phone.trim()))
      { setError('Số điện thoại không hợp lệ.'); return; }
    if (!form.address.trim()) { setError('Vui lòng nhập địa chỉ giao hàng.'); return; }
    if (selectedItems.length === 0) { setError('Không có sản phẩm nào được chọn.'); return; }
    setError('');

    const token = localStorage.getItem('shop_token');
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          recipientPhone: form.phone,
          address: form.address,
          note: form.note,
          payment,
          items: selectedItems,
          subtotal, shipping, total,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Có lỗi khi đặt hàng.');
        return;
      }
      setTrackingCode(data.order_id || '');
    } catch {
      setError('Không thể kết nối server.');
      return;
    }
    setSavedTotal(total);
    selectedItems.forEach(i => removeItem(i.productId));
    setSubmitted(true);
  };

  if (selectedItems.length === 0 && !submitted) {
    return (
      <div className="co-empty">
        <div className="co-empty-icon">📋</div>
        <h2>Không có sản phẩm nào được chọn</h2>
        <p>Hãy chọn sản phẩm trong giỏ hàng trước khi đặt hàng.</p>
        <button onClick={() => navigate('/gio-hang')}>← Quay lại giỏ hàng</button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="co-success">
        <div className="co-success-icon">🎉</div>
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ để xác nhận đơn hàng của bạn sớm nhất!</p>
        <div className="co-success-info">
          <div><strong>Người nhận:</strong> {form.name}</div>
          <div><strong>Điện thoại:</strong> {form.phone}</div>
          <div><strong>Địa chỉ:</strong> {form.address}</div>
          <div><strong>Thanh toán:</strong> {PAYMENT_METHODS.find(p => p.id === payment)?.label}</div>
          <div><strong>Mã vận đơn:</strong> #{order_id}</div>
          <div><strong>Tổng tiền:</strong> {fmt(savedTotal)}</div>
        </div>
        <div className="co-success-actions">
          <button className="co-btn-primary" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
          <button className="co-btn-outline" onClick={() => navigate('/gio-hang')}>Xem giỏ hàng</button>
        </div>
      </div>
    );
  }

  return (
    <div className="co-root">
      <div className="co-inner">
        <h1 className="co-title">Tiến hành đặt hàng</h1>

        <div className="co-layout">
          {/* LEFT — FORM */}
          <form className="co-form" onSubmit={handleSubmit}>

            {/* THÔNG TIN GIAO HÀNG */}
            <div className="co-section">
              <h2 className="co-section-title">📍 Thông tin giao hàng</h2>

              <div className="co-field">
                <label>Họ và tên <span className="co-required">*</span></label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>

              <div className="co-field">
                <label>Số điện thoại <span className="co-required">*</span></label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                />
              </div>

              <div className="co-field">
                <label>Địa chỉ giao hàng <span className="co-required">*</span></label>
                <input
                  type="text"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  value={form.address}
                  onChange={set('address')}
                />
              </div>

              <div className="co-field">
                <label>Ghi chú đơn hàng</label>
                <textarea
                  placeholder="Ghi chú cho người giao hàng (không bắt buộc)..."
                  value={form.note}
                  onChange={set('note')}
                  rows={3}
                />
              </div>
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div className="co-section">
              <h2 className="co-section-title">💳 Phương thức thanh toán</h2>
              <div className="co-payment-list">
                {PAYMENT_METHODS.map(m => (
                  <label key={m.id} className={`co-payment-item ${payment === m.id ? 'co-payment-item--active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={payment === m.id}
                      onChange={() => setPayment(m.id)}
                    />
                    <span className="co-payment-icon">{m.icon}</span>
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>

              {payment === 'bank' && (
                <div className="co-bank-info">
                  <p><strong>Ngân hàng:</strong> Vietcombank</p>
                  <p><strong>Số tài khoản:</strong> 1234567890</p>
                  <p><strong>Chủ tài khoản:</strong> NGUYEN THI THUY</p>
                  <p><strong>Nội dung CK:</strong> [SĐT] + Đặt hàng</p>
                </div>
              )}
            </div>

            {error && <div className="co-error">⚠️ {error}</div>}

            <button type="submit" className="co-submit-btn">
              Xác nhận đặt hàng →
            </button>

            <button type="button" className="co-back-btn" onClick={() => navigate('/gio-hang')}>
              ← Quay lại giỏ hàng
            </button>
          </form>

          {/* RIGHT — TÓM TẮT ĐƠN */}
          <div className="co-summary">
            <h2 className="co-section-title">🛒 Sản phẩm đặt hàng</h2>

            <div className="co-item-list">
              {selectedItems.map(item => {
                const hasDiscount = item.old_price && item.old_price > item.price;
                const discount = hasDiscount ? Math.round((1 - item.price / item.old_price) * 100) : null;
                return (
                  <div key={item.productId} className="co-item">
                    <div className="co-item-img-wrap">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="co-item-img" />
                        : <div className="co-item-img co-item-img--empty">📦</div>
                      }
                      <span className="co-item-qty-badge">{item.qty}</span>
                    </div>
                    <div className="co-item-info">
                      <span className="co-item-name">{item.name}</span>
                      {hasDiscount && <span className="co-item-discount">-{discount}%</span>}
                    </div>
                    <span className="co-item-price">{fmt(item.price * item.qty)}</span>
                  </div>
                );
              })}
            </div>

            <div className="co-summary-divider" />

            <div className="co-summary-row">
              <span>Tạm tính</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="co-summary-row">
              <span>Phí vận chuyển</span>
              <span className={shipping === 0 ? 'co-free-ship' : ''}>
                {shipping === 0 ? 'Miễn phí' : fmt(shipping)}
              </span>
            </div>

            {subtotal > 0 && subtotal < 300000 && (
              <div className="co-ship-notice">
                Mua thêm <strong>{fmt(300000 - subtotal)}</strong> để được miễn phí ship 🚚
              </div>
            )}

            <div className="co-summary-divider" />

            <div className="co-summary-total">
              <span>Tổng cộng</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
