import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [cart, setCart]           = useState([]);
  const [activeCat, setActiveCat] = useState(searchParams.get('category') || null);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");

  // ── Đồng bộ activeCat theo URL query param ──
  useEffect(() => {
    setActiveCat(searchParams.get('category') || null);
  }, [searchParams]);

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

  // Tiêu đề section
  const activeCatLabel = filterCategories.find(c => c.value === activeCat)?.label;
  const sectionTitle   = activeCat ? activeCatLabel : "Sản phẩm nổi bật";

  return (
    <>
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
                  productId={p._id}
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
    </>
  );
}