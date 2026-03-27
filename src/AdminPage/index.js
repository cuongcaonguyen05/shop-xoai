import { useState, useEffect, useCallback } from 'react';
import './index.css';

import imgChair        from '../Resource/menu_icon_chair.webp';
import imgGrinder      from '../Resource/menu_icon_pot_and_pan_grinder.webp';
import imgKitchen      from '../Resource/menu_icon_kitchen_utensils.webp';
import imgUtensils     from '../Resource/menu_icon_eating_utensils.webp';
import imgPostpartum   from '../Resource/menu_icon_for_postpartum_mothers.webp';
import imgSpice        from '../Resource/menu_icon_spice.webp';
import imgInstant      from '../Resource/menu_icon_instant_food.webp';
import imgOrganic      from '../Resource/menu_icon_organic_grains_and_flour.webp';
import imgNoodles      from '../Resource/menu_icon_noodles_and_vermicelli.webp';
import imgMilk         from '../Resource/menu_icon_milk_and_vitamins.webp';
import imgToys         from '../Resource/menu_icon_educational_toys.webp';

const API_URL      = 'http://localhost:5000/api/products';
const NEWS_API_URL = 'http://localhost:5000/api/news';

const CATEGORIES = [
  { value: 'chair',               label: 'Ghế ăn dặm',               img: imgChair },
  { value: 'pot_and_pan_grinder', label: 'Máy xay, nồi chảo',        img: imgGrinder },
  { value: 'kitchen',             label: 'Đồ dùng bếp',              img: imgKitchen },
  { value: 'utensils',            label: 'Dụng cụ ăn uống',          img: imgUtensils },
  { value: 'postpartum',          label: 'Dành cho mẹ sau sinh',      img: imgPostpartum },
  { value: 'spice',               label: 'Gia vị ăn dặm',            img: imgSpice },
  { value: 'instant_food',        label: 'Thực phẩm ăn liền',        img: imgInstant },
  { value: 'organic_flour',       label: 'Bột, hạt hữu cơ',          img: imgOrganic },
  { value: 'noodles',             label: 'Nui, mì, bún',              img: imgNoodles },
  { value: 'milk',                label: 'Sữa, men vi sinh, vitamin', img: imgMilk },
  { value: 'toys',                label: 'Đồ chơi giáo dục',         img: imgToys },
];

const NEWS_CATS = [
  { value: 'info',   label: 'Thông tin hữu ích', icon: '📋' },
  { value: 'recipe', label: 'Công thức món ăn',  icon: '🍳' },
];

const CAT_MAP  = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));
const PAGE_SIZE = 8;

const fmt   = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';
const stars = (r) => '★'.repeat(Math.round(r || 0)) + '☆'.repeat(5 - Math.round(r || 0));
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

const defaultForm = {
  name: '', description: '', price: '', old_price: '',
  category: 'milk', image: '', tag: '', rating: 0,
  brand: '', like: 0, product_code: '',
};
const defaultNewsForm = { title: '', author: '', category: 'info', content: '' };

function CatIcon({ catValue, size = 20 }) {
  const cat = CAT_MAP[catValue];
  if (!cat) return <span style={{ fontSize: size * 0.9 }}>📦</span>;
  return <img src={cat.img} alt={cat.label} style={{ width: size, height: size, objectFit: 'contain' }} />;
}

let _fireToast;
function useToast() {
  const [toast, setToast] = useState({ msg: '', type: 'ok', show: false });
  _fireToast = useCallback((msg, type = 'ok') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }, []);
  return toast;
}
const showToast = (msg, type = 'ok') => _fireToast?.(msg, type);

