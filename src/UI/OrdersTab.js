import { useState } from 'react';

const PAYMENT_LABEL = { cod: 'Thanh toán khi nhận hàng', bank: 'Chuyển khoản ngân hàng', momo: 'Ví MoMo' };
const STATUS_COLOR  = { 'Đang xử lý': '#f59e0b', 'Đang giao': '#3b82f6', 'Đã giao': '#10b981', 'Đã huỷ': '#ef4444' };

function fmt(n) { return Number(n).toLocaleString('vi-VN') + 'đ'; }
function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

export default function OrdersTab() {
  const [orders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shop_orders') || '[]'); }
    catch { return []; }
  });
  const [expanded, setExpanded] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="acc-tab-content">
        <div className="acc-tab-header"><h3>Đơn hàng của tôi</h3></div>
        <div className="acc-empty">Bạn chưa có đơn hàng nào.</div>
      </div>
    );
  }

  return (
    <div className="acc-tab-content">
      <div className="acc-tab-header"><h3>Đơn hàng của tôi ({orders.length})</h3></div>
      <div className="acc-order-list">
        {orders.map(order => {
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} className="acc-order-card">
              {/* HEADER */}
              <div className="acc-order-header" onClick={() => setExpanded(isOpen ? null : order.id)}>
                <div className="acc-order-meta">
                  <span className="acc-order-id">#{String(order.id).slice(-6)}</span>
                  <span className="acc-order-date">{fmtDate(order.date)}</span>
                </div>
                <div className="acc-order-right">
                  <span className="acc-order-status" style={{ color: STATUS_COLOR[order.status] || '#6b7280' }}>
                    ● {order.status}
                  </span>
                  <span className="acc-order-total">{fmt(order.total)}</span>
                  <span className="acc-order-chevron">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* CHI TIẾT */}
              {isOpen && (
                <div className="acc-order-detail">
                  <div className="acc-order-section">
                    <span className="acc-order-label">Giao đến:</span>
                    <span>{order.name} · {order.phone} · {order.address}</span>
                  </div>
                  {order.note && (
                    <div className="acc-order-section">
                      <span className="acc-order-label">Ghi chú:</span>
                      <span>{order.note}</span>
                    </div>
                  )}
                  <div className="acc-order-section">
                    <span className="acc-order-label">Thanh toán:</span>
                    <span>{PAYMENT_LABEL[order.payment] || order.payment}</span>
                  </div>

                  <div className="acc-order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="acc-order-item">
                        {item.image
                          ? <img src={item.image} alt={item.name} className="acc-order-img" />
                          : <div className="acc-order-img acc-order-img--empty">📦</div>
                        }
                        <div className="acc-order-item-info">
                          <span className="acc-order-item-name">{item.name}</span>
                          <span className="acc-order-item-qty">x{item.qty}</span>
                        </div>
                        <span className="acc-order-item-price">{fmt(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="acc-order-summary">
                    <div className="acc-order-sum-row"><span>Tạm tính</span><span>{fmt(order.subtotal)}</span></div>
                    <div className="acc-order-sum-row"><span>Phí ship</span><span>{order.shipping === 0 ? 'Miễn phí' : fmt(order.shipping)}</span></div>
                    <div className="acc-order-sum-row acc-order-sum-total"><span>Tổng cộng</span><span>{fmt(order.total)}</span></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
