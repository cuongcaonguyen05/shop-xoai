import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';
import logoImg      from '../Resource/logo/logo.jpg';
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

const API = 'http://localhost:5000/api';

export default function Layout() {
  const [openNav, setOpenNav] = useState(null);
  const [searchQ, setSearchQ]           = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen]     = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setLoginOpen, logout } = useAuth();

  useEffect(() => {
    if (!searchQ.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/products?search=${encodeURIComponent(searchQ.trim())}`);
        const data = await res.json();
        setSearchResults(data.slice(0, 8));
        setSearchOpen(data.length >= 0);
      } catch { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQ]);

  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchSelect = (product) => {
    setSearchOpen(false);
    setSearchQ('');
    navigate(`/?search=${encodeURIComponent(product.name)}&category=${product.category || ''}`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQ.trim()) {
      setSearchOpen(false);
      navigate(`/?search=${encodeURIComponent(searchQ.trim())}`);
    }
  };

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
          <div className="logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
            <img src={logoImg} alt="Shop mẹ Thủy" className="logo-img" />
            <span className="logo-text">Shop mẹ <em>Thủy</em></span>
          </div>

          <div className="search-box" ref={searchRef}>
            <span>🔍</span>
            <input
              placeholder="Tìm sản phẩm cho bé..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            />
            {searchOpen && (
              <div className="search-dropdown">
                {searchResults.length > 0 ? searchResults.map(p => (
                  <div key={p._id} className="search-dropdown-item" onMouseDown={() => handleSearchSelect(p)}>
                    {p.image && <img src={p.image} alt={p.name} className="search-dropdown-img" />}
                    <div className="search-dropdown-info">
                      <span className="search-dropdown-name">{p.name}</span>
                      <span className="search-dropdown-price">{Number(p.price).toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                )) : (
                  <div className="search-dropdown-empty">Không tìm thấy sản phẩm nào</div>
                )}
              </div>
            )}
          </div>

          <div className="header-actions">
            {user ? (
              <div className="user-menu-wrap">
                <div className="user-info" onClick={() => setOpenNav(openNav === 'user' ? null : 'user')}>
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="user-avatar" />
                    : <div className="user-avatar user-avatar-fallback">{user.name[0].toUpperCase()}</div>
                  }
                  <span className="user-name">{user.name.split(' ').slice(-1)[0]}</span>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>▾</span>
                </div>
                {openNav === 'user' && (
                  <div className="user-dropdown" onMouseLeave={() => setOpenNav(null)}>
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-name">{user.name}</div>
                      <div className="user-dropdown-email">{user.email}</div>
                    </div>
                    {user.role === 'admin'
                      ? <div className="user-dropdown-item" onClick={() => { navigate('/admin'); setOpenNav(null); }}>🏪 Quản lí cửa hàng</div>
                      : <div className="user-dropdown-item" onClick={() => setOpenNav(null)}>📦 Đơn hàng của tôi</div>
                    }
                    <div className="user-dropdown-item" onClick={() => { logout(); setOpenNav(null); }}>🚪 Đăng xuất</div>
                  </div>
                )}
              </div>
            ) : (
              <button className="action-btn login-btn" onClick={() => setLoginOpen(true)}>
                👤 Đăng nhập
              </button>
            )}
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
                  <div key={cat.value} className="nav-dropdown-item"
                    onClick={() => { navigate(`/?news=${cat.value}`); setOpenNav(null); }}>
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
              <span className="logo-text">Shop mẹ <em>Thủy</em></span>
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
            <p>📞 0352332840</p>
            <p>✉️ shopandammethuy@gmail.com</p>
            <p>📍 Xã Đô Lương, Tỉnh Nghệ An</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2025 ShopMeThuy — Mọi quyền được bảo lưu
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
