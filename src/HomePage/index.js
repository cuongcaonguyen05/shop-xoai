import { useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./index.css";
import ProductCategory from "../Components/ProductCategory";
import ProductCard from "../Components/ProductCard";
import img_test_product_card from "../Resource/ProductCard/coquetdau.webp";

// ===== DỮ LIỆU MẪU =====
const categories = [
  {
    label: "Dụng cụ ăn dặm",
    icon: "🍼",
    sub: ["Ghế ăn dặm", "Máy xay nghiền", "Đồ dùng bếp", "Dụng cụ ăn uống"],
  },
  {
    label: "Nguyên liệu",
    icon: "🌾",
    sub: [
      "Gia vị ăn dặm",
      "Thực phẩm ăn liền",
      "Bột, hạt hữu cơ",
      "Nui, mì, bún",
    ],
  },
  {
    label: "Dinh dưỡng & Sức khoẻ",
    icon: "💊",
    sub: ["Sữa công thức", "Men vi sinh", "Vitamin & khoáng chất"],
  },
  {
    label: "Đồ chơi giáo dục",
    icon: "🧸",
    sub: ["Đồ chơi 0–1 tuổi", "Đồ chơi 1–3 tuổi", "Đồ chơi 3–6 tuổi"],
  },
  {
    label: "Quần áo & Phụ kiện",
    icon: "👶",
    sub: ["Quần áo sơ sinh", "Tã, bỉm", "Phụ kiện bé"],
  },
  {
    label: "Chăm sóc mẹ sau sinh",
    icon: "🤱",
    sub: ["Máy hút sữa", "Dụng cụ vệ sinh", "Dinh dưỡng cho mẹ"],
  },
  { label: "Khuyến mãi hot", icon: "🔥", sub: [] },
];

const featuredProducts = [
  {
    id: 1,
    name: "Ghế ăn dặm đa năng Stokke",
    price: 1850000,
    oldPrice: 2200000,
    rating: 4.9,
    reviews: 128,
    tag: "Bán chạy",
    emoji: "🪑",
    cat: "Dụng cụ ăn dặm",
  },
  {
    id: 2,
    name: "Máy xay nghiền đa năng Beaba",
    price: 990000,
    oldPrice: 1200000,
    rating: 4.8,
    reviews: 95,
    tag: "Mới về",
    emoji: "🫙",
    cat: "Dụng cụ ăn dặm",
  },
  {
    id: 3,
    name: "Bột gạo hữu cơ Ecomama 200g",
    price: 85000,
    oldPrice: null,
    rating: 4.7,
    reviews: 210,
    tag: "Yêu thích",
    emoji: "🌾",
    cat: "Nguyên liệu",
  },
  {
    id: 4,
    name: "Men vi sinh Biogaia nhỏ giọt",
    price: 320000,
    oldPrice: 380000,
    rating: 5.0,
    reviews: 304,
    tag: "Hot",
    emoji: "💊",
    cat: "Dinh dưỡng & Sức khoẻ",
  },
  {
    id: 5,
    name: "Bộ khay ăn dặm silicon BLW",
    price: 145000,
    oldPrice: null,
    rating: 4.6,
    reviews: 77,
    tag: null,
    emoji: "🍽️",
    cat: "Dụng cụ ăn dặm",
  },
  {
    id: 6,
    name: "Nui hữu cơ hình thú Organic",
    price: 65000,
    oldPrice: 78000,
    rating: 4.8,
    reviews: 189,
    tag: "Sale",
    emoji: "🍝",
    cat: "Nguyên liệu",
  },
  {
    id: 7,
    name: "Đồ chơi xếp hình gỗ Montessori",
    price: 235000,
    oldPrice: null,
    rating: 4.9,
    reviews: 56,
    tag: "Mới",
    emoji: "🧩",
    cat: "Đồ chơi giáo dục",
  },
  {
    id: 8,
    name: "Máy hút sữa điện đôi Spectra S1",
    price: 3200000,
    oldPrice: 3800000,
    rating: 4.9,
    reviews: 412,
    tag: "Best seller",
    emoji: "🤱",
    cat: "Chăm sóc mẹ sau sinh",
  },
];

const posts = [
  {
    title: "10 thực phẩm ăn dặm tốt nhất cho bé 6 tháng",
    date: "15/03/2025",
    emoji: "🥕",
  },
  {
    title: "Hướng dẫn ăn dặm kiểu Nhật đúng cách",
    date: "10/03/2025",
    emoji: "🍱",
  },
  {
    title: "Cách chọn máy hút sữa phù hợp cho mẹ",
    date: "05/03/2025",
    emoji: "🤱",
  },
];

// ===== COMPONENT CON: SAO ĐÁNH GIÁ =====
// function StarRating({ rating }) {
//   return (
//     <div className="stars">
//       {[1,2,3,4,5].map(i => (
//         <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
//       ))}
//       <span className="rating-num">{rating}</span>
//     </div>
//   );
// }

// ===== COMPONENT CHÍNH =====
export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [activeCat, setActiveCat] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const addToCart = (id) => {
    setCart((c) => [...c, id]);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      // Nếu đang ở trang chủ, reload page
      window.location.href = '/';
    } else {
      // Nếu ở trang khác, navigate về trang chủ
      navigate('/');
    }
  };

  const filteredProducts = featuredProducts.filter((p) => {
    const matchCat = activeCat === "Tất cả" || p.cat === activeCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="shop-root">
      {/* TOP BANNER */}
      <div className="top-banner">
        🎉 Miễn phí ship toàn quốc đơn từ <strong>300K</strong> &nbsp;|&nbsp; 🌿
        Cam kết hàng chính hãng 100% &nbsp;|&nbsp; 📞 Hotline:{" "}
        <strong>1800 6868</strong>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">👶</span>
            <span className="logo-text">
              Bé<em>Yêu</em>Shop
            </span>
          </div>

          <div className="search-box">
            <span>🔍</span>
            <input
              placeholder="Tìm sản phẩm cho bé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <button className="action-btn">👤 Tài khoản</button>
            <button className="action-btn">📦 Đơn hàng</button>
            <button className="cart-btn">
              🛒 Giỏ hàng
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </button>
          </div>
        </div>

        <nav className="main-nav">
          <a href="#!" onClick={handleHomeClick} className="nav-link">Trang chủ</a>
          <Link to="/gioi-thieu"  className="nav-link">Giới thiệu</Link>
          <Link to="/san-pham"    className="nav-link">Sản phẩm</Link>
          <Link to="/tin-tuc"     className="nav-link">Tin tức</Link>
          <Link to="/lien-he"     className="nav-link">Liên hệ</Link>
        </nav>
      </header>

      {/* BODY: SIDEBAR + NỘI DUNG CHÍNH */}
      <div className="body-layout">
        {/* ← ProductCategory tự quản lý openCat bên trong, không cần truyền */}
        <ProductCategory active={activeCat} onSelect={setActiveCat} />
        <main className="main-content">
          {/* FILTER TABS */}
          <div className="filter-row">
            <button
              className={`filter-tab ${activeCat === "Tất cả" ? "active" : ""}`}
              onClick={() => setActiveCat("Tất cả")}
            >
              Tất cả
            </button>
            {categories.slice(0, 5).map((c, i) => (
              <button
                key={i}
                className={`filter-tab ${activeCat === c.label ? "active" : ""}`}
                onClick={() => setActiveCat(c.label)}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          <div className="section-header">
            <h2 className="section-title">
              🔥 {activeCat === "Tất cả" ? "Sản phẩm nổi bật" : activeCat}
            </h2>
            <span className="product-count">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">😔 Không tìm thấy sản phẩm</div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  image={img_test_product_card}
                  name={p.name}
                  price={p.price}
                  oldPrice={p.oldPrice}
                  onAdd={() => console.log("Thêm:", p.name)}
                />
              ))}
            </div>
          )}

          {/* TIN TỨC */}
          <div className="section-header" style={{ marginTop: 48 }}>
            <h2 className="section-title">📰 Tin tức & Công thức</h2>
            <a href="#!" className="see-all">
              Xem tất cả →
            </a>
          </div>
          <div className="posts-grid">
            {posts.map((post, i) => (
              <div className="post-card" key={i}>
                <div className="post-emoji">{post.emoji}</div>
                <div className="post-body">
                  <p className="post-date">{post.date}</p>
                  <h4 className="post-title">{post.title}</h4>
                  <a href="#!" className="post-link">
                    Đọc tiếp →
                  </a>
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
              <span className="logo-text">
                Bé<em>Yêu</em>Shop
              </span>
            </div>
            <p>Chuyên cung cấp sản phẩm chất lượng cao cho mẹ và bé.</p>
          </div>
          <div className="footer-col">
            <h4>Danh mục</h4>
            {categories.slice(0, 4).map((c, i) => (
              <a key={i} href="#!">
                {c.label}
              </a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            {[
              "Chính sách đổi trả",
              "Hướng dẫn mua hàng",
              "Câu hỏi thường gặp",
              "Liên hệ",
            ].map((t, i) => (
              <a key={i} href="#!">
                {t}
              </a>
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