export default function AdminPage() {
  const [activePage, setActivePage] = useState('dashboard');

  // ── Products state ──
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState(null);
  const [searchQ, setSearchQ]     = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [prodPage, setProdPage]   = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(defaultForm);
  const [formErr, setFormErr]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── News state ──
  const [newsList, setNewsList]         = useState([]);
  const [newsLoading, setNewsLoading]   = useState(false);
  const [newsFilter, setNewsFilter]     = useState('all');
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [newsEditId, setNewsEditId]     = useState(null);
  const [newsForm, setNewsForm]         = useState(defaultNewsForm);
  const [newsFormErr, setNewsFormErr]   = useState('');
  const [newsSaving, setNewsSaving]     = useState(false);
  const [viewingNews, setViewingNews]   = useState(null); // bài đang xem chi tiết
  const [newsConfirmOpen, setNewsConfirmOpen]   = useState(false);
  const [newsDeleteTarget, setNewsDeleteTarget] = useState(null);

  const toast = useToast();

  // ── Fetch products ──
  const fetchProducts = useCallback(async () => {
    setLoading(true); setApiError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
      setProducts(await res.json());
    } catch (err) { setApiError(err.message); }
    finally { setLoading(false); }
  }, []);

  // ── Fetch news ──
  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const res = await fetch(NEWS_API_URL);
      if (!res.ok) throw new Error(`Lỗi ${res.status}`);
      setNewsList(await res.json());
    } catch (_) {}
    finally { setNewsLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchNews(); }, [fetchNews]);

  // ── Product CRUD ──
  const openAdd = () => { setEditId(null); setForm(defaultForm); setFormErr(''); setModalOpen(true); };
  const openEdit = async (p) => {
    setEditId(p._id);
    setForm({
      name: p.name || '', description: '', price: p.price || '',
      old_price: p.old_price || '', category: p.category || 'milk',
      image: '', tag: p.tag || '', rating: p.rating || 0,
      brand: p.brand || '', like: p.like || 0, product_code: p.product_code || '',
    });
    setFormErr(''); setModalOpen(true);
    try {
      const res = await fetch(`${API_URL}/${p._id}/description`);
      if (res.ok) {
        const d = await res.json();
        setForm(f => ({ ...f, description: d.desc || '', image: d.img || '' }));
      }
    } catch (_) {}
  };

  const handleSave = async () => {
    if (!form.name.trim())               { setFormErr('Vui lòng nhập tên sản phẩm.'); return; }
    if (!form.price || +form.price <= 0) { setFormErr('Giá bán phải lớn hơn 0.'); return; }
    setSaving(true); setFormErr('');
    try {
      const body = {
        name: form.name.trim(), description: form.description.trim(),
        price: Number(form.price), old_price: form.old_price ? Number(form.old_price) : null,
        category: form.category, image: form.image.trim(), tag: form.tag.trim(),
        rating: Number(form.rating), brand: form.brand.trim(),
        like: Number(form.like) || 0, product_code: form.product_code.trim(),
      };
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Lỗi server'); }
      await fetchProducts(); setModalOpen(false);
      showToast(editId ? '✓ Đã cập nhật sản phẩm' : '✓ Đã thêm sản phẩm mới');
    } catch (err) { setFormErr(err.message); }
    finally { setSaving(false); }
  };

  const confirmDelete = (p) => { setDeleteTarget(p); setConfirmOpen(true); };
  const handleDelete  = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_URL}/${deleteTarget._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể xóa');
      await fetchProducts(); showToast('🗑 Đã xóa sản phẩm');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setConfirmOpen(false); setDeleteTarget(null); }
  };

  // ── News CRUD ──
  const openAddNews = () => { setNewsEditId(null); setNewsForm(defaultNewsForm); setNewsFormErr(''); setNewsModalOpen(true); };
  const openEditNews = (n) => {
    setNewsEditId(n._id);
    setNewsForm({ title: n.title || '', author: n.author || '', category: n.category || 'info', content: n.content || '' });
    setNewsFormErr(''); setNewsModalOpen(true);
  };

  const handleSaveNews = async () => {
    if (!newsForm.title.trim()) { setNewsFormErr('Vui lòng nhập tiêu đề.'); return; }
    setNewsSaving(true); setNewsFormErr('');
    try {
      const body = { title: newsForm.title.trim(), author: newsForm.author.trim(), category: newsForm.category, content: newsForm.content.trim() };
      const url = newsEditId ? `${NEWS_API_URL}/${newsEditId}` : NEWS_API_URL;
      const res = await fetch(url, { method: newsEditId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Lỗi server'); }
      await fetchNews(); setNewsModalOpen(false);
      showToast(newsEditId ? '✓ Đã cập nhật bài viết' : '✓ Đã thêm bài viết mới');
    } catch (err) { setNewsFormErr(err.message); }
    finally { setNewsSaving(false); }
  };

  const confirmDeleteNews = (n) => { setNewsDeleteTarget(n); setNewsConfirmOpen(true); };
  const handleDeleteNews  = async () => {
    if (!newsDeleteTarget) return;
    try {
      const res = await fetch(`${NEWS_API_URL}/${newsDeleteTarget._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể xóa');
      if (viewingNews?._id === newsDeleteTarget._id) setViewingNews(null);
      await fetchNews(); showToast('🗑 Đã xóa bài viết');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setNewsConfirmOpen(false); setNewsDeleteTarget(null); }
  };

  const handleDeleteComment = async (newsId, commentId) => {
    try {
      const res = await fetch(`${NEWS_API_URL}/${newsId}/comments/${commentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setNewsList(list => list.map(n => n._id === newsId ? updated : n));
      setViewingNews(updated);
      showToast('Đã xóa bình luận');
    } catch (_) { showToast('Không thể xóa bình luận', 'error'); }
  };

  // ── Filter + Paginate products ──
  const filtered = products.filter(p => {
    if (filterCat !== 'all' && p.category !== filterCat) return false;
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });
  const totalPages    = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedProducts = filtered.slice((prodPage - 1) * PAGE_SIZE, prodPage * PAGE_SIZE);
  useEffect(() => { setProdPage(1); }, [searchQ, filterCat]);

  // ── Filter news ──
  const filteredNews = newsFilter === 'all' ? newsList : newsList.filter(n => n.category === newsFilter);

  // ── Stats ──
  const totalProds    = products.length;
  const activePrCount = products.filter(p => p.price > 0).length;
  const lowStockCnt   = products.filter(p => (p.stock || 0) < 10).length;

  const now     = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
    { id: 'products',  label: 'Sản phẩm',  icon: '📦' },
    { id: 'orders',    label: 'Đơn hàng',  icon: '🛒', badge: 3 },
    { id: 'customers', label: 'Khách hàng',icon: '👥' },
    { id: 'news',      label: 'Tin tức',   icon: '📰' },
  ];

  return (
    <div className="admin-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="adm-sidebar">
        <div className="adm-logo">
          <span className="adm-logo-icon">👶</span>
          <div>
            <div className="adm-logo-text">Bé<em>Yêu</em>Shop</div>
            <span className="adm-logo-tag">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="adm-nav">
          <div className="adm-nav-section-label">Menu chính</div>
          {navItems.map(item => (
            <div key={item.id} className={`adm-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}>
              <span className="adm-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
            </div>
          ))}

          <div className="adm-nav-section-label" style={{ marginTop: 20 }}>Hệ thống</div>
          <div className="adm-nav-item" onClick={() => window.open('/', '_blank')}>
            <span className="adm-nav-icon">🏠</span>Xem trang bán hàng
          </div>
          <div className="adm-nav-item" onClick={() => showToast('Cài đặt đang phát triển')}>
            <span className="adm-nav-icon">⚙️</span>Cài đặt
          </div>
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-admin-card">
            <div className="adm-avatar">AD</div>
            <div>
              <div className="adm-admin-name">mr. Cường</div>
              <div className="adm-admin-role">0365414845</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className="adm-main">
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <h1>{navItems.find(n => n.id === activePage)?.icon} {navItems.find(n => n.id === activePage)?.label}</h1>
            <p>{dateStr}</p>
          </div>
          <div className="adm-topbar-right">
            <button className="adm-btn adm-btn-outline"
              onClick={activePage === 'news' ? fetchNews : fetchProducts}
              disabled={loading || newsLoading}>
              🔄 Làm mới
            </button>
            {activePage === 'products' && (
              <button className="adm-btn adm-btn-primary" onClick={openAdd}>+ Thêm sản phẩm</button>
            )}
            {activePage === 'news' && (
              <button className="adm-btn adm-btn-primary" onClick={openAddNews}>✍️ Viết bài mới</button>
            )}
          </div>
        </header>

        <div className="adm-content">

          {/* ══════════ DASHBOARD ══════════ */}
          <div className={`adm-page ${activePage === 'dashboard' ? 'active' : ''}`}>
            {apiError && <div className="adm-error-msg">❌ {apiError} — Kiểm tra server port 5000</div>}

            <div className="adm-stats-grid">
              <div className="adm-stat-card">
                <div className="adm-stat-top"><div className="adm-stat-icon orange">📦</div><span className="adm-stat-trend neutral">MongoDB</span></div>
                <div className="adm-stat-value">{loading ? '…' : totalProds}</div>
                <div className="adm-stat-label">Tổng sản phẩm</div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-top"><div className="adm-stat-icon green">✅</div><span className="adm-stat-trend up">Đang bán</span></div>
                <div className="adm-stat-value">{loading ? '…' : activePrCount}</div>
                <div className="adm-stat-label">Sản phẩm có giá</div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon red">⚠️</div>
                  <span className={`adm-stat-trend ${lowStockCnt > 0 ? 'down' : 'up'}`}>{lowStockCnt > 0 ? 'Cần nhập' : 'Ổn định'}</span>
                </div>
                <div className="adm-stat-value">{loading ? '…' : lowStockCnt}</div>
                <div className="adm-stat-label">Sắp hết hàng</div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-top"><div className="adm-stat-icon blue">📰</div></div>
                <div className="adm-stat-value">{newsLoading ? '…' : newsList.length}</div>
                <div className="adm-stat-label">Bài viết tin tức</div>
              </div>
            </div>

            <div className="adm-grid-2">
              <div className="adm-card">
                <div className="adm-card-header">
                  <div><div className="adm-card-title">Phân bổ danh mục</div><div className="adm-card-sub">Số sản phẩm theo từng danh mục</div></div>
                </div>
                {loading ? <div className="adm-loading"><span className="adm-loading-dots">Đang tải</span></div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {CATEGORIES.map(cat => {
                      const count = products.filter(p => p.category === cat.value).length;
                      if (count === 0) return null;
                      const pct = Math.round((count / (totalProds || 1)) * 100);
                      return (
                        <div key={cat.value} className="adm-cat-row">
                          <div className="adm-cat-icon"><img src={cat.img} alt={cat.label} /></div>
                          <span className="adm-cat-row-label">{cat.label}</span>
                          <div className="adm-cat-track"><div className="adm-cat-fill" style={{ width: `${pct}%` }} /></div>
                          <span className="adm-cat-num">{count}</span>
                        </div>
                      );
                    })}
                    {!loading && totalProds === 0 && <div className="adm-empty-state"><div className="icon">📭</div><p>Chưa có sản phẩm</p></div>}
                  </div>
                )}
              </div>

              <div className="adm-card">
                <div className="adm-card-header">
                  <div><div className="adm-card-title">Sản phẩm mới nhất</div><div className="adm-card-sub">5 sản phẩm thêm gần đây</div></div>
                  <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setActivePage('products')}>Xem tất cả →</button>
                </div>
                {loading ? <div className="adm-loading"><span className="adm-loading-dots">Đang tải</span></div> : (
                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Danh mục</th></tr></thead>
                      <tbody>
                        {[...products].reverse().slice(0, 5).map(p => {
                          const cat = CAT_MAP[p.category];
                          return (
                            <tr key={p._id}>
                              <td>
                                <div className="adm-prod-cell">
                                  <div className="adm-prod-thumb">
                                    {p.image
                                      ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} onError={e => { e.target.style.display = 'none'; }} />
                                      : cat && <img src={cat.img} alt={cat.label} />}
                                  </div>
                                  <div>
                                    <div className="adm-prod-name">{p.name}</div>
                                    {p.tag && <span className="adm-badge adm-badge-yellow" style={{ fontSize: 10, padding: '1px 6px' }}>{p.tag}</span>}
                                  </div>
                                </div>
                              </td>
                              <td style={{ fontWeight: 800, color: '#e8760a', whiteSpace: 'nowrap' }}>{fmt(p.price)}</td>
                              <td>
                                {cat
                                  ? <span className="adm-badge adm-badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                      <img src={cat.img} alt={cat.label} style={{ width: 13, height: 13, objectFit: 'contain' }} />{cat.label}
                                    </span>
                                  : <span className="adm-badge adm-badge-gray">{p.category || '—'}</span>}
                              </td>
                            </tr>
                          );
                        })}
                        {products.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>Chưa có sản phẩm</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="adm-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 32 }}>🚀</span>
                <div>
                  <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Modules đơn hàng &amp; khách hàng đang phát triển</div>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>
                    Backend hiện có <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: 4, color: '#15803d' }}>/api/products</code> và <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: 4, color: '#15803d' }}>/api/news</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════ PRODUCTS ══════════ */}
          <div className={`adm-page ${activePage === 'products' ? 'active' : ''}`}>
            {apiError && <div className="adm-error-msg">❌ {apiError} — Kiểm tra server port 5000</div>}
            <div className="adm-cat-pills">
              <button className={`adm-cat-pill ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>Tất cả ({products.length})</button>
              {CATEGORIES.map(cat => {
                const count = products.filter(p => p.category === cat.value).length;
                if (count === 0) return null;
                return (
                  <button key={cat.value} className={`adm-cat-pill ${filterCat === cat.value ? 'active' : ''}`} onClick={() => setFilterCat(cat.value)}>
                    <img src={cat.img} alt={cat.label} />{cat.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="adm-card">
              <div className="adm-filter-bar">
                <div className="adm-search-wrap">
                  <span>🔍</span>
                  <input type="text" placeholder="Tìm tên sản phẩm..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                </div>
                <select className="adm-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="all">Tất cả danh mục</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{filtered.length} sản phẩm</span>
              </div>

              {loading ? <div className="adm-loading"><span className="adm-loading-dots">Đang tải từ MongoDB Atlas</span></div> : (
                <>
                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead>
                        <tr><th>Sản phẩm</th><th>Danh mục</th><th>Mã SP</th><th>Giá bán</th><th>Giá gốc / Giảm</th><th>Rating</th><th>Tag</th><th>Thao tác</th></tr>
                      </thead>
                      <tbody>
                        {pagedProducts.length === 0
                          ? <tr><td colSpan={8}><div className="adm-empty-state"><div className="icon">🔍</div><p>Không tìm thấy sản phẩm</p></div></td></tr>
                          : pagedProducts.map(p => {
                              const cat    = CAT_MAP[p.category];
                              const hasDis = p.old_price && p.old_price > p.price;
                              const disPct = hasDis ? Math.round((1 - p.price / p.old_price) * 100) : 0;
                              return (
                                <tr key={p._id}>
                                  <td>
                                    <div className="adm-prod-cell">
                                      <div className="adm-prod-thumb">
                                        {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, padding: 0 }}
                                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }} /> : null}
                                        {cat && <img src={cat.img} alt={cat.label} style={{ width: 24, height: 24, objectFit: 'contain', display: p.image ? 'none' : 'block' }} />}
                                      </div>
                                      <div>
                                        <div className="adm-prod-name">{p.name}</div>
                                        <div className="adm-prod-id">{p._id.slice(-6).toUpperCase()}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {cat
                                      ? <span className="adm-badge adm-badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                          <img src={cat.img} alt={cat.label} style={{ width: 13, height: 13, objectFit: 'contain' }} />{cat.label}
                                        </span>
                                      : <span className="adm-badge adm-badge-gray">{p.category || '—'}</span>}
                                  </td>
                                  <td>{p.product_code ? <span className="adm-badge adm-badge-gray" style={{ fontFamily: 'monospace', letterSpacing: 1 }}>{p.product_code}</span> : <span style={{ color: '#d1d5db' }}>—</span>}</td>
                                  <td><span style={{ fontWeight: 800, color: '#e8760a', whiteSpace: 'nowrap' }}>{fmt(p.price)}</span></td>
                                  <td>
                                    {p.old_price
                                      ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                          <s style={{ fontSize: 12, color: '#9ca3af' }}>{fmt(p.old_price)}</s>
                                          {hasDis && <span className="adm-badge adm-badge-red">-{disPct}%</span>}
                                        </div>
                                      : <span style={{ color: '#d1d5db' }}>—</span>}
                                  </td>
                                  <td><span className="adm-stars">{stars(p.rating)}</span><span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 3 }}>({p.rating || 0})</span></td>
                                  <td>{p.tag ? <span className="adm-badge adm-badge-yellow">{p.tag}</span> : <span style={{ color: '#d1d5db' }}>—</span>}</td>
                                  <td>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                      <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(p)}>✏️ Sửa</button>
                                      <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => confirmDelete(p)}>🗑</button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  </div>
                  <div className="adm-pagination">
                    <span>Trang {prodPage}/{totalPages} · {filtered.length} sản phẩm</span>
                    <div className="adm-page-btns">
                      <button className="adm-page-btn" onClick={() => setProdPage(p => Math.max(1, p - 1))} disabled={prodPage === 1}>←</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button key={n} className={`adm-page-btn ${n === prodPage ? 'active' : ''}`} onClick={() => setProdPage(n)}>{n}</button>
                      ))}
                      <button className="adm-page-btn" onClick={() => setProdPage(p => Math.min(totalPages, p + 1))} disabled={prodPage === totalPages}>→</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ══════════ NEWS ══════════ */}
          <div className={`adm-page ${activePage === 'news' ? 'active' : ''}`}>

            {/* Nếu đang xem chi tiết bài viết */}
            {viewingNews ? (
              <div className="adm-card">
                <div className="adm-card-header">
                  <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setViewingNews(null)}>← Quay lại</button>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => { openEditNews(viewingNews); }}>✏️ Sửa</button>
                    <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => confirmDeleteNews(viewingNews)}>🗑 Xóa</button>
                  </div>
                </div>

                {/* Thông tin bài */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span className={`adm-badge ${viewingNews.category === 'recipe' ? 'adm-badge-orange' : 'adm-badge-blue'}`}>
                      {NEWS_CATS.find(c => c.value === viewingNews.category)?.icon} {NEWS_CATS.find(c => c.value === viewingNews.category)?.label}
                    </span>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{fmtDate(viewingNews.createdAt)}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 22, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>{viewingNews.title}</h2>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                    ✍️ <strong>{viewingNews.author || 'Ẩn danh'}</strong>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.9, color: '#374151', whiteSpace: 'pre-wrap', background: '#fafafa', borderRadius: 10, padding: '16px 20px', border: '1px solid #f3f4f6' }}>
                    {viewingNews.content || <em style={{ color: '#9ca3af' }}>Chưa có nội dung</em>}
                  </div>
                </div>

                {/* Bình luận */}
                <div>
                  <div className="adm-card-title" style={{ marginBottom: 12 }}>
                    💬 Bình luận ({viewingNews.comments?.length || 0})
                  </div>
                  {viewingNews.comments?.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px 0', fontSize: 13 }}>Chưa có bình luận nào</div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {viewingNews.comments?.map(c => (
                      <div key={c._id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', marginBottom: 4 }}>
                            👤 {c.author || 'Ẩn danh'}
                            <span style={{ fontWeight: 400, fontSize: 11, color: '#9ca3af', marginLeft: 8 }}>{fmtDate(c.createdAt)}</span>
                          </div>
                          <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{c.content}</div>
                        </div>
                        <button
                          className="adm-btn adm-btn-danger adm-btn-sm"
                          style={{ flexShrink: 0, padding: '3px 10px' }}
                          onClick={() => handleDeleteComment(viewingNews._id, c._id)}
                        >🗑</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Tabs loại tin */}
                <div className="adm-cat-pills" style={{ marginBottom: 16 }}>
                  <button className={`adm-cat-pill ${newsFilter === 'all' ? 'active' : ''}`} onClick={() => setNewsFilter('all')}>
                    Tất cả ({newsList.length})
                  </button>
                  {NEWS_CATS.map(c => (
                    <button key={c.value} className={`adm-cat-pill ${newsFilter === c.value ? 'active' : ''}`} onClick={() => setNewsFilter(c.value)}>
                      {c.icon} {c.label} ({newsList.filter(n => n.category === c.value).length})
                    </button>
                  ))}
                </div>

                <div className="adm-card">
                  {newsLoading ? (
                    <div className="adm-loading"><span className="adm-loading-dots">Đang tải tin tức</span></div>
                  ) : filteredNews.length === 0 ? (
                    <div className="adm-empty-state" style={{ padding: '40px 0' }}>
                      <div className="icon">📰</div><p>Chưa có bài viết nào</p>
                      <button className="adm-btn adm-btn-primary" style={{ marginTop: 12 }} onClick={openAddNews}>✍️ Viết bài đầu tiên</button>
                    </div>
                  ) : (
                    <div className="adm-table-wrap">
                      <table className="adm-table">
                        <thead>
                          <tr><th>Tiêu đề</th><th>Loại</th><th>Người viết</th><th>Bình luận</th><th>Ngày đăng</th><th>Thao tác</th></tr>
                        </thead>
                        <tbody>
                          {filteredNews.map(n => {
                            const nc = NEWS_CATS.find(c => c.value === n.category);
                            return (
                              <tr key={n._id}>
                                <td>
                                  <div
                                    className="adm-prod-name"
                                    style={{ cursor: 'pointer', color: '#3b82f6', textDecoration: 'underline' }}
                                    onClick={() => setViewingNews(n)}
                                  >{n.title}</div>
                                  {n.content && (
                                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {n.content.slice(0, 80)}{n.content.length > 80 ? '…' : ''}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <span className={`adm-badge ${n.category === 'recipe' ? 'adm-badge-orange' : 'adm-badge-blue'}`}>
                                    {nc?.icon} {nc?.label}
                                  </span>
                                </td>
                                <td style={{ fontSize: 13, color: '#374151' }}>{n.author || <span style={{ color: '#d1d5db' }}>—</span>}</td>
                                <td>
                                  <span className="adm-badge adm-badge-gray">💬 {n.comments?.length || 0}</span>
                                </td>
                                <td style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{fmtDate(n.createdAt)}</td>
                                <td>
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setViewingNews(n)}>👁 Xem</button>
                                    <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEditNews(n)}>✏️</button>
                                    <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => confirmDeleteNews(n)}>🗑</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ══════════ ORDERS (placeholder) ══════════ */}
          <div className={`adm-page ${activePage === 'orders' ? 'active' : ''}`}>
            <div className="adm-card" style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Module Đơn hàng</div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, maxWidth: 440, margin: '0 auto' }}>Đang phát triển</p>
            </div>
          </div>

          {/* ══════════ CUSTOMERS (placeholder) ══════════ */}
          <div className={`adm-page ${activePage === 'customers' ? 'active' : ''}`}>
            <div className="adm-card" style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>👥</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Module Khách hàng</div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, maxWidth: 440, margin: '0 auto' }}>Đang phát triển</p>
            </div>
          </div>

        </div>
      </main>

      {/* ══════════ MODAL THÊM / SỬA SẢN PHẨM ══════════ */}
      <div className={`adm-modal-overlay ${modalOpen ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="adm-modal">
          <div className="adm-modal-header">
            <div className="adm-modal-title">{editId ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</div>
            <button className="adm-modal-close" onClick={() => setModalOpen(false)}>✕</button>
          </div>
          {formErr && <div className="adm-error-msg">⚠️ {formErr}</div>}

          <div className="adm-form-group">
            <label className="adm-form-label">Tên sản phẩm *</label>
            <input className="adm-form-input" placeholder="VD: Cháo rau củ hữu cơ 6 tháng" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Giá bán (₫) *</label>
              <input className="adm-form-input" type="number" placeholder="25000" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Giá gốc (₫)</label>
              <input className="adm-form-input" type="number" placeholder="35000" value={form.old_price} onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))} />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Danh mục *</label>
              <select className="adm-form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {CAT_MAP[form.category] && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <img src={CAT_MAP[form.category].img} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{CAT_MAP[form.category].label}</span>
                </div>
              )}
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Tag</label>
              <input className="adm-form-input" placeholder="Best seller, Mới, Hot..." value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
            </div>
          </div>
          <div className="adm-form-group" style={{ maxWidth: 200 }}>
            <label className="adm-form-label">Rating (0–5)</label>
            <input className="adm-form-input" type="number" min="0" max="5" step="0.5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
            <div className="adm-form-hint"><span className="adm-stars">{stars(form.rating)}</span></div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Thương hiệu</label>
              <input className="adm-form-input" placeholder="VD: Anpaso, Nutifood..." value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Mã sản phẩm</label>
              <input className="adm-form-input" placeholder="VD: ADNAJD" value={form.product_code} onChange={e => setForm(f => ({ ...f, product_code: e.target.value }))} />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Lượt thích</label>
              <input className="adm-form-input" type="number" min="0" placeholder="0" value={form.like} onChange={e => setForm(f => ({ ...f, like: e.target.value }))} />
            </div>
            <div className="adm-form-group" style={{ flex: 2 }}>
              <label className="adm-form-label">URL ảnh</label>
              <input className="adm-form-input" placeholder="https://... (để trống → dùng icon danh mục)" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-form-label">Mô tả</label>
            <textarea className="adm-form-textarea" placeholder="Mô tả chi tiết, thành phần, công dụng..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="adm-modal-actions">
            <button className="adm-btn adm-btn-outline" onClick={() => setModalOpen(false)}>Hủy</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu…' : editId ? '💾 Cập nhật' : '➕ Thêm sản phẩm'}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════ MODAL THÊM / SỬA TIN TỨC ══════════ */}
      <div className={`adm-modal-overlay ${newsModalOpen ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && setNewsModalOpen(false)}>
        <div className="adm-modal" style={{ maxWidth: 640 }}>
          <div className="adm-modal-header">
            <div className="adm-modal-title">{newsEditId ? '✏️ Chỉnh sửa bài viết' : '✍️ Viết bài mới'}</div>
            <button className="adm-modal-close" onClick={() => setNewsModalOpen(false)}>✕</button>
          </div>
          {newsFormErr && <div className="adm-error-msg">⚠️ {newsFormErr}</div>}

          <div className="adm-form-group">
            <label className="adm-form-label">Tiêu đề *</label>
            <input className="adm-form-input" placeholder="VD: 5 công thức cháo ngon cho bé 6 tháng"
              value={newsForm.title} onChange={e => setNewsForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Người viết</label>
              <input className="adm-form-input" placeholder="VD: Mẹ Thủy"
                value={newsForm.author} onChange={e => setNewsForm(f => ({ ...f, author: e.target.value }))} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Loại bài viết</label>
              <select className="adm-form-select" value={newsForm.category} onChange={e => setNewsForm(f => ({ ...f, category: e.target.value }))}>
                {NEWS_CATS.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-form-label">Nội dung</label>
            <textarea className="adm-form-textarea" rows={10}
              placeholder="Viết nội dung bài viết tại đây..."
              style={{ minHeight: 220 }}
              value={newsForm.content} onChange={e => setNewsForm(f => ({ ...f, content: e.target.value }))} />
          </div>
          <div className="adm-modal-actions">
            <button className="adm-btn adm-btn-outline" onClick={() => setNewsModalOpen(false)}>Hủy</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSaveNews} disabled={newsSaving}>
              {newsSaving ? 'Đang lưu…' : newsEditId ? '💾 Cập nhật' : '✍️ Đăng bài'}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════ CONFIRM DELETE SẢN PHẨM ══════════ */}
      <div className={`adm-confirm-overlay ${confirmOpen ? 'open' : ''}`}>
        <div className="adm-confirm-box">
          <div className="adm-confirm-icon">🗑️</div>
          <div className="adm-confirm-title">Xác nhận xóa?</div>
          <div className="adm-confirm-msg">Bạn sắp xóa <strong>"{deleteTarget?.name}"</strong>.<br />Hành động này xóa vĩnh viễn khỏi MongoDB Atlas.</div>
          <div className="adm-confirm-actions">
            <button className="adm-btn adm-btn-outline" onClick={() => { setConfirmOpen(false); setDeleteTarget(null); }}>Hủy</button>
            <button className="adm-btn adm-btn-danger" onClick={handleDelete}>Xóa ngay</button>
          </div>
        </div>
      </div>

      {/* ══════════ CONFIRM DELETE TIN TỨC ══════════ */}
      <div className={`adm-confirm-overlay ${newsConfirmOpen ? 'open' : ''}`}>
        <div className="adm-confirm-box">
          <div className="adm-confirm-icon">🗑️</div>
          <div className="adm-confirm-title">Xóa bài viết?</div>
          <div className="adm-confirm-msg">Bạn sắp xóa bài <strong>"{newsDeleteTarget?.title}"</strong>.<br />Tất cả bình luận cũng sẽ bị xóa.</div>
          <div className="adm-confirm-actions">
            <button className="adm-btn adm-btn-outline" onClick={() => { setNewsConfirmOpen(false); setNewsDeleteTarget(null); }}>Hủy</button>
            <button className="adm-btn adm-btn-danger" onClick={handleDeleteNews}>Xóa ngay</button>
          </div>
        </div>
      </div>

      {/* ══════════ TOAST ══════════ */}
      <div className={`adm-toast ${toast.show ? 'show' : ''} ${toast.type === 'error' ? 'error' : ''}`}>
        {toast.msg}
      </div>

    </div>
  );
}
