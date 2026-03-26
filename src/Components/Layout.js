import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import './Layout.css';
import iconShopee   from '../Resource/contact/shopee.png';
import iconMessenger from '../Resource/contact/messenger.png';
import iconZalo     from '../Resource/contact/zalo.png';
import iconTiktok   from '../Resource/contact/tiktok.png';

const filterCategories = [
  { label: "Dụng cụ ăn dặm", value: "chair",        icon: "🍼" },
  { label: "Nguyên liệu",     value: "organic_flour", icon: "🌾" },
  { label: "Dinh dưỡng",      value: "milk",          icon: "💊" },
  { label: "Đồ chơi",         value: "toys",          icon: "🧸" },
  { label: "Chăm sóc mẹ",     value: "postpartum",    icon: "🤱" },
];

export default function Layout() {
  const [openNav, setOpenNav] = useState(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === '/') window.location.href = '/';
    else navigate('/');
  };

  return (
    <div className="shop-root">

      {/* TOP BANNER */}
      <div className="top-banner">
        🎉 Miễn phí ship toàn quốc đơn từ <strong>300K</strong> &nbsp;|&nbsp; 🌿
        Cam kết hàng chính hãng 100% &nbsp;|&nbsp; 📞 Hotline: <strong>1800 6868</strong>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">👶</span>
            <span className="logo-text">Bé<em>Yêu</em>Shop</span>
          </div>

          <div className="search-box">
            <span>🔍</span>
            <input placeholder="Tìm sản phẩm cho bé..." />
          </div>

          <div className="header-actions">
            <button className="action-btn">👤 Tài khoản</button>
            <button className="action-btn">📦 Đơn hàng</button>
            <button className="cart-btn">🛒 Giỏ hàng</button>
          </div>
        </div>

        <nav className="main-nav">
          <span className="nav-link" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>Trang chủ</span>
          <Link to="/gioi-thieu" className="nav-link">Giới thiệu</Link>

          <div
            className="nav-item-dropdown"
            onMouseEnter={() => setOpenNav('sanpham')}
            onMouseLeave={() => setOpenNav(null)}
          >
            <span className="nav-link">Sản phẩm ▾</span>
            {openNav === 'sanpham' && (
              <div className="nav-dropdown">
                {[
                  { label: 'Ghế ăn dặm',               value: 'chair' },
                  { label: 'Máy xay, nồi chảo',         value: 'pot_and_pan_grinder' },
                  { label: 'Đồ dùng bếp',               value: 'kitchen' },
                  { label: 'Dụng cụ ăn uống',           value: 'utensils' },
                  { label: 'Dành cho mẹ sau sinh',      value: 'postpartum' },
                  { label: 'Gia vị ăn dặm',             value: 'spice' },
                  { label: 'Thực phẩm ăn liền',         value: 'instant_food' },
                  { label: 'Các loại bột, hạt hữu cơ',  value: 'organic_flour' },
                  { label: 'Nui, mì, bún',              value: 'noodles' },
                  { label: 'Sữa, men vi sinh, vitamin',  value: 'milk' },
                  { label: 'Đồ chơi giáo dục',          value: 'toys' },
                ].map(cat => (
                  <div
                    key={cat.value}
                    className="nav-dropdown-item"
                    onClick={() => { navigate(`/?category=${cat.value}`); setOpenNav(null); }}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="nav-item-dropdown"
            onMouseEnter={() => setOpenNav('tintuc')}
            onMouseLeave={() => setOpenNav(null)}
          >
            <span className="nav-link">Tin tức ▾</span>
            {openNav === 'tintuc' && (
              <div className="nav-dropdown">
                {[
                  { label: 'Thông tin hữu ích', value: 'info' },
                  { label: 'Công thức món ăn',  value: 'recipe' },
                ].map(cat => (
                  <div key={cat.value} className="nav-dropdown-item" onClick={() => setOpenNav(null)}>
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/lien-he" className="nav-link">Liên hệ</Link>
        </nav>
      </header>

      {/* NỘI DUNG TRANG */}
      <Outlet />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: 12 }}>
              <span className="logo-icon">👶</span>
              <span className="logo-text">Bé<em>Yêu</em>Shop</span>
            </div>
            <p>Chuyên cung cấp sản phẩm chất lượng cao cho mẹ và bé.</p>
          </div>
          <div className="footer-col">
            <h4>Danh mục</h4>
            {filterCategories.slice(0, 4).map((c, i) => (
              <a key={i} href="#!">{c.label}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            {["Chính sách đổi trả", "Hướng dẫn mua hàng", "Câu hỏi thường gặp", "Liên hệ"].map((t, i) => (
              <a key={i} href="#!">{t}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Liên hệ</h4>
            <p>📞 1800 6868</p>
            <p>✉️ hello@beyeushop.vn</p>
            <p>📍 TP. Biên Hoà, Đồng Nai</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 BeYêuShop — Mọi quyền được bảo lưu
        </div>
      </footer>

      {/* FLOATING SOCIAL BUTTONS */}
      <div className="float-social">
        {[
          { icon: iconShopee,    href: 'https://shopee.vn',       tooltip: 'Gian hàng Shopee',                   bg: '#ee4d2d' },
          { icon: iconMessenger, href: 'https://m.me',            tooltip: 'Chat với chúng tôi qua Messenger',   bg: '#0084ff' },
          { icon: iconZalo,      href: 'https://zalo.me',         tooltip: 'Chat với chúng tôi qua Zalo',        bg: '#0068ff' },
          { icon: iconTiktok,    href: 'https://tiktok.com',      tooltip: 'Trang TikTok của shop',              bg: '#000000' },
        ].map((item, i) => (
          <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
            className="float-btn" style={{ background: item.bg }}
          >
            <img src={item.icon} alt={item.tooltip} />
            <span className="float-tooltip">{item.tooltip}</span>
          </a>
        ))}
      </div>

    </div>
  );
}
