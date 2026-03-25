import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./index.css";
import ProductCategory from "../Components/ProductCategory";
import ProductCard from "../Components/ProductCard";
import img_test_product_card from "../Resource/ProductCard/coquetdau.webp";

// ===== DỮ LIỆU TĨNH (posts, categories cho filter tabs & footer) =====
const filterCategories = [
  { label: "Dụng cụ ăn dặm", value: "chair",       icon: "🍼" },
  { label: "Nguyên liệu",     value: "organic_flour",icon: "🌾" },
  { label: "Dinh dưỡng",      value: "milk",         icon: "💊" },
  { label: "Đồ chơi",         value: "toys",         icon: "🧸" },
  { label: "Chăm sóc mẹ",     value: "postpartum",   icon: "🤱" },
];

const posts = [
  { title: "10 thực phẩm ăn dặm tốt nhất cho bé 6 tháng", date: "15/03/2025", emoji: "🥕" },
  { title: "Hướng dẫn ăn dặm kiểu Nhật đúng cách",        date: "10/03/2025", emoji: "🍱" },
  { title: "Cách chọn máy hút sữa phù hợp cho mẹ",        date: "05/03/2025", emoji: "🤱" },
];

const API_URL = 'http://localhost:5000/api/products';

// ===== COMPONENT CHÍNH =====
export default function HomePage() {
  const [cart, setCart]           = useState([]);
  const [activeCat, setActiveCat] = useState(null);   // null = tất cả
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [openNav, setOpenNav]     = useState(null); // ← thêm dòng này

  const navigate  = useNavigate();
  const location  = useLocation();

  // ── Fetch API mỗi khi activeCat thay đổi ──
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = activeCat
          ? `${API_URL}?category=${activeCat}`
          : API_URL;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Lỗi kết nối API');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCat]);

  // ── Filter search phía client ──
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (id) => {
    setCart(c => [...c, id]);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.location.href = '/';
    } else {
      navigate('/');
    }
  };

  // Tiêu đề section
  const activeCatLabel = filterCategories.find(c => c.value === activeCat)?.label;
  const sectionTitle   = activeCat ? activeCatLabel : "Sản phẩm nổi bật";

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
            <input
              placeholder="Tìm sản phẩm cho bé..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="action-btn">👤 Tài khoản</button>
            <button className="action-btn">📦 Đơn hàng</button>
            <button className="cart-btn">
              🛒 Giỏ hàng
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </button>
          </div>
        </div>

        <nav className="main-nav">
          {/* Trang chủ, Giới thiệu, Tin tức, Liên hệ — bình thường */}
          <Link to="/"           className="nav-link">Trang chủ</Link>
          <Link to="/gioi-thieu" className="nav-link">Giới thiệu</Link>

          {/* Sản phẩm — có dropdown */}
          <div
            className="nav-item-dropdown"
            onMouseEnter={() => setOpenNav('sanpham')}
            onMouseLeave={() => setOpenNav(null)}
          >
            <span className="nav-link">Sản phẩm ▾</span>

            {openNav === 'sanpham' && (
              <div className="nav-dropdown">
                {[
                  { label: 'Ghế ăn dặm',              value: 'chair' },
                  { label: 'Máy xay, nồi chảo',        value: 'pot_and_pan_grinder' },
                  { label: 'Đồ dùng bếp',              value: 'kitchen' },
                  { label: 'Dụng cụ ăn uống',          value: 'utensils' },
                  { label: 'Dành cho mẹ sau sinh',     value: 'postpartum' },
                  { label: 'Gia vị ăn dặm',            value: 'spice' },
                  { label: 'Thực phẩm ăn liền',        value: 'instant_food' },
                  { label: 'Các loại bột, hạt hữu cơ', value: 'organic_flour' },
                  { label: 'Nui, mì, bún',             value: 'noodles' },
                  { label: 'Sữa, men vi sinh, vitamin', value: 'milk' },
                  { label: 'Đồ chơi giáo dục',         value: 'toys' },
                ].map((cat) => (
                  <div
                    key={cat.value}
                    className="nav-dropdown-item"
                    onClick={() => {
                      setActiveCat(cat.label);  // cập nhật filter sidebar
                      setOpenNav(null);
                    }}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sản phẩm — có dropdown */}
          <div
            className="nav-item-dropdown"
            onMouseEnter={() => setOpenNav('tintuc')}
            onMouseLeave={() => setOpenNav(null)}
          >
            <span className="nav-link">Tin tức ▾</span>

            {openNav === 'tintuc' && (
              <div className="nav-dropdown">
                {[
                  { label: 'Thông tin hữu ích',               value: 'chair' },
                  { label: 'Công thức món ăn',                value: 'pot_and_pan_grinder' },
                ].map((cat) => (
                  <div
                    key={cat.value}
                    className="nav-dropdown-item"
                    onClick={() => {
                      setActiveCat(cat.label);  // cập nhật filter sidebar
                      setOpenNav(null);
                    }}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/lien-he" className="nav-link">Liên hệ</Link>
        </nav>
      </header>

      {/* BODY */}
      <div className="body-layout">

        {/* SIDEBAR — truyền value qua onSelect */}
        <ProductCategory
          active={activeCat}
          onSelect={(value) => setActiveCat(value)}
        />

        <main className="main-content">

          {/* FILTER TABS */}
          <div className="filter-row">
            <button
              className={`filter-tab ${activeCat === null ? "active" : ""}`}
              onClick={() => setActiveCat(null)}
            >
              Tất cả
            </button>
            {filterCategories.map((c, i) => (
              <button
                key={i}
                className={`filter-tab ${activeCat === c.value ? "active" : ""}`}
                onClick={() => setActiveCat(c.value)}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* SECTION HEADER */}
          <div className="section-header">
            <h2 className="section-title">🔥 {sectionTitle}</h2>
            <span className="product-count">
              {loading ? '...' : `${filteredProducts.length} sản phẩm`}
            </span>
          </div>

          {/* TRẠNG THÁI LOADING */}
          {loading && (
            <div className="empty-state">⏳ Đang tải sản phẩm...</div>
          )}

          {/* TRẠNG THÁI LỖI */}
          {!loading && error && (
            <div className="empty-state">❌ {error} — Kiểm tra server đang chạy chưa?</div>
          )}

          {/* KHÔNG CÓ SẢN PHẨM */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">😔 Không tìm thấy sản phẩm</div>
          )}

          {/* PRODUCT GRID */}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map(p => (
                <ProductCard
                  key={p._id}
                  image={p.image || img_test_product_card}
                  name={p.name}
                  price={p.price}
                  oldPrice={p.old_price}
                  onAdd={() => addToCart(p._id)}
                />
              ))}
            </div>
          )}

          {/* TIN TỨC */}
          <div className="section-header" style={{ marginTop: 48 }}>
            <h2 className="section-title">📰 Tin tức & Công thức</h2>
            <a href="#!" className="see-all">Xem tất cả →</a>
          </div>
          <div className="posts-grid">
            {posts.map((post, i) => (
              <div className="post-card" key={i}>
                <div className="post-emoji">{post.emoji}</div>
                <div className="post-body">
                  <p className="post-date">{post.date}</p>
                  <h4 className="post-title">{post.title}</h4>
                  <a href="#!" className="post-link">Đọc tiếp →</a>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

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

    </div>
  );
}