import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/addresses';
const EMPTY_FORM = { name: '', recipientPhone: '', address: '', province: '', district: '', ward: '', isDefault: false };

function authHeaders() {
  const token = localStorage.getItem('shop_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function AddressTab() {
  const [list, setList]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null); // null=ẩn, 'new'=thêm, id=sửa
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(API, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { setList(Array.isArray(data) ? data : []); })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  const set = (f) => (e) => setForm(p => ({
    ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
  }));

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId('new'); setError(''); };
  const openEdit = (item) => {
    setForm({
      name: item.name, recipientPhone: item.recipientPhone,
      address: item.address, province: item.province || '',
      district: item.district || '', ward: item.ward || '',
      isDefault: item.isDefault,
    });
    setEditId(item._id);
    setError('');
  };
  const cancel = () => { setEditId(null); setError(''); };

  const handleSave = async () => {
    if (!form.name.trim())           { setError('Vui lòng nhập tên người nhận.'); return; }
    if (!/^(0|\+84)\d{9,10}$/.test(form.recipientPhone.trim()))
      { setError('Số điện thoại không hợp lệ.'); return; }
    if (!form.address.trim())        { setError('Vui lòng nhập địa chỉ.'); return; }

    setSaving(true); setError('');
    try {
      const isNew = editId === 'new';
      const res = await fetch(
        isNew ? API : `${API}/${editId}`,
        { method: isNew ? 'POST' : 'PUT', headers: authHeaders(), body: JSON.stringify(form) }
      );
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Có lỗi xảy ra.'); return; }

      // Reload danh sách
      const listRes = await fetch(API, { headers: authHeaders() });
      setList(await listRes.json());
      setEditId(null);
    } catch { setError('Không thể kết nối server.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá địa chỉ này?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders() });
    setList(prev => prev.filter(a => a._id !== id));
  };

  const handleSetDefault = async (id) => {
    const res = await fetch(`${API}/${id}/default`, { method: 'PATCH', headers: authHeaders() });
    if (res.ok) setList(prev => prev.map(a => ({ ...a, isDefault: a._id === id })));
  };

  return (
    <div className="acc-tab-content">
      <div className="acc-tab-header">
        <h3>Địa chỉ giao hàng</h3>
        {editId === null && (
          <button className="acc-btn-add" onClick={openAdd}>+ Thêm địa chỉ</button>
        )}
      </div>

      {/* FORM THÊM / SỬA */}
      {editId !== null && (
        <div className="acc-form-box">
          <h4>{editId === 'new' ? 'Thêm địa chỉ mới' : 'Sửa địa chỉ'}</h4>
          <div className="acc-form-row">
            <div className="acc-field">
              <label>Tên người nhận</label>
              <input type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={set('name')} />
            </div>
            <div className="acc-field">
              <label>Số điện thoại người nhận</label>
              <input type="tel" placeholder="0912 345 678" value={form.recipientPhone}
                onChange={e => setForm(p => ({ ...p, recipientPhone: e.target.value.replace(/\D/g,'').slice(0,11) }))} />
            </div>
          </div>
          <div className="acc-field">
            <label>Địa chỉ (số nhà, đường)</label>
            <input type="text" placeholder="123 Đường Lê Lợi" value={form.address} onChange={set('address')} />
          </div>
          <div className="acc-form-row">
            <div className="acc-field">
              <label>Phường / Xã</label>
              <input type="text" placeholder="Xã Đô Lương" value={form.ward} onChange={set('ward')} />
            </div>
            <div className="acc-field">
              <label>Tỉnh / Thành phố</label>
              <input type="text" placeholder="Nghệ An" value={form.province} onChange={set('province')} />
            </div>
          </div>
          <label className="acc-default-check">
            <input type="checkbox" checked={form.isDefault} onChange={set('isDefault')} />
            Đặt làm địa chỉ mặc định
          </label>
          {error && <div className="acc-error">⚠️ {error}</div>}
          <div className="acc-form-actions">
            <button className="acc-btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu…' : 'Lưu'}
            </button>
            <button className="acc-btn-cancel" onClick={cancel} disabled={saving}>Huỷ</button>
          </div>
        </div>
      )}

      {/* DANH SÁCH */}
      {loading && <div className="acc-empty">Đang tải...</div>}
      {!loading && list.length === 0 && editId === null && (
        <div className="acc-empty">Bạn chưa có địa chỉ nào. Thêm ngay để đặt hàng nhanh hơn!</div>
      )}
      <div className="acc-address-list">
        {list.map(item => (
          <div key={item._id} className={`acc-address-card ${item.isDefault ? 'acc-address-card--default' : ''}`}>
            <div className="acc-address-info">
              <div className="acc-address-name">
                {item.name}
                {item.isDefault && <span className="acc-default-badge">Mặc định</span>}
              </div>
              <div className="acc-address-phone">{item.recipientPhone}</div>
              <div className="acc-address-addr">
                {[item.address, item.ward, item.province].filter(Boolean).join(', ')}
              </div>
            </div>
            <div className="acc-address-actions">
              {!item.isDefault && (
                <button className="acc-action-link" onClick={() => handleSetDefault(item._id)}>Đặt làm mặc định</button>
              )}
              <button className="acc-action-link" onClick={() => openEdit(item)}>Sửa</button>
              <button className="acc-action-link acc-action-delete" onClick={() => handleDelete(item._id)}>Xoá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
