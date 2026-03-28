import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./index.css";
import ProductCategory from "../Components/ProductCategory";
import ProductCard from "../Components/ProductCard";
import img_test_product_card from "../Resource/ProductCard/coquetdau.webp";

const filterCategories = [
  { label: "Dụng cụ ăn dặm", value: "chair",       icon: "🍼" },
  { label: "Nguyên liệu",     value: "organic_flour",icon: "🌾" },
  { label: "Dinh dưỡng",      value: "milk",         icon: "💊" },
  { label: "Đồ chơi",         value: "toys",         icon: "🧸" },
  { label: "Chăm sóc mẹ",     value: "postpartum",   icon: "🤱" },
];

const NEWS_CATS = {
  info:   { label: 'Thông tin hữu ích', icon: '📋' },
  recipe: { label: 'Công thức món ăn',  icon: '🍳' },
};

const API_URL      = 'http://localhost:5000/api/products';
const NEWS_API_URL = 'http://localhost:5000/api/news';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── Product state ──
  const [cart, setCart]     = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");

  // ── News state ──
  const [newsList, setNewsList]               = useState([]);
  const [newsLoading, setNewsLoading]         = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Đọc thẳng từ URL — luôn đồng bộ, không lag
  const activeCat  = searchParams.get('category') || null;
  const newsParam  = searchParams.get('news') || null;
  const searchQ    = searchParams.get('search') || null;

  // Đóng bài đang đọc khi đổi tab
  useEffect(() => { setSelectedArticle(null); }, [newsParam]);

  // ── Fetch products ──
  useEffect(() => {
    if (newsParam) return;
    const fetchProducts = async () => {
      setLoading(true); setError(null);
      try {
        let url = activeCat ? `${API_URL}?category=${activeCat}` : API_URL;
        if (searchQ) url = `${API_URL}?search=${encodeURIComponent(searchQ)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Lỗi kết nối API');
        setProducts(await res.json());
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [activeCat, newsParam, searchQ]);

  // ── Fetch news khi có newsParam ──
  useEffect(() => {
    if (!newsParam) return;
    setNewsLoading(true);
    fetch(`${NEWS_API_URL}?category=${newsParam}`)
      .then(r => r.json())
      .then(data => setNewsList(Array.isArray(data) ? data : []))
      .catch(() => setNewsList([]))
      .finally(() => setNewsLoading(false));
  }, [newsParam]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (id) => setCart(c => [...c, id]);

  const activeCatLabel = filterCategories.find(c => c.value === activeCat)?.label;
  const sectionTitle   = searchQ ? `Kết quả tìm kiếm: "${searchQ}"` : activeCat ? activeCatLabel : "Sản phẩm nổi bật";

  return (
    <>
      <div className="body-layout">

        {/* SIDEBAR */}
        <ProductCategory
          active={activeCat}
          onSelect={(value) => navigate(value ? `/?category=${value}` : '/')}
        />

        <main className="main-content">

          {/* ══════ CHẾ ĐỘ TIN TỨC ══════ */}
          {newsParam ? (
            <>
              {selectedArticle ? (
                /* ── CHI TIẾT BÀI VIẾT ── */
                <div className="news-article-wrap">
                  <button className="news-back-btn" onClick={() => setSelectedArticle(null)}>
                    ← Quay lại danh sách
                  </button>
                  <div className="news-article">
                    <div className="news-article-meta">
                      <span className={`news-cat-tag news-cat-${selectedArticle.category}`}>
                        {NEWS_CATS[selectedArticle.category]?.icon} {NEWS_CATS[selectedArticle.category]?.label}
                      </span>
                      <span className="news-article-date">📅 {fmtDate(selectedArticle.createdAt)}</span>
                    </div>
                    <h1 className="news-article-title">{selectedArticle.title}</h1>
                    <div className="news-article-author">✍️ {selectedArticle.author || 'Shop mẹ Thủy'}</div>
                    <div className="news-article-content">
                      {selectedArticle.content
                        ? selectedArticle.content.split('\n').map((line, i) =>
                            line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
                          )
                        : <p className="news-no-content">Bài viết đang được cập nhật...</p>
                      }
                    </div>

                    {/* Bình luận */}
                    <div className="news-comments-section">
                      <h3 className="news-comments-heading">
                        💬 Bình luận ({selectedArticle.comments?.length || 0})
                      </h3>
                      {!selectedArticle.comments?.length ? (
                        <p className="news-no-comment">Chưa có bình luận nào.</p>
                      ) : (
                        <div className="news-comment-list">
                          {selectedArticle.comments.map(c => (
                            <div key={c._id} className="news-comment-item">
                              <div className="news-comment-avatar">
                                {(c.author || 'A')[0].toUpperCase()}
                              </div>
                              <div className="news-comment-body">
                                <div className="news-comment-header">
                                  <strong>{c.author || 'Ẩn danh'}</strong>
                                  <span>{fmtDate(c.createdAt)}</span>
                                </div>
                                <p>{c.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ── DANH SÁCH BÀI VIẾT ── */
                <>
                  <div className="section-header">
                    <h2 className="section-title">
                      {NEWS_CATS[newsParam]?.icon} {NEWS_CATS[newsParam]?.label}
                    </h2>
                    <span className="product-count">
                      {newsLoading ? '...' : `${newsList.length} bài viết`}
                    </span>
                  </div>

                  {newsLoading && <div className="empty-state">⏳ Đang tải bài viết...</div>}

                  {!newsLoading && newsList.length === 0 && (
                    <div className="empty-state">📭 Chưa có bài viết nào trong mục này.</div>
                  )}

                  {!newsLoading && newsList.length > 0 && (
                    <div className="news-list-grid">
                      {newsList.map(n => (
                        <div key={n._id} className="news-list-card" onClick={() => setSelectedArticle(n)}>
                          <div className="news-list-card-top">
                            <span className={`news-cat-tag news-cat-${n.category}`}>
                              {NEWS_CATS[n.category]?.icon} {NEWS_CATS[n.category]?.label}
                            </span>
                            <span className="news-list-date">{fmtDate(n.createdAt)}</span>
                          </div>
                          <h3 className="news-list-title">{n.title}</h3>
                          <p className="news-list-preview">
                            {n.content ? n.content.slice(0, 110) + (n.content.length > 110 ? '…' : '') : 'Xem chi tiết...'}
                          </p>
                          <div className="news-list-footer">
                            <span>✍️ {n.author || 'Shop mẹ Thủy'}</span>
                            <span>💬 {n.comments?.length || 0}</span>
                            <span className="news-read-more">Đọc tiếp →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* ══════ CHẾ ĐỘ SẢN PHẨM ══════ */
            <>
              <div className="filter-row">
                <button className={`filter-tab ${activeCat === null ? "active" : ""}`} onClick={() => navigate('/')}>
                  Tất cả
                </button>
                {filterCategories.map((c, i) => (
                  <button key={i} className={`filter-tab ${activeCat === c.value ? "active" : ""}`} onClick={() => navigate(`/?category=${c.value}`)}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>

              <div className="section-header">
                <h2 className="section-title">🔥 {sectionTitle}</h2>
                <span className="product-count">{loading ? '...' : `${filteredProducts.length} sản phẩm`}</span>
              </div>

              {loading && <div className="empty-state">⏳ Đang tải sản phẩm...</div>}
              {!loading && error && <div className="empty-state">❌ {error} — Kiểm tra server đang chạy chưa?</div>}
              {!loading && !error && filteredProducts.length === 0 && (
                <div className="empty-state">😔 Hiện tại shop chưa bán sản phẩm thuộc danh mục này!</div>
              )}
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
            </>
          )}

        </main>
      </div>
    </>
  );
}
