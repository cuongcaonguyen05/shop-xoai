import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="contact-root">

      {/* BREADCRUMB */}
      <div className="contact-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>›</span>
        <span>Liên hệ</span>
      </div>

      <div className="contact-layout">

        {/* CỘT TRÁI */}
        <div className="contact-left">

          {/* THÔNG TIN */}
          <div className="contact-info-box">
            <div className="contact-logo">
              <span>👶</span>
              <span className="contact-logo-text">Bé<em>Yêu</em>Shop</span>
            </div>
            <p className="contact-tagline">Chuyên cung cấp sản phẩm chất lượng cho mẹ và bé</p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="contact-info-icon">📍</span>
                <span>Địa chỉ: TP. Biên Hoà, Đồng Nai</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">📞</span>
                <span>Hotline: <strong>1800 6868</strong> (Miễn phí)</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">✉️</span>
                <span>Email: hello@beyeushop.vn</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">🕐</span>
                <span>Giờ làm việc: 8:00 – 21:00, Thứ 2 – Chủ nhật</span>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="contact-form-box">
            <h2 className="contact-form-title">💬 Liên hệ với chúng tôi</h2>
            <p className="contact-form-sub">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-row">
                <div className="contact-field">
                  <input
                    placeholder="Họ và tên *"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="contact-field">
                  <input
                    placeholder="Email *"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <input
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div className="contact-field">
                <textarea
                  placeholder="Nội dung tin nhắn *"
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" className={`contact-submit ${sent ? 'contact-submit--sent' : ''}`}>
                {sent ? '✓ Đã gửi thành công!' : '🚀 Gửi tin nhắn'}
              </button>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI — BẢN ĐỒ */}
        <div className="contact-right">
          <div className="contact-map-wrap">
            <iframe
              title="BeYêuShop location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.610123046289!2d106.82749167480615!3d10.84177758929613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d863867b4e73%3A0x3e17b8e6c5a56220!2zVGjDoG5oIHBo4buRIEJpw6puIEhvw6AsIMSQ4buTbmcgTmFp!5e0!3m2!1svi!2svn!4v1700000000000"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* KÊNH LIÊN HỆ NHANH */}
          <div className="contact-channels">
            <h3>Kênh liên hệ nhanh</h3>
            <div className="contact-channel-list">
              {[
                { icon: '💬', label: 'Zalo', value: '1800 6868', color: '#0068FF' },
                { icon: '📘', label: 'Facebook', value: 'BeYêuShop Official', color: '#1877F2' },
                { icon: '📸', label: 'Instagram', value: '@beyeushop.vn', color: '#E4405F' },
                { icon: '🎵', label: 'TikTok', value: '@beyeushop', color: '#000000' },
              ].map((c, i) => (
                <div className="contact-channel-item" key={i}>
                  <span className="contact-channel-icon" style={{ background: c.color }}>{c.icon}</span>
                  <div>
                    <div className="contact-channel-label">{c.label}</div>
                    <div className="contact-channel-value">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
