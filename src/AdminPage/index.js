import { useState, useEffect, useCallback } from 'react';
import './index.css';

// ── Import đúng ảnh từ Resource (giống ProductCategory.js) ──
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

// ══════════════════════════════════════════════════
// CONSTANTS — khớp hoàn toàn với ProductCategory.js
// ══════════════════════════════════════════════════
const API_URL = 'http://localhost:5000/api/products';

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

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));
const PAGE_SIZE = 8;

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════
const fmt   = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';
const stars = (r) => '★'.repeat(Math.round(r || 0)) + '☆'.repeat(5 - Math.round(r || 0));

const defaultForm = {
  name: '', description: '', price: '', old_price: '',
  category: 'milk', image: '', tag: '', rating: 0,
};

// ── CatIcon: hiển thị ảnh danh mục ──
function CatIcon({ catValue, size = 20 }) {
  const cat = CAT_MAP[catValue];
  if (!cat) return <span style={{ fontSize: size * 0.9 }}>📦</span>;
  return (
    <img
      src={cat.img}
      alt={cat.label}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}

// ══════════════════════════════════════════════════
// TOAST HOOK
// ══════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════
// COMPONENT CHÍNH
// ══════════════════════════════════════════════════
export default function AdminPage() {
  const [activePage, setActivePage] = useState('dashboard');
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [apiError, setApiError]     = useState(null);

  // filter & pagination
  const [searchQ, setSearchQ]       = useState('');
  const [filterCat, setFilterCat]   = useState('all');
  const [prodPage, setProdPage]     = useState(1);

  // modal thêm/sửa
  const [modalOpen, setModalOpen]   = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(defaultForm);
  const [formErr, setFormErr]       = useState('');
  const [saving, setSaving]         = useState(false);

  // xác nhận xóa
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const toast = useToast();

  // ── Fetch API ──
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Lỗi ${res.status}: ${res.statusText}`);
      setProducts(await res.json());
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── CRUD ──
  const openAdd = () => {
    setEditId(null); setForm(defaultForm); setFormErr(''); setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditId(p._id);
    setForm({
      name:        p.name        || '',
      description: p.description || '',
      price:       p.price       || '',
      old_price:   p.old_price   || '',
      category:    p.category    || 'milk',
      image:       p.image       || '',
      tag:         p.tag         || '',
      rating:      p.rating      || 0,
    });
    setFormErr(''); setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim())            { setFormErr('Vui lòng nhập tên sản phẩm.'); return; }
    if (!form.price || +form.price <= 0) { setFormErr('Giá bán phải lớn hơn 0.'); return; }
    setSaving(true); setFormErr('');
    try {
      const body = {
        name:        form.name.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
        old_price:   form.old_price ? Number(form.old_price) : null,
        category:    form.category,
        image:       form.image.trim(),
        tag:         form.tag.trim(),
        rating:      Number(form.rating),
      };
      const url    = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Lỗi server'); }
      await fetchProducts();
      setModalOpen(false);
      showToast(editId ? '✓ Đã cập nhật sản phẩm' : '✓ Đã thêm sản phẩm mới');
    } catch (err) {
      setFormErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (p) => { setDeleteTarget(p); setConfirmOpen(true); };
  const handleDelete  = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_URL}/${deleteTarget._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể xóa');
      await fetchProducts();
      showToast('🗑 Đã xóa sản phẩm');
    } catch (err) { showToast(err.message, 'error'); }
    finally { setConfirmOpen(false); setDeleteTarget(null); }
  };

  // ── Filter + Paginate ──
  const filtered = products.filter(p => {
    if (filterCat !== 'all' && p.category !== filterCat) return false;
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });
  const totalPages    = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedProducts = filtered.slice((prodPage - 1) * PAGE_SIZE, prodPage * PAGE_SIZE);
  useEffect(() => { setProdPage(1); }, [searchQ, filterCat]);

  // ── Stats ──
  const totalProds    = products.length;
  const activePrCount = products.filter(p => p.price > 0).length;
  const lowStockCnt   = products.filter(p => (p.stock || 0) < 10).length;
  const catCount      = new Set(products.map(p => p.category).filter(Boolean)).size;

  const now     = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan',  icon: '📊' },
    { id: 'products',  label: 'Sản phẩm',   icon: '📦' },
    { id: 'orders',    label: 'Đơn hàng',    icon: '🛒', badge: 3 },
    { id: 'customers', label: 'Khách hàng',  icon: '👥' },
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
            <div
              key={item.id}
              className={`adm-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="adm-nav-badge">{item.badge}</span>}
            </div>
          ))}

          <div className="adm-nav-section-label" style={{ marginTop: 20 }}>Hệ thống</div>
          <div className="adm-nav-item" onClick={() => window.open('/', '_blank')}>
            <span className="adm-nav-icon">🏠</span>
            Xem trang bán hàng
          </div>
          <div className="adm-nav-item" onClick={() => showToast('Cài đặt đang phát triển')}>
            <span className="adm-nav-icon">⚙️</span>
            Cài đặt
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
            <button className="adm-btn adm-btn-outline" onClick={fetchProducts} disabled={loading}>
              🔄 Làm mới
            </button>
            {activePage === 'products' && (
              <button className="adm-btn adm-btn-primary" onClick={openAdd}>
                + Thêm sản phẩm
              </button>
            )}
          </div>
        </header>

        <div className="adm-content">

          {/* ══════════ DASHBOARD ══════════ */}
          <div className={`adm-page ${activePage === 'dashboard' ? 'active' : ''}`}>
            {apiError && <div className="adm-error-msg">❌ {apiError} — Kiểm tra server port 5000</div>}

            <div className="adm-stats-grid">
              <div className="adm-stat-card">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon orange">📦</div>
                  <span className="adm-stat-trend neutral">MongoDB</span>
                </div>
                <div className="adm-stat-value">{loading ? '…' : totalProds}</div>
                <div className="adm-stat-label">Tổng sản phẩm</div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon green">✅</div>
                  <span className="adm-stat-trend up">Đang bán</span>
                </div>
                <div className="adm-stat-value">{loading ? '…' : activePrCount}</div>
                <div className="adm-stat-label">Sản phẩm có giá</div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon red">⚠️</div>
                  <span className={`adm-stat-trend ${lowStockCnt > 0 ? 'down' : 'up'}`}>
                    {lowStockCnt > 0 ? 'Cần nhập' : 'Ổn định'}
                  </span>
                </div>
                <div className="adm-stat-value">{loading ? '…' : lowStockCnt}</div>
                <div className="adm-stat-label">Sắp hết hàng</div>
              </div>
              <div className="adm-stat-card">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon blue">🗂️</div>
                </div>
                <div className="adm-stat-value">{loading ? '…' : catCount}</div>
                <div className="adm-stat-label">Danh mục có hàng</div>
              </div>
            </div>

            <div className="adm-grid-2">
              {/* Phân bổ danh mục với ảnh icon */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <div>
                    <div className="adm-card-title">Phân bổ danh mục</div>
                    <div className="adm-card-sub">Số sản phẩm theo từng danh mục</div>
                  </div>
                </div>
                {loading
                  ? <div className="adm-loading"><span className="adm-loading-dots">Đang tải</span></div>
                  : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {CATEGORIES.map(cat => {
                        const count = products.filter(p => p.category === cat.value).length;
                        if (count === 0) return null;
                        const pct = Math.round((count / (totalProds || 1)) * 100);
                        return (
                          <div key={cat.value} className="adm-cat-row">
                            {/* Ảnh icon từ Resource */}
                            <div className="adm-cat-icon">
                              <img src={cat.img} alt={cat.label} />
                            </div>
                            <span className="adm-cat-row-label">{cat.label}</span>
                            <div className="adm-cat-track">
                              <div className="adm-cat-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="adm-cat-num">{count}</span>
                          </div>
                        );
                      })}
                      {!loading && totalProds === 0 && (
                        <div className="adm-empty-state"><div className="icon">📭</div><p>Chưa có sản phẩm</p></div>
                      )}
                    </div>
                  )}
              </div>

              {/* Sản phẩm mới nhất */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <div>
                    <div className="adm-card-title">Sản phẩm mới nhất</div>
                    <div className="adm-card-sub">5 sản phẩm thêm gần đây</div>
                  </div>
                  <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setActivePage('products')}>
                    Xem tất cả →
                  </button>
                </div>
                {loading
                  ? <div className="adm-loading"><span className="adm-loading-dots">Đang tải</span></div>
                  : (
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
                                        ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                                            onError={e => { e.target.style.display = 'none'; }} />
                                        : cat && <img src={cat.img} alt={cat.label} />
                                      }
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
                                        <img src={cat.img} alt={cat.label} style={{ width: 13, height: 13, objectFit: 'contain' }} />
                                        {cat.label}
                                      </span>
                                    : <span className="adm-badge adm-badge-gray">{p.category || '—'}</span>
                                  }
                                </td>
                              </tr>
                            );
                          })}
                          {products.length === 0 && (
                            <tr><td colSpan={3} style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>Chưa có sản phẩm</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            </div>

            {/* Info banner */}
            <div className="adm-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 32 }}>🚀</span>
                <div>
                  <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
                    Modules đơn hàng &amp; khách hàng đang phát triển
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>
                    Backend hiện có <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: 4, color: '#15803d' }}>/api/products</code>.
                    Cần thêm <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: 4, color: '#15803d' }}>/api/orders</code> và <code style={{ background: '#dcfce7', padding: '1px 6px', borderRadius: 4, color: '#15803d' }}>/api/customers</code> trong Express để mở khóa các module còn lại.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════ PRODUCTS ══════════ */}
          <div className={`adm-page ${activePage === 'products' ? 'active' : ''}`}>
            {apiError && <div className="adm-error-msg">❌ {apiError} — Kiểm tra server port 5000</div>}

            {/* Pills với ảnh icon */}
            <div className="adm-cat-pills">
              <button
                className={`adm-cat-pill ${filterCat === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCat('all')}
              >
                Tất cả ({products.length})
              </button>
              {CATEGORIES.map(cat => {
                const count = products.filter(p => p.category === cat.value).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.value}
                    className={`adm-cat-pill ${filterCat === cat.value ? 'active' : ''}`}
                    onClick={() => setFilterCat(cat.value)}
                  >
                    <img src={cat.img} alt={cat.label} />
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="adm-card">
              <div className="adm-filter-bar">
                <div className="adm-search-wrap">
                  <span>🔍</span>
                  <input
                    type="text"
                    placeholder="Tìm tên sản phẩm..."
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                  />
                </div>
                <select
                  className="adm-select"
                  value={filterCat}
                  onChange={e => setFilterCat(e.target.value)}
                >
                  <option value="all">Tất cả danh mục</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>
                  {filtered.length} sản phẩm
                </span>
              </div>

              {loading
                ? <div className="adm-loading"><span className="adm-loading-dots">Đang tải từ MongoDB Atlas</span></div>
                : (
                  <>
                    <div className="adm-table-wrap">
                      <table className="adm-table">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Danh mục</th>
                            <th>Giá bán</th>
                            <th>Giá gốc / Giảm</th>
                            <th>Rating</th>
                            <th>Tag</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pagedProducts.length === 0
                            ? <tr><td colSpan={7}><div className="adm-empty-state"><div className="icon">🔍</div><p>Không tìm thấy sản phẩm</p></div></td></tr>
                            : pagedProducts.map(p => {
                                const cat = CAT_MAP[p.category];
                                const hasDis = p.old_price && p.old_price > p.price;
                                const disPct = hasDis ? Math.round((1 - p.price / p.old_price) * 100) : 0;
                                return (
                                  <tr key={p._id}>
                                    <td>
                                      <div className="adm-prod-cell">
                                        {/* Thumbnail: ưu tiên ảnh sản phẩm, fallback về icon danh mục */}
                                        <div className="adm-prod-thumb">
                                          {p.image
                                            ? <img
                                                src={p.image} alt={p.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, padding: 0 }}
                                                onError={e => {
                                                  e.target.style.display = 'none';
                                                  e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                                                }}
                                              />
                                            : null}
                                          {/* fallback icon danh mục */}
                                          {cat && (
                                            <img
                                              src={cat.img} alt={cat.label}
                                              style={{ width: 24, height: 24, objectFit: 'contain', display: p.image ? 'none' : 'block' }}
                                            />
                                          )}
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
                                            <img src={cat.img} alt={cat.label} style={{ width: 13, height: 13, objectFit: 'contain' }} />
                                            {cat.label}
                                          </span>
                                        : <span className="adm-badge adm-badge-gray">{p.category || '—'}</span>
                                      }
                                    </td>
                                    <td>
                                      <span style={{ fontWeight: 800, color: '#e8760a', whiteSpace: 'nowrap' }}>
                                        {fmt(p.price)}
                                      </span>
                                    </td>
                                    <td>
                                      {p.old_price
                                        ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                            <s style={{ fontSize: 12, color: '#9ca3af' }}>{fmt(p.old_price)}</s>
                                            {hasDis && <span className="adm-badge adm-badge-red">-{disPct}%</span>}
                                          </div>
                                        : <span style={{ color: '#d1d5db' }}>—</span>}
                                    </td>
                                    <td>
                                      <span className="adm-stars">{stars(p.rating)}</span>
                                      <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 3 }}>({p.rating || 0})</span>
                                    </td>
                                    <td>
                                      {p.tag
                                        ? <span className="adm-badge adm-badge-yellow">{p.tag}</span>
                                        : <span style={{ color: '#d1d5db' }}>—</span>}
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(p)}>✏️ Sửa</button>
                                        <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => confirmDelete(p)}>🗑</button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                          }
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
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

          {/* ══════════ ORDERS (placeholder) ══════════ */}
          <div className={`adm-page ${activePage === 'orders' ? 'active' : ''}`}>
            <div className="adm-card" style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>🛒</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Module Đơn hàng</div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, maxWidth: 440, margin: '0 auto 22px' }}>
                Cần tạo thêm route và model trong Express backend:
              </p>
              <div style={{ background: '#faf8f5', border: '1.5px dashed #ede8e2', borderRadius: 12, padding: '14px 22px', display: 'inline-block', textAlign: 'left' }}>
                <code style={{ fontSize: 12, color: '#e8760a', lineHeight: 2.1, display: 'block', fontFamily: 'monospace' }}>
                  src/backend/models/Order.js<br />
                  src/backend/routes/order.js<br />
                  src/backend/controllers/orderController.js<br />
                  <span style={{ color: '#9ca3af' }}>// app.js:</span><br />
                  app.use('/api/orders', require('./routes/order'))
                </code>
              </div>
            </div>
          </div>

          {/* ══════════ CUSTOMERS (placeholder) ══════════ */}
          <div className={`adm-page ${activePage === 'customers' ? 'active' : ''}`}>
            <div className="adm-card" style={{ textAlign: 'center', padding: '56px 20px' }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>👥</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Module Khách hàng</div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, maxWidth: 440, margin: '0 auto 22px' }}>
                Cần authentication system và model Customer:
              </p>
              <div style={{ background: '#faf8f5', border: '1.5px dashed #ede8e2', borderRadius: 12, padding: '14px 22px', display: 'inline-block', textAlign: 'left' }}>
                <code style={{ fontSize: 12, color: '#e8760a', lineHeight: 2.1, display: 'block', fontFamily: 'monospace' }}>
                  src/backend/models/Customer.js<br />
                  src/backend/routes/customer.js<br />
                  src/backend/controllers/customerController.js<br />
                  app.use('/api/customers', require('./routes/customer'))
                </code>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ══════════ MODAL THÊM / SỬA ══════════ */}
      <div className={`adm-modal-overlay ${modalOpen ? 'open' : ''}`}
        onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="adm-modal">
          <div className="adm-modal-header">
            <div className="adm-modal-title">
              {editId ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
            </div>
            <button className="adm-modal-close" onClick={() => setModalOpen(false)}>✕</button>
          </div>

          {formErr && <div className="adm-error-msg">⚠️ {formErr}</div>}

          <div className="adm-form-group">
            <label className="adm-form-label">Tên sản phẩm *</label>
            <input className="adm-form-input"
              placeholder="VD: Cháo rau củ hữu cơ 6 tháng"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Giá bán (₫) *</label>
              <input className="adm-form-input" type="number" placeholder="25000"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Giá gốc (₫)</label>
              <input className="adm-form-input" type="number" placeholder="35000 (để trống nếu không sale)"
                value={form.old_price}
                onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))} />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Danh mục *</label>
              <select className="adm-form-select" value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {/* Preview icon danh mục đang chọn */}
              {CAT_MAP[form.category] && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <img src={CAT_MAP[form.category].img} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{CAT_MAP[form.category].label}</span>
                </div>
              )}
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">Tag</label>
              <input className="adm-form-input" placeholder="Best seller, Mới, Hot..."
                value={form.tag}
                onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-label">Rating (0–5)</label>
              <input className="adm-form-input" type="number" min="0" max="5" step="0.5"
                value={form.rating}
                onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} />
              <div className="adm-form-hint">
                <span className="adm-stars">{stars(form.rating)}</span>
              </div>
            </div>
            <div className="adm-form-group">
              <label className="adm-form-label">URL ảnh</label>
              <input className="adm-form-input" placeholder="https://... (để trống → dùng icon danh mục)"
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-form-label">Mô tả</label>
            <textarea className="adm-form-textarea"
              placeholder="Mô tả chi tiết, thành phần, công dụng..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="adm-modal-actions">
            <button className="adm-btn adm-btn-outline" onClick={() => setModalOpen(false)}>Hủy</button>
            <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu…' : editId ? '💾 Cập nhật' : '➕ Thêm sản phẩm'}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════ CONFIRM DELETE ══════════ */}
      <div className={`adm-confirm-overlay ${confirmOpen ? 'open' : ''}`}>
        <div className="adm-confirm-box">
          <div className="adm-confirm-icon">🗑️</div>
          <div className="adm-confirm-title">Xác nhận xóa?</div>
          <div className="adm-confirm-msg">
            Bạn sắp xóa <strong>"{deleteTarget?.name}"</strong>.<br />
            Hành động này xóa vĩnh viễn khỏi MongoDB Atlas.
          </div>
          <div className="adm-confirm-actions">
            <button className="adm-btn adm-btn-outline" onClick={() => { setConfirmOpen(false); setDeleteTarget(null); }}>Hủy</button>
            <button className="adm-btn adm-btn-danger" onClick={handleDelete}>Xóa ngay</button>
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